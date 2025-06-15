import React from 'react';
import { BusinessOnboardingData, RestaurantType, PriceRange } from '../../types';
import FormInput from '@/ui-components/forms/FormInput';
import FormSelect from '@/ui-components/forms/FormSelect';

interface BasicInfoStepProps {
  data: Partial<BusinessOnboardingData>;
  errors: Record<string, string>;
  updateData: (data: Partial<BusinessOnboardingData>) => void;
}

const restaurantCategories = [
  // Tier 1 - Essential
  { value: 'thai-traditional', label: 'Thai Traditional' },
  { value: 'seafood', label: 'Fresh Seafood' },
  { value: 'street-food', label: 'Street Food' },
  { value: 'chinese-thai', label: 'Chinese-Thai' },
  { value: 'international', label: 'International' },
  
  // Tier 2 - Important
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'italian', label: 'Italian' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'bbq', label: 'BBQ & Grill' },
  
  // Tier 3 - Growing Market
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'halal', label: 'Halal' },
  { value: 'vegetarian', label: 'Vegetarian/Vegan' },
  { value: 'cafe', label: 'Cafe & Coffee' }
];

const restaurantTypes: { value: RestaurantType; label: string }[] = [
  { value: 'fine-dining', label: 'Fine Dining' },
  { value: 'casual', label: 'Casual Dining' },
  { value: 'beachfront', label: 'Beachfront/Waterfront' },
  { value: 'night-market', label: 'Night Market' },
  { value: 'food-court', label: 'Food Court' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'fast-food', label: 'Fast Food' },
  { value: 'street-food', label: 'Street Food' }
];

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: '฿', label: '฿ - Budget (Under ฿200)' },
  { value: '฿฿', label: '฿฿ - Mid-range (฿200-500)' },
  { value: '฿฿฿', label: '฿฿฿ - Upscale (฿500-1000)' },
  { value: '฿฿฿฿', label: '฿฿฿฿ - Fine Dining (฿1000+)' }
];

const serviceCategories = [
  { value: 'cleaning', label: 'Cleaning Services' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'aircon', label: 'Air Conditioning' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'beauty', label: 'Beauty & Salon' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'tutoring', label: 'Tutoring & Education' },
  { value: 'other-service', label: 'Other Service' }
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  errors,
  updateData
}) => {
  const handleInputChange = (field: keyof BusinessOnboardingData, value: string | boolean) => {
    updateData({ [field]: value });
  };

  const getCategoryOptions = () => {
    switch (data.businessType) {
      case 'restaurant':
        return restaurantCategories;
      case 'service-provider':
        return serviceCategories;
      case 'event-organizer':
        return [
          { value: 'music', label: 'Music & Concerts' },
          { value: 'food', label: 'Food & Dining' },
          { value: 'art', label: 'Art & Culture' },
          { value: 'sports', label: 'Sports & Fitness' },
          { value: 'business', label: 'Business & Networking' },
          { value: 'nightlife', label: 'Nightlife & Entertainment' }
        ];
      default:
        return [{ value: 'general', label: 'General' }];
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Tell us about your business
        </h2>
        <p className="text-gray-600">
          Help customers find and connect with you
        </p>
      </div>

      {/* Basic Information */}
      <div>
        <FormInput
          label="Business Name"
          value={data.businessName || ''}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          error={errors.businessName}
          placeholder="e.g., Somtum Paradise"
          required
        />

        <FormInput
          label="Your Name (Contact Person)"
          value={data.contactName || ''}
          onChange={(e) => handleInputChange('contactName', e.target.value)}
          error={errors.contactName}
          placeholder="e.g., Khun Somchai"
          required
        />

        <FormInput
          label="Your Email"
          type="email"
          value={data.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="e.g., contact@business.com"
          required
        />

        <FormInput
          label="Your Phone Number (WhatsApp preferred)"
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="e.g., +66 81 234 5678"
          required
        />

        <FormSelect
          label="Business Category"
          options={getCategoryOptions()}
          value={data.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
          error={errors.category}
          required
        />
      </div>

      {/* Restaurant-specific fields */}
      {data.businessType === 'restaurant' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-medium text-orange-900 mb-3">Restaurant Details</h3>
          
          <FormSelect
            label="Restaurant Type"
            options={restaurantTypes}
            value={data.restaurantType || ''}
            onChange={(e) => handleInputChange('restaurantType', e.target.value as RestaurantType)}
            error={errors.restaurantType}
          />

          <FormSelect
            label="Price Range"
            options={priceRanges}
            value={data.priceRange || ''}
            onChange={(e) => handleInputChange('priceRange', e.target.value as PriceRange)}
            error={errors.priceRange}
            helperText="This helps customers find restaurants in their budget"
          />

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="offers-deals"
              checked={data.offersTodaysDeals || false}
              onChange={(e) => handleInputChange('offersTodaysDeals', e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="offers-deals" className="text-sm text-gray-700">
              We want to offer "Today's Deals" to customers
            </label>
          </div>
        </div>
      )}

      {/* Event organizer specific fields */}
      {data.businessType === 'event-organizer' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">Event Details</h3>
          
          <FormInput
            label="Venue Name (if fixed location)"
            value={data.venueName || ''}
            onChange={(e) => handleInputChange('venueName', e.target.value)}
            error={errors.venueName}
            placeholder="e.g., The Jazz Lounge"
            helperText="Leave empty if you organize events at various locations"
          />

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">How do you want to list events?</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="listingType"
                  value="individual-events"
                  checked={data.listingType === 'individual-events'}
                  onChange={(e) => handleInputChange('listingType', e.target.value as 'individual-events' | 'venue-listing')}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm text-gray-700">Submit individual events</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="listingType"
                  value="venue-listing"
                  checked={data.listingType === 'venue-listing'}
                  onChange={(e) => handleInputChange('listingType', e.target.value as 'individual-events' | 'venue-listing')}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm text-gray-700">List venue for general inquiries</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoStep; 