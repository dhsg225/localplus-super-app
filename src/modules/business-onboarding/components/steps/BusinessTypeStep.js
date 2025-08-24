import React from 'react';
import { Store, Calendar, Wrench, Building } from 'lucide-react';
import FormInput from '@/ui-components/forms/FormInput';
var businessTypes = [
    {
        value: 'restaurant',
        label: 'Restaurant / Cafe',
        icon: <Store size={24} className="text-red-500"/>,
        description: 'Food and beverage establishments'
    },
    {
        value: 'event-organizer',
        label: 'Event Organizer / Venue',
        icon: <Calendar size={24} className="text-red-500"/>,
        description: 'Event organizers and venues'
    },
    {
        value: 'service-provider',
        label: 'Local Service Provider',
        icon: <Wrench size={24} className="text-red-500"/>,
        description: 'Handyman, cleaners, salons, etc.'
    },
    {
        value: 'other',
        label: 'Other',
        icon: <Building size={24} className="text-red-500"/>,
        description: 'Please specify your business type'
    }
];
var BusinessTypeStep = function (_a) {
    var data = _a.data, errors = _a.errors, updateData = _a.updateData;
    var handleBusinessTypeSelect = function (businessType) {
        updateData({ businessType: businessType });
    };
    var handleOtherTypeChange = function (value) {
        updateData({ otherBusinessType: value });
    };
    return (<div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Partner with LocalPlus
        </h2>
        <p className="text-gray-600">
          List your business and reach thousands of local customers!
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What kind of business are you listing?
        </h3>
        
        <div className="space-y-3">
          {businessTypes.map(function (type) { return (<button key={type.value} onClick={function () { return handleBusinessTypeSelect(type.value); }} className={"w-full p-4 rounded-xl border-2 transition-colors text-left ".concat(data.businessType === type.value
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300')}>
              <div className="flex items-start space-x-3">
                <div className="mt-1">{type.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                </div>
                <div className="mt-1">
                  <div className={"w-5 h-5 rounded-full border-2 ".concat(data.businessType === type.value
                ? 'border-red-500 bg-red-500'
                : 'border-gray-300')}>
                    {data.businessType === type.value && (<div className="w-full h-full rounded-full bg-white scale-50"></div>)}
                  </div>
                </div>
              </div>
            </button>); })}
        </div>

        {errors.businessType && (<p className="mt-2 text-sm text-red-600">{errors.businessType}</p>)}
      </div>

      {data.businessType === 'other' && (<div className="mb-6">
          <FormInput label="Please specify your business type" value={data.otherBusinessType || ''} onChange={function (e) { return handleOtherTypeChange(e.target.value); }} error={errors.otherBusinessType} placeholder="e.g., Photography Studio, Fitness Center..." required/>
        </div>)}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Why partner with us?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Grow your visibility in the community</li>
              <li>• Attract new customers daily</li>
              <li>• Simple, free listing process</li>
              <li>• Access to AI-powered customer matching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);
};
export default BusinessTypeStep;
