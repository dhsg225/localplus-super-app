var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
export var Button = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.isLoading, isLoading = _d === void 0 ? false : _d, _e = _a.rounded, rounded = _e === void 0 ? 'normal' : _e, _f = _a.theme, theme = _f === void 0 ? 'blue' : _f, _g = _a.className, className = _g === void 0 ? '' : _g, disabled = _a.disabled, props = __rest(_a, ["children", "variant", "size", "isLoading", "rounded", "theme", "className", "disabled"]);
    var baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    var roundedClasses = {
        normal: 'rounded-md',
        full: 'rounded-full'
    };
    var variantClasses = {
        primary: {
            blue: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            red: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
            gray: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
        },
        secondary: {
            blue: 'bg-blue-100 text-blue-900 hover:bg-blue-200 focus:ring-blue-500',
            red: 'bg-red-100 text-red-900 hover:bg-red-200 focus:ring-red-500',
            gray: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500'
        },
        outline: {
            blue: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
            red: 'border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500',
            gray: 'border-2 border-gray-500 text-gray-500 hover:bg-gray-50 focus:ring-gray-500'
        },
        danger: {
            blue: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
            red: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
            gray: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
        }
    };
    var sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    var allClasses = "".concat(baseClasses, " ").concat(roundedClasses[rounded], " ").concat(variantClasses[variant][theme], " ").concat(sizeClasses[size], " ").concat(className).trim();
    return (<button className={allClasses} disabled={disabled || isLoading} {...props}>
      {isLoading ? (<>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>) : (children)}
    </button>);
};
