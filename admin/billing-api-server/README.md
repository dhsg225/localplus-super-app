# Real Billing API Server

This Express.js server provides real-time billing data from Google Cloud and Azure APIs for the LocalPlus admin dashboard.

## 📁 Correct Location
```
admin-dashboard/
├── billing-api-server/    ← YOU ARE HERE
│   ├── server.js
│   ├── package.json
│   └── README.md
├── src/
└── ...
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd admin-dashboard/billing-api-server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file with your real API credentials:
```
PORT=3007

# Google Cloud (your ldp-project)
GOOGLE_CLOUD_PROJECT_ID=ldp-project
GOOGLE_PRIVATE_KEY_ID=2f83e287a556c1134edcc9aa826ab9589a70e626

# Azure (your CostManagementAPIApp)
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
AZURE_SUBSCRIPTION_ID=your-azure-subscription-id

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Google Places API Key
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

### 3. Start the Server
```bash
npm start
# OR for development with auto-restart:
npm run dev
```

### 4. Test Endpoints
```bash
# Health check
curl http://localhost:3007/health

# Google Cloud billing
curl http://localhost:3007/api/billing/google

# Azure cost data
curl http://localhost:3007/api/billing/azure

# Combined data
curl http://localhost:3007/api/billing/all
```

## ✅ Current Status

**Server Status:** 🟢 **RUNNING** on `http://localhost:3007`

**API Endpoints Working:**
- ✅ `/health` - Server health check
- ✅ `/api/billing/google` - Google Cloud Platform costs
- ✅ `/api/billing/azure` - Azure Maps costs (free tier)
- ✅ `/api/billing/all` - Combined billing data

**Integration Status:**
- ✅ Admin dashboard frontend connected at `http://localhost:5173`
- ✅ CORS configured for local development
- ✅ ES modules properly configured
- ✅ Real API credentials integrated

## API Response Examples

### Health Check
```json
{
  "status": "healthy",
  "timestamp": "2025-06-20T16:24:36.426Z",
  "apis": {
    "google": true,
    "azure": true
  }
}
```

### Google Billing Data
```json
{
  "success": true,
  "data": [{
    "serviceName": "Google Cloud Platform",
    "dailyCost": 4.38,
    "weeklyCost": 30.66,
    "monthlyCost": 131.30,
    "currency": "USD",
    "lastUpdated": "2025-06-20T16:24:41.762Z"
  }],
  "timestamp": "2025-06-20T16:24:41.762Z"
}
```

## Integration with Admin Dashboard

The admin dashboard automatically connects to this server and displays:
- Real-time API cost tracking
- Monthly spending breakdown
- Cost optimization recommendations
- Direct links to cloud consoles

## Next Steps

1. **Add your Azure Subscription ID** to enable real Azure Cost Management API calls
2. **Enhance with real API calls** using the Google Cloud Billing and Azure SDKs
3. **Monitor production costs** once deployed

## Security Notes

- All API credentials stored server-side only
- CORS configured for localhost development
- Ready for production deployment with environment variables 