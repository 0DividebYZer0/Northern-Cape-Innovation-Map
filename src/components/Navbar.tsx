import React from 'react';
import { Menu, X, Building, Lock, Info, Heart, Crown, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isVIP: boolean;
  setActiveModal: (modal: 'join' | 'pulse' | 'unlock' | 'donate' | 'welcome' | 'help' | null) => void;
}

export const Navbar = ({ isSidebarOpen, setIsSidebarOpen, isVIP, setActiveModal }: NavbarProps) => {
  return (
    <nav 
      className="h-16 bg-white border-b-4 border-[#d35400] shadow-md flex items-center justify-between px-4 z-[2000]"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-[#2c3e50] transition-colors focus-visible:ring-4 focus-visible:ring-[#d35400]/20 outline-none"
          title={isSidebarOpen ? "Close List" : "Open List"}
          aria-label={isSidebarOpen ? "Close Stakeholder Directory" : "Open Stakeholder Directory"}
          aria-expanded={isSidebarOpen}
          aria-controls="stakeholder-sidebar"
        >
          {isSidebarOpen ? <X size={24} className="text-[#d35400]" /> : <Menu size={24} />}
          <span className="hidden sm:inline font-black text-[10px] uppercase tracking-widest">
            {isSidebarOpen ? "Hide List" : "Show List"}
          </span>
        </button>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-[#2c3e50] text-lg md:text-xl flex items-center gap-2">
            <Building className="text-[#d35400]" size={24} aria-hidden="true" />
            <span className="hidden sm:inline">South African Innovation Landscape</span>
            <span className="sm:hidden">SA Innovation</span>
          </h1>
          {isVIP && (
            <div className="flex items-center gap-1 text-[#f1c40f] text-[10px] font-black uppercase">
              <Crown size={10} aria-hidden="true" /> VIP SPONSOR ACCESS
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setActiveModal('join')}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all focus-visible:ring-4 focus-visible:ring-blue-200 outline-none border border-blue-200"
          aria-label="Join the ecosystem"
        >
          <Building size={12} aria-hidden="true" /> Join
        </button>
        <button 
          onClick={() => setActiveModal('pulse')}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-100 transition-all focus-visible:ring-4 focus-visible:ring-yellow-200 outline-none border border-yellow-200"
          aria-label="Learn about Pulse verification"
        >
          <CheckCircle size={12} aria-hidden="true" /> Pulse
        </button>
        {!isVIP && (
          <button 
            onClick={() => setActiveModal('unlock')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 border-2 border-[#2c3e50] rounded-lg font-bold text-xs hover:bg-[#2c3e50] hover:text-white transition-all focus-visible:ring-4 focus-visible:ring-[#2c3e50]/20 outline-none"
            aria-label="Sponsor Login"
          >
            <Lock size={14} aria-hidden="true" /> SPONSOR LOGIN
          </button>
        )}
        <button 
          onClick={() => setActiveModal('help')}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 focus-visible:ring-4 focus-visible:ring-gray-200 outline-none"
          title="Help & FAQ"
          aria-label="Help and Frequently Asked Questions"
        >
          <Info size={24} aria-hidden="true" />
        </button>
        <button 
          onClick={() => setActiveModal('donate')}
          className="flex items-center gap-2 bg-[#e74c3c] text-white px-4 py-2 rounded-full font-bold text-xs hover:scale-105 transition-transform shadow-lg focus-visible:ring-4 focus-visible:ring-[#e74c3c]/20 outline-none"
          aria-label="Support the platform"
        >
          <Heart size={14} className="animate-pulse" aria-hidden="true" /> SUPPORT
        </button>
      </div>
    </nav>
  );
};
