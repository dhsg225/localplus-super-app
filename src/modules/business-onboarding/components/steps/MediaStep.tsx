import React from 'react';
import { Upload, Image, FileText } from 'lucide-react';
import { BusinessOnboardingData } from '../../types';
import FormInput from '@/ui-components/forms/FormInput';

interface MediaStepProps {
  data: Partial<BusinessOnboardingData>;
  errors: Record<string, string>;
  updateData: (data: Partial<BusinessOnboardingData>) => void;
}

const MediaStep: React.FC<MediaStepProps> = ({
  data,
  errors,
  updateData
}) => {
  const handleInputChange = (field: keyof BusinessOnboardingData, value: string | boolean) => {
    updateData({ [field]: value });
  };

  const handleFileUpload = (field: 'logoFile' | 'photos' | 'menuPhotos', files: FileList | null) => {
    if (!files) return;
    
    if (field === 'logoFile') {
      updateData({ [field]: files[0] });
    } else {
      updateData({ [field]: Array.from(files) });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Tell your story
        </h2>
        <p className="text-gray-600">
          Help customers understand what makes you special
        </p>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.shortDescription || ''}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={3}
            maxLength={200}
            placeholder="e.g., Authentic Thai cuisine with a modern twist. Fresh ingredients, family recipes, cozy atmosphere."
          />
          <div className="flex justify-between mt-1">
            {errors.shortDescription && (
              <p className="text-sm text-red-600">{errors.shortDescription}</p>
            )}
            <p className="text-xs text-gray-500">
              {(data.shortDescription || '').length}/200 characters
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Description (Optional)
          </label>
          <textarea
            value={data.detailedDescription || ''}
            onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={4}
            placeholder="Tell customers more about your business, specialties, history, what makes you unique..."
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Image size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Business Logo</h3>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload('logoFile', e.target.files)}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {data.logoFile ? data.logoFile.name : 'Click to upload your logo'}
            </p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
          </label>
        </div>
      </div>

      {/* Photos Upload */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Image size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Business Photos</h3>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload('photos', e.target.files)}
            className="hidden"
            id="photos-upload"
          />
          <label htmlFor="photos-upload" className="cursor-pointer">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {data.photos && data.photos.length > 0 
                ? `${data.photos.length} photos selected` 
                : 'Click to upload photos of your business'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Multiple photos welcome (Max 5MB each)</p>
          </label>
        </div>
      </div>

      {/* Menu Photos for Restaurants */}
      {data.businessType === 'restaurant' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText size={20} className="text-orange-600" />
            <h3 className="font-medium text-orange-900">Menu Photos</h3>
          </div>
          
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload('menuPhotos', e.target.files)}
              className="hidden"
              id="menu-upload"
            />
            <label htmlFor="menu-upload" className="cursor-pointer">
              <Upload size={24} className="mx-auto text-orange-400 mb-2" />
              <p className="text-sm text-orange-800">
                {data.menuPhotos && data.menuPhotos.length > 0 
                  ? `${data.menuPhotos.length} menu photos selected` 
                  : 'Upload your menu photos'
                }
              </p>
              <p className="text-xs text-orange-600 mt-1">Clear photos of your menu help customers decide</p>
            </label>
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Online Presence (Optional)</h3>
        
        <FormInput
          label="Website"
          value={data.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://yourbusiness.com"
          type="url"
        />

        <FormInput
          label="Facebook Page"
          value={data.facebookUrl || ''}
          onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
          placeholder="https://facebook.com/yourbusiness"
          type="url"
        />

        <FormInput
          label="Instagram"
          value={data.instagramUrl || ''}
          onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
          placeholder="https://instagram.com/yourbusiness"
          type="url"
        />
      </div>

      {/* Terms Agreement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms-agreement"
            checked={data.agreedToTerms || false}
            onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mt-0.5"
          />
          <label htmlFor="terms-agreement" className="text-sm text-blue-900">
            I agree to the{' '}
            <a href="/terms" className="underline hover:text-blue-700" target="_blank">
              LocalPlus Partner Terms of Service
            </a>
            {' '}and confirm that all information provided is accurate. <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.agreedToTerms && (
          <p className="mt-2 text-sm text-red-600">{errors.agreedToTerms}</p>
        )}
      </div>

      {/* Submission Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Our team will review your listing within 1-3 business days</li>
          <li>• We'll email you when your listing goes live</li>
          <li>• You can update your information anytime</li>
          <li>• Start attracting new customers immediately!</li>
        </ul>
      </div>
    </div>
  );
};

export default MediaStep; 