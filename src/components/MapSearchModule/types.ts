// [2025-01-07 11:35 UTC] - Unified Map Search Module Types
// Core types for the reusable map-based discovery module

export type MapSearchContext = 'consumer' | 'admin';

export type BusinessCardAction = 
  // Consumer actions
  | 'view' 
  | 'call' 
  | 'book' 
  | 'menu'
  | 'directions'
  // Admin actions
  | 'approve' 
  | 'reject' 
  | 'lead'
  | 'details'
  | 'edit';

export interface MapSearchLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface MapSearchFilters {
  cuisine?: string[];
  priceLevel?: number[];
  rating?: number;
  openNow?: boolean;
  radius?: number; // in meters
  businessType?: string;
  status?: 'pending' | 'approved' | 'rejected'; // admin context only
}

export interface BusinessResult {
  id: string;
  placeId?: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  photos?: string[];
  phoneNumber?: string;
  website?: string;
  cuisine?: string[];
  types?: string[];
  openingHours?: {
    isOpen: boolean;
    hours?: string[];
  };
  businessStatus?: string;
  // Admin-specific fields
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  addedDate?: Date;
  source?: 'google_places' | 'manual' | 'partner_signup';
}

export interface MapSearchModuleProps {
  // Core configuration
  context: MapSearchContext;
  
  // Display options
  filtersEnabled?: boolean;
  radiusSlider?: boolean;
  resultCardType?: 'restaurant' | 'business' | 'hotel' | 'spa';
  
  // Actions configuration
  actions?: BusinessCardAction[];
  
  // Map configuration
  initialLocation?: MapSearchLocation;
  defaultRadius?: number; // in meters
  maxResults?: number;
  
  // UI configuration
  className?: string;
  showMap?: boolean;
  mapHeight?: string;
  cardLayout?: 'grid' | 'list';
  
  // Event handlers
  onLocationChange?: (location: MapSearchLocation) => void;
  onFiltersChange?: (filters: MapSearchFilters) => void;
  onBusinessSelect?: (business: BusinessResult) => void;
  onBusinessAction?: (action: BusinessCardAction, business: BusinessResult) => void;
  
  // Admin-specific props
  onApprove?: (business: BusinessResult) => void;
  onReject?: (business: BusinessResult) => void;
  onCreateLead?: (business: BusinessResult) => void;
}

export interface MapSearchState {
  location: MapSearchLocation | null;
  filters: MapSearchFilters;
  results: BusinessResult[];
  selectedBusiness: BusinessResult | null;
  isLoading: boolean;
  error: string | null;
  mapInstance: any | null; // Google Maps instance
  markers: any[]; // Google Maps markers
}

// Filter options for different contexts
export interface FilterOption {
  id: string;
  label: string;
  value: any;
  icon?: React.ComponentType<any>;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

// Context-specific configurations
export interface ContextConfig {
  filters: FilterGroup[];
  actions: BusinessCardAction[];
  cardLayout: 'grid' | 'list';
  showMap: boolean;
  mapHeight: string;
} 