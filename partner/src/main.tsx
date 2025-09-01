import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';

// [2024-07-29] - Added health check integration to catch issues early
import { developmentHealthCheck, logHealthCheckResult } from '../../shared/services/healthCheck';

console.log('🚀 Partner App Main.tsx loaded');

// Perform health check before rendering the app
const initializeApp = async () => {
  try {
    console.log('🏥 Performing application health check...');
    const healthResult = await developmentHealthCheck();
    logHealthCheckResult(healthResult);
    
    if (!healthResult.isHealthy) {
      console.warn('⚠️  Application has health issues but will continue loading...');
    }
  } catch (error) {
    console.error('❌ Health check failed:', error);
    console.warn('⚠️  Continuing with app load despite health check failure...');
  }
  
  // Render the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  
  console.log('🎯 Partner App rendered successfully');
};

// Initialize the app with health check
initializeApp();
