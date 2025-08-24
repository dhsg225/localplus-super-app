// Loading Spinner Component
import React from "react";
import { motion } from "framer-motion";
var LoadingSpinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? "md" : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    var sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };
    return (<motion.div className={"".concat(sizeClasses[size], " border-2 border-primary-200 border-t-primary-600 rounded-full ").concat(className)} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}/>);
};
export default LoadingSpinner;
