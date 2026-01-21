import React from 'react';
import { PlayerState, LevelType, SquareType } from '../types';
import { TRACK_LENGTH, LEVEL_CONFIG, BOARD_LAYOUT, SQUARE_NAMES } from '../constants';
import { Circle } from 'lucide-react';
import { 
    AngelIcon, LotusIcon, HeartIcon, DropIcon, 
    LightningIcon, TrumpetIcon, XIcon, StarIcon, 
    ExclamationIcon, SmileyIcon 
} from './GameIcons';

interface GameBoardProps {
  player: PlayerState;
}

const SquareIcon: React.FC<{ type: SquareType; active: boolean }> = ({ type, active }) => {
  const baseClass = active ? "w-6 h-6" : "w-5 h-5 opacity-80";
  
  switch (type) {
    case SquareType.INSPIRATION: return <StarIcon className={`${baseClass} text-yellow-300`} />;
    case SquareType.OBSTACLE: return <XIcon className={`${baseClass} text-red-500`} />;
    case SquareType.ANGEL: return <AngelIcon className={`${baseClass} text-white`} />;
    case SquareType.SERVICE: return <HeartIcon className={`${baseClass} text-rose-400`} />;
    case SquareType.INTUITION: return <LightningIcon className={`${baseClass} text-cyan-300`} />;
    case SquareType.BLESSING: return <SmileyIcon className={`${baseClass} text-amber-300`} />;
    case SquareType.MIRACLE: return <LotusIcon className={`${baseClass} text-pink-300`} />;
    case SquareType.UNIVERSE: return <ExclamationIcon className={`${baseClass} text-purple-300`} />;
    case SquareType.TEAR: return <DropIcon className={`${baseClass} text-blue-400`} />;
    case SquareType.TRANSFORMATION: return <TrumpetIcon className={`${baseClass} text-teal-300`} />;
    default: return <Circle className={`${baseClass} text-slate-600`} />;
  }
};

const GameBoard: React.FC<GameBoardProps> = ({ player }) => {
  const currentLevelConfig = LEVEL_CONFIG[player.currentLevel];

  // Helper to determine step position
  const getStepStatus = (index: number) => {
    if (index === player.position) return 'active';
    if (index < player.position) return 'completed';
    return 'pending';
  };

  return (
    <div className="w-full bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
      <div className={`p-4 border-b border-slate-700 ${currentLevelConfig.bgColor}`}>
        <div className="flex justify-between items-center">
            <div>
                <h2 className={`text-xl font-bold serif-font ${currentLevelConfig.color}`}>
                {currentLevelConfig.name}
                </h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{currentLevelConfig.description}</p>
            </div>
            <div className="text-right">
                <span className="text-sm text-slate-400">当前位置</span>
                <p className="text-2xl font-mono">{player.position} <span className="text-sm text-slate-500">/ {TRACK_LENGTH}</span></p>
            </div>
        </div>
      </div>

      <div className="p-8 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[2800px] relative">
            {/* Connecting Line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 -z-10 rounded-full"></div>
            <div 
                className={`absolute left-0 top-1/2 h-1 ${currentLevelConfig.bgColor.replace('/20', '')} -z-10 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${(player.position / TRACK_LENGTH) * 100}%`, backgroundColor: 'currentColor' }}
            ></div>

            {Array.from({ length: TRACK_LENGTH + 1 }).map((_, index) => {
                const status = getStepStatus(index);
                // Cycle through board layout types for the board squares
                const squareType = index === 0 ? SquareType.EMPTY : BOARD_LAYOUT[(index - 1) % BOARD_LAYOUT.length];
                const displayName = index === 0 ? '起点' : (index === TRACK_LENGTH ? '晋级' : SQUARE_NAMES[squareType]);

                let scale = "scale-100";
                let ring = "";
                let bg = "bg-slate-900";
                let border = "border-slate-600";

                if (status === 'active') {
                    scale = "scale-125";
                    ring = `ring-4 ${currentLevelConfig.borderColor.replace('/50', '/30')}`;
                    bg = "bg-slate-800";
                    border = currentLevelConfig.color.replace('text-', 'border-');
                } else if (status === 'completed') {
                    bg = "bg-slate-800";
                    border = "border-slate-500";
                }

                return (
                    <div key={index} className="flex flex-col items-center group relative z-0">
                         {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black px-2 py-1 rounded text-white pointer-events-none whitespace-nowrap">
                            {displayName}
                        </div>

                        <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${bg} ${border} ${scale} ${ring} z-10`}
                        >
                            <SquareIcon type={squareType} active={status === 'active'} />
                        </div>
                        {index === 0 || index === TRACK_LENGTH ? (
                             <span className="absolute top-full mt-2 text-[10px] uppercase font-bold text-slate-500">{index === 0 ? '起点' : '毕业'}</span>
                        ) : null}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;