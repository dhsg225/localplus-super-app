import { Province, District, SubDistrict, GeoFilter, CascadingGeoData, AddressComponents, LDPArea } from '@/types/geography';
export declare class GeographyService {
    private static instance;
    static getInstance(): GeographyService;
    getProvinces(): Promise<Province[]>;
    getDistrictsByProvince(provinceId: string): Promise<District[]>;
    getSubDistrictsByDistrict(districtId: string): Promise<SubDistrict[]>;
    getCascadingGeoData(provinceId?: string, districtId?: string): Promise<CascadingGeoData>;
    parseAddressComponents(components: AddressComponents): Promise<{
        province_id?: string;
        district_id?: string;
        sub_district_id?: string;
    }>;
    getLDPAreas(): LDPArea[];
    getBusinessesByGeoFilter(filter: GeoFilter): Promise<any>;
    getFullAddress(provinceId: string, districtId: string, subDistrictId: string): Promise<string>;
    private getFallbackProvinces;
    private getFallbackDistricts;
    private getFallbackSubDistricts;
}
export declare const geographyService: GeographyService;
