import React, { createContext, useContext, useState } from 'react';
var ToastContext = createContext(undefined);
export var useToast = function () {
    var ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
export var ToastProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), toast = _b[0], setToast = _b[1];
    var showToast = function (msg, type) {
        if (type === void 0) { type = 'success'; }
        setToast({ msg: msg, type: type });
        setTimeout(function () { return setToast(null); }, 2500);
    };
    return (<ToastContext.Provider value={{ showToast: showToast }}>
      {children}
      {toast && (<div className={"fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white text-sm font-semibold transition-all ".concat(toast.type === 'success' ? 'bg-green-600' : 'bg-red-600')}>
          {toast.msg}
        </div>)}
    </ToastContext.Provider>);
};
