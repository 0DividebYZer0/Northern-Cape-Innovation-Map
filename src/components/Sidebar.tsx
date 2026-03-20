import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Building, X, Landmark, Globe, Mail, Phone, Lock, ChevronRight, CheckCircle, ArrowUp } from 'lucide-react';
import { cn } from '../utils/cn';
import { Organization, OrgType } from '../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: OrgType | 'All';
  setTypeFilter: (type: OrgType | 'All') => void;
  filteredData: Organization[];
  selectedOrg: Organization | null;
  handleOrgClick: (org: Organization) => void;
  isVIP: boolean;
  setActiveModal: (modal: 'join' | 'pulse' | 'unlock' | 'donate' | 'welcome' | 'help' | null) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  filteredData,
  selectedOrg,
  handleOrgClick,
  isVIP,
  setActiveModal,
  scrollContainerRef
}: SidebarProps) => {
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowBackToTop(container.scrollTop > 400);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  return (
    <AnimatePresence mode="wait">
      {isSidebarOpen && (
        <motion.aside 
          id="stakeholder-sidebar"
          initial={{ x: -500 }}
          animate={{ x: 0 }}
          exit={{ x: -500 }}
          className="w-full md:w-[500px] bg-white border-r border-gray-200 flex flex-col shadow-2xl z-[1000] absolute md:relative inset-y-0 left-0 md:inset-auto h-full"
          role="complementary"
          aria-label="Stakeholder Directory"
        >
          <div className="p-2 border-b flex items-center gap-2 bg-white shrink-0">
            <div className="p-1 bg-[#d35400] rounded text-white shadow-sm" aria-hidden="true">
              <Building size={14} />
            </div>
            <h2 className="font-black text-[10px] uppercase tracking-widest text-[#2c3e50]">Stakeholder Directory</h2>
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest ml-auto">NC</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded-md transition-colors ml-1"
              aria-label="Close sidebar"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="p-2 border-b space-y-1.5 shrink-0 bg-gray-50/10">
            <div className="relative" id="tour-search">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} aria-hidden="true" />
              <input 
                type="text" 
                placeholder="Search support, funding, training..." 
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#d35400]/10 focus:border-[#d35400] outline-none font-bold text-[10px] shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search stakeholders by name, support, funding, or training"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1" id="tour-filters" role="tablist" aria-labelledby="filter-label">
                {(['All', 'Enabler', 'Innovator', 'Knowledge', 'Government', 'Infrastructure'] as const).map((type) => (
                  <button
                    key={type}
                    role="tab"
                    aria-selected={typeFilter === type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      "px-2 py-1 rounded text-[7px] font-black whitespace-nowrap border transition-all uppercase tracking-widest outline-none",
                      typeFilter === type 
                        ? "bg-[#2c3e50] text-white border-[#2c3e50]" 
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {type === 'All' ? 'All' : type === 'Infrastructure' ? 'Infrastructure' : type + 's'}
                  </button>
                ))}
              </div>
              <span className="text-[7px] font-black text-[#d35400] bg-orange-50 px-1.5 py-0.5 rounded ml-auto whitespace-nowrap" aria-live="polite">
                {filteredData.length} Results
              </span>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50 scroll-smooth custom-scrollbar relative" 
            role="list"
          >
            {/* Back to Top Button */}
            <AnimatePresence>
              {showBackToTop && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="sticky top-2 left-1/2 -translate-x-1/2 z-[1100] px-3 py-1.5 bg-[#2c3e50] text-white rounded-full shadow-lg hover:bg-[#d35400] transition-all flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest"
                  aria-label="Back to top"
                >
                  <ArrowUp size={10} /> Back to Top
                </motion.button>
              )}
            </AnimatePresence>

            {filteredData.length === 0 ? (
              <div className="text-center py-12" role="status">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-gray-300" aria-hidden="true" />
                </div>
                <h3 className="font-black text-[#2c3e50] uppercase tracking-widest text-xs mb-1">No Stakeholders Found</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-4">Try adjusting your search or filters</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('All');
                  }}
                  className="px-4 py-2 bg-[#2c3e50] text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-[#d35400] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredData.map((org) => (
                <motion.div
                  layout
                  key={org.id}
                  id={`org-card-${org.id}`}
                  role="listitem"
                  tabIndex={0}
                  aria-selected={selectedOrg?.id === org.id}
                  onClick={() => handleOrgClick(org)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOrgClick(org);
                    }
                  }}
                  className={cn(
                    "bg-white p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:border-[#d35400]/30 group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#d35400]/30",
                    org.isPulseVerified ? "border-[#f1c40f]/30" : "border-gray-100",
                    selectedOrg?.id === org.id && "border-[#d35400] ring-2 ring-[#d35400]/5 shadow-lg scale-[1.01] z-10"
                  )}
                >
                  {org.isPulseVerified && (
                    <div className="absolute top-0 right-0 bg-[#f1c40f] text-white px-1 py-0.5 rounded-bl flex items-center gap-1 shadow-sm">
                      <CheckCircle size={6} aria-hidden="true" />
                      <span className="text-[5px] font-black uppercase tracking-widest">Verified</span>
                    </div>
                  )}

                  <div className="mb-1">
                    <h3 className="font-black text-[#2c3e50] group-hover:text-[#d35400] transition-colors leading-tight text-[10px] uppercase tracking-tight">
                      {org.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    <span className={cn(
                      "text-[6px] font-black uppercase tracking-widest px-1 py-0.5 rounded-sm border",
                      org.type === 'Enabler' && "bg-green-50 text-green-700 border-green-200",
                      org.type === 'Innovator' && "bg-orange-50 text-orange-700 border-orange-200",
                      org.type === 'Knowledge' && "bg-blue-50 text-blue-700 border-blue-200",
                      org.type === 'Government' && "bg-gray-50 text-gray-700 border-gray-200",
                      org.type === 'Infrastructure' && "bg-purple-50 text-purple-700 border-purple-200"
                    )}>
                      {org.type}
                    </span>
                    <span className="text-[6px] font-black uppercase tracking-widest px-1 py-0.5 bg-white text-gray-400 border-gray-100 rounded-sm">
                      {org.category}
                    </span>
                  </div>

                  <p className="text-[9px] text-gray-500 leading-snug font-medium mb-1.5 line-clamp-2">
                    {org.role}
                  </p>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedOrg?.id === org.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                        aria-expanded="true"
                      >
                        <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-100 space-y-2">
                          {isVIP ? (
                            <div className="grid grid-cols-1 gap-2">
                              <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-3 bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#d35400] hover:text-white transition-all group/btn shadow-sm focus-visible:ring-4 focus-visible:ring-[#d35400]/20 outline-none">
                                <Globe size={14} className="text-[#d35400] group-hover/btn:text-white" aria-hidden="true" /> Visit Website
                              </a>
                              <div className="grid grid-cols-2 gap-2">
                                <a href={`mailto:${org.email || 'admin@ncdev.co.za'}`} className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2c3e50] hover:text-white transition-all group/btn shadow-sm focus-visible:ring-4 focus-visible:ring-[#2c3e50]/20 outline-none">
                                  <Mail size={14} className="text-[#2c3e50] group-hover/btn:text-white" aria-hidden="true" /> Email
                                </a>
                                <a href={`tel:${org.phone || '0531234567'}`} className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2c3e50] hover:text-white transition-all group/btn shadow-sm focus-visible:ring-4 focus-visible:ring-[#2c3e50]/20 outline-none">
                                  <Phone size={14} className="text-[#2c3e50] group-hover/btn:text-white" aria-hidden="true" /> Call
                                </a>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModal('unlock');
                              }}
                              className="w-full p-4 border-2 border-dashed border-orange-200 bg-orange-50/50 rounded-xl flex flex-col items-center gap-1.5 hover:bg-orange-50 transition-all group/lock focus-visible:ring-4 focus-visible:ring-[#d35400]/20 outline-none"
                              aria-label="Unlock contact information"
                            >
                              <div className="p-1.5 bg-white rounded-full shadow-sm group-hover/lock:scale-110 transition-transform">
                                <Lock size={16} className="text-[#d35400]" aria-hidden="true" />
                              </div>
                              <div className="text-center">
                                <span className="block font-black text-[9px] text-[#d35400] uppercase tracking-widest">Contact Info Locked</span>
                                <span className="block text-[7px] font-bold text-orange-400 uppercase mt-0.5">Sponsor Access Required</span>
                              </div>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                      <Landmark size={10} className="text-[#d35400]/50" aria-hidden="true" />
                      <span>{org.city}, {org.province}</span>
                    </div>
                    <div className={cn(
                      "p-1 rounded-md bg-gray-50 text-gray-400 group-hover:bg-[#d35400] group-hover:text-white transition-all",
                      selectedOrg?.id === org.id && "bg-[#d35400] text-white rotate-90"
                    )}>
                      <ChevronRight size={12} aria-hidden="true" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <footer className="p-2 bg-[#2c3e50] text-white shrink-0">
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex flex-col">
                <p className="text-[6px] font-black uppercase tracking-[0.2em] opacity-40">Managed By</p>
                <p className="text-[8px] font-black uppercase tracking-widest">NC Dev Ecosystem</p>
              </div>
              <a href="mailto:admin@ncdev.co.za" className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[7px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border border-white/10">
                <Mail size={10} className="text-[#f1c40f]" /> admin@ncdev.co.za
              </a>
            </div>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
