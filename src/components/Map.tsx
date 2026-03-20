import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, AttributionControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import { 
  MapPin, 
  Info, 
  CheckCircle, 
  ChevronUp, 
  ChevronDown,
  HandHelping,
  Rocket,
  GraduationCap,
  Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { Organization, ORGANIZATION_TYPES } from '../types';
import { MapController } from './MapController';

const ICON_MAP: Record<string, any> = {
  HandHelping,
  Rocket,
  GraduationCap,
  Landmark,
  MapPin
};

interface MapViewProps {
  mapCenter: [number, number];
  mapZoom: number;
  filteredData: Organization[];
  selectedOrg: Organization | null;
  handleMarkerClick: (org: Organization) => void;
  handleOrgClick: (org: Organization) => void;
  markerRefs: React.MutableRefObject<Map<number, L.Marker>>;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
}

export const MapView = ({
  mapCenter,
  mapZoom,
  filteredData,
  selectedOrg,
  handleMarkerClick,
  handleOrgClick,
  markerRefs,
  showLegend,
  setShowLegend
}: MapViewProps) => {
  return (
    <main className="flex-1 relative z-0" id="tour-map" role="main" aria-label="Interactive map of organizations">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        className="w-full h-full"
        zoomControl={false}
        closePopupOnClick={false}
        aria-label="Geographic map showing organization locations"
        role="application"
      >
        <ZoomControl position="topleft" />
        <AttributionControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {filteredData.map((org) => {
            const typeInfo = ORGANIZATION_TYPES[org.type];
            const isSelected = selectedOrg?.id === org.id;
            const IconComponent = ICON_MAP[typeInfo.icon] || MapPin;
            
            const iconHtml = renderToStaticMarkup(
              <div className={cn(
                "marker-pin",
                org.isPulseVerified && "glow-gold",
                isSelected && "selected-marker-pin"
              )} 
              style={{ 
                background: isSelected ? '#d35400' : typeInfo.color,
                borderColor: org.isPulseVerified ? '#f1c40f' : 'white'
              }}
              aria-label={`${org.name} - ${org.type} marker`}
              >
                <IconComponent size={16} aria-hidden="true" />
              </div>
            );

            const customIcon = L.divIcon({
              className: 'custom-div-icon',
              html: iconHtml,
              iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
              iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
              popupAnchor: [0, isSelected ? -44 : -36]
            });

            return (
              <Marker 
                key={org.id} 
                position={[org.lat, org.lng]} 
                icon={customIcon}
                alt={`${org.name} location marker`}
                title={org.name}
                ref={(ref) => {
                  if (ref) markerRefs.current.set(org.id, ref);
                  else markerRefs.current.delete(org.id);
                }}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    handleMarkerClick(org);
                  }
                }}
              >
                <Popup closeOnClick={false}>
                  <div className="p-4 min-w-[240px] max-w-[300px] font-sans" role="dialog" aria-labelledby={`popup-title-${org.id}`} aria-describedby={`popup-desc-${org.id}`}>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 id={`popup-title-${org.id}`} className="font-black text-sm text-[#2c3e50] uppercase tracking-tight leading-tight">
                        {org.name}
                      </h3>
                      {org.isPulseVerified && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200 shrink-0" aria-label="Verified organization">
                          <CheckCircle size={12} className="text-[#f1c40f]" aria-hidden="true" />
                          <span className="text-[8px] font-black text-[#d35400] uppercase">Verified</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border",
                        org.type === 'Enabler' && "bg-green-50 text-green-700 border-green-200",
                        org.type === 'Innovator' && "bg-orange-50 text-orange-700 border-orange-200",
                        org.type === 'Knowledge' && "bg-blue-50 text-blue-700 border-blue-200",
                        org.type === 'Government' && "bg-gray-50 text-gray-700 border-gray-200"
                      )} aria-label={`Organization type: ${org.type}`}>
                        {org.type}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white text-gray-500 border-gray-200 rounded" aria-label={`Category: ${org.category}`}>
                        {org.category}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">What they do:</p>
                      <p id={`popup-desc-${org.id}`} className="text-[12px] text-gray-600 leading-snug font-medium">
                        {org.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg" aria-label={`Location: ${org.city}, ${org.province}`}>
                      <Landmark size={14} className="text-[#d35400]" aria-hidden="true" />
                      <span>{org.city}, {org.province}</span>
                    </div>

                    <button 
                      onClick={() => handleOrgClick(org)}
                      aria-label={`View full details for ${org.name}`}
                      className="w-full bg-[#d35400] text-white text-[11px] font-black py-3 rounded-xl uppercase tracking-widest hover:bg-[#2c3e50] focus-visible:ring-4 focus-visible:ring-[#d35400]/30 outline-none transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                      <Info size={16} aria-hidden="true" /> 
                      View Full Details
                    </button>
                    <p className="text-[9px] text-center text-gray-400 mt-2 font-bold uppercase tracking-tighter" aria-hidden="true">
                      Click to see contact info & website
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* --- Legend --- */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#2c3e50]/10 z-[1000] w-[180px] overflow-hidden transition-all duration-300">
        <button 
          onClick={() => setShowLegend(!showLegend)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
          aria-expanded={showLegend}
          aria-controls="legend-content"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#d35400] rounded-full" />
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#2c3e50]">Map Legend</h4>
          </div>
          {showLegend ? <ChevronUp size={14} className="text-gray-400 group-hover:text-[#2c3e50]" /> : <ChevronDown size={14} className="text-gray-400 group-hover:text-[#2c3e50]" />}
        </button>
        
        <AnimatePresence>
          {showLegend && (
            <motion.div 
              id="legend-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-3"
            >
              {Object.entries(ORGANIZATION_TYPES).map(([type, info]) => (
                <div key={type} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center text-white shadow-md shrink-0 mt-0.5" style={{ background: info.color }}>
                    {React.createElement(ICON_MAP[info.icon] || MapPin, { size: 12 })}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50] leading-tight">{type}</span>
                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter leading-tight">{info.description}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};
