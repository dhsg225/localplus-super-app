// Main application entry point
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import "./styles/globals.css";
console.log("🚀 Main.tsx loaded");
// Configure React Query
var queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
});
console.log("📱 About to render React app");
var rootElement = document.getElementById("root");
console.log("🎯 Root element:", rootElement);
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>);
    console.log("✅ React app rendered successfully");
}
else {
    console.error("❌ Root element not found!");
}
