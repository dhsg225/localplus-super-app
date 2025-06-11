import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Calendar, Wrench, MessageCircle, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to LocalPlus
        </h1>
        <p className="text-gray-600 mb-4">
          Your lifestyle companion for Thailand
        </p>
        <div className="flex items-center justify-center text-red-600 mb-8">
          <MapPin size={20} className="mr-2" />
          <span className="font-medium">Bangkok</span>
        </div>
      </div>

      {/* Business Partnership Banner */}
      <div className="px-4 mb-6">
        <Link
          to="/business-onboarding"
          className="block bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">For Businesses</h3>
              <p className="text-red-100 text-sm">List your business and reach thousands of customers</p>
            </div>
            <div className="text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Off Peak Dining Banner */}
      <div className="px-4 mb-6">
        <Link
          to="/off-peak"
          className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center">
                <Clock size={20} className="mr-2" />
                Off Peak Dining
              </h3>
              <p className="text-purple-100 text-sm">Save up to 50% during off-peak hours</p>
            </div>
            <div className="text-white bg-yellow-500 px-2 py-1 rounded-full text-xs font-bold">
              UP TO 50% OFF
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/restaurants"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Search size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Restaurants</h3>
            <p className="text-sm text-gray-500">Find great places to eat</p>
          </Link>

          <Link
            to="/events"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Calendar size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Events</h3>
            <p className="text-sm text-gray-500">Discover local events</p>
          </Link>

          <Link
            to="/services"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Wrench size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Services</h3>
            <p className="text-sm text-gray-500">Local service providers</p>
          </Link>

          <Link
            to="/ai-assistant"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <MessageCircle size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
            <p className="text-sm text-gray-500">Ask about anything local</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 