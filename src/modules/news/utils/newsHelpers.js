export var formatDate = function (dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
export var stripHtml = function (html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};
export var truncateText = function (text, maxLength) {
    if (maxLength === void 0) { maxLength = 150; }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
export var buildApiUrl = function (baseUrl, params) {
    var url = new URL(baseUrl);
    Object.entries(params).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        url.searchParams.append(key, value.toString());
    });
    return url.toString();
};
export var getCityFromLocation = function (locationData) {
    var cityMapping = {
        'Bangkok': 'bangkok',
        'Hua Hin': 'hua-hin',
        'Pattaya': 'pattaya',
        'Phuket': 'phuket',
        'Chiang Mai': 'chiang-mai'
    };
    return cityMapping[locationData === null || locationData === void 0 ? void 0 : locationData.city] || 'hua-hin';
};
