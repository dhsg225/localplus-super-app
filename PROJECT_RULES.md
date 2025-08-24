# 📋 LocalPlus v2 Project Rules

**Last Updated:** January 7, 2025

## 🎯 **CORE PRINCIPLE: Shared-First Development**

Before creating any new component, service, or utility, you MUST follow the **"Shared-First Development Principle"**.

### **🔍 DECISION QUESTIONS**

Ask these questions in order:

1. **"Will this be used by 2+ apps?"** → `shared/` folder
2. **"Is this business logic or data access?"** → `shared/` folder  
3. **"Is this a reusable UI component?"** → `shared/` folder
4. **"Is this app-specific routing/navigation?"** → `src/` folder
5. **"Is this app-specific styling/branding?"** → `src/` folder

### **📁 DECISION MATRIX**

| **Type** | **✅ Shared Folder** | **❌ App Folder** |
|----------|---------------------|-------------------|
| **Components** | Button, FormInput, Modal, Table, Card, LoadingSpinner | Navigation, AppHeader, AppSidebar, PageLayout |
| **Services** | Database, API, Auth, Restaurant, Booking | App-specific routing, App state management |
| **Utils** | Formatting, validation, storage, debounce, API helpers | App config, constants, app-specific helpers |
| **Types** | Business models (Restaurant, Booking, User, Partner) | Component props, app state, page-specific types |
| **Hooks** | useLocalStorage, useDebounce, useApi, useAuth | useNavigation, useAppState, usePageState |

### **🔄 MANDATORY WORKFLOW**

```
New Component/Service/Utility Needed
                ↓
        Ask: "Reusable by 2+ apps?"
                ↓
            Yes → shared/
            No → src/
                ↓
    If shared: Export from shared/[type]/index.ts
```

### **📝 NAMING CONVENTIONS**

#### **Shared Components/Services**
- **Use generic, descriptive names**
- ✅ `Button`, `FormInput`, `Modal`, `RestaurantService`
- ❌ `ConsumerButton`, `PartnerModal`, `AdminService`

#### **App-Specific Components/Services**
- **Use prefixed or context-specific names**
- ✅ `ConsumerNavigation`, `PartnerHeader`, `AdminDashboard`
- ❌ `Navigation` (too generic for app-specific)

### **🎨 STYLING STRATEGY**

#### **Shared Components**
- **MUST be theme-able with props**
- Example: `<Button theme="blue|red|gray" variant="primary|secondary">`
- **NO hardcoded app-specific colors**
- **Support multiple visual contexts**

#### **App-Specific Components**
- **CAN use app-specific colors directly**
- **CAN have hardcoded branding**
- **Should still use design system tokens when possible**

### **📦 EXPORT REQUIREMENTS**

#### **Shared Components**
```typescript
// shared/components/index.ts
export { Button } from './Button'
export { FormInput } from './FormInput'
export { Modal } from './Modal'
```

#### **Shared Services**
```typescript
// shared/services/index.ts
export { restaurantService } from './restaurantService'
export { bookingService } from './bookingService'
export { supabase } from './supabase'
```

#### **Shared Types**
```typescript
// shared/types/index.ts
export type { Restaurant, Booking, User } from './business'
export type { ApiResponse, ErrorResponse } from './api'
```

### **🔧 IMPORT PATTERNS**

#### **Preferred Imports**
```typescript
// ✅ Clean imports from shared
import { Button, FormInput } from '@shared/components'
import { restaurantService } from '@shared/services'
import { formatCurrency } from '@shared/utils'
import type { Restaurant } from '@shared/types'
```

#### **Avoid**
```typescript
// ❌ Direct file imports
import { Button } from '../../shared/components/Button'
```

## 🚨 **ENFORCEMENT RULES**

### **Before Creating New Code**
1. **Check if similar exists in `shared/`**
2. **Ask: "Could any other app use this?"**
3. **If yes → Create in `shared/`**
4. **If no → Create in app-specific folder**

### **Code Review Requirements**
- **Reviewer MUST verify shared-first principle was followed**
- **Any app-specific code that could be shared MUST be flagged**
- **Duplicate functionality across apps MUST be consolidated**

### **Refactoring Triggers**
- **If component appears in 2+ apps → Move to shared**
- **If business logic is duplicated → Create shared service**
- **If types are copied → Create shared types**

## 📈 **BENEFITS TRACKING**

This rule prevents:
- ✅ **Code duplication** (saves development time)
- ✅ **Inconsistent UI/UX** (maintains design system)
- ✅ **Technical debt** (prevents future migration pain)
- ✅ **Bug multiplication** (fix once, works everywhere)

## 🔮 **FUTURE CONSIDERATIONS**

### **Planned Shared Components**
- `Modal` - For dialogs and overlays
- `Table` - For data display
- `Calendar` - For booking interfaces
- `ImageUpload` - For photo management
- `StatusBadge` - For booking/business status

### **Planned Shared Services**
- `menuService` - Menu management
- `partnerService` - Partner operations
- `analyticsService` - Usage tracking
- `notificationService` - Push notifications

## ⚡ **QUICK REFERENCE**

**When in doubt:** 
1. Start in `shared/`
2. Move to app-specific only if truly unique
3. Always prefer reusability over convenience

**Remember:** It's easier to move from shared to specific than specific to shared!

---

**🎯 This rule is MANDATORY for all development work on LocalPlus v2.** 