import React from 'react';
import { LogEntry } from '../types';

interface GameLogProps {
  logs: LogEntry[];
}

const LOG_TYPE_NAMES = {
    'MOVE': '移动',
    'CARD': '卡牌',
    'SYSTEM': '系统',
    'ERROR': '错误'
};

const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  // Show most recent first
  const reversedLogs = [...logs].reverse();

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 h-64 md:h-96 flex flex-col overflow-hidden">
      <div className="p-3 bg-slate-900/50 border-b border-slate-700">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">旅程日志</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {reversedLogs.map((log) => (
          <div key={log.id} className="text-sm border-l-2 border-slate-700 pl-3 py-1">
            <div className="flex justify-between items-baseline mb-1">
                 <span className={`font-bold text-xs uppercase ${
                    log.type === 'CARD' ? 'text-purple-400' :
                    log.type === 'MOVE' ? 'text-sky-400' :
                    log.type === 'SYSTEM' ? 'text-slate-500' : 'text-red-400'
                 }`}>
                    {LOG_TYPE_NAMES[log.type]}
                 </span>
                 <span className="text-[10px] text-slate-600">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
            </div>
            <p className="text-slate-300">{log.message}</p>
            {log.details && (
                <p className="text-xs text-slate-500 mt-1 italic">"{log.details}"</p>
            )}
          </div>
        ))}
        {logs.length === 0 && (
            <div className="text-center text-slate-600 mt-10 italic">
                你的旅程从这里开始...
            </div>
        )}
      </div>
    </div>
  );
};

export default GameLog;