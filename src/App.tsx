import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import Fuse from 'fuse.js';
import { 
  Building, 
  Heart, 
  Lock, 
  CheckCircle, 
  Info,
  MapPin
} from 'lucide-react';

import { ALL_DATA } from './data';
import { Organization, OrgType } from './types';
import { cn } from './utils/cn';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/Map';
import { Modal } from './components/Modal';
import { Tour } from './components/Tour';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<OrgType | 'All'>('All');
  const [isVIP, setIsVIP] = useState(() => localStorage.getItem('ncdev_vip') === 'true');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-29.0852, 26.1596]);
  const [mapZoom, setMapZoom] = useState(7);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const markerRefs = useRef<Map<number, L.Marker>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Modals
  const [activeModal, setActiveModal] = useState<'join' | 'pulse' | 'unlock' | 'donate' | 'welcome' | 'help' | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [unlockCode, setUnlockCode] = useState('');

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(ALL_DATA, {
    keys: ['name', 'category', 'role', 'city', 'province'],
    threshold: 0.4,
  }), []);

  const filteredData = useMemo(() => {
    let results = searchTerm 
      ? fuse.search(searchTerm).map(r => r.item)
      : ALL_DATA;

    if (typeFilter !== 'All') {
      results = results.filter(d => d.type === typeFilter);
    }
    return results;
  }, [searchTerm, typeFilter, fuse]);

  useEffect(() => {
    if (selectedOrg && isSidebarOpen) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`org-card-${selectedOrg.id}`);
        if (element && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const scrollTarget = element.offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);
          
          container.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedOrg?.id, isSidebarOpen]);

  const handleOrgClick = useCallback((org: Organization) => {
    setSelectedOrg(org);
    setMapCenter([org.lat, org.lng]);
    setMapZoom(16);
    
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    }
    
    setTimeout(() => {
      const marker = markerRefs.current.get(org.id);
      if (marker) {
        marker.openPopup();
      }
    }, 500);
  }, []);

  const handleMarkerClick = useCallback((org: Organization) => {
    setSelectedOrg(org);
    setMapCenter([org.lat, org.lng]);
    setMapZoom(14);
    
    if (window.innerWidth >= 768 && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  }, [isSidebarOpen]);

  const [unlockError, setUnlockError] = useState(false);

  const attemptUnlock = (code: string) => {
    const validCodes = ["NCDEV", "SISHEN", "MTN", "ADMIN"];
    if (validCodes.includes(code.toUpperCase())) {
      setIsVIP(true);
      localStorage.setItem('ncdev_vip', 'true');
      setActiveModal('welcome');
      setUnlockCode('');
      setUnlockError(false);
    } else {
      setUnlockError(true);
      setUnlockCode('');
      setTimeout(() => setUnlockError(false), 3000);
    }
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('sa_innovation_tour_seen');
    if (!hasSeenTour) {
      setTourStep(0);
    }
  }, []);

  const finishTour = () => {
    setTourStep(null);
    localStorage.setItem('sa_innovation_tour_seen', 'true');
  };

  const tourSteps = [
    {
      title: "Welcome to the Landscape! 🇿🇦",
      content: "We'll show you how to find support, funding, and training in just 3 quick steps.",
      target: null
    },
    {
      title: "Find Exactly What You Need",
      content: "Type here to search for specific support centers or types of help. Don't worry about spelling—we'll understand!",
      target: "tour-search"
    },
    {
      title: "Filter by Category",
      content: "Use these buttons to quickly see only Enablers, Innovators, or Government support.",
      target: "tour-filters"
    },
    {
      title: "Explore the Map",
      content: "See where everything is located. Tap a pin to see contact details and how they can help you.",
      target: "tour-map"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-[#f4f6f8]">
      <Tour 
        tourStep={tourStep} 
        tourSteps={tourSteps} 
        setTourStep={setTourStep} 
        finishTour={finishTour} 
      />

      <Navbar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isVIP={isVIP} 
        setActiveModal={setActiveModal} 
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          filteredData={filteredData}
          selectedOrg={selectedOrg}
          handleOrgClick={handleOrgClick}
          isVIP={isVIP}
          setActiveModal={setActiveModal}
          scrollContainerRef={scrollContainerRef}
        />

        <MapView 
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          filteredData={filteredData}
          selectedOrg={selectedOrg}
          handleMarkerClick={handleMarkerClick}
          handleOrgClick={handleOrgClick}
          markerRefs={markerRefs}
          showLegend={showLegend}
          setShowLegend={setShowLegend}
        />
      </div>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'unlock'} 
        onClose={() => setActiveModal(null)} 
        title="Sponsor Access"
        icon={Lock}
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-[#d35400]" />
          </div>
          <h4 className="text-2xl font-black text-[#2c3e50] mb-2 uppercase tracking-tight">Unlock Contact Data</h4>
          <p className="text-gray-500 mb-8 font-medium">Enter your partner or sponsor code to view direct contact information and websites.</p>
          
          <div className="max-w-xs mx-auto space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="ENTER CODE" 
                className={cn(
                  "w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl text-center font-black text-xl uppercase tracking-[0.3em] outline-none transition-all",
                  unlockError ? "border-red-500 animate-shake" : "border-gray-200 focus:border-[#d35400]"
                )}
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && attemptUnlock(unlockCode)}
              />
              {unlockError && (
                <p className="absolute -bottom-6 left-0 w-full text-center text-red-500 text-[10px] font-black uppercase tracking-widest animate-fade-in">
                  Invalid Access Code
                </p>
              )}
            </div>
            <button 
              onClick={() => attemptUnlock(unlockCode)}
              className="w-full py-4 bg-[#2c3e50] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#d35400] transition-all shadow-xl active:scale-95"
            >
              Verify Access
            </button>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Don't have a code? Try <span className="text-[#d35400]">NCDEV</span></p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'welcome'} 
        onClose={() => setActiveModal(null)} 
        title="Welcome, Partner"
        icon={CheckCircle}
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h4 className="text-2xl font-black text-[#2c3e50] mb-2 uppercase tracking-tight">Access Granted</h4>
          <p className="text-gray-500 mb-8 font-medium">You now have full access to the stakeholder directory, including direct emails, phone numbers, and websites.</p>
          <button 
            onClick={() => setActiveModal(null)}
            className="px-12 py-4 bg-[#2c3e50] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl"
          >
            Let's Go
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'help'} 
        onClose={() => setActiveModal(null)} 
        title="Help & FAQ"
        icon={Info}
      >
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="font-black text-[#2c3e50] uppercase tracking-widest text-sm">What is this platform?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">This is a comprehensive map of the South African innovation ecosystem, specifically focused on the Northern Cape but including national enablers.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-[#2c3e50] uppercase tracking-widest text-sm">How do I get listed?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">If you are an enabler, innovator, or provide infrastructure, please contact us at admin@ncdev.co.za to be added to the landscape.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-[#2c3e50] uppercase tracking-widest text-sm">Why is contact info locked?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">To protect our stakeholders from spam, direct contact details are reserved for verified partners and sponsors. You can unlock access with a code.</p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'join'} 
        onClose={() => setActiveModal(null)} 
        title="Join the Ecosystem"
        icon={Building}
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building size={40} className="text-blue-600" />
          </div>
          <h4 className="text-2xl font-black text-[#2c3e50] mb-2 uppercase tracking-tight">Get Listed</h4>
          <p className="text-gray-500 mb-8 font-medium">Are you an enabler, innovator, or infrastructure provider in the Northern Cape? Join our growing network.</p>
          <div className="space-y-4 max-w-xs mx-auto">
            <a 
              href="mailto:admin@ncdev.co.za?subject=Join the Innovation Landscape"
              className="block w-full py-4 bg-[#2c3e50] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl text-center"
            >
              Email Us to Join
            </a>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free for all verified ecosystem stakeholders</p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'pulse'} 
        onClose={() => setActiveModal(null)} 
        title="NC Dev Pulse"
        icon={CheckCircle}
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-yellow-600" />
          </div>
          <h4 className="text-2xl font-black text-[#2c3e50] mb-2 uppercase tracking-tight">Pulse Verification</h4>
          <p className="text-gray-500 mb-8 font-medium">The Pulse badge indicates a stakeholder has been physically verified by the NC Dev Ecosystem team.</p>
          <div className="bg-gray-50 p-6 rounded-2xl text-left space-y-4 mb-8">
            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-black text-[10px]">1</div>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">Physical site visit by our ecosystem mapping team.</p>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-black text-[10px]">2</div>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">Verification of active support programs and infrastructure.</p>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-black text-[10px]">3</div>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">Direct connection to the regional innovation pipeline.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal(null)}
            className="px-12 py-4 bg-[#2c3e50] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-xl"
          >
            Got it
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'donate'} 
        onClose={() => setActiveModal(null)} 
        title="Support the Ecosystem"
        icon={Heart}
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-[#e74c3c] fill-[#e74c3c]" />
          </div>
          <h4 className="text-2xl font-black text-[#2c3e50] mb-2 uppercase tracking-tight">Fuel Innovation</h4>
          <p className="text-gray-500 mb-8 font-medium">Your support helps us maintain this platform and continue mapping the landscape for local innovators.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="py-4 border-2 border-gray-200 rounded-2xl font-black uppercase tracking-widest hover:border-[#e74c3c] hover:text-[#e74c3c] transition-all">Become a Sponsor</button>
            <button className="py-4 bg-[#e74c3c] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#c0392b] transition-all shadow-lg">Donate Now</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
