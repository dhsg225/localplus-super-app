// [2025-01-07 11:40 UTC] - MapSearchModule Configuration
// Context-specific configurations for consumer and admin interfaces

import { 
  MapPin, 
  Star, 
  DollarSign, 
  Clock, 
  Utensils, 
  Coffee, 
  Pizza, 
  Fish, 
  CheckCircle, 
  XCircle, 
  UserPlus,
  Eye,
  Phone,
  Navigation,
  Calendar,
  Menu
} from 'lucide-react';

import { ContextConfig } from './types';

// Cuisine options with icons
export const CUISINE_FILTERS = [
  { id: 'thai', label: 'Thai Traditional', value: 'thai', icon: Utensils },
  { id: 'italian', label: 'Italian', value: 'italian', icon: Pizza },
  { id: 'seafood', label: 'Seafood', value: 'seafood', icon: Fish },
  { id: 'international', label: 'International', value: 'international', icon: Coffee },
  { id: 'cafe', label: 'Café & Coffee', value: 'cafe', icon: Coffee },
  { id: 'street_food', label: 'Street Food', value: 'street_food', icon: Utensils },
];

// Price level options
export const PRICE_LEVEL_FILTERS = [
  { id: 'budget', label: 'Budget (฿)', value: 1, icon: DollarSign },
  { id: 'moderate', label: 'Moderate (฿฿)', value: 2, icon: DollarSign },
  { id: 'upscale', label: 'Upscale (฿฿฿)', value: 3, icon: DollarSign },
  { id: 'fine_dining', label: 'Fine Dining (฿฿฿฿)', value: 4, icon: DollarSign },
];

// Business type options
export const BUSINESS_TYPE_FILTERS = [
  { id: 'restaurant', label: 'Restaurants', value: 'restaurant', icon: Utensils },
  { id: 'cafe', label: 'Cafés', value: 'cafe', icon: Coffee },
  { id: 'bar', label: 'Bars & Pubs', value: 'bar', icon: Coffee },
  { id: 'spa', label: 'Spa & Wellness', value: 'spa', icon: Star },
  { id: 'hotel', label: 'Hotels', value: 'lodging', icon: MapPin },
  { id: 'shopping', label: 'Shopping', value: 'store', icon: MapPin },
];

// Consumer context configuration
export const CONSUMER_CONFIG: ContextConfig = {
  filters: [
    {
      id: 'cuisine',
      label: 'Cuisine Type',
      type: 'multiselect',
      options: CUISINE_FILTERS,
    },
    {
      id: 'priceLevel',
      label: 'Price Range',
      type: 'multiselect',
      options: PRICE_LEVEL_FILTERS,
    },
    {
      id: 'rating',
      label: 'Minimum Rating',
      type: 'range',
      min: 0,
      max: 5,
      step: 0.5,
    },
    {
      id: 'openNow',
      label: 'Open Now',
      type: 'toggle',
    },
    {
      id: 'radius',
      label: 'Search Radius (km)',
      type: 'range',
      min: 0.5,
      max: 10,
      step: 0.5,
    },
  ],
  actions: ['view', 'call', 'directions', 'book', 'menu'],
  cardLayout: 'grid',
  showMap: true,
  mapHeight: '300px',
};

// Admin context configuration
export const ADMIN_CONFIG: ContextConfig = {
  filters: [
    {
      id: 'businessType',
      label: 'Business Type',
      type: 'select',
      options: BUSINESS_TYPE_FILTERS,
    },
    {
      id: 'status',
      label: 'Approval Status',
      type: 'select',
      options: [
        { id: 'pending', label: 'Pending Review', value: 'pending', icon: Clock },
        { id: 'approved', label: 'Approved', value: 'approved', icon: CheckCircle },
        { id: 'rejected', label: 'Rejected', value: 'rejected', icon: XCircle },
      ],
    },
    {
      id: 'rating',
      label: 'Minimum Rating',
      type: 'range',
      min: 0,
      max: 5,
      step: 0.5,
    },
    {
      id: 'radius',
      label: 'Search Radius (km)',
      type: 'range',
      min: 0.5,
      max: 20,
      step: 0.5,
    },
  ],
  actions: ['approve', 'reject', 'lead', 'details'],
  cardLayout: 'list',
  showMap: true,
  mapHeight: '400px',
};

// Action button configurations
export const ACTION_CONFIGS = {
  // Consumer actions
  view: { label: 'View Details', icon: Eye, variant: 'primary' as const },
  call: { label: 'Call', icon: Phone, variant: 'outline' as const },
  directions: { label: 'Directions', icon: Navigation, variant: 'outline' as const },
  book: { label: 'Book Table', icon: Calendar, variant: 'primary' as const },
  menu: { label: 'View Menu', icon: Menu, variant: 'outline' as const },
  
  // Admin actions
  approve: { label: 'Approve', icon: CheckCircle, variant: 'success' as const },
  reject: { label: 'Reject', icon: XCircle, variant: 'danger' as const },
  lead: { label: 'Create Lead', icon: UserPlus, variant: 'outline' as const },
  details: { label: 'View Details', icon: Eye, variant: 'outline' as const },
  edit: { label: 'Edit', icon: Menu, variant: 'outline' as const },
};

// Default radius options (in meters)
export const DEFAULT_RADIUS = {
  consumer: 3000,  // 3km for consumer searches
  admin: 5000,     // 5km for admin discovery
};

// Maximum results per search
export const MAX_RESULTS = {
  consumer: 20,
  admin: 50,
};

// Map configuration
export const MAP_CONFIG = {
  defaultZoom: 14,
  styles: [
    // Simplified map style for better visibility
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ],
  controls: {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  }
}; 