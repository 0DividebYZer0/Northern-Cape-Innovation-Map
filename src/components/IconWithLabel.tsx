import React from 'react';
import { cn } from '../utils/cn';

export const IconWithLabel = ({ icon: Icon, label, className }: { icon: any, label: string, className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Icon size={18} />
    <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
  </div>
);
