import React from 'react';
import { cn } from '../utils/cn';

export const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", className)}>
    {children}
  </span>
);
