// [2025-01-07 12:00] - Shared utility functions
// Format currency for display
export function formatCurrency(amount, currency) {
    if (currency === void 0) { currency = 'THB'; }
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
// Format date for display
export function formatDate(date, format) {
    if (format === void 0) { format = 'short'; }
    var dateObj = typeof date === 'string' ? new Date(date) : date;
    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        case 'long':
            return dateObj.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        case 'time':
            return dateObj.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
            });
        default:
            return dateObj.toLocaleDateString('th-TH');
    }
}
// Debounce function for search inputs
export function debounce(func, delay) {
    var timeoutId;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () { return func.apply(void 0, args); }, delay);
    };
}
// Generate random ID
export function generateId(prefix) {
    if (prefix === void 0) { prefix = ''; }
    var timestamp = Date.now().toString(36);
    var randomStr = Math.random().toString(36).substring(2, 8);
    return "".concat(prefix).concat(timestamp).concat(randomStr);
}
// Validate email format
export function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Validate phone number (Thai format)
export function isValidPhoneNumber(phone) {
    var phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
}
// Format phone number for display
export function formatPhoneNumber(phone) {
    var cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('66')) {
        return "+66 ".concat(cleaned.substring(2, 4), " ").concat(cleaned.substring(4, 7), " ").concat(cleaned.substring(7));
    }
    else if (cleaned.startsWith('0')) {
        return "".concat(cleaned.substring(0, 3), " ").concat(cleaned.substring(3, 6), " ").concat(cleaned.substring(6));
    }
    return phone;
}
// Calculate time ago
export function timeAgo(date) {
    var now = new Date();
    var past = typeof date === 'string' ? new Date(date) : date;
    var diffInMs = now.getTime() - past.getTime();
    var diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    var diffInHours = Math.floor(diffInMinutes / 60);
    var diffInDays = Math.floor(diffInHours / 24);
    if (diffInMinutes < 1)
        return 'just now';
    if (diffInMinutes < 60)
        return "".concat(diffInMinutes, "m ago");
    if (diffInHours < 24)
        return "".concat(diffInHours, "h ago");
    if (diffInDays < 7)
        return "".concat(diffInDays, "d ago");
    return formatDate(past, 'short');
}
// Truncate text with ellipsis
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
}
// Local storage helpers with error handling
export var localStorage = {
    get: function (key, defaultValue) {
        try {
            var item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    set: function (key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },
    remove: function (key) {
        try {
            window.localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};
// Session storage helpers
export var sessionStorage = {
    get: function (key, defaultValue) {
        try {
            var item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return defaultValue;
        }
    },
    set: function (key, value) {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Error writing to sessionStorage:', error);
        }
    },
    remove: function (key) {
        try {
            window.sessionStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing from sessionStorage:', error);
        }
    }
};
// API response helpers
export function isApiError(response) {
    return response && typeof response === 'object' && 'error' in response;
}
export function getErrorMessage(error) {
    var _a;
    if (typeof error === 'string')
        return error;
    if (error === null || error === void 0 ? void 0 : error.message)
        return error.message;
    if ((_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.message)
        return error.error.message;
    return 'An unexpected error occurred';
}
