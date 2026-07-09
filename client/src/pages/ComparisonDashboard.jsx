import { ArrowLeft, Trophy, Scale, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import ChatPanel from '../components/ChatPanel.jsx';

export default function ComparisonDashboard({ data, onNewSearch }) {
  const { reportA, reportB, conclusion, winner } = data;

  const getRecColor = (rec) => {
    if (rec === 'BUY') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (rec === 'HOLD') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (rec === 'PASS' || rec === 'SELL') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const renderMetric = (label, valA, valB, isBetterFn) => {
    const aBetter = isBetterFn ? isBetterFn(valA, valB) === 'A' : false;
    const bBetter = isBetterFn ? isBetterFn(valA, valB) === 'B' : false;

    return (
      <div className="grid grid-cols-3 py-3 border-b border-gray-800 items-center">
        <div className={`text-center text-sm font-medium ${aBetter ? 'text-emerald-400' : 'text-gray-300'}`}>{valA || 'N/A'}</div>
        <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
        <div className={`text-center text-sm font-medium ${bBetter ? 'text-emerald-400' : 'text-gray-300'}`}>{valB || 'N/A'}</div>
      </div>
    );
  };

  const compareScores = (a, b) => {
    if (a > b) return 'A';
    if (b > a) return 'B';
    return 'TIE';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onNewSearch}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Search
        </button>
      </div>

      <div className="space-y-6 pb-10">
        
        {/* Title & Winner Header */}
        <div className="glass-card text-center relative overflow-hidden bg-gradient-to-b from-surface to-background">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">{reportA.companyName}</h1>
            <span className="text-gray-500 font-bold text-xl italic">VS</span>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">{reportB.companyName}</h1>
          </div>
          
          <div className="mt-6 p-6 bg-surface/50 rounded-2xl border border-gray-700 max-w-4xl mx-auto shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Trophy size={14} /> AI Conclusion
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Winner: <span className="text-emerald-400">{winner}</span></h3>
            <p className="text-sm text-gray-300 leading-relaxed italic">"{conclusion}"</p>
          </div>
        </div>

        {/* Side-by-side Overview */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {/* Company A Card */}
          <div className="glass-card flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-2">{reportA.companyName}</h2>
            <div className={`px-4 py-1 rounded-full text-xs font-bold border mb-4 ${getRecColor(reportA.recommendation)}`}>
              {reportA.recommendation}
            </div>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
              {reportA.scoreBreakdown?.overall || reportA.investmentScore}
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Overall Score</p>
          </div>

          {/* Company B Card */}
          <div className="glass-card flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-2">{reportB.companyName}</h2>
            <div className={`px-4 py-1 rounded-full text-xs font-bold border mb-4 ${getRecColor(reportB.recommendation)}`}>
              {reportB.recommendation}
            </div>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
              {reportB.scoreBreakdown?.overall || reportB.investmentScore}
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Overall Score</p>
          </div>
        </div>

        {/* Core Metrics Comparison Table */}
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-center gap-2 border-b border-gray-800 pb-2">
            <Scale className="text-primary" size={20} /> Metrics Comparison
          </h3>
          
          {/* AI Scores */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">AI Sub-Scores</h4>
            {renderMetric('Financial Health', reportA.scoreBreakdown?.financialHealth, reportB.scoreBreakdown?.financialHealth, compareScores)}
            {renderMetric('Growth Potential', reportA.scoreBreakdown?.growthPotential, reportB.scoreBreakdown?.growthPotential, compareScores)}
            {renderMetric('News Sentiment', reportA.scoreBreakdown?.newsSentiment, reportB.scoreBreakdown?.newsSentiment, compareScores)}
            {renderMetric('Risk Score', reportA.scoreBreakdown?.riskScore, reportB.scoreBreakdown?.riskScore, (a, b) => compareScores(b, a))} {/* Lower risk is better */}
          </div>

          {/* Financials */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Financials</h4>
            {renderMetric('Market Cap', reportA.overview?.marketCap, reportB.overview?.marketCap)}
            {renderMetric('Revenue', reportA.financials?.revenue, reportB.financials?.revenue)}
            {renderMetric('Net Income', reportA.financials?.netIncome, reportB.financials?.netIncome)}
            {renderMetric('Profit Margin', reportA.financials?.profitMargin, reportB.financials?.profitMargin)}
            {renderMetric('PE Ratio', reportA.financials?.peRatio, reportB.financials?.peRatio)}
          </div>
        </div>

        {/* Theses side-by-side */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          <div className="glass-card bg-primary/5 border-primary/20">
            <h3 className="text-sm font-bold text-primary mb-3">Thesis: {reportA.companyName}</h3>
            <p className="text-sm text-gray-300 italic">{reportA.investmentThesis}</p>
          </div>
          <div className="glass-card bg-primary/5 border-primary/20">
            <h3 className="text-sm font-bold text-primary mb-3">Thesis: {reportB.companyName}</h3>
            <p className="text-sm text-gray-300 italic">{reportB.investmentThesis}</p>
          </div>
        </div>

      </div>

      {/* Chat Panels for Both (or just pass the combined context if we had a combined chat, but let's just use chat panel for Company A for now or hide it to keep comparison clean) */}
    </div>
  );
}
