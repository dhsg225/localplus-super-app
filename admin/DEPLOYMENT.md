# LocalPlus Admin Dashboard - Vercel Deployment

## Overview
This admin dashboard manages business approvals, photo enrichment, and analytics for the LocalPlus platform.

## Deployment Steps

### 1. Create New Vercel Project
```bash
# From Vercel dashboard:
# 1. Click "New Project"
# 2. Import from GitHub
# 3. Select this repository
# 4. Set root directory to "admin"
# 5. Framework preset: Vite
```

### 2. Environment Variables
Set these in Vercel dashboard > Settings > Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### 3. Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Security Considerations
After deployment:
- [ ] Set up password protection in Vercel dashboard
- [ ] Configure custom domain (e.g., admin.yoursite.com)
- [ ] Add IP restrictions if needed
- [ ] Set up monitoring/alerts

## Current Dependencies
⚠️ **Important**: This admin dashboard currently depends on:
1. Local proxy server at `localhost:3004` for Google Places API
2. Supabase database access
3. Photo storage in Supabase Storage

## Next Steps After Initial Deployment
1. Replace `localhost:3004` references with production API endpoints
2. Set up proper authentication system
3. Configure domain and SSL
4. Test all features in production environment

## Project Structure
```
admin/
├── src/
│   ├── components/     # Dashboard components
│   ├── lib/           # Services (auth, database, websocket)
│   └── App.tsx        # Main application
├── dist/              # Build output
├── vercel.json        # Vercel configuration
└── package.json       # Dependencies
```

## Features
- Business approval workflow
- Photo gallery management
- Real-time analytics
- Database management
- Google Places integration 