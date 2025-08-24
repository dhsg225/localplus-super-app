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
export var FormSelect = function (_a) {
    var label = _a.label, error = _a.error, helpText = _a.helpText, required = _a.required, options = _a.options, placeholder = _a.placeholder, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "error", "helpText", "required", "options", "placeholder", "className"]);
    var selectId = props.id || "select-".concat(Math.random().toString(36).substring(2, 9));
    var selectClasses = "\n    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm \n    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \n    disabled:bg-gray-50 disabled:text-gray-500\n    ".concat(error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '', "\n    ").concat(className, "\n  ").trim();
    return (<div className="space-y-1">
      {label && (<label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>)}
      
      <select id={selectId} className={selectClasses} {...props}>
        {placeholder && (<option value="" disabled>
            {placeholder}
          </option>)}
        {options.map(function (option) { return (<option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>); })}
      </select>
      
      {error && (<p className="text-sm text-red-600">
          {error}
        </p>)}
      
      {helpText && !error && (<p className="text-sm text-gray-500">
          {helpText}
        </p>)}
    </div>);
};
