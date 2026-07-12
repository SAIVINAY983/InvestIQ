import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, BarChart2, ShieldAlert, GitCompare, Zap, Newspaper, BrainCircuit } from 'lucide-react';

export default function LandingPage({ onAnalyze, onCompare, error }) {
  const [mode, setMode] = useState('single');
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

  const popularCompanies = ["Tesla", "Apple", "Microsoft", "TCS", "Infosys", "NVIDIA"];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20 relative w-full overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-5xl w-full text-center z-10 space-y-10 mt-10"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight">
            Smarter Investments with <br />
            <span className="gradient-text drop-shadow-sm">AI-Powered Research</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mt-6">
            Research any company using AI. Analyze financials, latest news, SWOT analysis, risks, and receive an AI-powered investment recommendation.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div variants={itemVariants} className="flex justify-center mt-6">
          <div className="bg-surface backdrop-blur-xl border border-slate-800 rounded-full p-1 flex shadow-xl">
            <button
              onClick={() => setMode('single')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'single' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-textMain'}`}
            >
              Single Analysis
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${mode === 'compare' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-textMain'}`}
            >
              <GitCompare size={14} /> Compare
            </button>
          </div>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-surface backdrop-blur-2xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl p-2 gap-2 transition-all">
              <div className="flex-1 flex items-center w-full bg-background/50 rounded-xl border border-slate-800/50 transition-colors focus-within:border-primary/50 focus-within:bg-background/80">
                <div className="pl-4 text-muted">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Company A (e.g. Tesla)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-transparent text-textMain px-3 py-4 outline-none text-lg placeholder-slate-600 font-medium"
                  required
                />
              </div>

              {mode === 'compare' && (
                <>
                  <div className="text-muted font-display font-bold px-2 text-sm">VS</div>
                  <div className="flex-1 flex items-center w-full bg-background/50 rounded-xl border border-slate-800/50 transition-colors focus-within:border-primary/50 focus-within:bg-background/80">
                    <div className="pl-4 text-muted">
                      <Search size={22} />
                    </div>
                    <input
                      type="text"
                      placeholder="Company B"
                      value={companyB}
                      onChange={(e) => setCompanyB(e.target.value)}
                      className="w-full bg-transparent text-textMain px-3 py-4 outline-none text-lg placeholder-slate-600 font-medium"
                      required
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="btn-primary w-full sm:w-auto h-auto py-4 px-8 whitespace-nowrap rounded-xl text-lg flex items-center justify-center gap-2 group/btn"
                disabled={mode === 'single' ? !company.trim() : (!company.trim() || !companyB.trim())}
              >
                {mode === 'single' ? 'Analyze' : 'Compare'}
                <Zap size={18} className="group-hover/btn:text-yellow-300 transition-colors" />
              </button>
            </div>
          </div>
          
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-danger mt-4 text-sm font-medium">{error}</motion.p>
          )}

          {/* Popular Companies Quick Select */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted mr-2">Popular:</span>
            {popularCompanies.map((pop, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setMode('single');
                  setCompany(pop);
                  onAnalyze(pop);
                  saveToHistory(pop);
                }}
                className="px-4 py-1.5 text-sm font-medium text-slate-300 bg-slate-800/30 hover:bg-slate-800 hover:text-white border border-slate-700/50 rounded-full transition-all duration-300"
              >
                {pop}
              </button>
            ))}
          </div>
        </motion.form>

        <motion.div variants={itemVariants} className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <FeatureCard 
            icon={<TrendingUp size={24} className="text-white" />}
            color="from-blue-500 to-cyan-500"
            title="Financial Analysis"
            desc="Deep dive into revenue, margins, debt, and cash flow."
          />
          <FeatureCard 
            icon={<Newspaper size={24} className="text-white" />}
            color="from-purple-500 to-pink-500"
            title="Latest News"
            desc="Real-time news sentiment and market perception."
          />
          <FeatureCard 
            icon={<BrainCircuit size={24} className="text-white" />}
            color="from-emerald-500 to-teal-500"
            title="AI Recommendation"
            desc="Actionable insights backed by multi-agent reasoning."
          />
          <FeatureCard 
            icon={<ShieldAlert size={24} className="text-white" />}
            color="from-orange-500 to-red-500"
            title="Risk Analysis"
            desc="Identify hidden business and market threats."
          />
          <FeatureCard 
            icon={<BarChart2 size={24} className="text-white" />}
            color="from-indigo-500 to-blue-500"
            title="SWOT Analysis"
            desc="Automated Strengths, Weaknesses, Opportunities, and Threats."
          />
          <FeatureCard 
            icon={<Zap size={24} className="text-white" />}
            color="from-yellow-400 to-orange-500"
            title="Confidence Score"
            desc="Algorithmic scoring system for objective evaluation."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }) {
  return (
    <div className="glass-card group hover:-translate-y-2 transition-all duration-500 hover:border-slate-600/50 hover:shadow-2xl hover:shadow-primary/5 cursor-default relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg relative z-10`}>
        {icon}
      </div>
      <h3 className="text-lg font-display font-semibold mb-2 text-white relative z-10">{title}</h3>
      <p className="text-sm text-muted leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}
