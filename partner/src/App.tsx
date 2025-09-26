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
import { useState, useEffect } from 'react';
// ToastProvider removed for deployment compatibility
import Navigation from './components/Navigation';
import { LoginForm } from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import BookingDashboard from './pages/BookingDashboard';
import AvailabilitySettings from './pages/AvailabilitySettings';
import Analytics from './pages/Analytics';
import StaffManagement from './pages/StaffManagement';
import NotificationSettings from './pages/NotificationSettings';
import AdminPartnerLinker from './pages/AdminPartnerLinker';
import { supabase } from './services/supabase';
import { bookingService } from './services/bookingService';
import './styles/App.css';
function App() {
    var _this = this;
    var _a, _b, _c, _d;
    var _e = useState(null), user = _e[0], setUser = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    var _g = useState('dashboard'), currentPage = _g[0], setCurrentPage = _g[1];
    var _h = useState(false), noPartnerAccess = _h[0], setNoPartnerAccess = _h[1]; // [2024-07-08] - Track if user is unlinked
    useEffect(function () {
        // Check current auth state
        var checkAuth = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentUser, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, authService.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        setUser(currentUser);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error checking auth state:', error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        checkAuth();
        // Listen for auth changes
        var subscription = supabase.auth.onAuthStateChange(function (event, session) { return __awaiter(_this, void 0, void 0, function () {
            var currentUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(event === 'SIGNED_IN' && (session === null || session === void 0 ? void 0 : session.user))) return [3 /*break*/, 2];
                        return [4 /*yield*/, authService.getUserProfile(session.user)];
                    case 1:
                        currentUser = _a.sent();
                        setUser(currentUser);
                        return [3 /*break*/, 3];
                    case 2:
                        if (event === 'SIGNED_OUT') {
                            setUser(null);
                        }
                        _a.label = 3;
                    case 3:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }).data.subscription;
        return function () { return subscription.unsubscribe(); };
    }, []);
    useEffect(function () {
        // [DEV BYPASS] Only allow in development
        if (import.meta.env.DEV) {
            var devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
            if (devUserRaw) {
                try {
                    var devUser = JSON.parse(devUserRaw);
                    setUser({
                        id: devUser.id,
                        email: devUser.email,
                        firstName: devUser.firstName,
                        lastName: devUser.lastName,
                        phone: devUser.phone || '',
                        avatar: '',
                        roles: ['partner'],
                        isEmailVerified: true,
                        isActive: true,
                        createdAt: new Date(),
                        lastLoginAt: new Date(),
                        loginProvider: 'email',
                        partnerProfile: {
                            businessIds: [devUser.businessId],
                            permissions: ['all'],
                            role: 'owner',
                        },
                    });
                    setLoading(false);
                    return;
                }
                catch (e) {
                    // Ignore parse errors
                }
            }
        }
    }, []);
    useEffect(function () {
        if (user) {
            console.log('Current user:', user);
        }
    }, [user]);
    useEffect(function () {
        var _a, _b;
        if (user && (((_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('partner')) || ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin')))) {
            // [2024-07-08] - Check if user is linked to any business
            bookingService.getPartnerRestaurants()
                .then(function () { return setNoPartnerAccess(false); })
                .catch(function (err) {
                if (err.message && err.message.includes('No restaurants found')) {
                    setNoPartnerAccess(true);
                }
                else {
                    setNoPartnerAccess(false);
                }
            });
        }
    }, [user]);
    var handleLoginSuccess = function () { return __awaiter(_this, void 0, void 0, function () {
        var currentUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService.getCurrentUser()];
                case 1:
                    currentUser = _a.sent();
                    setUser(currentUser);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService.signOut()];
                case 1:
                    _a.sent();
                    setUser(null);
                    return [2 /*return*/];
            }
        });
    }); };
    // Show loading while checking auth state
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>);
    }
    // Show login if not authenticated
    if (!user) {
        return <LoginForm onLoginSuccess={handleLoginSuccess}/>;
    }
    // [2024-07-08] - Show friendly message for unlinked users
    if (noPartnerAccess) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded shadow">
          <div className="mx-auto h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">🔗</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Linked to a Business</h2>
          <p className="text-gray-600 mb-4">Your account is not yet linked to any restaurant or business. You will not see any dashboard data until an admin links you.</p>
          <a href="mailto:support@localplus.com?subject=Request%20Business%20Access" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">
            Request Access
          </a>
          <p className="text-xs text-gray-500 mt-4">If you believe this is an error, please contact support or your admin.</p>
        </div>
      </div>);
    }
    // Check if user has partner access
    var hasPartnerAccess = ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('partner')) || ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin'));
    if (!hasPartnerAccess) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">This account does not have partner privileges.</p>
          <p className="text-sm text-gray-500">
            Current roles: {((_c = user.roles) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'none'}
          </p>
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Sign Out
          </button>
        </div>
      </div>);
    }
    var renderPage = function () {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={function (page) { return setCurrentPage(page); }}/>;
            case 'bookings':
                return <BookingDashboard />;
            case 'availability':
                return <AvailabilitySettings />;
            case 'analytics':
                return <Analytics />;
            case 'staff':
                return <StaffManagement />;
            case 'notifications':
                return <NotificationSettings user={user}/>;
            case 'admin-linker':
                return <AdminPartnerLinker />;
            case 'settings':
                return (<div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>);
            default:
                return <Dashboard onNavigate={function (page) { return setCurrentPage(page); }}/>;
        }
    };
    return (<ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage={currentPage} onPageChange={function (page) { return setCurrentPage(page); }} user={user} onLogout={handleLogout} showAdminLink={(_d = user.roles) === null || _d === void 0 ? void 0 : _d.includes('admin')}/>
        <main className="ml-64">
          {renderPage()}
        </main>
      </div>
    </ToastProvider>);
}
export default App;
