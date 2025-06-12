# LocalPlus Curated Pipeline - Deployment Checklist

## 🗃️ Step 1: Deploy Database Schema

### Prerequisites
- Supabase project with admin access
- PostgreSQL access via Supabase SQL editor

### Instructions
1. **Open Supabase Dashboard**
   - Go to your project dashboard
   - Navigate to "SQL Editor" in the left sidebar

2. **Execute Schema**
   - Create new query
   - Copy entire contents of `src/database/curated-pipeline-schema.sql`
   - Execute the schema (this will create all pipeline tables and functions)

3. **Verify Installation**
   Run this verification query:
   ```sql
   -- Verify all pipeline tables exist
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN (
     'suggested_businesses', 
     'sales_leads', 
     'discovery_campaigns', 
     'curation_activities', 
     'business_metrics'
   );
   
   -- Should return 5 rows
   ```

4. **Test Functions**
   ```sql
   -- Test quality score calculation
   SELECT calculate_quality_score(4.5, 120, true, true, true, 8);
   -- Should return a score around 85-90
   ```

### ✅ Completion Criteria
- [ ] All 5 new tables created successfully
- [ ] Enhanced businesses table with new columns
- [ ] PostgreSQL functions working (approve_suggested_business, etc.)
- [ ] Indexes created for performance
- [ ] RLS policies enabled

---

## 🔑 Step 2: Configure Google Places API

### Prerequisites
- Google Cloud Console account
- Credit card for API billing (pay-per-use)

### Instructions
1. **Enable Google Places API**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable "Places API" in API Library
   - Enable "Places API (New)" for enhanced features

2. **Create API Key**
   ```bash
   # In Google Cloud Console:
   # APIs & Services > Credentials > Create Credentials > API Key
   # Restrict API key to Places API only for security
   ```

3. **Configure Environment Variable**
   Update your `.env` file:
   ```env
   VITE_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

4. **Test API Integration**
   ```typescript
   // Test in browser console or create test script
   const testPlaces = async () => {
     const response = await fetch(
       `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
       `location=12.5664,99.9589&radius=5000&type=restaurant&` +
       `key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
     );
     const data = await response.json();
     console.log('Places API Test:', data.status); // Should be "OK"
   };
   ```

### ✅ Completion Criteria
- [ ] Google Places API enabled in Google Cloud Console
- [ ] API key created and restricted properly
- [ ] Environment variable configured in Vercel/local
- [ ] Test API call returns valid results
- [ ] Billing account set up (API costs ~$17/1000 requests)

---

## 🎯 Step 3: Create Discovery Campaigns

### Setup Initial Campaigns
Let's create campaigns for your key markets:

```typescript
// Create these campaigns via admin interface or direct database insert
const initialCampaigns = [
  {
    name: "Hua Hin Premium Restaurants",
    description: "High-quality dining establishments in Hua Hin center",
    target_location: "Hua Hin, Thailand",
    center_latitude: 12.5664,
    center_longitude: 99.9589,
    search_radius: 5000,
    target_categories: ["Restaurants"],
    quality_filters: {
      minRating: 4.0,
      minReviewCount: 20,
      excludedTypes: ["fast_food", "gas_station"]
    },
    run_frequency: "weekly"
  },
  {
    name: "Bangkok Thonglor Wellness",
    description: "Spas and wellness centers in premium Bangkok district",
    target_location: "Bangkok Thonglor",
    center_latitude: 13.7326,
    center_longitude: 100.5848,
    search_radius: 3000,
    target_categories: ["Wellness"],
    quality_filters: {
      minRating: 4.2,
      minReviewCount: 15
    },
    run_frequency: "monthly"
  },
  {
    name: "Pattaya Entertainment",
    description: "Entertainment venues and activities in Pattaya",
    target_location: "Pattaya, Thailand",
    center_latitude: 12.9236,
    center_longitude: 100.8825,
    search_radius: 8000,
    target_categories: ["Entertainment"],
    quality_filters: {
      minRating: 3.8,
      minReviewCount: 30
    },
    run_frequency: "weekly"
  }
];
```

### Campaign Creation Script
```sql
-- Insert initial discovery campaigns
INSERT INTO discovery_campaigns (
  name, description, target_location, center_latitude, center_longitude,
  search_radius, target_categories, quality_filters, run_frequency
) VALUES 
(
  'Hua Hin Premium Restaurants',
  'High-quality dining establishments in Hua Hin center',
  'Hua Hin, Thailand',
  12.5664, 99.9589, 5000,
  ARRAY['Restaurants'],
  '{"minRating": 4.0, "minReviewCount": 20, "excludedTypes": ["fast_food", "gas_station"]}',
  'weekly'
),
(
  'Bangkok Thonglor Wellness', 
  'Spas and wellness centers in premium Bangkok district',
  'Bangkok Thonglor',
  13.7326, 100.5848, 3000,
  ARRAY['Wellness'],
  '{"minRating": 4.2, "minReviewCount": 15}',
  'monthly'
),
(
  'Pattaya Entertainment',
  'Entertainment venues and activities in Pattaya', 
  'Pattaya, Thailand',
  12.9236, 100.8825, 8000,
  ARRAY['Entertainment'],
  '{"minRating": 3.8, "minReviewCount": 30}',
  'weekly'
);
```

### ✅ Completion Criteria
- [ ] 3+ discovery campaigns created for key markets
- [ ] Campaign parameters tuned for quality (4.0+ rating minimums)
- [ ] Geographic coverage of primary LocalPlus markets
- [ ] Test campaign execution returns valid results

---

## 👥 Step 4: Train Curation Team

### Curation Decision Matrix

| Quality Score | Google Rating | Review Count | Typical Action | Rationale |
|--------------|---------------|--------------|----------------|-----------|
| 85-100 | 4.5+ ⭐ | 50+ reviews | 🚩 **Flag for Sales** | Premium partnership potential |
| 70-84 | 4.0+ ⭐ | 20+ reviews | ✅ **Approve** | Solid directory addition |
| 60-69 | 3.5+ ⭐ | 10+ reviews | ✅ **Approve** (conditional) | Basic listing value |
| 50-59 | 3.0+ ⭐ | 5+ reviews | ❓ **Case-by-case** | Review context carefully |
| <50 | <3.0 ⭐ | <5 reviews | ❌ **Reject** | Below quality threshold |

### Sales Priority Guidelines

**Priority 5 (Highest):**
- Premium venues with 4.7+ rating
- Unique/exclusive establishments
- Strategic gap-filling businesses
- High-traffic, landmark locations

**Priority 4:**
- Strong candidates with 4.3+ rating
- Good strategic fit for LocalPlus
- Established businesses with loyal following

**Priority 3 (Standard):**
- Solid businesses meeting basic criteria
- Standard partnership potential
- Batch outreach candidates

**Priority 2-1 (Lower):**
- Opportunistic leads
- Businesses requiring more evaluation
- Future partnership potential

### Rejection Reasons (Common)
- "Below minimum rating threshold"
- "Insufficient review count for credibility"
- "Business type not aligned with LocalPlus focus"
- "Location outside target service area"
- "Duplicate of existing partner"
- "Permanently closed or inactive"

### ✅ Completion Criteria
- [ ] Team trained on quality score interpretation
- [ ] Decision matrix documented and distributed
- [ ] Sales priority guidelines established
- [ ] Rejection reason standards defined
- [ ] Sample curation session completed

---

## 📈 Step 5: Launch Sales Process Integration

### CRM Integration Points

1. **Sales Lead Export**
   ```sql
   -- Query to export sales leads for CRM
   SELECT 
     sl.id,
     sl.priority_level,
     sl.estimated_partnership_value,
     sl.outreach_status,
     COALESCE(sb.name, b.name) as business_name,
     COALESCE(sb.phone, b.phone) as phone,
     COALESCE(sb.address, b.address) as address,
     COALESCE(sb.google_rating, b.google_rating) as rating,
     sl.created_at
   FROM sales_leads sl
   LEFT JOIN suggested_businesses sb ON sl.suggested_business_id = sb.id  
   LEFT JOIN businesses b ON sl.business_id = b.id
   WHERE sl.outreach_status = 'new'
   ORDER BY sl.priority_level DESC, sl.created_at;
   ```

2. **Partnership Value Calculator**
   ```typescript
   const calculatePartnershipValue = (business: any) => {
     let baseValue = 500; // Base monthly partnership fee
     
     // Rating multiplier
     if (business.rating >= 4.5) baseValue *= 1.5;
     else if (business.rating >= 4.0) baseValue *= 1.2;
     
     // Review volume multiplier  
     if (business.reviewCount >= 100) baseValue *= 1.3;
     else if (business.reviewCount >= 50) baseValue *= 1.1;
     
     // Category multipliers
     const categoryMultipliers = {
       'Restaurants': 1.2,
       'Wellness': 1.4,
       'Entertainment': 1.1,
       'Travel': 1.3
     };
     
     return Math.round(baseValue * (categoryMultipliers[business.category] || 1.0));
   };
   ```

3. **Outreach Templates**
   ```markdown
   **Priority 5 Lead Template:**
   Subject: Partnership Invitation - LocalPlus Premium Directory
   
   Hi [Business Name],
   
   We've identified [Business Name] as a premium establishment that perfectly aligns with LocalPlus's curated directory of exceptional local businesses.
   
   Your outstanding [X.X star rating] and [XX reviews] demonstrate the quality that LocalPlus users seek. We'd love to discuss featuring your business as a verified LocalPlus partner.
   
   Partnership benefits include:
   - Featured placement in search results  
   - Exclusive deal promotion capabilities
   - Customer analytics and insights
   - Mobile app presence for 10,000+ active users
   
   Would you be available for a brief call this week?
   
   Best regards,
   LocalPlus Partnership Team
   ```

### Sales Tracking Workflow
1. **Lead Generation**: Automated from curation pipeline
2. **Initial Contact**: Within 48 hours of lead creation
3. **Follow-up**: 3-day, 1-week, 2-week intervals
4. **Conversion Tracking**: Update status through pipeline
5. **Partnership Onboarding**: Direct to /business signup flow

### ✅ Completion Criteria
- [ ] Sales lead export process established
- [ ] Partnership value calculator implemented
- [ ] Outreach templates created for each priority level
- [ ] Follow-up workflow documented
- [ ] Conversion tracking integrated with existing systems

---

## 🎯 Final Deployment Verification

### System Health Check
```sql
-- Pipeline health verification queries
SELECT 
  COUNT(*) as total_campaigns,
  COUNT(CASE WHEN campaign_status = 'active' THEN 1 END) as active_campaigns
FROM discovery_campaigns;

SELECT 
  curation_status,
  COUNT(*) as count,
  AVG(quality_score) as avg_quality
FROM suggested_businesses 
GROUP BY curation_status;

SELECT 
  outreach_status,
  COUNT(*) as count,
  AVG(estimated_partnership_value) as avg_value
FROM sales_leads 
GROUP BY outreach_status;
```

### Success Metrics Dashboard
- **Discovery Rate**: Businesses found per campaign execution
- **Curation Efficiency**: Approval rate (target: 60-70%)
- **Sales Conversion**: Lead-to-partner rate (target: 25-35%)
- **Quality Distribution**: Average quality scores by category
- **Pipeline Velocity**: Time from discovery to partner conversion

### ✅ Final Checklist
- [ ] Database schema deployed and verified
- [ ] Google Places API configured and tested
- [ ] Discovery campaigns created and running
- [ ] Curation team trained and active
- [ ] Sales process integrated and tracking conversions
- [ ] Analytics dashboard monitoring pipeline health
- [ ] Documentation updated with actual performance metrics

---

## 🎉 Congratulations!

Your LocalPlus Curated Business Pipeline is now live and transforming your platform from a basic directory into a strategic business intelligence engine!

**Next Phase**: Monitor performance metrics and optimize campaigns based on real-world results. 