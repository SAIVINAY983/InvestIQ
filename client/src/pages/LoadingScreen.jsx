import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, CircleDashed } from 'lucide-react';

const STEPS = [
  "Researching Company Profile...",
  "Fetching Financial Data...",
  "Collecting Latest News...",
  "Analyzing Business Model...",
  "Generating AI Report..."
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalDuration = 15000;
    const intervalTime = totalDuration / STEPS.length;
    
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, intervalTime);
    
    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card overflow-hidden relative"
      >
        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="relative mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-20 h-20 rounded-full border border-slate-700 border-t-primary"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-slate-700 border-b-secondary"
            />
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <Loader2 className="animate-spin" size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-center">AI Analysis in Progress</h2>
          <p className="text-muted text-center mt-2 text-sm">Gathering market intelligence and analyzing fundamentals.</p>
        </div>

        <div className="space-y-5 relative">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-800" />
          
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.3, 
                  x: 0,
                  scale: isActive ? 1.02 : 1
                }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 relative z-10"
              >
                <div className="bg-surface rounded-full">
                  {isCompleted ? (
                    <CheckCircle2 className="text-success flex-shrink-0 bg-background rounded-full" size={24} />
                  ) : isActive ? (
                    <Loader2 className="text-primary animate-spin flex-shrink-0 bg-background rounded-full" size={24} />
                  ) : (
                    <CircleDashed className="text-slate-600 flex-shrink-0 bg-background rounded-full" size={24} />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive ? 'text-white' : 
                  isCompleted ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
