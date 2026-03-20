import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: any;
  directLink?: string;
}

export const Modal = ({ isOpen, onClose, title, children, icon: Icon, directLink }: ModalProps) => {
  const modalId = title.toLowerCase().replace(/\s+/g, '-');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
          role="presentation" 
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div 
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${modalId}`}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
            tabIndex={-1}
          >
            <div className="bg-[#2c3e50] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className="text-[#f1c40f]" aria-hidden="true" />}
                <h3 id={`modal-title-${modalId}`} className="font-bold text-lg">{title}</h3>
              </div>
              <button 
                onClick={onClose} 
                aria-label={`Close ${title} modal`}
                className="p-1 hover:bg-white/10 rounded-full focus-visible:ring-2 focus-visible:ring-white outline-none transition-colors"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            
            {directLink && (
              <div className="bg-orange-50 p-4 border-b border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-orange-900 uppercase tracking-tight leading-none mb-1">
                      Privacy Block Detected?
                    </p>
                    <p className="text-[10px] font-medium text-orange-700 leading-tight">
                      Some browsers block embedded forms for your security. If you see a blank space below, please use the direct link.
                    </p>
                  </div>
                </div>
                <a 
                  href={directLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#d35400] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ExternalLink size={14} /> Open Form Directly
                </a>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-0 relative min-h-[400px]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
