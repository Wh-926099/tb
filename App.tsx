import React, { useState, useRef } from 'react';
import { 
  GamePhase, 
  PlayerState, 
  LevelType, 
  SquareType, 
  LogEntry, 
  CardContent 
} from './types';
import { BOARD_LAYOUT, TRACK_LENGTH, LEVEL_CONFIG, SQUARE_NAMES } from './constants';
import * as GeminiService from './services/geminiService';

// Components
import WelcomeScreen from './components/WelcomeScreen.tsx';
import GameBoard from './components/GameBoard.tsx';
import StatusPanel from './components/StatusPanel.tsx';
import GameLog from './components/GameLog.tsx';
import CardModal from './components/CardModal.tsx';
import { Dices, Crown, RefreshCcw, Droplets } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [loadingCard, setLoadingCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardContent | null>(null);
  const [currentSquareType, setCurrentSquareType] = useState<SquareType | null>(null);
  const [pendingSourceSelection, setPendingSourceSelection] = useState<SquareType | null>(null);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [player, setPlayer] = useState<PlayerState>({
    intention: '',
    currentLevel: LevelType.PHYSICAL,
    position: 0,
    awarenessTokens: 0,
    serviceTokens: 0,
    painTokens: 0,
    angels: []
  });

  const addLog = (type: LogEntry['type'], message: string, details?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(),
      type,
      message,
      details,
      timestamp: Date.now()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleStartGame = (intention: string) => {
    setPlayer(prev => ({ ...prev, intention }));
    setPhase(GamePhase.PLAYING);
    addLog('SYSTEM', '游戏开始', `意图: ${intention}`);
    addLog('SYSTEM', `进入${LEVEL_CONFIG[LevelType.PHYSICAL].name}`);
  };

  const handleClearPain = () => {
      if (player.awarenessTokens > 0 && player.painTokens > 0) {
          setPlayer(prev => ({
              ...prev,
              awarenessTokens: prev.awarenessTokens - 1,
              painTokens: prev.painTokens - 1
          }));
          addLog('SYSTEM', '清理眼泪', '使用 1 个觉知代币清理了 1 个眼泪(障碍)。');
      }
  };

  const handleRollDice = async () => {
    if (showModal || loadingCard || pendingSourceSelection) return;

    // 1. Roll Logic
    const roll = Math.floor(Math.random() * 6) + 1;
    
    // 2. Tear Logic (Pain slows movement)
    let moveAmount = roll;
    let tearMessage = "";

    if (player.painTokens > 0) {
        if (roll <= player.painTokens) {
            moveAmount = 0;
            tearMessage = `(被 ${player.painTokens} 个眼泪阻挡)`;
        } else {
            moveAmount = roll - player.painTokens;
            tearMessage = `(掷出 ${roll} - ${player.painTokens} 眼泪)`;
        }
    }

    if (moveAmount === 0) {
        addLog('MOVE', `原地停留 ${tearMessage}`, '你需要清理眼泪才能前进。');
        return; // End turn
    }

    let newPos = player.position + moveAmount;
    
    // 3. Cap movement at end of track
    if (newPos >= TRACK_LENGTH) {
        newPos = TRACK_LENGTH;
    }

    // 4. Update Player Position temporarily
    setPlayer(prev => ({ ...prev, position: newPos }));
    addLog('MOVE', `前进了 ${moveAmount} 步 ${tearMessage}`, `到达位置 ${newPos}`);

    // 5. Determine Square Type
    if (newPos === TRACK_LENGTH) {
        handleGraduationCheck();
        return;
    }

    const squareIndex = (newPos - 1) % BOARD_LAYOUT.length;
    const squareType = BOARD_LAYOUT[squareIndex];

    // 6. Handle Special Squares without AI Card first
    if (squareType === SquareType.EMPTY) return;

    if (squareType === SquareType.TEAR) {
        setPlayer(prev => ({ ...prev, painTokens: prev.painTokens + 4 }));
        addLog('SYSTEM', '眼泪方格', '你获得了 4 个眼泪代币。这将减缓你的步伐。');
        return;
    }

    if (squareType === SquareType.APPRECIATION) {
        setPlayer(prev => {
             const hasPain = prev.painTokens > 0;
             return {
                 ...prev,
                 painTokens: 0,
                 awarenessTokens: hasPain ? prev.awarenessTokens : prev.awarenessTokens + 2
             };
        });
        addLog('SYSTEM', '感谢方格', '所有的眼泪已被清理。');
        return;
    }
    
    if (squareType === SquareType.TRANSFORMATION) {
        addLog('SYSTEM', '蜕变方格', '你已转化了所有痛苦模式！');
        setPlayer(prev => ({ ...prev, painTokens: 0 }));
        handleLevelUp(); // Force level up
        return;
    }

    if (squareType === SquareType.MIRACLE) {
        addLog('SYSTEM', '奇迹方格', '恩典降临，所有的眼泪消失了。');
        setPlayer(prev => ({ ...prev, painTokens: 0 }));
        return;
    }

    // 7. Handle Source Selection for Inspiration & Obstacle
    if (squareType === SquareType.INSPIRATION || squareType === SquareType.OBSTACLE) {
        setPendingSourceSelection(squareType);
        return;
    }

    // 8. Trigger AI Card Event for other squares directly
    triggerCardEvent(squareType);
  };

  const handleSourceSelection = (source: 'ENVELOPE' | 'DECK') => {
      if (!pendingSourceSelection) return;
      const type = pendingSourceSelection;
      setPendingSourceSelection(null);
      
      const sourceText = source === 'ENVELOPE' ? '从信封' : '从卡池';
      addLog('SYSTEM', `${SQUARE_NAMES[type]}`, `${sourceText}抽取卡牌...`);
      
      triggerCardEvent(type);
  };

  const triggerCardEvent = async (squareType: SquareType) => {
    setCurrentSquareType(squareType);
    setLoadingCard(true);
    setShowModal(true);

    try {
        const card = await GeminiService.generateCard(player.intention, player.currentLevel, squareType);
        setCurrentCard(card);
        setLoadingCard(false);
    } catch (error) {
        addLog('ERROR', '咨询神谕失败。');
        setLoadingCard(false);
        setShowModal(false);
    }
  };

  const handleCardAction = () => {
    if (!currentCard) return;

    // Apply Effects
    setPlayer(prev => {
        let newAngels = [...prev.angels];
        if (currentSquareType === SquareType.ANGEL) {
            newAngels.push(currentCard.title);
        }

        const newAwareness = Math.max(0, prev.awarenessTokens + (currentCard.effect.awareness || 0));
        const newPain = Math.max(0, prev.painTokens + (currentCard.effect.pain || 0));
        const newService = Math.max(0, prev.serviceTokens + (currentCard.effect.service || 0));

        return {
            ...prev,
            awarenessTokens: newAwareness,
            painTokens: newPain,
            serviceTokens: newService,
            angels: newAngels
        };
    });

    addLog('CARD', `抽取了 ${currentCard.title}`, currentCard.description);
    
    // Check for "Angel Graduation" rule: 3 Angels + 0 Pain
    const checkAngelGraduation = () => {
        setPlayer(prev => {
            if (prev.angels.length >= 3 && prev.painTokens === 0) {
                 setTimeout(() => handleLevelUp(), 1000);
            }
            return prev;
        })
    };
    checkAngelGraduation();

    // Reset Modal
    setShowModal(false);
    setCurrentCard(null);
    setCurrentSquareType(null);
  };

  const handleGraduationCheck = async () => {
      if (player.painTokens > 0) {
          addLog('SYSTEM', '晋级受阻', `你还有 ${player.painTokens} 个眼泪(障碍)。必须清除它们才能晋升。`);
          setPlayer(prev => ({ ...prev, position: prev.position - 1 })); // Bounce back
          return;
      }
      handleLevelUp();
  };

  const handleLevelUp = async () => {
      const nextLevelMap: Record<LevelType, LevelType | null> = {
          [LevelType.PHYSICAL]: LevelType.EMOTIONAL,
          [LevelType.EMOTIONAL]: LevelType.MENTAL,
          [LevelType.MENTAL]: LevelType.SPIRITUAL,
          [LevelType.SPIRITUAL]: null
      };

      const nextLevel = nextLevelMap[player.currentLevel];

      if (nextLevel) {
          const msg = await GeminiService.generateGraduationMessage(player.intention, player.currentLevel);
          addLog('SYSTEM', `晋升至${LEVEL_CONFIG[nextLevel].name}`, msg);
          setPlayer(prev => ({
              ...prev,
              currentLevel: nextLevel,
              position: 0 // Reset to start of new level
          }));
      } else {
          setPhase(GamePhase.GAME_OVER);
          addLog('SYSTEM', '蜕变完成', '你已经在所有层面上整合了你的意图。');
      }
  };

  const handleReset = () => {
      if(window.confirm("你确定要重新开始旅程吗？")) {
        setPhase(GamePhase.SETUP);
        setLogs([]);
        setPendingSourceSelection(null);
        setPlayer({
            intention: '',
            currentLevel: LevelType.PHYSICAL,
            position: 0,
            awarenessTokens: 0,
            serviceTokens: 0,
            painTokens: 0,
            angels: []
        });
      }
  };

  // Render Setup
  if (phase === GamePhase.SETUP) {
    return <WelcomeScreen onStart={handleStartGame} />;
  }

  // Render Game Over
  if (phase === GamePhase.GAME_OVER) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-8 space-y-6">
              <Crown size={64} className="text-yellow-400 animate-bounce" />
              <h1 className="text-4xl font-serif text-white">蜕变完成</h1>
              <p className="text-slate-300 max-w-xl text-lg">
                  "{player.intention}" 已在身体、情绪、心智和灵性层面上完成了整合。
                  带着新的觉知继续前行吧。
              </p>
              <div className="flex gap-4">
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-sky-400">{player.awarenessTokens}</div>
                    <div className="text-xs uppercase text-slate-500">觉知</div>
                </div>
                 <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-rose-400">{player.serviceTokens}</div>
                    <div className="text-xs uppercase text-slate-500">服务</div>
                </div>
              </div>
              <button 
                onClick={() => setPhase(GamePhase.SETUP)}
                className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200"
            >
                开始新的旅程
            </button>
          </div>
      )
  }

  // Render Main Game
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-purple-500 rounded-lg"></div>
                <span className="font-serif font-bold text-lg tracking-widest hidden sm:block">LUMINA</span>
            </div>
            <div className="flex-1 text-center px-4">
                <p className="text-xs text-slate-500 uppercase font-bold">当前意图</p>
                <p className="text-sm text-slate-200 truncate max-w-md mx-auto italic">"{player.intention}"</p>
            </div>
            <button onClick={handleReset} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                <RefreshCcw size={18} />
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-32">
        
        {/* Status */}
        <StatusPanel player={player} />

        {/* Board */}
        <GameBoard player={player} />

        {/* Bottom Section: Controls & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Controls */}
            <div className="lg:col-span-1 bg-slate-800/30 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center space-y-6">
                
                {pendingSourceSelection ? (
                    <div className="text-center w-full animate-fade-in">
                         <h3 className="text-lg font-serif text-slate-200 mb-4">
                            选择卡牌来源
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleSourceSelection('ENVELOPE')}
                                className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-500 flex flex-col items-center gap-2 transition-colors"
                            >
                                <span className="text-2xl">📩</span>
                                <span className="text-sm font-bold">潜意识信封</span>
                            </button>
                            <button 
                                onClick={() => handleSourceSelection('DECK')}
                                className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-500 flex flex-col items-center gap-2 transition-colors"
                            >
                                <span className="text-2xl">🃏</span>
                                <span className="text-sm font-bold">公共卡池</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h3 className="text-lg font-serif text-slate-300 mb-1">轮到你了</h3>
                            <p className="text-sm text-slate-500">掷骰子以前行。</p>
                        </div>
                        
                        <button
                            onClick={handleRollDice}
                            disabled={loadingCard || showModal}
                            className="group relative w-full py-6 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                            <div className="relative flex flex-col items-center gap-2">
                                <Dices size={32} className="text-white" />
                                <span className="text-xl font-bold text-white tracking-widest uppercase">掷骰子</span>
                            </div>
                        </button>
                    </>
                )}

                {player.painTokens > 0 && !pendingSourceSelection && (
                    <button 
                        onClick={handleClearPain}
                        disabled={player.awarenessTokens === 0}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Droplets size={16} className="text-blue-400" />
                        使用觉知清理眼泪 ({player.painTokens} left)
                    </button>
                )}

                <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">状态提示</h4>
                    <p className="text-xs text-slate-400">
                        {player.painTokens > 0 
                            ? "眼泪正在减缓你的步伐。你可以使用觉知清理它们，或者带着它们艰难前行。" 
                            : "道路通畅。保持觉知，向蜕变迈进。"}
                    </p>
                </div>
            </div>

            {/* Logs */}
            <div className="lg:col-span-2">
                <GameLog logs={logs} />
            </div>
        </div>
      </main>

      {/* Modals */}
      <CardModal 
        isOpen={showModal} 
        loading={loadingCard}
        content={currentCard}
        squareType={currentSquareType}
        onClose={handleCardAction}
      />

    </div>
  );
};

export default App;