# LocalPlus Partner Dashboard

This is the desktop-first web application for restaurant partners to manage their bookings, menus, and business settings.

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
cd partner
npm install
```

### Environment Variables
Create a `.env` file in the partner directory:
```
VITE_SUPABASE_URL=https://joknprahhqdhvdhzmuwl.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3005`

## Architecture

### Shared Components
This app uses shared components and services from the `../shared` directory:
- **Shared Types**: Common TypeScript interfaces for Restaurant, Booking, etc.
- **Shared Services**: Restaurant service, Booking service, Supabase client
- **Shared Components**: Reusable UI components (Button, etc.)

### Path Aliases
- `@/*` - Points to `./src/*`
- `@shared/*` - Points to `../shared/*`

## Features (Planned)

### Phase 1: Basic Dashboard
- [ ] Restaurant overview dashboard
- [ ] Today's bookings view
- [ ] Basic restaurant profile editing

### Phase 2: Booking Management
- [ ] Full booking calendar view
- [ ] Booking status management (confirm, seat, complete)
- [ ] Availability settings
- [ ] Customer communication

### Phase 3: Menu Management
- [ ] Menu item CRUD operations
- [ ] Category management
- [ ] Pricing updates
- [ ] Availability toggles

### Phase 4: Analytics & Reports
- [ ] Booking analytics
- [ ] Revenue reporting
- [ ] Customer insights
- [ ] Peak time analysis

## Production Deployment

The partner app will be deployed to:
- **Staging**: `partners-staging.localplus-super-app.vercel.app`
- **Production**: `partners.localplus-super-app.vercel.app`

## Related Apps

- **Consumer App**: `http://localhost:3002` (mobile-first PWA)
- **Admin Dashboard**: `http://localhost:3000` (internal LDP team)
- **Partner Dashboard**: `http://localhost:3005` (this app - desktop-first) 