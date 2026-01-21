import React, { useState } from 'react';
import { GamePhase } from '../types';

interface WelcomeScreenProps {
  onStart: (intention: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [intention, setIntention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intention.trim()) {
      onStart(intention);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-slate-900 to-slate-800 text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-purple-400 mb-2">
            LUMINA
          </h1>
          <p className="text-slate-400 text-lg">数字化蜕变游戏</p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <p className="mb-6 text-slate-300 leading-relaxed text-justify">
            欢迎你，探索者。在开始之前，你必须设定一个<strong>意图</strong>。
            这是你旅程的种子。你希望在这个游戏中转化、理解或达成什么？
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="例如：我意图释放对失败的恐惧，拥抱我的创造力..."
                className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500 resize-none transition-all"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!intention.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide text-sm"
            >
              开始旅程
            </button>
          </form>
        </div>
        
        <p className="text-xs text-slate-600 mt-8">
          Powered by Gemini AI • 自我探索之旅
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;