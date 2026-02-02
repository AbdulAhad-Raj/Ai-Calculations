
import React from 'react';
import { CalculationRecord } from '../types';
import { Clock, Trash2, Hash } from 'lucide-react';

interface HistorySidebarProps {
  history: CalculationRecord[];
  onSelect: (record: CalculationRecord) => void;
  onClear: () => void;
  activeId?: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, activeId }) => {
  return (
    <div className="w-full md:w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="flex items-center gap-2 font-bold text-slate-300">
          <Clock size={18} />
          History
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 p-8 text-center space-y-2">
            <Hash size={40} className="opacity-20" />
            <p className="text-sm">No calculations yet</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group relative ${
                activeId === item.id 
                  ? 'bg-blue-600/10 border border-blue-500/30' 
                  : 'hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="text-xs text-slate-500 mb-1 flex justify-between">
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-700 px-1 rounded">View</span>
              </div>
              <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed">
                {item.problem}
              </p>
              <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                {item.response.domain}
              </div>
            </button>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-slate-800 text-[10px] text-slate-600 text-center uppercase tracking-widest font-bold">
        Axiom Engine v1.0.4
      </div>
    </div>
  );
};

export default HistorySidebar;
