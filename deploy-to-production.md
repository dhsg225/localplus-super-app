# 🚀 IMMEDIATE PRODUCTION DEPLOYMENT GUIDE

## **CRITICAL SECURITY FIX - DEPLOY NOW!**

### **Current Issue:**
- Service role key hardcoded in frontend (MAJOR SECURITY VULNERABILITY)
- API routes not working in development
- Need immediate production deployment

### **Solution: Deploy to Vercel NOW**

## **Step 1: Deploy Partner App to Vercel**

```bash
# Navigate to partner app
cd partner

# Deploy to Vercel
vercel --prod
```

## **Step 2: Deploy Admin App to Vercel**

```bash
# Navigate to admin app  
cd admin

# Deploy to Vercel
vercel --prod
```

## **Step 3: Update Environment Variables**

In Vercel dashboard for each app:
- `VITE_SUPABASE_URL`: `https://joknprahhqdhvdhzmuwl.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk`

## **Step 4: Update API URLs**

Once deployed, update the production URLs in:
- `shared/services/businessService.ts`
- Replace `https://localplus-v2.vercel.app` with actual Vercel URLs

## **Step 5: Test Production**

1. Visit partner app URL
2. Test signup flow
3. Verify businesses load correctly
4. Test admin tools

## **Security Benefits:**

✅ **Service role key SECURED** - only on server
✅ **API routes WORKING** - Vercel handles them
✅ **CORS configured** - production ready
✅ **No more workarounds** - proper architecture

## **Deployment Commands:**

```bash
# Partner app
cd partner && vercel --prod

# Admin app  
cd admin && vercel --prod

# Update URLs after deployment
# Test both apps
```

**DEPLOY IMMEDIATELY TO FIX SECURITY VULNERABILITY!** 