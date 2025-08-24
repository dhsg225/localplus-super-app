import { supabase } from '../lib/supabase';
import { 
  Province, 
  District, 
  SubDistrict, 
  GeoFilter, 
  CascadingGeoData,
  AddressComponents,
  LDP_PRIORITY_AREAS,
  LDPArea
} from '../types/geography';

export class GeographyService {
  private static instance: GeographyService;
  
  static getInstance(): GeographyService {
    if (!GeographyService.instance) {
      GeographyService.instance = new GeographyService();
    }
    return GeographyService.instance;
  }

  // Get all provinces
  async getProvinces(): Promise<Province[]> {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name_en');

      if (error) throw error;
      return data || this.getFallbackProvinces();
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return this.getFallbackProvinces();
    }
  }

  // Get districts by province
  async getDistrictsByProvince(provinceId: string): Promise<District[]> {
    try {
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .eq('province_id', provinceId)
        .order('name_en');

      if (error) throw error;
      return data || this.getFallbackDistricts(provinceId);
    } catch (error) {
      console.error('Error fetching districts:', error);
      return this.getFallbackDistricts(provinceId);
    }
  }

  // Get sub-districts by district
  async getSubDistrictsByDistrict(districtId: string): Promise<SubDistrict[]> {
    try {
      const { data, error } = await supabase
        .from('sub_districts')
        .select('*')
        .eq('district_id', districtId)
        .order('name_en');

      if (error) throw error;
      return data || this.getFallbackSubDistricts(districtId);
    } catch (error) {
      console.error('Error fetching sub-districts:', error);
      return this.getFallbackSubDistricts(districtId);
    }
  }

  // Get cascading data for dropdowns
  async getCascadingGeoData(provinceId?: string, districtId?: string): Promise<CascadingGeoData> {
    const [provinces, districts, subDistricts] = await Promise.all([
      this.getProvinces(),
      provinceId ? this.getDistrictsByProvince(provinceId) : Promise.resolve([]),
      districtId ? this.getSubDistrictsByDistrict(districtId) : Promise.resolve([])
    ]);

    return {
      provinces,
      districts,
      subDistricts
    };
  }

  // Parse Google Places address components to geographic IDs
  async parseAddressComponents(components: AddressComponents): Promise<{
    province_id?: string;
    district_id?: string;
    sub_district_id?: string;
  }> {
    try {
      const provinces = await this.getProvinces();
      
      // Find province by name
      const province = provinces.find(p => 
        p.name_en.toLowerCase() === components.administrative_area_level_1?.toLowerCase() ||
        p.name_th === components.administrative_area_level_1
      );

      if (!province) return {};

      // Find district
      const districts = await this.getDistrictsByProvince(province.id);
      const district = districts.find(d =>
        d.name_en.toLowerCase() === components.locality?.toLowerCase() ||
        d.name_th === components.locality
      );

      if (!district) return { province_id: province.id };

      // Find sub-district
      const subDistricts = await this.getSubDistrictsByDistrict(district.id);
      const subDistrict = subDistricts.find(s =>
        s.name_en.toLowerCase() === components.sublocality_level_1?.toLowerCase() ||
        s.name_th === components.sublocality_level_1
      );

      return {
        province_id: province.id,
        district_id: district.id,
        sub_district_id: subDistrict?.id
      };
    } catch (error) {
      console.error('Error parsing address components:', error);
      return {};
    }
  }

  // Get LDP priority areas
  getLDPAreas(): LDPArea[] {
    return LDP_PRIORITY_AREAS.filter(area => area.is_active);
  }

  // Get businesses within geographic hierarchy
  async getBusinessesByGeoFilter(filter: GeoFilter) {
    try {
      let query = supabase
        .from('businesses')
        .select(`
          *,
          provinces!province_id (name_en, name_th),
          districts!district_id (name_en, name_th),
          sub_districts!sub_district_id (name_en, name_th)
        `)
        .eq('partnership_status', 'active');

      if (filter.province_id) {
        query = query.eq('province_id', filter.province_id);
      }
      if (filter.district_id) {
        query = query.eq('district_id', filter.district_id);
      }
      if (filter.sub_district_id) {
        query = query.eq('sub_district_id', filter.sub_district_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching businesses by geo filter:', error);
      return [];
    }
  }

  // Get full address string from geographic IDs
  async getFullAddress(provinceId: string, districtId: string, subDistrictId: string): Promise<string> {
    try {
      const [provinces, districts, subDistricts] = await Promise.all([
        this.getProvinces(),
        this.getDistrictsByProvince(provinceId),
        this.getSubDistrictsByDistrict(districtId)
      ]);

      const province = provinces.find(p => p.id === provinceId);
      const district = districts.find(d => d.id === districtId);
      const subDistrict = subDistricts.find(s => s.id === subDistrictId);

      return [subDistrict?.name_en, district?.name_en, province?.name_en]
        .filter(Boolean)
        .join(', ');
    } catch (error) {
      console.error('Error building full address:', error);
      return '';
    }
  }

  // Fallback data for LDP areas when database is unavailable
  private getFallbackProvinces(): Province[] {
    return [
      {
        id: 'prachuap-khiri-khan',
        code: '77',
        name_en: 'Prachuap Khiri Khan',
        name_th: 'ประจวบคีรีขันธ์',
        region: 'southern',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'chonburi',
        code: '20',
        name_en: 'Chonburi',
        name_th: 'ชลบุรี',
        region: 'eastern',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'phuket',
        code: '83',
        name_en: 'Phuket',
        name_th: 'ภูเก็ต',
        region: 'southern',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'chiang-mai',
        code: '50',
        name_en: 'Chiang Mai',
        name_th: 'เชียงใหม่',
        region: 'northern',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getFallbackDistricts(provinceId: string): District[] {
    const districtMap: Record<string, District[]> = {
      'prachuap-khiri-khan': [
        {
          id: 'hua-hin-district',
          code: '7703',
          province_id: 'prachuap-khiri-khan',
          name_en: 'Hua Hin',
          name_th: 'หัวหิน',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      'chonburi': [
        {
          id: 'bang-lamung-district',
          code: '2007',
          province_id: 'chonburi',
          name_en: 'Bang Lamung',
          name_th: 'บางละมุง',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]
    };
    
    return districtMap[provinceId] || [];
  }

  private getFallbackSubDistricts(districtId: string): SubDistrict[] {
    const subDistrictMap: Record<string, SubDistrict[]> = {
      'hua-hin-district': [
        {
          id: 'hua-hin-subdistrict',
          code: '770301',
          district_id: 'hua-hin-district',
          name_en: 'Hua Hin',
          name_th: 'หัวหิน',
          postal_codes: ['77110'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'nong-kae-subdistrict',
          code: '770302',
          district_id: 'hua-hin-district',
          name_en: 'Nong Kae',
          name_th: 'หนองแก',
          postal_codes: ['77110'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      'bang-lamung-district': [
        {
          id: 'pattaya-subdistrict',
          code: '200704',
          district_id: 'bang-lamung-district',
          name_en: 'Pattaya',
          name_th: 'พัทยา',
          postal_codes: ['20150'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]
    };
    
    return subDistrictMap[districtId] || [];
  }
}

export const geographyService = GeographyService.getInstance(); 