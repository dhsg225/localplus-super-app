// Thailand Administrative Hierarchy Types
export interface Province {
  id: string;
  code: string;
  name_en: string;
  name_th: string;
  region: ThaiRegion;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  code: string;
  province_id: string;
  name_en: string;
  name_th: string;
  created_at: string;
  updated_at: string;
}

export interface SubDistrict {
  id: string;
  code: string;
  district_id: string;
  name_en: string;
  name_th: string;
  postal_codes: string[]; // Array of postal codes for this sub-district
  created_at: string;
  updated_at: string;
}

export type ThaiRegion = 
  | 'central'
  | 'northern' 
  | 'northeastern'
  | 'southern'
  | 'eastern'
  | 'western';

// Enhanced Business Type with Geo-Hierarchy
export interface GeoEnhancedBusiness {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Precise Geographic Location
  province_id: string;
  district_id: string;
  sub_district_id: string;
  postal_code?: string;
  address_line: string; // Street address (building number, street name)
  latitude?: number;
  longitude?: number;
  
  // Business Details
  category_id: string;
  partnership_status: 'pending' | 'active' | 'suspended';
  verified_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// Geographic Filtering Options
export interface GeoFilter {
  province_id?: string;
  district_id?: string;
  sub_district_id?: string;
  region?: ThaiRegion;
}

// Cascading Geographic Data for Dropdowns
export interface CascadingGeoData {
  provinces: Province[];
  districts: District[];
  subDistricts: SubDistrict[];
}

// Address Components for Google Places Integration
export interface AddressComponents {
  street_number?: string;
  route?: string;
  sublocality_level_1?: string; // Sub-district
  locality?: string; // District  
  administrative_area_level_1?: string; // Province
  postal_code?: string;
  country?: string;
}

// LDP Priority Areas Configuration
export interface LDPArea {
  id: string;
  name: string;
  province_id: string;
  district_ids: string[];
  sub_district_ids: string[];
  priority_level: 'primary' | 'secondary' | 'expansion';
  is_active: boolean;
}

export const LDP_PRIORITY_AREAS: LDPArea[] = [
  {
    id: 'hua-hin',
    name: 'Hua Hin',
    province_id: 'prachuap-khiri-khan',
    district_ids: ['hua-hin'],
    sub_district_ids: ['hua-hin', 'nong-kae', 'hin-lek-fai'],
    priority_level: 'primary',
    is_active: true
  },
  {
    id: 'pattaya',
    name: 'Pattaya',
    province_id: 'chonburi',
    district_ids: ['bang-lamung'],
    sub_district_ids: ['nong-prue', 'na-kluea', 'pattaya'],
    priority_level: 'primary',
    is_active: true
  },
  {
    id: 'phuket',
    name: 'Phuket',
    province_id: 'phuket',
    district_ids: ['mueang-phuket', 'kathu', 'thalang'],
    sub_district_ids: ['patong', 'karon', 'kata', 'rawai', 'chalong'],
    priority_level: 'primary',
    is_active: true
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai',
    province_id: 'chiang-mai',
    district_ids: ['mueang-chiang-mai'],
    sub_district_ids: ['si-phum', 'phra-sing', 'chang-khlan', 'nimmanhaemin'],
    priority_level: 'secondary',
    is_active: true
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    province_id: 'bangkok',
    district_ids: ['bang-rak', 'pathum-wan', 'phaya-thai', 'ratchathewi'],
    sub_district_ids: ['silom', 'siam', 'pratunam', 'thong-lo'],
    priority_level: 'expansion',
    is_active: false
  }
]; 