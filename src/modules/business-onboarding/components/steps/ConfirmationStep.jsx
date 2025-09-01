import React from 'react';
import { CheckCircle, Download, Users, TrendingUp } from 'lucide-react';
import Button from '@/ui-components/common/Button';
var ConfirmationStep = function (_a) {
    var data = _a.data;
    var handleGoHome = function () {
        window.location.href = '/';
    };
    var handleDownloadApp = function () {
        // TODO: Link to app stores or PWA install
        console.log('Download app clicked');
    };
    return (<div className="max-w-md mx-auto text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-600"/>
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You for Partnering with LocalPlus! 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          Your listing for <span className="font-semibold text-gray-900">{data.businessName}</span> has been submitted successfully.
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              1
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Review Process</p>
              <p className="text-xs text-blue-700">Our team will review your listing within 1-3 business days</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              2
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Go Live</p>
              <p className="text-xs text-blue-700">You'll receive an email when your listing is published</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              3
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Start Growing</p>
              <p className="text-xs text-blue-700">Begin attracting new customers immediately!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Reminder */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-900 mb-3">Your LocalPlus Benefits</h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-red-600"/>
            <span className="text-sm text-red-800">Reach thousands of locals</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-red-600"/>
            <span className="text-sm text-red-800">Boost visibility</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-red-600"/>
            <span className="text-sm text-red-800">Free listing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Download size={16} className="text-red-600"/>
            <span className="text-sm text-red-800">Mobile-first reach</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
        <p className="text-sm text-gray-700 mb-2">
          Contact our partner support team:
        </p>
        <div className="text-sm space-y-1">
          <p className="text-gray-600">📧 partners@localplus.city</p>
          <p className="text-gray-600">📱 +66 2 xxx xxxx</p>
          <p className="text-gray-600">💬 LINE: @localplus</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button variant="primary" onClick={handleDownloadApp} className="w-full">
          <Download size={20} className="mr-2"/>
          Download LocalPlus App
        </Button>
        
        <Button variant="outline" onClick={handleGoHome} className="w-full">
          Go to LocalPlus Homepage
        </Button>
      </div>

      {/* Social Follow */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Follow us for updates and tips:
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
        </div>
      </div>
    </div>);
};
export default ConfirmationStep;
