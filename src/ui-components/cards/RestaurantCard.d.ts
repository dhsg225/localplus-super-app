import React from 'react';
import { Restaurant } from '@/modules/restaurants/types';
interface RestaurantCardProps {
    restaurant: Restaurant;
    onBookClick?: (restaurantId: string) => void;
    onMenuClick?: (restaurantId: string) => void;
    onOffPeakClick?: (restaurantId: string) => void;
}
declare const RestaurantCard: React.FC<RestaurantCardProps>;
export default RestaurantCard;
