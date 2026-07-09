import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoadingScreen from './pages/LoadingScreen.jsx';
import ResultsDashboard from './pages/ResultsDashboard.jsx';
import ComparisonDashboard from './pages/ComparisonDashboard.jsx';
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
    <div className="min-h-screen bg-background text-gray-100 flex flex-col">
      <nav className="border-b border-gray-800 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleReset}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-lg shadow-[0_0_10px_rgba(59,130,246,0.6)]">
              IQ
            </div>
            <span className="text-xl font-bold gradient-text tracking-wide">InvestIQ</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {appState === 'landing' && (
          <LandingPage onAnalyze={handleAnalyze} onCompare={handleCompare} error={error} />
        )}
        {appState === 'loading' && (
          <LoadingScreen />
        )}
        {appState === 'results' && reportData && (
          <ResultsDashboard data={reportData} onNewSearch={handleReset} />
        )}
        {appState === 'compare_results' && compareData && (
          <ComparisonDashboard data={compareData} onNewSearch={handleReset} />
        )}
      </main>
      
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm mt-auto">
        <p>© {new Date().getFullYear()} InvestIQ. AI-powered investment research.</p>
      </footer>
    </div>
  );
}

export default App;
