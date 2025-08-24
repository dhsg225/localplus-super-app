import React from 'react';
interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantId: string;
    restaurantName: string;
}
declare const MenuModal: React.FC<MenuModalProps>;
export default MenuModal;
