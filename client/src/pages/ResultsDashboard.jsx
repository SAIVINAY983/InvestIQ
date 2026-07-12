import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, Copy, Building, Users, MapPin, 
  DollarSign, TrendingUp, AlertTriangle, Activity, 
  BookOpen, Globe, CheckCircle2, XCircle, Link as LinkIcon, 
  Star, ShieldAlert, ArrowUpRight, ArrowDownRight, Briefcase, Zap,
  BarChart2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ChatPanel from '../components/ChatPanel.jsx';

export default function ResultsDashboard({ data, onNewSearch }) {
  const dashboardRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true, backgroundColor: '#020617' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`InvestIQ_${data.companyName.replace(/\s+/g, '_')}_Report.pdf`);
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
    if (rec === 'BUY') return 'text-success border-success bg-success/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]';
    if (rec === 'HOLD') return 'text-warning border-warning bg-warning/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
    return 'text-danger border-danger bg-danger/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
  };

  const STEPS = [
    "Research Company",
    "Collect Financial Data",
    "Analyze News",
    "Generate SWOT",
    "Assess Risks",
    "Formulate Recommendation"
  ];

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
    <div className="max-w-7xl mx-auto w-full relative">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <button 
          onClick={onNewSearch}
          className="flex items-center gap-2 text-muted hover:text-textMain transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-5 py-2 bg-surface hover:bg-slate-800 border border-slate-700 rounded-full text-sm font-medium transition-colors"
          >
            <Copy size={16} /> Copy JSON
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2 btn-primary"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <motion.div 
        ref={dashboardRef} 
        className="space-y-8 pb-10"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        
        {/* Top Header - Recommendation & Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-card flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 p-6">
              {!data.isPublic && (
                 <span className="px-3 py-1 rounded-full text-xs font-bold border text-secondary bg-secondary/10 border-secondary/30">
                   PRIVATE COMPANY
                 </span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Building className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-white">{data.companyName}</h1>
            </div>
            <p className="text-primary font-medium mb-4">{data.overview?.industry}</p>
            <p className="text-sm text-muted leading-relaxed max-w-3xl">{data.overview?.businessSummary}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-6 border-t border-slate-800/50">
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">CEO</p>
                <p className="font-medium text-slate-200 truncate" title={data.overview?.ceo}>{data.overview?.ceo}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Headquarters</p>
                <p className="font-medium text-slate-200 flex items-center gap-1 truncate" title={data.overview?.headquarters}><MapPin size={14} className="shrink-0 text-slate-500"/> {data.overview?.headquarters}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Employees</p>
                <p className="font-medium text-slate-200 flex items-center gap-1"><Users size={14} className="shrink-0 text-slate-500"/> {data.overview?.employees?.toLocaleString()}</p>
              </div>
              {data.isPublic && (
                <div>
                  <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Market Cap</p>
                  <p className="font-medium text-slate-200 truncate">{data.overview?.marketCap}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h3 className="text-sm font-display text-muted font-bold tracking-widest uppercase mb-4">Investment Score</h3>
            
            <div className="relative mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                <motion.circle 
                  cx="80" cy="80" r="72" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="452" 
                  initial={{ strokeDashoffset: 452 }}
                  animate={{ strokeDashoffset: 452 - (452 * (data.scoreBreakdown?.overall || data.investmentScore)) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary drop-shadow-[0_0_12px_rgba(37,99,235,0.5)]" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-display font-bold text-white">{data.scoreBreakdown?.overall || data.investmentScore}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Recommendation</p>
              {data.isPublic ? (
                <div className={`px-6 py-2 rounded-full text-sm font-bold border tracking-wider ${getRecColor(data.recommendation)}`}>
                  {data.recommendation}
                </div>
              ) : (
                <div className="px-4 py-1.5 rounded-full text-xs font-bold border text-slate-400 bg-slate-800/50 border-slate-700">
                  N/A for Private
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Red Flags (Conditional) */}
        {data.redFlags && data.redFlags.length > 0 && (
          <motion.div variants={itemVariants} className="bg-danger/5 border border-danger/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.05)] backdrop-blur-xl">
            <h3 className="text-danger font-display font-bold mb-4 flex items-center gap-2 text-lg">
              <ShieldAlert size={22} /> Critical Red Flags Detected
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.redFlags.map((flag, i) => (
                <div key={i} className="bg-background/50 border border-danger/10 p-4 rounded-xl flex items-start gap-3 hover:bg-danger/5 transition-colors">
                  <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">{flag}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Investment Thesis & Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="text-xl font-display font-bold mb-5 flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg"><Zap className="text-primary" size={20} /></div>
              Investment Thesis
            </h3>
            <p className="text-slate-300 leading-relaxed italic text-lg font-medium">
              "{data.investmentThesis}"
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card">
            <h3 className="text-xl font-display font-bold mb-5 flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 bg-slate-800 rounded-lg"><BookOpen className="text-slate-400" size={20} /></div>
              Executive Summary
            </h3>
            <ul className="space-y-4">
              {data.executiveSummary?.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Score Breakdown with Explanations */}
        <motion.div variants={itemVariants} className="glass-card overflow-visible">
          <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3 border-b border-slate-800/50 pb-4">
            <div className="p-2 bg-secondary/10 rounded-lg"><Activity className="text-secondary" size={20} /></div>
            Detailed Score Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Financial Health', key: 'financialHealth', score: data.scoreBreakdown?.financialHealth || 0, color: 'text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' },
              { label: 'Growth Potential', key: 'growthPotential', score: data.scoreBreakdown?.growthPotential || 0, color: 'text-primary drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' },
              { label: 'Risk Score', key: 'riskScore', score: data.scoreBreakdown?.riskScore || 0, color: 'text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
              { label: 'News Sentiment', key: 'newsSentiment', score: data.scoreBreakdown?.newsSentiment || 0, color: 'text-secondary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center group relative p-6 rounded-2xl hover:bg-slate-800/30 border border-transparent hover:border-slate-700/50 transition-all cursor-default">
                <div className="relative w-28 h-28 mb-4">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    <motion.circle 
                      cx="56" cy="56" r="48" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="301" 
                      initial={{ strokeDashoffset: 301 }}
                      animate={{ strokeDashoffset: 301 - (301 * item.score) / 100 }}
                      transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                      className={item.color} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-display font-bold text-white">{item.score}</div>
                </div>
                <span className="text-xs text-muted text-center uppercase tracking-widest font-semibold">{item.label}</span>
                
                {data.scoreReasoning && data.scoreReasoning[item.key] && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 p-4 bg-background border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-20 translate-y-2 group-hover:translate-y-0">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-t border-l border-slate-700 transform rotate-45"></div>
                    <ul className="text-[11px] text-slate-300 space-y-2 relative z-10">
                      {data.scoreReasoning[item.key].map((r, idx) => (
                        <li key={idx} className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>{r}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financials & Suitability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="glass-card">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 bg-success/10 rounded-lg"><DollarSign className="text-success" size={20} /></div>
              Financial Overview
            </h3>
            {data.isPublic ? (
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {Object.entries(data.financials || {}).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1 border-b border-slate-800/30 pb-3">
                    <span className="text-muted text-xs uppercase tracking-wider font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-display font-bold text-lg text-white">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                <Briefcase size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">Public stock metrics unavailable for private companies.</p>
              </div>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 border-b border-slate-800/50 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><Users className="text-primary" size={20} /></div>
                Portfolio Suitability
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-success uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 size={14}/> Suitable For</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.portfolioSuitability?.suitableFor?.map((type, i) => (
                      <span key={i} className="px-4 py-1.5 bg-success/10 border border-success/20 rounded-full text-xs font-medium text-success-300">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-danger uppercase tracking-widest mb-3 flex items-center gap-2"><XCircle size={14}/> Not Suitable For</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.portfolioSuitability?.notSuitableFor?.map((type, i) => (
                      <span key={i} className="px-4 py-1.5 bg-danger/10 border border-danger/20 rounded-full text-xs font-medium text-danger-300">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Invest / Why Avoid Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="glass-card bg-success/5 border-success/20 hover:border-success/40 transition-all shadow-[0_0_30px_rgba(34,197,94,0.03)]">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 border-b border-success/20 pb-4 text-success">
              <div className="p-2 bg-success/10 rounded-lg"><ArrowUpRight className="text-success" size={20} /></div>
              Why Invest
            </h3>
            <ul className="space-y-4">
              {data.whyInvest?.map((point, i) => (
                <li key={i} className="text-slate-300 flex items-start gap-3">
                  <CheckCircle2 className="text-success mt-1 shrink-0" size={16} />
                  <span className="leading-relaxed">{point}</span>
                </li>
              )) || data.bullCase?.map((point, i) => (
                <li key={i} className="text-slate-300 flex items-start gap-3">
                  <CheckCircle2 className="text-success mt-1 shrink-0" size={16} />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card bg-danger/5 border-danger/20 hover:border-danger/40 transition-all shadow-[0_0_30px_rgba(239,68,68,0.03)]">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 border-b border-danger/20 pb-4 text-danger">
              <div className="p-2 bg-danger/10 rounded-lg"><ArrowDownRight className="text-danger" size={20} /></div>
              Why Avoid
            </h3>
            <ul className="space-y-4">
              {data.whyAvoid?.map((point, i) => (
                <li key={i} className="text-slate-300 flex items-start gap-3">
                  <AlertTriangle className="text-danger mt-1 shrink-0" size={16} />
                  <span className="leading-relaxed">{point}</span>
                </li>
              )) || data.bearCase?.map((point, i) => (
                <li key={i} className="text-slate-300 flex items-start gap-3">
                  <AlertTriangle className="text-danger mt-1 shrink-0" size={16} />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* SWOT Analysis 2x2 Grid */}
        <motion.div variants={itemVariants} className="glass-card">
          <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3 border-b border-slate-800/50 pb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg"><BarChart2 className="text-blue-500" size={20} /></div>
            SWOT Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-success/5 border border-success/10 rounded-2xl p-6 hover:bg-success/10 transition-colors">
              <h4 className="text-success font-display font-bold mb-4 flex items-center gap-2 text-lg">Strengths</h4>
              <ul className="space-y-3">
                {data.swot?.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-success mt-1.5 shrink-0"><CheckCircle2 size={14}/></span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-danger/5 border border-danger/10 rounded-2xl p-6 hover:bg-danger/10 transition-colors">
              <h4 className="text-danger font-display font-bold mb-4 flex items-center gap-2 text-lg">Weaknesses</h4>
              <ul className="space-y-3">
                {data.swot?.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-danger mt-1.5 shrink-0"><XCircle size={14}/></span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 hover:bg-primary/10 transition-colors">
              <h4 className="text-primary font-display font-bold mb-4 flex items-center gap-2 text-lg">Opportunities</h4>
              <ul className="space-y-3">
                {data.swot?.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-primary mt-1.5 shrink-0"><TrendingUp size={14}/></span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-warning/5 border border-warning/10 rounded-2xl p-6 hover:bg-warning/10 transition-colors">
              <h4 className="text-warning font-display font-bold mb-4 flex items-center gap-2 text-lg">Threats</h4>
              <ul className="space-y-3">
                {data.swot?.threats.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-warning mt-1.5 shrink-0"><ShieldAlert size={14}/></span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Risk Analysis Cards */}
        {data.risks && data.risks.length > 0 && (
          <motion.div variants={itemVariants} className="glass-card">
            <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 bg-warning/10 rounded-lg"><ShieldAlert className="text-warning" size={20} /></div>
              Risk Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.risks.map((risk, i) => (
                <div key={i} className="bg-background/50 border border-slate-800 rounded-2xl p-5 hover:border-warning/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white tracking-wide">{risk.type}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-warning/20 text-warning-400 border border-warning/20">
                      Risk Area
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{risk.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline & Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <motion.div variants={itemVariants} className="glass-card">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-8 border-b border-slate-800/50 pb-4">AI Reasoning Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-secondary/50 before:to-transparent">
              {STEPS.map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-default"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background border-[3px] border-primary text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(37,99,235,0.4)] z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-slate-800 bg-background/50 shadow-sm hover:border-primary/30 hover:bg-slate-800/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-white">{step}</h4>
                      <CheckCircle2 size={14} className="text-success" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card flex flex-col">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-6 border-b border-slate-800/50 pb-4">Sources & Citations</h3>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {data.sources?.length > 0 ? data.sources.map((source, i) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={i} className="block group">
                  <div className="flex flex-col gap-2 p-4 bg-background/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-200 group-hover:text-primary transition-colors truncate pr-4">
                        <LinkIcon size={14} className="text-muted shrink-0" />
                        <span className="truncate">{source.name}</span>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={12} className={star <= (source.reliabilityScore || 4) ? "text-primary fill-primary" : "text-slate-700"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted pl-6 truncate opacity-70">{source.url}</p>
                  </div>
                </a>
              )) : (
                <div className="h-full flex items-center justify-center text-sm text-muted py-12 bg-background/30 rounded-xl border border-slate-800/50 border-dashed">
                  No sources explicitly cited in this report.
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </motion.div>

      {/* Inject Chat Panel */}
      <ChatPanel reportData={data} />
    </div>
  );
}
