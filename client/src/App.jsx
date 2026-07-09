import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoadingScreen from './pages/LoadingScreen.jsx';
import ResultsDashboard from './pages/ResultsDashboard.jsx';
import { analyzeCompany } from './services/api.js';

function App() {
  const [appState, setAppState] = useState('landing');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

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
      
      if (data.recommendation === 'ERROR') {
        throw new Error(data.reasoning);
      }

      setCache(prev => ({ ...prev, [normalizedName]: data }));
      setReportData(data);
      setAppState('results');
    } catch (err) {
      console.error(err);
      
      let errorMessage = err.message || err.response?.data?.error || 'Failed to analyze company. Please try again.';
      
      // Clean up the ugly Gemini API 429 quota error message
      if (errorMessage.includes('429') || errorMessage.includes('quota')) {
        const timeMatch = errorMessage.match(/retry in (.*?)\./);
        const waitTime = timeMatch ? timeMatch[1] : 'a minute';
        errorMessage = `Google AI Rate Limit Reached! You are making requests too quickly. Please wait ${waitTime} and try again.`;
      }
      
      setError(errorMessage);
      setAppState('landing');
    }
  };

  const handleReset = () => {
    setAppState('landing');
    setReportData(null);
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
          <LandingPage onAnalyze={handleAnalyze} error={error} />
        )}
        {appState === 'loading' && (
          <LoadingScreen />
        )}
        {appState === 'results' && reportData && (
          <ResultsDashboard data={reportData} onNewSearch={handleReset} />
        )}
      </main>
      
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm mt-auto">
        <p>© {new Date().getFullYear()} InvestIQ. AI-powered investment research.</p>
      </footer>
    </div>
  );
}

export default App;
