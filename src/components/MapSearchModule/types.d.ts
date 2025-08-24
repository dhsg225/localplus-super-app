export type MapSearchContext = 'consumer' | 'admin';
export type BusinessCardAction = 'view' | 'call' | 'book' | 'menu' | 'directions' | 'approve' | 'reject' | 'lead' | 'details' | 'edit';
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
    radius?: number;
    businessType?: string;
    status?: 'pending' | 'approved' | 'rejected';
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
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    addedDate?: Date;
    source?: 'google_places' | 'manual' | 'partner_signup';
}
export interface MapSearchModuleProps {
    context: MapSearchContext;
    filtersEnabled?: boolean;
    radiusSlider?: boolean;
    resultCardType?: 'restaurant' | 'business' | 'hotel' | 'spa';
    actions?: BusinessCardAction[];
    initialLocation?: MapSearchLocation;
    defaultRadius?: number;
    maxResults?: number;
    className?: string;
    showMap?: boolean;
    mapHeight?: string;
    cardLayout?: 'grid' | 'list';
    onLocationChange?: (location: MapSearchLocation) => void;
    onFiltersChange?: (filters: MapSearchFilters) => void;
    onBusinessSelect?: (business: BusinessResult) => void;
    onBusinessAction?: (action: BusinessCardAction, business: BusinessResult) => void;
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
    mapInstance: any | null;
    markers: any[];
}
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
export interface ContextConfig {
    filters: FilterGroup[];
    actions: BusinessCardAction[];
    cardLayout: 'grid' | 'list';
    showMap: boolean;
    mapHeight: string;
}
