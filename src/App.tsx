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
          </Routes>
        </main>
        
        {/* Bottom Navigation */}
        <Navigation />
      </div>
    </div>
  );
}

export default App;