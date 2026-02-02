
import React, { useState, useEffect, useRef } from 'react';
import { solveMathProblem } from './services/geminiService';
import { CalculationRecord, MathResponse } from './types';
import HistorySidebar from './components/HistorySidebar';
import MathOutput from './components/MathOutput';
import { Send, Sigma, Sparkles, Loader2, Cpu, Calculator, Binary } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<CalculationRecord | null>(null);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('axiom_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('axiom_history', JSON.stringify(history));
  }, [history]);

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await solveMathProblem(input);
      const newRecord: CalculationRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        problem: input,
        response
      };
      
      setCurrentResult(newRecord);
      setHistory(prev => [newRecord, ...prev]);
      setInput('');
      
      // Scroll to top of results
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'The engine encountered a logical conflict. Please rephrase the problem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (record: CalculationRecord) => {
    setCurrentResult(record);
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearHistory = () => {
    if (window.confirm("Purge calculation history?")) {
      setHistory([]);
      localStorage.removeItem('axiom_history');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 overflow-hidden">
      <HistorySidebar 
        history={history} 
        onSelect={handleSelectHistory} 
        onClear={clearHistory}
        activeId={currentResult?.id}
      />

      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[160px]" />
        </div>

        {/* Header */}
        <header className="px-8 py-6 border-b border-slate-800/50 flex justify-between items-center backdrop-blur-md bg-slate-950/80 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
              <Cpu className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                AXIOM
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono tracking-normal">ENGINE</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Neural Symbolic Reasoning</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Binary size={14} className="text-blue-500" />
              <span>Full Precision</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Sigma size={14} className="text-indigo-500" />
              <span>Latex-Native</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 z-0">
          <div ref={scrollRef} className="max-w-4xl mx-auto space-y-12 pb-32">
            {!currentResult && !isLoading && !error && (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                  <Calculator size={80} className="text-slate-800 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white tracking-tight">How can I assist you today?</h2>
                  <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
                    Enter any mathematical expression or word problem. I'll derive the solution using first principles.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    "Solve x² - 5x + 6 = 0",
                    "Integrate sin(x)e^x dx",
                    "Derive the formula for area of a circle",
                    "Calculate the probability of 3 heads in 5 coin flips"
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setInput(example)}
                      className="text-left p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all text-sm text-slate-400"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex gap-4 items-start animate-shake">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <Sparkles size={20} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-red-400 font-bold text-sm mb-1 uppercase">Logical Conflict</h4>
                  <p className="text-red-200/70 text-sm">{error}</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-12 animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-slate-800 rounded-full" />
                  <div className="h-8 w-64 bg-slate-800 rounded-full" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-6">
                      <div className="w-1 bg-slate-800 rounded-full" />
                      <div className="flex-1 space-y-4">
                        <div className="h-4 w-1/4 bg-slate-800 rounded" />
                        <div className="h-20 bg-slate-800/50 rounded-2xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentResult && !isLoading && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Query</h2>
                  <div className="text-3xl font-bold text-white leading-tight">
                    {currentResult.problem}
                  </div>
                </div>
                <MathOutput data={currentResult.response} />
              </div>
            )}
          </div>
        </div>

        {/* Input Dock */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto">
            <form 
              onSubmit={handleSolve}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-3xl p-2 pl-6 focus-within:border-blue-500/50 transition-all shadow-2xl">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a mathematical question..."
                  className="flex-1 bg-transparent border-none outline-none text-white py-4 placeholder:text-slate-600 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isLoading || !input.trim()
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="hidden md:inline">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span className="hidden md:inline">Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <span>Scientific Precision</span>
              <span className="text-slate-800">•</span>
              <span>Reasoning Over Computation</span>
              <span className="text-slate-800">•</span>
              <span>Multidisciplinary Mastery</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
