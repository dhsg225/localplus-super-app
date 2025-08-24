import React from 'react';
interface RotatingHeadlinesProps {
    currentCity: string;
    transitionStyle: 'slide' | 'fade' | 'crossdissolve';
    intervalMs?: number;
    maxHeadlines?: number;
}
declare const RotatingHeadlines: React.FC<RotatingHeadlinesProps>;
export default RotatingHeadlines;
