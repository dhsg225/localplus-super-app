// Main App component - LocalPlus Super App
import React from "react";
import { Routes, Route } from "react-router-dom";
// Authentication
import { AuthProvider } from "./modules/auth/context/AuthContext";
// Core components
import Navigation from "./core/navigation/Navigation";
// Module components (Phase 1)
import RestaurantsPage from "./modules/restaurants/components/RestaurantsPage";
import EventsPage from "./modules/events/components/EventsPage";
import ServicesPage from "./modules/services/components/ServicesPage";
import AIAssistantPage from "./modules/ai-assistant/components/AIAssistantPage";
import BusinessOnboardingPage from "./modules/business-onboarding/components/BusinessOnboardingPage";
import OffPeakPage from "./modules/off-peak/components/OffPeakPage";
import BusinessManagementDashboard from "./modules/business-management/components/BusinessManagementDashboard";
import BusinessProfileEditor from "./modules/business-management/components/BusinessProfileEditor";
import MenuManagement from "./modules/business-management/components/MenuManagement";
import DealsManagement from "./modules/business-management/components/DealsManagement";
import CuisineExplorer from "./modules/restaurants/components/CuisineExplorer";
import TodaysDeals from "./modules/restaurants/components/TodaysDeals";
import PassportPage from "./modules/passport/components/PassportPage";
import SubscriptionUpgrade from "./modules/passport/components/SubscriptionUpgrade";
import DiscountPassportInfo from "./modules/passport/components/DiscountPassportInfo";
// Admin components
import AdminDashboard from "./modules/admin/components/AdminDashboard";
import NewsAdminSettings from "./modules/admin/components/NewsAdminSettings";
// [2024-05-10 17:30 UTC] - Advertising Management
import AdManagementDashboard from "./modules/advertising/components/AdManagementDashboard";
import AdShowcase from "./modules/advertising/components/AdShowcase";
// Auth components
import LoginPage from "./modules/auth/components/LoginPage";
import RegisterPage from "./modules/auth/components/RegisterPage";
// User Profile components
import ProfilePage from "./modules/user-profile/components/ProfilePage";
import ProfileEditPage from "./modules/user-profile/components/ProfileEditPage";
// News components
import NewsPage from "./modules/news/components/NewsPage";
// User Settings components  
import UserSettingsPage from "./modules/user-settings/components/UserSettingsPage";
// UI Components
import HomePage from "./ui-components/common/HomePage";
import LoyaltyProgramManagement from "./modules/business-management/components/LoyaltyProgramManagement";
import LoyaltyCardsList from "./modules/loyalty-cards/components/LoyaltyCardsList";
import LoyaltyCardDetail from "./modules/loyalty-cards/components/LoyaltyCardDetail";
function App() {
    return (<AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container-mobile">
          {/* Main Content */}
          <main className="pb-20">
            <Routes>
              <Route path="/" element={<HomePage />}/>
              <Route path="/restaurants" element={<RestaurantsPage />}/>
              <Route path="/events" element={<EventsPage />}/>
              <Route path="/services" element={<ServicesPage />}/>
              <Route path="/ai-assistant" element={<AIAssistantPage />}/>
              <Route path="/business-onboarding" element={<BusinessOnboardingPage />}/>
              <Route path="/off-peak" element={<OffPeakPage />}/>
              <Route path="/business" element={<BusinessManagementDashboard />}/>
              <Route path="/business/profile" element={<BusinessProfileEditor />}/>
              <Route path="/business/menu" element={<MenuManagement />}/>
              <Route path="/business/deals" element={<DealsManagement />}/>
              <Route path="/business/loyalty" element={<LoyaltyProgramManagement />}/>
              <Route path="/explore-cuisines" element={<CuisineExplorer />}/>
              <Route path="/todays-deals" element={<TodaysDeals />}/>
              <Route path="/passport" element={<PassportPage />}/>
              <Route path="/passport/upgrade" element={<SubscriptionUpgrade />}/>
              <Route path="/passport/info" element={<DiscountPassportInfo />}/>
              
              {/* News Routes */}
              <Route path="/news" element={<NewsPage />}/>
              
              {/* User Settings Routes */}
              <Route path="/usersettings" element={<UserSettingsPage />}/>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />}/>
              <Route path="/admin/news-settings" element={<NewsAdminSettings />}/>
              
              {/* [2024-05-10 17:30 UTC] - Advertising Management Route */}
              <Route path="/admin/advertising" element={<AdManagementDashboard />}/>
              
              {/* [2024-05-10 17:30 UTC] - Advertising Showcase Route */}
              <Route path="/ad-showcase" element={<AdShowcase />}/>
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<LoginPage />}/>
              <Route path="/auth/register" element={<RegisterPage />}/>
              
              {/* Profile Routes */}
              <Route path="/profile" element={<ProfilePage />}/>
              <Route path="/profile/edit" element={<ProfileEditPage />}/>

              <Route path="/loyalty-cards" element={<LoyaltyCardsList />}/>
              <Route path="/loyalty-cards/:id" element={<LoyaltyCardDetail />}/>
            </Routes>
          </main>
          
          {/* Bottom Navigation */}
          <Navigation />
        </div>
      </div>
    </AuthProvider>);
}
export default App;
