// Main App component - LocalPlus Super App
import React from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

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

// UI Components
import HomePage from "./ui-components/common/HomePage";
import LoadingSpinner from "./ui-components/common/LoadingSpinner";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-mobile">
        {/* Main Content */}
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/business-onboarding" element={<BusinessOnboardingPage />} />
            <Route path="/off-peak" element={<OffPeakPage />} />
            <Route path="/business" element={<BusinessManagementDashboard />} />
            <Route path="/business/profile" element={<BusinessProfileEditor />} />
            <Route path="/business/menu" element={<MenuManagement />} />
            <Route path="/business/deals" element={<DealsManagement />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation */}
        <Navigation />
      </div>
    </div>
  );
}

export default App;