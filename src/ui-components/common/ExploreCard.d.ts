import React from 'react';
interface ExploreCardProps {
    title: string;
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
}
declare const ExploreCard: React.FC<ExploreCardProps>;
export default ExploreCard;
