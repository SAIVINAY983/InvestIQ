import { useRef, useState } from 'react';
import { 
  ArrowLeft, Download, Copy, Building, Users, MapPin, 
  DollarSign, TrendingUp, AlertTriangle, ShieldCheck, 
  Activity, BookOpen, Globe, CheckCircle2, XCircle, Link as LinkIcon, Info, Star, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Briefcase
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ChatPanel from '../components/ChatPanel.jsx';

export default function ResultsDashboard({ data, onNewSearch }) {
  const dashboardRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`InvestIQ_${data.companyName.replace(/\\s+/g, '_')}_Report.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleCopyReport = () => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    alert("Report JSON copied to clipboard!");
  };

  const getRecColor = (rec) => {
    if (rec === 'BUY') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (rec === 'HOLD') return 'text-warning bg-warning/10 border-warning/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const STEPS = [
    "Research Company",
    "Collect Financial Data",
    "Analyze News",
    "Generate SWOT",
    "Generate Recommendation"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <button 
          onClick={onNewSearch}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Search
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Copy size={16} /> Copy JSON
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div ref={dashboardRef} className="space-y-6 pb-10 bg-background">
        
        {/* Top Header - Recommendation & Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              {!data.isPublic && (
                 <span className="px-3 py-1 rounded-full text-xs font-bold border text-purple-400 bg-purple-500/10 border-purple-500/20">
                   PRIVATE COMPANY
                 </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Building className="text-primary" size={24} />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{data.companyName}</h1>
            </div>
            <p className="text-gray-400 mb-4">{data.overview?.industry}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{data.overview?.businessSummary}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
              <div>
                <p className="text-xs text-gray-500 mb-1">CEO</p>
                <p className="font-medium truncate" title={data.overview?.ceo}>{data.overview?.ceo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Headquarters</p>
                <p className="font-medium flex items-center gap-1 truncate" title={data.overview?.headquarters}><MapPin size={14} className="shrink-0"/> {data.overview?.headquarters}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Employees</p>
                <p className="font-medium flex items-center gap-1"><Users size={14} className="shrink-0"/> {data.overview?.employees?.toLocaleString()}</p>
              </div>
              {data.isPublic && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                  <p className="font-medium truncate">{data.overview?.marketCap}</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 p-4">
              {data.isPublic ? (
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecColor(data.recommendation)} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                  {data.recommendation}
                </div>
              ) : (
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold border text-gray-400 bg-gray-800 border-gray-700`}>
                  N/A for Private
                </div>
              )}
            </div>
            
            <h3 className="text-sm text-gray-400 font-semibold tracking-widest uppercase mb-2">Overall Score</h3>
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
              {data.scoreBreakdown?.overall || data.investmentScore}
            </div>
            
            <div className="w-full mt-6 space-y-4">
              <div className="group/confidence cursor-pointer relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">AI Confidence</span>
                  <span className="font-bold">{data.confidence}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: data.confidence + '%' }}></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 text-left line-clamp-2">{data.confidenceReasoning}</p>
                
                {/* Confidence Details Hover */}
                {data.confidenceReasons?.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover/confidence:opacity-100 pointer-events-none group-hover/confidence:pointer-events-auto transition-opacity z-10 text-left">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Confidence Factors:</p>
                    <ul className="text-[10px] text-gray-300 space-y-1">
                      {data.confidenceReasons.map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Red Flags (Conditional) */}
        {data.redFlags && data.redFlags.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <ShieldAlert size={20} /> Critical Red Flags Detected
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.redFlags.map((flag, i) => (
                <div key={i} className="bg-red-950/50 border border-red-500/20 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-200">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment Thesis & Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card bg-primary/5 border-primary/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-primary/20 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              <Info className="text-primary" size={20} /> Investment Thesis
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "{data.investmentThesis}"
            </p>
          </div>
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <BookOpen className="text-gray-400" size={20} /> Executive Summary
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {data.executiveSummary?.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Score Breakdown with Explanations */}
        <div className="glass-card overflow-visible">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Activity className="text-blue-400" size={20} /> Detailed Score Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Financial Health', key: 'financialHealth', score: data.scoreBreakdown?.financialHealth || 0, color: 'bg-emerald-500' },
              { label: 'Growth Potential', key: 'growthPotential', score: data.scoreBreakdown?.growthPotential || 0, color: 'bg-blue-500' },
              { label: 'Risk Score', key: 'riskScore', score: data.scoreBreakdown?.riskScore || 0, color: 'bg-amber-500' },
              { label: 'News Sentiment', key: 'newsSentiment', score: data.scoreBreakdown?.newsSentiment || 0, color: 'bg-purple-500' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center group relative p-4 rounded-xl hover:bg-surface border border-transparent hover:border-gray-700 transition-all">
                <div className="relative w-24 h-24 mb-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="276" strokeDashoffset={276 - (276 * item.score) / 100} className={`${item.color.replace('bg-', 'text-')} drop-shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-out`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">{item.score}</div>
                </div>
                <span className="text-xs text-gray-400 text-center uppercase tracking-wide font-semibold">{item.label}</span>
                
                {/* Score Reason Tooltip */}
                {data.scoreReasoning && data.scoreReasoning[item.key] && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-20">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 border-t border-l border-gray-700 transform rotate-45"></div>
                    <ul className="text-[10px] text-gray-300 space-y-1 relative z-10">
                      {data.scoreReasoning[item.key].map((r, idx) => <li key={idx}>• {r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financials & Suitability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card relative">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <DollarSign className="text-emerald-400" size={20} /> Financial Overview
            </h3>
            {data.isPublic ? (
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(data.financials || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center border-b border-gray-800/50 pb-2 hover:bg-gray-800/20 px-2 rounded transition-colors">
                    <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-500">
                <Briefcase size={32} className="mb-2 opacity-50" />
                <p>Public stock metrics unavailable for private companies.</p>
              </div>
            )}
          </div>
          
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Users className="text-primary" size={20} /> Portfolio Suitability
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Suitable For</h4>
                <div className="flex flex-wrap gap-2">
                  {data.portfolioSuitability?.suitableFor?.map((type, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={12}/> {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Not Suitable For</h4>
                <div className="flex flex-wrap gap-2">
                  {data.portfolioSuitability?.notSuitableFor?.map((type, i) => (
                    <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-300 flex items-center gap-1">
                      <XCircle size={12}/> {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bull vs Bear Case */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-2 text-emerald-400">
              <ArrowUpRight size={20} /> Bull Case
            </h3>
            <ul className="space-y-3">
              {data.bullCase?.map((point, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span> {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card bg-red-950/20 border-red-500/20 hover:border-red-500/40 transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-red-500/20 pb-2 text-red-400">
              <ArrowDownRight size={20} /> Bear Case
            </h3>
            <ul className="space-y-3">
              {data.bearCase?.map((point, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span> {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Catalysts & Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <TrendingUp className="text-blue-400" size={20} /> Key Catalysts
            </h3>
            <div className="space-y-4">
              <div className="bg-surface p-3 rounded-lg border border-gray-800">
                <span className="text-xs font-bold text-emerald-400 uppercase block mb-2">Positive Catalysts</span>
                <ul className="text-sm text-gray-300 space-y-1 ml-4 list-disc marker:text-emerald-500">
                  {data.positiveCatalysts?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-gray-800">
                <span className="text-xs font-bold text-red-400 uppercase block mb-2">Negative Catalysts</span>
                <ul className="text-sm text-gray-300 space-y-1 ml-4 list-disc marker:text-red-500">
                  {data.negativeCatalysts?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Globe className="text-purple-400" size={20} /> Recommendation Scenarios
            </h3>
            <p className="text-xs text-gray-400 mb-4">Current Recommendation: <span className="font-bold text-white">{data.recommendation}</span></p>
            <div className="space-y-4">
              <div className="bg-surface p-3 rounded-lg border border-gray-800 border-l-4 border-l-emerald-500">
                <span className="text-xs font-bold text-emerald-400 uppercase block mb-1">Upgrade Scenario</span>
                <p className="text-[10px] text-gray-400 mb-2">Recommendation will improve if:</p>
                <ul className="text-sm text-gray-300 space-y-1 ml-4 list-disc marker:text-gray-500">
                  {data.recommendationScenarios?.upgradeScenario?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-gray-800 border-l-4 border-l-red-500">
                <span className="text-xs font-bold text-red-400 uppercase block mb-1">Downgrade Scenario</span>
                <p className="text-[10px] text-gray-400 mb-2">Recommendation will worsen if:</p>
                <ul className="text-sm text-gray-300 space-y-1 ml-4 list-disc marker:text-gray-500">
                  {data.recommendationScenarios?.downgradeScenario?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Activity className="text-blue-400" size={20} /> SWOT Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-shadow">
              <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">Strengths</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-shadow">
              <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">Weaknesses</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-shadow">
              <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">Opportunities</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-shadow">
              <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">Threats</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.threats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline & Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-card">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">AI Reasoning Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              {STEPS.map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active hover:scale-[1.02] transition-transform cursor-default">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-emerald-500 bg-background text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.3)] z-10 animate-pulse">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-800 bg-surface/50 shadow group-hover:bg-gray-800/80 transition-colors">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-gray-200">{step}</h4>
                      <span className="text-xs text-emerald-500 font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card flex flex-col">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Sources & Reliability</h3>
            <div className="flex-1 bg-surface border border-gray-700 rounded-lg p-4 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar">
              {data.sources?.length > 0 ? data.sources.map((source, i) => (
                <div key={i} className="flex flex-col gap-1 p-2 bg-background border border-gray-800 rounded hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <a href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium text-gray-200 truncate pr-4">
                      <LinkIcon size={14} className="text-gray-500 shrink-0" />
                      {source.name}
                    </a>
                    <div className="flex shrink-0">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={12} className={star <= (source.reliabilityScore || 4) ? "text-amber-400 fill-amber-400" : "text-gray-600"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 pl-6 truncate">{source.url}</p>
                </div>
              )) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  No sources explicitly cited in this report.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Inject Chat Panel */}
      <ChatPanel reportData={data} />
    </div>
  );
}

