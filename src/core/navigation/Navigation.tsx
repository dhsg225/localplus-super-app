// Bottom Navigation Component
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
  MessageCircle, 
  Award, 
  User 
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "../../modules/auth/context/AuthContext";

const getNavigationItems = (isAuthenticated: boolean) => [
  { path: "/", icon: Home, label: "Home" },
  { path: "/restaurants", icon: Search, label: "Explore" },
  { path: "/ai-assistant", icon: MessageCircle, label: "AI Assistant" },
  { path: "/passport", icon: Award, label: "Passport" },
  { path: isAuthenticated ? "/profile" : "/auth/login", icon: User, label: "Profile" },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();



  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="container-mobile">
        <div className="flex justify-around items-center py-2">
          {getNavigationItems(isAuthenticated).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative",
                  isActive 
                    ? "text-primary-600" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-50 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={24} className="relative z-10" />
                <span className="text-xs mt-1 relative z-10 font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;