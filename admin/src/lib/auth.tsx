var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Admin users with enhanced permissions
var mockAdminUsers = [
    {
        id: 'admin-001',
        email: 'admin@localplus.co.th',
        firstName: 'LocalPlus',
        lastName: 'Administrator',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        permissions: [
            'view_dashboard',
            'manage_businesses',
            'approve_listings',
            'bulk_operations',
            'export_data',
            'manage_users',
            'system_settings',
            'analytics_full'
        ],
        lastLogin: new Date(),
        isActive: true
    },
    {
        id: 'admin-002',
        email: 'curator@localplus.co.th',
        firstName: 'Business',
        lastName: 'Curator',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150',
        permissions: [
            'view_dashboard',
            'manage_businesses',
            'approve_listings',
            'export_data',
            'analytics_basic'
        ],
        lastLogin: new Date(),
        isActive: true
    }
];
var AdminAuthService = /** @class */ (function () {
    function AdminAuthService() {
        this.tokenKey = 'localplus_admin_token';
        this.userKey = 'localplus_admin_user';
    }
    AdminAuthService.prototype.login = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var adminUser, validPasswords, authResponse;
            return __generator(this, function (_a) {
                adminUser = mockAdminUsers.find(function (u) { return u.email === credentials.email; });
                if (!adminUser) {
                    throw new Error('Invalid admin credentials');
                }
                validPasswords = {
                    'admin@localplus.co.th': 'admin123',
                    'curator@localplus.co.th': 'curator123'
                };
                if (credentials.password !== validPasswords[credentials.email]) {
                    throw new Error('Invalid admin password');
                }
                if (!adminUser.isActive) {
                    throw new Error('Admin account is deactivated');
                }
                authResponse = {
                    user: __assign(__assign({}, adminUser), { lastLogin: new Date() }),
                    token: this.generateToken(),
                    expiresIn: 28800 // 8 hours for admin sessions
                };
                // Store admin session
                if (credentials.rememberMe) {
                    localStorage.setItem(this.tokenKey, authResponse.token);
                    localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
                }
                else {
                    sessionStorage.setItem(this.tokenKey, authResponse.token);
                    sessionStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
                }
                return [2 /*return*/, authResponse];
            });
        });
    };
    AdminAuthService.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.userKey);
                sessionStorage.removeItem(this.tokenKey);
                sessionStorage.removeItem(this.userKey);
                return [2 /*return*/];
            });
        });
    };
    AdminAuthService.prototype.getCurrentUser = function () {
        var userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
        if (!userStr)
            return null;
        try {
            var user = JSON.parse(userStr);
            return __assign(__assign({}, user), { lastLogin: new Date(user.lastLogin) });
        }
        catch (_a) {
            return null;
        }
    };
    AdminAuthService.prototype.getToken = function () {
        return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
    };
    AdminAuthService.prototype.isAuthenticated = function () {
        return this.getToken() !== null && this.getCurrentUser() !== null;
    };
    AdminAuthService.prototype.hasPermission = function (permission) {
        var user = this.getCurrentUser();
        return (user === null || user === void 0 ? void 0 : user.permissions.includes(permission)) || false;
    };
    AdminAuthService.prototype.generateToken = function () {
        return "admin_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
    };
    return AdminAuthService;
}());
export var adminAuth = new AdminAuthService();
