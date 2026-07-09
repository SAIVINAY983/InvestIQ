import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  "Researching Company Profile...",
  "Collecting Financial Data...",
  "Reading Latest News...",
  "Analyzing Business Model & Competitors...",
  "Generating SWOT & Risk Assessment...",
  "Finalizing Investment Report..."
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 15000; // 15 seconds
    const intervalTime = totalDuration / STEPS.length;
    
    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, intervalTime);
    
    // Smooth progress bar
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (totalDuration / 50)), 100));
    }, 50);
    
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full glass-card overflow-hidden relative">
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gray-700 border-t-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <Loader2 className="animate-spin" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-6 text-center">Analyzing Data</h2>
          <p className="text-gray-400 text-center mt-2 text-sm">Our AI is gathering and processing information. This might take a minute.</p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 transition-all duration-500 transform ${
                  isPending ? 'opacity-30 translate-y-2' : 
                  isActive ? 'opacity-100 translate-y-0 scale-105' : 
                  'opacity-80 translate-y-0'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
                ) : isActive ? (
                  <Loader2 className="text-primary animate-spin flex-shrink-0" size={20} />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0"></div>
                )}
                <span className={`text-sm transition-colors duration-300 ${
                  isActive ? 'text-white font-medium drop-shadow-md' : 
                  isCompleted ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
