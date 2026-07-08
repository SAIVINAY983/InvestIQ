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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500); // Progress every 2.5s to simulate the different LangChain steps
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full glass-card">
        <div className="flex flex-col items-center mb-8">
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
                className={`flex items-center gap-3 transition-opacity duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                ) : isActive ? (
                  <Loader2 className="text-primary animate-spin" size={20} />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                )}
                <span className={`text-sm ${isActive ? 'text-white font-medium' : isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
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
