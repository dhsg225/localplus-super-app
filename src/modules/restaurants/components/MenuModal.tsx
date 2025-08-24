import React from 'react';
import { X } from 'lucide-react';
import MenuPage from './MenuPage';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  restaurantName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full bg-white overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        >
          <X size={20} className="text-gray-700" />
        </button>
        
        {/* Menu Page */}
        <MenuPage 
          restaurantName={restaurantName}
          categories={[]} // This would be fetched based on restaurantId
          onBack={onClose}
        />
      </div>
    </div>
  );
};

export default MenuModal; 