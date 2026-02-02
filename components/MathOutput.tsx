
import React from 'react';
import { MathResponse } from '../types';
import LatexRenderer from './LatexRenderer';
import { BookOpen, CheckCircle2, Info, Lightbulb } from 'lucide-react';

// Explicitly define Lucide icons using a simple SVG approach or assuming library access
// Since I should use popular libraries, I will use basic SVG for icons to ensure it works without complex installs if necessary
// But standard Lucide React is very common.

interface MathOutputProps {
  data: MathResponse;
}

const MathOutput: React.FC<MathOutputProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
          {data.domain}
        </span>
        {data.assumptions && data.assumptions.length > 0 && (
          <div className="flex items-center gap-2 text-slate-400 text-sm italic">
            <Info size={14} />
            <span>Assumptions: {data.assumptions.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100">
          <BookOpen className="text-blue-400" size={24} />
          Logical Derivation
        </h3>
        <div className="space-y-8 border-l-2 border-slate-800 ml-3 pl-6">
          {data.steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-blue-500 transition-colors" />
              <h4 className="font-semibold text-slate-200 mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.explanation}</p>
              {step.formula && (
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 overflow-x-auto">
                  <LatexRenderer formula={step.formula} displayMode={true} className="text-blue-100" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Methods */}
      {data.alternativeMethods && data.alternativeMethods.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl">
          <h3 className="flex items-center gap-2 text-lg font-bold text-amber-200 mb-4">
            <Lightbulb size={20} className="text-amber-400" />
            Alternative Perspectives
          </h3>
          <ul className="space-y-2 text-amber-100/70 text-sm list-disc list-inside">
            {data.alternativeMethods.map((method, i) => (
              <li key={i}>{method}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Result */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 size={120} className="text-emerald-400" />
        </div>
        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">Final Conclusion</h3>
        <div className="space-y-4">
          <div className="text-4xl font-bold text-white tracking-tight">
            {data.finalAnswer}
          </div>
          <div className="pt-4 border-t border-emerald-500/10 overflow-x-auto">
            <LatexRenderer formula={data.latexAnswer} displayMode={true} className="text-emerald-200 text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Lucide icons fallback if lucide-react isn't available, but it usually is.
const InfoIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;

export default MathOutput;
