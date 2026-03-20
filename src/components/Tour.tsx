import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface TourStep {
  title: string;
  content: string;
  target: string | null;
}

interface TourProps {
  tourStep: number | null;
  tourSteps: TourStep[];
  setTourStep: (step: number | null) => void;
  finishTour: () => void;
}

export const Tour = ({ tourStep, tourSteps, setTourStep, finishTour }: TourProps) => {
  return (
    <AnimatePresence>
      {tourStep !== null && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border-4 border-[#d35400] relative",
              tourSteps[tourStep].target && "md:absolute"
            )}
            style={tourStep === 1 ? { top: '140px', left: '20px' } : 
                   tourStep === 2 ? { top: '220px', left: '20px' } : 
                   tourStep === 3 ? { top: '50%', right: '50px', transform: 'translateY(-50%)' } : {}}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#d35400] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Step {tourStep + 1} of {tourSteps.length}
              </span>
              <button onClick={finishTour} className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest">Skip Tour</button>
            </div>
            <h3 className="text-xl font-black text-[#2c3e50] mb-3 leading-tight">{tourSteps[tourStep].title}</h3>
            <p className="text-gray-600 mb-8 font-medium leading-relaxed">{tourSteps[tourStep].content}</p>
            
            <div className="flex gap-3">
              {tourStep > 0 && (
                <button 
                  onClick={() => setTourStep(tourStep - 1)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 uppercase tracking-widest text-xs"
                >
                  Back
                </button>
              )}
              <button 
                onClick={() => tourStep < tourSteps.length - 1 ? setTourStep(tourStep + 1) : finishTour()}
                className="flex-[2] py-3 bg-[#d35400] text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform text-xs"
              >
                {tourStep === tourSteps.length - 1 ? "Start Exploring" : "Next Step"}
              </button>
            </div>

            {/* Spotlight Arrow for Desktop */}
            {tourStep > 0 && (
              <div className={cn(
                "hidden md:block absolute w-8 h-8 bg-white border-l-4 border-t-4 border-[#d35400] rotate-[-45deg] -left-4 top-1/2 -translate-y-1/2",
                tourStep === 3 && "rotate-[135deg] -right-4 left-auto"
              )} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
