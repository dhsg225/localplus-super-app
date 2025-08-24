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
    postal_codes: string[];
    created_at: string;
    updated_at: string;
}
export type ThaiRegion = 'central' | 'northern' | 'northeastern' | 'southern' | 'eastern' | 'western';
export interface GeoEnhancedBusiness {
    id: string;
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
    province_id: string;
    district_id: string;
    sub_district_id: string;
    postal_code?: string;
    address_line: string;
    latitude?: number;
    longitude?: number;
    category_id: string;
    partnership_status: 'pending' | 'active' | 'suspended';
    verified_at?: string;
    created_at: string;
    updated_at: string;
}
export interface GeoFilter {
    province_id?: string;
    district_id?: string;
    sub_district_id?: string;
    region?: ThaiRegion;
}
export interface CascadingGeoData {
    provinces: Province[];
    districts: District[];
    subDistricts: SubDistrict[];
}
export interface AddressComponents {
    street_number?: string;
    route?: string;
    sublocality_level_1?: string;
    locality?: string;
    administrative_area_level_1?: string;
    postal_code?: string;
    country?: string;
}
export interface LDPArea {
    id: string;
    name: string;
    province_id: string;
    district_ids: string[];
    sub_district_ids: string[];
    priority_level: 'primary' | 'secondary' | 'expansion';
    is_active: boolean;
}
export declare const LDP_PRIORITY_AREAS: LDPArea[];
