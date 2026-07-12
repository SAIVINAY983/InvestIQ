import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutDashboard, Info, Github, Moon } from 'lucide-react';
import LandingPage from './pages/LandingPage.jsx';
import LoadingScreen from './pages/LoadingScreen.jsx';
import ResultsDashboard from './pages/ResultsDashboard.jsx';
import ComparisonDashboard from './pages/ComparisonDashboard.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';
import { analyzeCompany, compareCompanies } from './services/api.js';

function App() {
  const [appState, setAppState] = useState('landing');
  const [reportData, setReportData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  const handleError = (err) => {
    let errorMessage = err.message || err.response?.data?.error || 'Failed to process request. Please try again.';
    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      const timeMatch = errorMessage.match(/retry in (.*?)\./);
      const waitTime = timeMatch ? timeMatch[1] : 'a minute';
      errorMessage = `Google AI Rate Limit Reached! You are making requests too quickly. Please wait ${waitTime} and try again.`;
    }
    setError(errorMessage);
    setAppState('landing');
  };

  const handleAnalyze = async (companyName) => {
    const normalizedName = companyName.toLowerCase().trim();
    if (cache[normalizedName]) {
      setReportData(cache[normalizedName]);
      setAppState('results');
      return;
    }

    setAppState('loading');
    setError(null);
    try {
      const data = await analyzeCompany(companyName);
      if (data.recommendation === 'ERROR') throw new Error(data.reasoning);

      setCache(prev => ({ ...prev, [normalizedName]: data }));
      setReportData(data);
      setAppState('results');
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  };

  const handleCompare = async (companyA, companyB) => {
    const key = `${companyA.toLowerCase().trim()}_vs_${companyB.toLowerCase().trim()}`;
    if (cache[key]) {
      setCompareData(cache[key]);
      setAppState('compare_results');
      return;
    }

    setAppState('loading');
    setError(null);
    try {
      const data = await compareCompanies(companyA, companyB);
      if (data.reportA?.recommendation === 'ERROR' || data.reportB?.recommendation === 'ERROR') {
        throw new Error("Failed to analyze one or both companies.");
      }

      setCache(prev => ({ ...prev, [key]: data }));
      setCompareData(data);
      setAppState('compare_results');
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  };

  const handleReset = () => {
    setAppState('landing');
    setReportData(null);
    setCompareData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col font-sans relative z-10 overflow-x-hidden selection:bg-primary/30">
      <ParticleBackground />
      
      <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleReset}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              IQ
            </div>
            <span className="text-xl font-display font-semibold tracking-tight">InvestIQ <span className="text-muted text-sm font-normal ml-1">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <button onClick={handleReset} className="hover:text-textMain transition-colors flex items-center gap-2"><Home size={16}/> Home</button>
            <button className="hover:text-textMain transition-colors flex items-center gap-2"><LayoutDashboard size={16}/> Dashboard</button>
            <button className="hover:text-textMain transition-colors flex items-center gap-2"><Info size={16}/> About</button>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-muted hover:text-textMain transition-colors rounded-full hover:bg-white/5">
              <Github size={20} />
            </a>
            <button className="p-2 text-muted hover:text-textMain transition-colors rounded-full hover:bg-white/5">
              <Moon size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative z-10 w-full">
        <AnimatePresence mode="wait">
          {appState === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
              <LandingPage onAnalyze={handleAnalyze} onCompare={handleCompare} error={error} />
            </motion.div>
          )}
          {appState === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col items-center justify-center">
              <LoadingScreen />
            </motion.div>
          )}
          {appState === 'results' && reportData && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
              <ResultsDashboard data={reportData} onNewSearch={handleReset} />
            </motion.div>
          )}
          {appState === 'compare_results' && compareData && (
            <motion.div key="compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
              <ComparisonDashboard data={compareData} onNewSearch={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="border-t border-slate-800/50 py-12 mt-auto relative z-10 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-xs text-white">IQ</div>
              <span className="font-display font-semibold">InvestIQ AI</span>
            </div>
            <p className="text-muted text-sm max-w-sm">Smarter Investments with AI-Powered Research. Built for modern investors, driven by cutting-edge generative AI.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-sm text-slate-200">Powered By</h4>
            <ul className="text-muted text-sm space-y-2">
              <li>React & Tailwind</li>
              <li>Node.js & Express</li>
              <li>Google Gemini</li>
              <li>LangChain</li>
              <li>Tavily & Yahoo Finance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-sm text-slate-200">Links</h4>
            <ul className="text-muted text-sm space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InvestIQ AI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
