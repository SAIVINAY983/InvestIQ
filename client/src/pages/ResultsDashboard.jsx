import { useRef } from 'react';
import { 
  ArrowLeft, Download, Copy, Building, Users, MapPin, 
  DollarSign, TrendingUp, AlertTriangle, ShieldCheck, 
  Activity, BookOpen, Globe, CheckCircle2, XCircle, Link as LinkIcon, Info
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
          <div className="lg:col-span-2 glass-card flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Building className="text-primary" size={24} />
              <h1 className="text-3xl font-bold">{data.companyName}</h1>
            </div>
            <p className="text-gray-400 mb-4">{data.overview?.industry}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{data.overview?.businessSummary}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
              <div>
                <p className="text-xs text-gray-500 mb-1">CEO</p>
                <p className="font-medium">{data.overview?.ceo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Headquarters</p>
                <p className="font-medium flex items-center gap-1"><MapPin size={14}/> {data.overview?.headquarters}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Employees</p>
                <p className="font-medium flex items-center gap-1"><Users size={14}/> {data.overview?.employees?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                <p className="font-medium">{data.overview?.marketCap}</p>
              </div>
            </div>
          </div>

          <div className="glass-card flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecColor(data.recommendation)}`}>
                {data.recommendation}
              </div>
            </div>
            
            <h3 className="text-sm text-gray-400 font-semibold tracking-widest uppercase mb-2">Overall Score</h3>
            <div className="text-6xl font-extrabold text-white mb-2">
              {data.scoreBreakdown?.overall || data.investmentScore}
            </div>
            
            <div className="w-full mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">AI Confidence</span>
                  <span className="font-bold">{data.confidence}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: data.confidence + '%' }}></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 text-left line-clamp-2">{data.confidenceReasoning}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="glass-card bg-primary/5 border-primary/20">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-primary/20 pb-2">
            <Info className="text-primary" size={20} /> Executive Summary
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

        {/* Score Breakdown (Feature 1) */}
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Activity className="text-blue-400" size={20} /> Score Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Financial Health', score: data.scoreBreakdown?.financialHealth || 0, color: 'bg-emerald-500' },
              { label: 'Growth Potential', score: data.scoreBreakdown?.growthPotential || 0, color: 'bg-blue-500' },
              { label: 'Risk Score', score: data.scoreBreakdown?.riskScore || 0, color: 'bg-amber-500' },
              { label: 'News Sentiment', score: data.scoreBreakdown?.newsSentiment || 0, color: 'bg-purple-500' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * item.score) / 100} className={item.color.replace('bg-', 'text-')} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{item.score}</div>
                </div>
                <span className="text-xs text-gray-400 text-center uppercase tracking-wide font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials & Why Invest/Avoid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <DollarSign className="text-emerald-400" size={20} /> Financial Overview
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {Object.entries(data.financials || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-800/50 pb-2">
                  <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Why Invest / Avoid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                <CheckCircle2 size={16} /> Why Invest
              </h3>
              <ul className="space-y-3">
                {data.whyInvest?.map((reason, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card bg-red-500/5 border-red-500/20">
              <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2 border-b border-red-500/20 pb-2">
                <XCircle size={16} /> Why Avoid
              </h3>
              <ul className="space-y-3">
                {data.whyAvoid?.map((reason, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
            <ShieldCheck className="text-primary" size={20} /> AI Investment Reasoning
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm italic">
            "{data.reasoning}"
          </p>
        </div>

        {/* SWOT Analysis */}
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <TrendingUp className="text-blue-400" size={20} /> SWOT Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4">
              <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">Strengths</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
              <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">Weaknesses</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">Opportunities</h4>
              <ul className="space-y-2 text-sm">
                {data.swot?.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span> <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4">
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

        {/* Risks & News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <AlertTriangle className="text-amber-400" size={20} /> Risk Assessment
            </h3>
            <div className="space-y-4">
              {data.risks?.map((risk, i) => (
                <div key={i} className="bg-surface p-3 rounded-lg border border-gray-700">
                  <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">{risk.type}</div>
                  <p className="text-sm text-gray-300">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card lg:col-span-2">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Globe className="text-blue-400" size={20} /> Latest News
              </h3>
              <div className="text-xs font-semibold px-2 py-1 bg-surface border border-gray-700 rounded-md">
                Overall Sentiment: <span className={
                  data.overallNewsSentiment === 'Positive' ? 'text-emerald-400' :
                  data.overallNewsSentiment === 'Negative' ? 'text-red-400' : 'text-gray-300'
                }>{data.overallNewsSentiment || 'Neutral'}</span>
              </div>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {data.news?.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-surface rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                          {item.title}
                        </a>
                      ) : item.title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><BookOpen size={12}/> {item.source}</span>
                      {item.publishedDate && <span>• {item.publishedDate}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-start sm:justify-end">
                    <span className={'px-3 py-1 rounded-full text-xs font-medium border ' + 
                      (item.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        item.sentiment === 'Negative' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        'bg-gray-500/10 text-gray-300 border-gray-500/20')
                    }>
                      {item.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline & Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-card">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">AI Reasoning Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              {STEPS.map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-emerald-500 bg-background text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.3)] z-10">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-800 bg-surface/50 shadow">
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
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Sources Referenced</h3>
            <div className="flex-1 bg-surface border border-gray-700 rounded-lg p-4 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar">
              {data.sources?.length > 0 ? data.sources.map((source, i) => (
                <a key={i} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded transition-colors group">
                  <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <LinkIcon size={14} className="text-gray-400 group-hover:text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-200 truncate">{source.name}</p>
                    <p className="text-xs text-gray-500 truncate">{source.url}</p>
                  </div>
                </a>
              )) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  No sources explicitly cited in this report.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
