import React from 'react';
import { OffPeakDeal } from '../types';
interface OffPeakDealCardProps {
    deal: OffPeakDeal;
    selectedDate: string;
    selectedPax: number;
    onBookNow?: (deal: OffPeakDeal) => void;
}
declare const OffPeakDealCard: React.FC<OffPeakDealCardProps>;
export default OffPeakDealCard;
