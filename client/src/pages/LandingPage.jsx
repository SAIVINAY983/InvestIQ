import { useState } from 'react';
import { Search, TrendingUp, BarChart2, ShieldAlert } from 'lucide-react';

export default function LandingPage({ onAnalyze, error }) {
  const [company, setCompany] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim()) {
      onAnalyze(company.trim());
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

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full relative mt-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center bg-surface border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              <div className="pl-4 text-gray-400">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Enter company name (e.g. Tesla, Apple)..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-transparent text-white px-4 py-5 outline-none text-lg placeholder-gray-500"
                required
              />
              <button 
                type="submit" 
                className="btn-primary m-2 h-auto py-3 whitespace-nowrap"
                disabled={!company.trim()}
              >
                Analyze
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-400 mt-3 text-sm">{error}</p>
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
