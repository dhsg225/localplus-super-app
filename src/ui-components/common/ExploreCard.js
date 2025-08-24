import React from 'react';
var ExploreCard = function (_a) {
    var title = _a.title, icon = _a.icon, onClick = _a.onClick, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (<button onClick={onClick} className={"\n        flex flex-col items-center p-4 bg-white rounded-xl shadow-sm \n        hover:shadow-md transition-shadow duration-200 text-center\n        ".concat(className, "\n      ")}>
      <div className="w-12 h-12 mb-2 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900">
        {title}
      </span>
    </button>);
};
export default ExploreCard;
