import React from 'react';
import { MenuItem } from '../types';
interface MenuPageProps {
    restaurantName: string;
    categories: MenuCategory[];
    onBack?: () => void;
}
interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}
declare const MenuPage: React.FC<MenuPageProps>;
export default MenuPage;
