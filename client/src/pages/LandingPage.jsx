import { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart2, ShieldAlert, Clock, GitCompare } from 'lucide-react';

export default function LandingPage({ onAnalyze, onCompare, error }) {
  const [mode, setMode] = useState('single'); // 'single' or 'compare'
  const [company, setCompany] = useState('');
  const [companyB, setCompanyB] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('investiq_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (term) => {
    const updated = [term, ...history.filter(h => h.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('investiq_history', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'single' && company.trim()) {
      saveToHistory(company.trim());
      onAnalyze(company.trim());
    } else if (mode === 'compare' && company.trim() && companyB.trim()) {
      const term = `${company.trim()} vs ${companyB.trim()}`;
      saveToHistory(term);
      onCompare(company.trim(), companyB.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center z-10 space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Smarter Investments with <br />
          <span className="gradient-text">AI-Powered Research</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Instantly generate comprehensive investment reports, SWOT analyses, and risk assessments for any public company using advanced AI.
        </p>

        {/* Mode Toggle */}
        <div className="flex justify-center mt-6">
          <div className="bg-surface border border-gray-700 rounded-full p-1 flex">
            <button
              onClick={() => setMode('single')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'single' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Single Analysis
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'compare' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <GitCompare size={14} /> Compare
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full relative mt-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-surface border border-gray-700 rounded-2xl overflow-hidden shadow-2xl p-2 gap-2">
              <div className="flex-1 flex items-center w-full bg-background rounded-xl border border-gray-700">
                <div className="pl-4 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Company A (e.g. Tesla)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-transparent text-white px-3 py-4 outline-none text-base placeholder-gray-500"
                  required
                />
              </div>

              {mode === 'compare' && (
                <>
                  <div className="text-gray-500 font-bold px-2">VS</div>
                  <div className="flex-1 flex items-center w-full bg-background rounded-xl border border-gray-700">
                    <div className="pl-4 text-gray-400">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Company B"
                      value={companyB}
                      onChange={(e) => setCompanyB(e.target.value)}
                      className="w-full bg-transparent text-white px-3 py-4 outline-none text-base placeholder-gray-500"
                      required
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="btn-primary w-full sm:w-auto h-auto py-4 px-6 whitespace-nowrap rounded-xl"
                disabled={mode === 'single' ? !company.trim() : (!company.trim() || !companyB.trim())}
              >
                {mode === 'single' ? 'Analyze' : 'Compare'}
              </button>
            </div>
          </div>
          
          {error && (
            <p className="text-red-400 mt-3 text-sm">{error}</p>
          )}

          {history.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} /> Recent:
              </span>
              {history.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (h.includes(' vs ')) {
                      const [a, b] = h.split(' vs ');
                      setMode('compare');
                      setCompany(a);
                      setCompanyB(b);
                      onCompare(a, b);
                    } else {
                      setMode('single');
                      setCompany(h);
                      onAnalyze(h);
                    }
                    saveToHistory(h);
                  }}
                  className="px-3 py-1 text-sm bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-full transition-colors"
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </form>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-card hover:-translate-y-1 transition-transform">
            <TrendingUp className="text-blue-400 mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">Deep Market Insights</h3>
            <p className="text-sm text-gray-400">Real-time financial data combined with intelligent AI-driven context.</p>
          </div>
          <div className="glass-card hover:-translate-y-1 transition-transform">
            <BarChart2 className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">Comprehensive SWOT</h3>
            <p className="text-sm text-gray-400">Instantly uncover strengths, weaknesses, opportunities, and threats.</p>
          </div>
          <div className="glass-card hover:-translate-y-1 transition-transform">
            <ShieldAlert className="text-amber-400 mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">Risk Assessment</h3>
            <p className="text-sm text-gray-400">Identify potential business and market risks before making decisions.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
