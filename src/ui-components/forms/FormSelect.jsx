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
import { clsx } from 'clsx';
var FormSelect = function (_a) {
    var label = _a.label, options = _a.options, error = _a.error, helperText = _a.helperText, required = _a.required, _b = _a.placeholder, placeholder = _b === void 0 ? 'Please select...' : _b, className = _a.className, id = _a.id, props = __rest(_a, ["label", "options", "error", "helperText", "required", "placeholder", "className", "id"]);
    var selectId = id || "select-".concat(label.toLowerCase().replace(/\s+/g, '-'));
    return (<div className="mb-4">
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select id={selectId} className={clsx('w-full px-3 py-2 border rounded-lg shadow-sm transition-colors', 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500', 'bg-white', error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400', className)} {...props}>
        <option value="">{placeholder}</option>
        {options.map(function (option) { return (<option key={option.value} value={option.value}>
            {option.label}
          </option>); })}
      </select>
      
      {error && (<p className="mt-1 text-sm text-red-600">{error}</p>)}
      
      {helperText && !error && (<p className="mt-1 text-sm text-gray-500">{helperText}</p>)}
    </div>);
};
export default FormSelect;
