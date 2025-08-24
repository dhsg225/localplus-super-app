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
export var FormInput = function (_a) {
    var label = _a.label, error = _a.error, helpText = _a.helpText, required = _a.required, leftIcon = _a.leftIcon, rightIcon = _a.rightIcon, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "error", "helpText", "required", "leftIcon", "rightIcon", "className"]);
    var inputId = props.id || "input-".concat(Math.random().toString(36).substring(2, 9));
    var inputClasses = "\n    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm \n    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 \n    focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500\n    ".concat(error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '', "\n    ").concat(leftIcon ? 'pl-10' : '', "\n    ").concat(rightIcon ? 'pr-10' : '', "\n    ").concat(className, "\n  ").trim();
    return (<div className="space-y-1">
      {label && (<label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>)}
      
      <div className="relative">
        {leftIcon && (<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>)}
        
        <input id={inputId} className={inputClasses} {...props}/>
        
        {rightIcon && (<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>)}
      </div>
      
      {error && (<p className="text-sm text-red-600">
          {error}
        </p>)}
      
      {helpText && !error && (<p className="text-sm text-gray-500">
          {helpText}
        </p>)}
    </div>);
};
