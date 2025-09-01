# 🚀 LOCALPLUS DEVELOPMENT ENVIRONMENT SETUP

## 📋 **PREREQUISITES**

### **Required Software**
- **Node.js** 18+ (Recommended: 20.x LTS)
- **npm** 9+ or **pnpm** 8+
- **Git** for version control
- **Code Editor** (VS Code recommended)

### **Required Accounts**
- **Supabase** account and project
- **Google Places API** key (for location services)

### **System Requirements**
- **macOS** 12+ / **Windows** 10+ / **Linux** (Ubuntu 20.04+)
- **8GB RAM** minimum (16GB recommended)
- **2GB free disk space**

---

## 🛠️ **INITIAL SETUP**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd "LocalPlus v2"
```

### **2. Install Dependencies**
```bash
# Install root dependencies
npm install

# Install partner app dependencies
cd partner && npm install && cd ..

# Install admin app dependencies  
cd admin && npm install && cd ..
```

### **3. Environment Configuration**

#### **Root Environment (.env)**
```bash
# Copy the example file
cp .env.example .env

# Required variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_PLACES_API_KEY=your-google-api-key
```

#### **Partner App Environment (partner/.env)**
```bash
# Copy the example file
cd partner
cp .env.example .env

# Required variables (same as root)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### **Admin App Environment (admin/.env)**
```bash
# Copy the example file
cd admin
cp .env.example .env

# Required variables (same as root)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🏃‍♂️ **QUICK START**

### **Start Partner Application**
```bash
npm run dev:partner
# App will be available at http://localhost:3005
```

### **Start Consumer Application**
```bash
npm run dev:full
# App will be available at http://localhost:3000
# News server will also start
```

### **Start Admin Application**
```bash
cd admin && npm run dev
# App will be available at http://localhost:3001
```

---

## 🔧 **DEVELOPMENT WORKFLOW**

### **File Naming Conventions**
- **JSX files**: Use `.jsx` extension for files containing JSX syntax
- **TypeScript files**: Use `.tsx` extension for React components with TypeScript
- **Regular JavaScript**: Use `.js` extension for utility files without JSX

### **Component Development**
- **Shared components**: Place in `shared/components/` for reuse across apps
- **App-specific components**: Place in respective `src/components/` directories
- **Follow the Shared-First Development Principle**

### **Mock Data Guidelines**
- **Always use valid UUID format** for IDs (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Validate mock data** using the validation utilities in `shared/utils/validation.ts`
- **Test data integrity** before committing

---

## 🚨 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

#### **1. JSX Parsing Errors**
**Symptoms:**
```
Failed to parse source for import analysis because the content contains invalid JS syntax.
If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
```

**Solution:**
- Rename `.js` files containing JSX to `.jsx`
- Check all files in `src/`, `src/components/`, `src/modules/`
- Clear Vite cache: `rm -rf node_modules/.vite`

**Files to Check:**
- `src/App.js` → `src/App.jsx`
- `src/modules/*/components/*.js` → `*.jsx`
- `src/ui-components/*.js` → `*.jsx`

#### **2. Supabase Environment Variable Errors**
**Symptoms:**
```
CRITICAL: Supabase environment variables are missing. Please check your .env file.
```

**Solution:**
- Verify `.env` file exists in the correct directory
- Check environment variable names (must start with `VITE_`)
- Restart development server after `.env` changes
- Use fallback values in development

**Required Variables:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### **3. UUID Format Errors**
**Symptoms:**
```
invalid input syntax for type uuid: "mock-restaurant-123"
```

**Solution:**
- Use valid UUID format for all mock data IDs
- Run validation utilities: `shared/utils/validation.ts`
- Generate UUIDs using: `generateUUID()` function

**Valid UUID Example:**
```typescript
id: '550e8400-e29b-41d4-a716-446655440000'
```

#### **4. Toast Context Provider Issues**
**Symptoms:**
```
useToast must be used within ToastProvider
```

**Solution:**
- Ensure `useToast()` is called within `ToastProvider` context
- Call hooks inside functions, not at component initialization
- Add error boundaries for context failures

#### **5. Development Server Won't Start**
**Symptoms:**
- Port already in use errors
- Vite build failures
- White screen on app load

**Solution:**
- Check for running processes: `lsof -i -P | grep LISTEN`
- Kill conflicting processes: `pkill -f "npm run dev"`
- Clear caches: `rm -rf node_modules/.vite`
- Check file extensions and JSX syntax

---

## 🧪 **TESTING & VALIDATION**

### **Health Check System**
The app automatically runs health checks on startup:
- **Environment variables** validation
- **Database connectivity** testing
- **Mock data format** validation
- **Authentication service** checks

### **Manual Validation**
```bash
# Test validation utilities
cd shared/utils
node validation.demo.js

# Test health check system
cd shared/services
node healthCheck.demo.js
```

### **Mock Data Validation**
```typescript
import { validateRestaurant, logValidationErrors } from '../utils/validation';

const validation = validateRestaurant(mockRestaurant);
logValidationErrors(validation, 'Mock Restaurant Data');

if (!validation.isValid) {
  console.warn('⚠️  Fix these issues:', validation.errors);
}
```

---

## 📚 **DEVELOPMENT RESOURCES**

### **Documentation**
- **SAFEGUARDS.md** - Comprehensive safeguards and prevention strategies
- **PROJECT_RULES.md** - Project-specific development rules
- **SHARED_COMPONENTS_MIGRATION.md** - Component migration guide

### **Key Files**
- **`shared/utils/validation.ts`** - Data validation utilities
- **`shared/services/healthCheck.ts`** - Health check system
- **`shared/services/supabase.ts`** - Database configuration
- **`shared/types/index.ts`** - TypeScript type definitions

### **External Resources**
- **Vite Documentation**: https://vitejs.dev/
- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://reactjs.org/docs/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## 🚀 **DEPLOYMENT**

### **Build Commands**
```bash
# Partner app
cd partner && npm run build

# Consumer app
npm run build

# Admin app
cd admin && npm run build
```

### **Environment Variables**
- Ensure all required environment variables are set in production
- Use production Supabase credentials
- Validate environment configuration before deployment

---

## 📞 **SUPPORT & CONTRIBUTION**

### **Getting Help**
1. **Check this documentation** first
2. **Review SAFEGUARDS.md** for known issues
3. **Check browser console** for error messages
4. **Run health checks** to identify issues
5. **Contact the development team**

### **Contributing**
1. **Follow file naming conventions**
2. **Use shared components** when possible
3. **Validate mock data** before committing
4. **Test health checks** on your changes
5. **Update documentation** for new features

---

## 🔄 **MAINTENANCE**

### **Regular Tasks**
- **Update dependencies** monthly
- **Run health checks** before major changes
- **Validate mock data** after updates
- **Test all applications** after dependency changes

### **Monitoring**
- **Watch console logs** for health check results
- **Monitor for JSX parsing errors**
- **Check environment variable loading**
- **Validate UUID formats** in mock data

---

*Last Updated: [Current Date]*
*Version: 1.0*
*Status: Active Development*

---

**💡 Pro Tip:** Always run the health check system before starting development work. It will catch most common issues early and save you hours of debugging!
