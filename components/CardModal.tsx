import React from 'react';
import { CardContent, SquareType } from '../types';
import { SQUARE_NAMES } from '../constants';
import { ArrowRight } from 'lucide-react';

interface CardModalProps {
  isOpen: boolean;
  content: CardContent | null;
  squareType: SquareType | null;
  onClose: () => void;
  loading: boolean;
}

const CardModal: React.FC<CardModalProps> = ({ isOpen, content, squareType, onClose, loading }) => {
  if (!isOpen) return null;

  let borderColor = "border-slate-500";
  let titleColor = "text-slate-200";
  let bgGradient = "from-slate-800 to-slate-900";

  switch (squareType) {
    case SquareType.INSPIRATION:
      borderColor = "border-sky-500";
      titleColor = "text-sky-300";
      bgGradient = "from-sky-900/40 to-slate-900";
      break;
    case SquareType.OBSTACLE:
      borderColor = "border-stone-500";
      titleColor = "text-stone-300";
      bgGradient = "from-stone-900/40 to-slate-900";
      break;
    case SquareType.ANGEL:
      borderColor = "border-yellow-500";
      titleColor = "text-yellow-300";
      bgGradient = "from-yellow-900/40 to-slate-900";
      break;
    case SquareType.BLESSING:
      borderColor = "border-purple-500";
      titleColor = "text-purple-300";
      bgGradient = "from-purple-900/40 to-slate-900";
      break;
    case SquareType.SERVICE:
      borderColor = "border-rose-500";
      titleColor = "text-rose-300";
      bgGradient = "from-rose-900/40 to-slate-900";
      break;
    case SquareType.TEAR:
      borderColor = "border-blue-500";
      titleColor = "text-blue-300";
      bgGradient = "from-blue-900/40 to-slate-900";
      break;
    case SquareType.TRANSFORMATION:
      borderColor = "border-teal-500";
      titleColor = "text-teal-300";
      bgGradient = "from-teal-900/40 to-slate-900";
      break;
     // Others use default
  }

  const squareName = squareType ? SQUARE_NAMES[squareType] : '卡牌';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border-2 ${borderColor} flex flex-col overflow-hidden`}>
        
        {/* Header Texture */}
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${bgGradient} opacity-50`}></div>

        <div className="relative p-8 flex flex-col items-center text-center space-y-6 min-h-[400px]">
          
          {loading ? (
             <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                <div className="w-12 h-12 border-4 border-t-transparent border-slate-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse font-serif">正在解读你的路径...</p>
             </div>
          ) : content ? (
            <>
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{squareName}</h3>
                <h2 className={`text-3xl font-serif font-bold ${titleColor} drop-shadow-lg`}>{content.title}</h2>
              </div>

              <div className="py-4 px-2">
                <p className="text-lg leading-relaxed text-slate-200 font-light">{content.description}</p>
              </div>

              <div className="w-full bg-black/30 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">行动指引</p>
                <p className="text-slate-300 italic">"{content.action}"</p>
              </div>

              <div className="flex gap-4 text-xs font-mono text-slate-500">
                 {content.effect.awareness ? <span className="text-sky-400">+{content.effect.awareness} 觉知</span> : null}
                 {content.effect.pain ? <span className="text-red-400">+{content.effect.pain} 痛苦/眼泪</span> : null}
                 {content.effect.service ? <span className="text-rose-400">+{content.effect.service} 服务</span> : null}
                 {(!content.effect.awareness && !content.effect.pain && !content.effect.service) && <span>状态未改变</span>}
              </div>

              <button 
                onClick={onClose}
                className="mt-auto flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-900 hover:bg-white font-bold rounded-full transition-transform hover:scale-105"
              >
                接受并继续 <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center text-red-400">读取卡牌失败。</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardModal;
