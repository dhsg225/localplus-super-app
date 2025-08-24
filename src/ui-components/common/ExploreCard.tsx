import React from 'react';

interface ExploreCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  icon,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center p-4 bg-white rounded-xl shadow-sm 
        hover:shadow-md transition-shadow duration-200 text-center
        ${className}
      `}
    >
      <div className="w-12 h-12 mb-2 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900">
        {title}
      </span>
    </button>
  );
};

export default ExploreCard; 