# LocalPlus Business Web Portal - Design Mockups

## Overview
Professional web interface for restaurant owners to manage their LocalPlus presence, deals, and analytics.

## Portal Architecture

### 1. Authentication & Onboarding
```
┌─────────────────────────────────────────────────────────────┐
│  🍜 LocalPlus Business Portal                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     Welcome Back to LocalPlus                              │
│     Manage your restaurant's digital presence              │
│                                                             │
│     ┌─────────────────────────────────────┐                │
│     │  Email: [your-restaurant@email.com] │                │
│     │  Password: [********************]   │                │
│     │                                     │                │
│     │  [x] Remember me                   │                │
│     │                                     │                │
│     │  [ Sign In to Dashboard ]          │                │
│     └─────────────────────────────────────┘                │
│                                                             │
│     New to LocalPlus? → Start Free Trial                   │
│     Forgot Password? → Reset Link                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 🍜 LocalPlus Business │ The Spice Merchant             [ Profile ▼ ] [ Sign Out ] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Sidebar ──────────┐  ┌─ Main Content Area ────────────────────────────────────┐ │
│ │                    │  │                                                         │ │
│ │ 📊 Dashboard       │  │  📈 Restaurant Performance Overview                    │ │
│ │ 🏪 Profile         │  │  ┌─────────┬─────────┬─────────┬─────────┐            │ │
│ │ 📷 Media Gallery   │  │  │  Views  │Bookings │Revenue  │ Rating  │            │ │
│ │ 🎯 Deals & Offers  │  │  │  2,847  │   124   │ ฿68,400 │  4.7⭐  │            │ │
│ │ 📅 Bookings       │  │  │This Week│This Week│This Week│23 reviews│            │ │
│ │ ⭐ Reviews         │  │  └─────────┴─────────┴─────────┴─────────┘            │ │
│ │ 📊 Analytics      │  │                                                         │ │
│ │ 💳 Billing        │  │  📊 Revenue Trend (Last 30 Days)                      │ │
│ │ ⚙️ Settings       │  │  [Revenue Chart showing daily earnings]               │ │
│ │                    │  │                                                         │ │
│ │ ── SUBSCRIPTION ─  │  │  🔥 Top Performing Deals                              │ │
│ │ ✅ Premium Plan    │  │  • Afternoon 55% Off - 89 bookings                    │ │
│ │ 💰 ฿300/month     │  │  • Early Bird 40% Off - 67 bookings                   │ │
│ │ Next: Jan 15       │  │  • Late Night 50% Off - 45 bookings                   │ │
│ │                    │  │                                                         │ │
│ └────────────────────┘  └─────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Restaurant Profile Management
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 🏪 Restaurant Profile                                        [ Save Changes ] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Basic Information ─────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Restaurant Name: [The Spice Merchant                                        ]  │ │
│ │ Cuisine Type:    [Thai ▼                                                    ]  │ │
│ │ Description:     [Authentic Thai cuisine in the heart of Bangkok...        ]  │ │
│ │                  [                                                          ]  │ │
│ │                                                                                 │ │
│ │ Phone:          [+66 2 123 4567                                             ]  │ │
│ │ Email:          [contact@spicemerchant.co.th                                ]  │ │
│ │ Website:        [https://spicemerchant.co.th                                ]  │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Location Details ──────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Address:        [123 Silom Road, Silom, Bang Rak                            ]  │ │
│ │ District:       [Silom ▼                                                    ]  │ │
│ │ City:           [Bangkok                                                    ]  │ │
│ │ Postal Code:    [10500                                                      ]  │ │
│ │                                                                                 │ │
│ │ 🗺️ Map Preview: [Interactive Google Maps showing restaurant location]        │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Operating Hours ───────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Monday:    [11:00] to [22:00]  [ Open ]                                        │ │
│ │ Tuesday:   [11:00] to [22:00]  [ Open ]                                        │ │
│ │ Wednesday: [11:00] to [22:00]  [ Open ]                                        │ │
│ │ Thursday:  [11:00] to [22:00]  [ Open ]                                        │ │
│ │ Friday:    [11:00] to [23:00]  [ Open ]                                        │ │
│ │ Saturday:  [11:00] to [23:00]  [ Open ]                                        │ │
│ │ Sunday:    [       Closed       ]                                              │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4. Media Gallery Management
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 📷 Media Gallery                               [ Upload Photos ] [ Upload Video ] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Drag & Drop Upload Area ───────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │     📸 Drag photos here or click to browse                                     │ │
│ │                                                                                 │ │
│ │     Supported: JPG, PNG, WebP • Max 5MB per file • Up to 20 photos           │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Current Photos (12/20) ────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ┌─────────┬─────────┬─────────┬─────────┬─────────┐                          │ │
│ │ │ [IMG01] │ [IMG02] │ [IMG03] │ [IMG04] │ [IMG05] │                          │ │
│ │ │ 🌟Cover │ Interior│ Food    │ Plating │ Ambiance│                          │ │
│ │ │[Edit]   │[Edit]   │[Edit]   │[Edit]   │[Edit]   │                          │ │
│ │ └─────────┴─────────┴─────────┴─────────┴─────────┘                          │ │
│ │                                                                                 │ │
│ │ ┌─────────┬─────────┬─────────┬─────────┬─────────┐                          │ │
│ │ │ [IMG06] │ [IMG07] │ [IMG08] │ [IMG09] │ [IMG10] │                          │ │
│ │ │ Kitchen │ Staff   │ Exterior│ Dishes  │ Setup   │                          │ │
│ │ │[Edit]   │[Edit]   │[Edit]   │[Edit]   │[Edit]   │                          │ │
│ │ └─────────┴─────────┴─────────┴─────────┴─────────┘                          │ │
│ │                                                                                 │ │
│ │ ┌─────────┬─────────┬─ Add More ─┐                                            │ │
│ │ │ [IMG11] │ [IMG12] │     +      │                                            │ │
│ │ │ Dessert │ Drinks  │            │                                            │ │
│ │ │[Edit]   │[Edit]   │[Upload]    │                                            │ │
│ │ └─────────┴─────────┴────────────┘                                            │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ 💡 Tips: Set a cover photo, add food shots, show your restaurant ambiance         │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 5. Deals & Offers Management
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 🎯 Deals & Offers                                            [ + Create New Deal ] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Active Deals (3) ──────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🌅 Early Bird Special - 40% OFF                                    [Edit] │ │ │
│ │ │                                                                             │ │ │
│ │ │ Time Slots: 11:00-12:00, 12:00-13:00, 13:00-14:00                        │ │ │
│ │ │ Bookings: 67 total • 23 this week                                          │ │ │
│ │ │ Revenue: ฿28,900 total • ฿8,200 this week                                 │ │ │
│ │ │ Status: Live • Ends: Dec 31, 2024                                          │ │ │
│ │ │                                                                             │ │ │
│ │ │ [👁️ Analytics] [⏸️ Pause] [🗑️ Delete]                                    │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ ☀️ Afternoon Delight - 55% OFF                                     [Edit] │ │ │
│ │ │                                                                             │ │ │
│ │ │ Time Slots: 14:00-15:00, 15:00-16:00, 16:00-17:00                        │ │ │
│ │ │ Bookings: 89 total • 31 this week                                          │ │ │
│ │ │ Revenue: ฿45,600 total • ฿15,800 this week                                │ │ │
│ │ │ Status: Live • Ends: Dec 31, 2024                                          │ │ │
│ │ │                                                                             │ │ │
│ │ │ [👁️ Analytics] [⏸️ Pause] [🗑️ Delete]                                    │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🌙 Late Night Feast - 50% OFF                                      [Edit] │ │ │
│ │ │                                                                             │ │ │
│ │ │ Time Slots: 21:00-22:00, 22:00-23:00, 23:00-00:00                        │ │ │
│ │ │ Bookings: 45 total • 18 this week                                          │ │ │
│ │ │ Revenue: ฿22,800 total • ฿9,200 this week                                 │ │ │
│ │ │ Status: Live • Ends: Dec 31, 2024                                          │ │ │
│ │ │                                                                             │ │ │
│ │ │ [👁️ Analytics] [⏸️ Pause] [🗑️ Delete]                                    │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Deal Performance Summary ──────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ This Week: 72 bookings • ฿33,200 revenue • 4.8⭐ avg rating                   │ │
│ │ This Month: 298 bookings • ฿142,500 revenue • 4.7⭐ avg rating                │ │
│ │                                                                                 │ │
│ │ 🎯 Tips:                                                                       │ │
│ │ • Afternoon deals perform best (55% booking rate)                             │ │
│ │ • Consider increasing late-night availability                                  │ │
│ │ • Premium customers book 3x more often                                        │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 6. Create New Deal Modal
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ ✨ Create New Deal                                                        [ × ] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Deal Basics ───────────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Deal Name:     [Weekend Special                                              ]  │ │
│ │ Deal Type:     [Afternoon ▼] (Early Bird, Afternoon, Late Night)              │ │
│ │ Description:   [Perfect for weekend dining with family and friends...       ]  │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Pricing ───────────────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Original Price:    [฿ 800                    ]                                 │ │
│ │ Discount %:        [    45  %] (rounded to nearest 5%)                        │ │
│ │ Final Price:       [฿ 440                    ] (auto-calculated)              │ │
│ │ You Save:          [฿ 360                    ] per customer                    │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│ │                                                                                 │ │
│ ┌─ Availability ──────────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Start Date:        [2024-12-15 ▼]                                             │ │
│ │ End Date:          [2024-12-31 ▼]                                             │ │
│ │                                                                                 │ │
│ │ Time Slots:                                                                     │ │
│ │ ┌──────────┬────────────┬─────────────┬──────────┐                           │ │
│ │ │ Slot 1   │ 14:00-15:00│ Max: [30]   │ [Remove] │                           │ │
│ │ │ Slot 2   │ 15:00-16:00│ Max: [30]   │ [Remove] │                           │ │
│ │ │ Slot 3   │ 16:00-17:00│ Max: [25]   │ [Remove] │                           │ │
│ │ └──────────┴────────────┴─────────────┴──────────┘                           │ │
│ │                                                  [+ Add Time Slot]            │ │
│ │                                                                                 │ │
│ │ Party Sizes:       [☑️ 2] [☑️ 4] [☑️ 6] [☐ 8] [☐ 10+]                      │ │
│ │ Max Uses/Customer: [1 ▼] per person                                           │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Premium Features ──────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ [☐] Premium-only deal (higher visibility + exclusive access)                   │ │
│ │ [☐] Flash deal (limited time, extra promotion)                                │ │
│ │ [☑️] Popular badge (show as trending)                                          │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│                                          [ Cancel ] [ Create Deal ]              │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 7. Booking Management Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 📅 Booking Management                                      Today: Dec 15, 2024  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Today's Schedule ──────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ┌─ 11:00-12:00 ──┬─ 12:00-13:00 ──┬─ 13:00-14:00 ──┬─ 14:00-15:00 ──┐      │ │
│ │ │ Early Bird      │ Early Bird      │ Early Bird      │ Afternoon      │      │ │
│ │ │ 8/20 booked     │ 12/25 booked    │ 10/20 booked    │ 25/30 booked   │      │ │
│ │ │ [View Details]  │ [View Details]  │ [View Details]  │ [View Details] │      │ │
│ │ └─────────────────┴─────────────────┴─────────────────┴────────────────┘      │ │
│ │                                                                                 │ │
│ │ ┌─ 15:00-16:00 ──┬─ 16:00-17:00 ──┬─ 21:00-22:00 ──┬─ 22:00-23:00 ──┐      │ │
│ │ │ Afternoon      │ Afternoon      │ Late Night     │ Late Night     │      │ │
│ │ │ 28/30 booked    │ 22/25 booked    │ 5/20 booked     │ 3/15 booked     │      │ │
│ │ │ [View Details]  │ [View Details]  │ [View Details]  │ [View Details] │      │ │
│ │ └─────────────────┴─────────────────┴─────────────────┴────────────────┘      │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Recent Bookings ───────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ┌──────────────┬────────────┬─────────────────┬──────────┬──────────────────┐  │ │
│ │ │ Time         │ Customer   │ Deal            │ Party    │ Status           │  │ │
│ │ ├──────────────┼────────────┼─────────────────┼──────────┼──────────────────┤  │ │
│ │ │ 15:00 Today  │ John Smith │ Afternoon 55%   │ 4 people │ ✅ Confirmed    │  │ │
│ │ │ 14:30 Today  │ Sarah Wong │ Afternoon 55%   │ 2 people │ ✅ Confirmed    │  │ │
│ │ │ 14:00 Today  │ Mike Chen  │ Afternoon 55%   │ 6 people │ ⏳ Pending     │  │ │
│ │ │ 12:30 Today  │ Lisa Park  │ Early Bird 40%  │ 3 people │ ✅ Confirmed    │  │ │
│ │ │ 21:00 Yesterday│ David Kim │ Late Night 50% │ 2 people │ ✅ Completed    │  │ │
│ │ └──────────────┴────────────┴─────────────────┴──────────┴──────────────────┘  │ │
│ │                                                                                 │ │
│ │                                                          [View All Bookings]   │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Quick Actions ─────────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ [📱 Send SMS Reminder] [✉️ Email Confirmation] [⏰ Block Time Slot]            │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 8. Analytics Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 📊 Analytics & Reports                            [ Export Data ] [ Date Range ▼ ] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ Revenue Analytics ─────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ 📈 Revenue Trend (Last 30 Days)                                                │ │
│ │                                                                                 │ │
│ │     ฿3000 ┤                                    ●                               │ │
│ │           │                                   ╱│                               │ │
│ │     ฿2500 ┤                           ●     ╱  │                               │ │
│ │           │                          ╱│    ╱   │                               │ │
│ │     ฿2000 ┤                    ●   ╱  │   ╱    │                               │ │
│ │           │                   ╱│  ╱   │  ╱     │                               │ │
│ │     ฿1500 ┤           ●     ╱  │ ╱    │ ╱      │                               │ │
│ │           │          ╱│    ╱   │╱     │╱       │                               │ │
│ │     ฿1000 ┤    ●   ╱  │   ╱    ●      ●        ●                               │ │
│ │           └────┼───┼───┼───┼────┼──────┼────────┼───────────────────────────    │ │
│ │               Nov 15  Nov 22  Nov 29   Dec 6   Dec 13                         │ │
│ │                                                                                 │ │
│ │ Total Revenue: ฿89,400 (+23% vs last month)                                   │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Deal Performance ──────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ┌─────────────────┬─────────────┬─────────────┬─────────────────────────────┐   │ │
│ │ │ Deal Type       │ Bookings    │ Revenue     │ Avg Rating                  │   │ │
│ │ ├─────────────────┼─────────────┼─────────────┼─────────────────────────────┤   │ │
│ │ │ ☀️ Afternoon    │ 89 (+15%)   │ ฿45,600     │ 4.8⭐ (Very Popular)        │   │ │
│ │ │ 🌅 Early Bird   │ 67 (+8%)    │ ฿28,900     │ 4.7⭐                       │   │ │
│ │ │ 🌙 Late Night   │ 45 (+12%)   │ ฿22,800     │ 4.6⭐                       │   │ │
│ │ └─────────────────┴─────────────┴─────────────┴─────────────────────────────┘   │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ Customer Insights ─────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ • 68% of customers are LocalPlus Premium subscribers                           │ │
│ │ • Peak booking times: 15:00-16:00 (28% of daily bookings)                     │ │
│ │ • Average party size: 3.2 people                                               │ │
│ │ • Repeat customer rate: 34% (industry avg: 22%)                               │ │
│ │ • Most popular cuisines requested: Pad Thai, Green Curry, Tom Yum             │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Key Features Highlighted

✅ **Responsive Design**: Works on desktop, tablet, mobile browsers
✅ **Drag & Drop**: Easy photo uploads with progress indicators  
✅ **Real-time Data**: Live booking counts, revenue tracking
✅ **Visual Analytics**: Charts, graphs, performance metrics
✅ **Bulk Operations**: Manage multiple deals, time slots, photos
✅ **Smart Suggestions**: AI-powered recommendations for pricing, timing
✅ **Mobile-First**: Touch-friendly buttons, readable fonts
✅ **Professional UI**: Clean, business-appropriate design language

## Technical Implementation Notes

**Frontend Stack:**
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Chart.js for analytics visualization
- React Hook Form for form management
- React Query for data fetching

**Key Components:**
- Sidebar navigation with active states
- Modal dialogs for deal creation
- Drag-and-drop file upload zones
- Real-time data updates via WebSockets
- Responsive table layouts for bookings
- Interactive charts and graphs

**Integration Points:**
- Direct connection to PostgreSQL via Supabase
- Real-time subscriptions for booking updates
- File upload to Cloudinary
- Email/SMS notifications via SendGrid/Twilio
- Payment processing via Omise/Stripe

This web portal will significantly improve the restaurant owner experience compared to mobile-only management! 🚀 