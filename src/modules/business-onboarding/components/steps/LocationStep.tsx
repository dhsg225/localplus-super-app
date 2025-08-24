import React, { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { BusinessOnboardingData, OperatingHours } from '../../types';
import FormInput from '@/ui-components/forms/FormInput';
import FormSelect from '@/ui-components/forms/FormSelect';

interface LocationStepProps {
  data: Partial<BusinessOnboardingData>;
  errors: Record<string, string>;
  updateData: (data: Partial<BusinessOnboardingData>) => void;
}

const thailandCities = [
  { value: 'bangkok', label: 'Bangkok' },
  { value: 'pattaya', label: 'Pattaya' },
  { value: 'hua-hin', label: 'Hua Hin' },
  { value: 'krabi', label: 'Krabi' },
  { value: 'samui', label: 'Koh Samui' },
  { value: 'phuket', label: 'Phuket' },
  { value: 'chiang-mai', label: 'Chiang Mai' },
  { value: 'other', label: 'Other' }
];

const bangkokDistricts = [
  { value: 'thonglor', label: 'Thonglor' },
  { value: 'phrom-phong', label: 'Phrom Phong' },
  { value: 'ekkamai', label: 'Ekkamai' },
  { value: 'on-nut', label: 'On Nut' },
  { value: 'riverside', label: 'Riverside' },
  { value: 'nana', label: 'Nana' },
  { value: 'sukhumvit', label: 'Sukhumvit' },
  { value: 'silom', label: 'Silom' },
  { value: 'siam', label: 'Siam' },
  { value: 'other-bangkok', label: 'Other Bangkok District' }
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const LocationStep: React.FC<LocationStepProps> = ({
  data,
  errors,
  updateData
}) => {
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(
    data.operatingHours || daysOfWeek.map(day => ({
      day,
      isOpen: true,
      openTime: '09:00',
      closeTime: '22:00'
    }))
  );

  const handleInputChange = (field: keyof BusinessOnboardingData, value: string) => {
    updateData({ [field]: value });
  };

  const updateOperatingHours = (dayIndex: number, updates: Partial<OperatingHours>) => {
    const newHours = [...operatingHours];
    newHours[dayIndex] = { ...newHours[dayIndex], ...updates };
    setOperatingHours(newHours);
    updateData({ operatingHours: newHours });
  };

  const getDistrictOptions = () => {
    return data.city === 'bangkok' ? bangkokDistricts : [];
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Where can customers find you?
        </h2>
        <p className="text-gray-600">
          Help customers locate your business easily
        </p>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <FormInput
          label="Full Address"
          value={data.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={errors.address}
          placeholder="e.g., 123 Sukhumvit Road, Watthana"
          required
        />

        <FormSelect
          label="City"
          options={thailandCities}
          value={data.city || ''}
          onChange={(e) => handleInputChange('city', e.target.value)}
          error={errors.city}
          required
        />

        {data.city === 'bangkok' && (
          <FormSelect
            label="District"
            options={getDistrictOptions()}
            value={data.district || ''}
            onChange={(e) => handleInputChange('district', e.target.value)}
            error={errors.district}
            helperText="Select the specific Bangkok district"
          />
        )}

        <FormInput
          label="Google Maps Link (Optional but Recommended)"
          value={data.googleMapsLink || ''}
          onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
          error={errors.googleMapsLink}
          placeholder="https://maps.google.com/..."
          helperText="Makes it easier for customers to find you"
        />
      </div>

      {/* Operating Hours */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Clock size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Operating Hours</h3>
        </div>

        <div className="space-y-3">
          {operatingHours.map((dayHours, index) => (
            <div key={dayHours.day} className="flex items-center space-x-3">
              <div className="w-20 text-sm font-medium text-gray-700">
                {dayHours.day.slice(0, 3)}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dayHours.isOpen}
                  onChange={(e) => updateOperatingHours(index, { isOpen: e.target.checked })}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-xs text-gray-500">Open</span>
              </div>

              {dayHours.isOpen && (
                <>
                  <input
                    type="time"
                    value={dayHours.openTime}
                    onChange={(e) => updateOperatingHours(index, { openTime: e.target.value })}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="time"
                    value={dayHours.closeTime}
                    onChange={(e) => updateOperatingHours(index, { closeTime: e.target.value })}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </>
              )}

              {!dayHours.isOpen && (
                <span className="text-sm text-gray-500 italic">Closed</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Tip: Accurate hours help customers plan their visits and build trust
        </div>
      </div>

      {/* Location Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <MapPin size={16} className="text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">Location Tips</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Include nearby landmarks in your address</li>
              <li>• Google Maps link helps customers navigate easily</li>
              <li>• Accurate hours prevent disappointed customers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStep; 