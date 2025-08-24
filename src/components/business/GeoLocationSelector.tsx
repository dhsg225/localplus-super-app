import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { geographyService } from '@/services/geographyService';
import { Province, District, SubDistrict } from '@/types/geography';

interface GeoLocationSelectorProps {
  onLocationChange: (location: {
    province_id?: string;
    district_id?: string;
    sub_district_id?: string;
  }) => void;
  initialValues?: {
    province_id?: string;
    district_id?: string;
    sub_district_id?: string;
  };
  className?: string;
  showLabels?: boolean;
  required?: boolean;
}

export const GeoLocationSelector: React.FC<GeoLocationSelectorProps> = ({
  onLocationChange,
  initialValues,
  className = '',
  showLabels = true,
  required = false
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<string>(initialValues?.province_id || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialValues?.district_id || '');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>(initialValues?.sub_district_id || '');
  
  const [isLoading, setIsLoading] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoading(true);
      try {
        const provincesData = await geographyService.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error loading provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        setSelectedDistrict('');
        setSelectedSubDistrict('');
        return;
      }

      setIsLoading(true);
      try {
        const districtsData = await geographyService.getDistrictsByProvince(selectedProvince);
        setDistricts(districtsData);
        
        // Reset dependent selections
        if (selectedDistrict && !districtsData.find(d => d.id === selectedDistrict)) {
          setSelectedDistrict('');
          setSelectedSubDistrict('');
        }
      } catch (error) {
        console.error('Error loading districts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDistricts();
  }, [selectedProvince]);

  // Load sub-districts when district changes
  useEffect(() => {
    const loadSubDistricts = async () => {
      if (!selectedDistrict) {
        setSubDistricts([]);
        setSelectedSubDistrict('');
        return;
      }

      setIsLoading(true);
      try {
        const subDistrictsData = await geographyService.getSubDistrictsByDistrict(selectedDistrict);
        setSubDistricts(subDistrictsData);
        
        // Reset sub-district if it's no longer valid
        if (selectedSubDistrict && !subDistrictsData.find(s => s.id === selectedSubDistrict)) {
          setSelectedSubDistrict('');
        }
      } catch (error) {
        console.error('Error loading sub-districts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubDistricts();
  }, [selectedDistrict]);

  // Notify parent of changes
  useEffect(() => {
    onLocationChange({
      province_id: selectedProvince || undefined,
      district_id: selectedDistrict || undefined,
      sub_district_id: selectedSubDistrict || undefined
    });
  }, [selectedProvince, selectedDistrict, selectedSubDistrict, onLocationChange]);

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedSubDistrict('');
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedSubDistrict('');
  };

  const handleSubDistrictChange = (subDistrictId: string) => {
    setSelectedSubDistrict(subDistrictId);
  };

  const selectClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className={`space-y-4 ${className}`}>
      {showLabels && (
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <MapPin size={20} className="text-blue-600" />
          <span>Location</span>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province Selector */}
        <div>
          {showLabels && (
            <label className={labelClass}>
              Province {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className={selectClass}
              disabled={isLoading || provinces.length === 0}
              required={required}
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name_en} ({province.name_th})
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
        </div>

        {/* District Selector */}
        <div>
          {showLabels && (
            <label className={labelClass}>
              District {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className={selectClass}
              disabled={isLoading || !selectedProvince || districts.length === 0}
              required={required}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name_en} ({district.name_th})
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
        </div>

        {/* Sub-District Selector */}
        <div>
          {showLabels && (
            <label className={labelClass}>
              Sub-District
            </label>
          )}
          <div className="relative">
            <select
              value={selectedSubDistrict}
              onChange={(e) => handleSubDistrictChange(e.target.value)}
              className={selectClass}
              disabled={isLoading || !selectedDistrict || subDistricts.length === 0}
            >
              <option value="">Select Sub-District</option>
              {subDistricts.map((subDistrict) => (
                <option key={subDistrict.id} value={subDistrict.id}>
                  {subDistrict.name_en} ({subDistrict.name_th})
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Loading geographic data...</span>
        </div>
      )}

      {/* Selected location display */}
      {(selectedProvince || selectedDistrict || selectedSubDistrict) && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <MapPin size={16} />
            <span className="font-medium">Selected Location:</span>
          </div>
          <div className="mt-1 text-sm text-blue-700">
            {[
              subDistricts.find(s => s.id === selectedSubDistrict)?.name_en,
              districts.find(d => d.id === selectedDistrict)?.name_en,
              provinces.find(p => p.id === selectedProvince)?.name_en
            ].filter(Boolean).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}; 