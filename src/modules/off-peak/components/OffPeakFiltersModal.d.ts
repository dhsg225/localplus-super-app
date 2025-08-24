import React from 'react';
import { OffPeakFilters } from '../types';
interface OffPeakFiltersModalProps {
    onClose: () => void;
    onApplyFilters: (filters: OffPeakFilters) => void;
}
declare const OffPeakFiltersModal: React.FC<OffPeakFiltersModalProps>;
export default OffPeakFiltersModal;
