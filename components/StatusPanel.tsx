import React from 'react';
import { PlayerState } from '../types';
import { LotusIcon, DropIcon, HeartIcon, AngelIcon } from './GameIcons';

interface StatusPanelProps {
  player: PlayerState;
}

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-md bg-slate-900 ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-300 uppercase tracking-wide">{label}</span>
    </div>
    <span className="text-2xl font-bold text-white font-mono">{value}</span>
  </div>
);

const StatusPanel: React.FC<StatusPanelProps> = ({ player }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <StatCard 
        label="觉知" 
        value={player.awarenessTokens} 
        icon={<LotusIcon className="w-5 h-5" />} 
        color="text-sky-400" 
      />
      <StatCard 
        label="障碍" 
        value={player.painTokens} 
        icon={<DropIcon className="w-5 h-5" />} 
        color="text-red-400" 
      />
      <StatCard 
        label="服务" 
        value={player.serviceTokens} 
        icon={<HeartIcon className="w-5 h-5" />} 
        color="text-rose-400" 
      />
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex flex-col justify-center">
        <div className="flex items-center space-x-2 mb-1">
             <div className="text-yellow-400">
                <AngelIcon className="w-4 h-4" />
             </div>
             <span className="text-xs font-medium text-slate-400 uppercase">守护天使</span>
        </div>
        <div className="truncate text-sm font-medium text-yellow-200">
            {player.angels.length > 0 ? player.angels[player.angels.length - 1] : "暂无"}
        </div>
        {player.angels.length > 1 && (
            <div className="text-[10px] text-slate-500 mt-1">
                + 还有 {player.angels.length - 1} 位
            </div>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;