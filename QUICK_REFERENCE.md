# 🚀 LOCALPLUS QUICK REFERENCE CARD

## ⚡ **FAST COMMANDS**

### **Start Development Servers**
```bash
# Partner app (recommended for development)
npm run dev:partner

# Consumer app + news server
npm run dev:full

# Admin app
cd admin && npm run dev
```

### **Health Checks**
```bash
# Test validation utilities
cd shared/utils && node validation.demo.js

# Test health check system
cd shared/services && node healthCheck.demo.js
```

### **Troubleshooting**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Check running processes
lsof -i -P | grep LISTEN

# Kill conflicting processes
pkill -f "npm run dev"
```

---

## 🔧 **COMMON FIXES**

### **JSX Parsing Error**
```bash
# Rename .js files with JSX to .jsx
mv src/App.js src/App.jsx
mv src/modules/*/components/*.js src/modules/*/components/*.jsx
```

### **Environment Variables Missing**
```bash
# Copy example file
cp env.example .env

# Edit .env with your values
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **UUID Format Error**
```typescript
// Use valid UUID format
id: '550e8400-e29b-41d4-a716-446655440000'

// Generate new UUID
import { generateUUID } from '../utils/validation';
const newId = generateUUID();
```

---

## 📁 **KEY FILE LOCATIONS**

- **Environment**: `.env` (root), `partner/.env`, `admin/.env`
- **Validation**: `shared/utils/validation.ts`
- **Health Checks**: `shared/services/healthCheck.ts`
- **Supabase**: `shared/services/supabase.ts`
- **Types**: `shared/types/index.ts`

---

## 🚨 **EMERGENCY RECOVERY**

### **App Won't Start**
1. Check terminal for JSX parsing errors
2. Verify `.env` files exist and have correct values
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Check file extensions (.jsx vs .js)
5. Restart development server

### **White Screen**
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check for UUID format errors in mock data
4. Ensure ToastProvider context is available

### **Database Errors**
1. Verify Supabase credentials in `.env`
2. Check network connectivity
3. Validate mock data format
4. Run health checks

---

## 💡 **PRO TIPS**

- **Always use `.jsx` extension** for files with JSX syntax
- **Run health checks** before starting development
- **Validate mock data** using validation utilities
- **Check console logs** for health check results
- **Use shared components** when possible

---

*Keep this card handy for quick troubleshooting!*
