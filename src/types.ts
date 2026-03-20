export type OrgType = 'Enabler' | 'Innovator' | 'Knowledge' | 'Government' | 'Infrastructure';

export interface Organization {
  id: string | number;
  name: string;
  website: string;
  category: string;
  role: string;
  type: OrgType;
  city: string;
  province: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  logo?: string;
  isPulseVerified?: boolean;
  status?: 'pending' | 'approved';
}

export const ORGANIZATION_TYPES: Record<OrgType, { color: string; icon: string; description: string }> = {
  Enabler: {
    color: '#27ae60',
    icon: 'HandHelping',
    description: 'Support & Service Providers',
  },
  Innovator: {
    color: '#e67e22',
    icon: 'Rocket',
    description: 'Technology & Startup Companies',
  },
  Knowledge: {
    color: '#2980b9',
    icon: 'GraduationCap',
    description: 'Education & Research Institutions',
  },
  Government: {
    color: '#7f8c8d',
    icon: 'Landmark',
    description: 'Public & State-Backed Organizations',
  },
  Infrastructure: {
    color: '#9b59b6',
    icon: 'MapPin',
    description: 'Physical & Digital Resources',
  },
};
