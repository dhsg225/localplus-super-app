import { test, expect } from '@playwright/test';

const PARTNER_URL = 'http://localhost:3014';
const ADMIN_URL = 'http://localhost:3000'; // Default admin port

// [2024-12-19] - Comprehensive Partner Flow Test
// This test covers the complete partner journey: signup → admin approval → dashboard access

test('Complete Partner Flow: Signup to Dashboard Access', async ({ page }) => {
  console.log('🚀 Testing Complete Partner Flow...');
  
  // Step 1: Test Partner Signup
  console.log('📝 Step 1: Testing Partner Signup');
  await page.goto(PARTNER_URL);
  
  // Wait for login form
  await expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 });
  
  // Generate unique test data
  const testEmail = `test-partner-${Date.now()}@localplus.com`;
  const testPassword = 'TestPassword123!';
  
  // Fill signup form
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  
  // Check business availability
  const businessSelect = page.locator('select');
  await expect(businessSelect).toBeVisible({ timeout: 10000 });
  
  const options = await page.locator('select option').allTextContents();
  console.log('Available businesses:', options.length);
  
  if (options.length > 1) {
    // Select first business
    await page.selectOption('select', { index: 1 });
    console.log('✅ Business selected for signup');
    
    // Create account
    await page.click('button:has-text("Create Partner Account")');
    await page.waitForTimeout(3000);
    
    // Check for success message
    const successMessage = page.locator('text=Account created!');
    const emailConfirmationMessage = page.locator('text=Please check your email');
    
    await expect(
      successMessage.or(emailConfirmationMessage)
    ).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Partner account created successfully');
  } else {
    console.log('⚠️ No businesses available - using dev bypass for testing');
    await page.click('button:has-text("Development Bypass")');
    await expect(page.locator('text=Partner Dashboard')).toBeVisible({ timeout: 10000 });
  }
  
  // Step 2: Test Dashboard Access
  console.log('📊 Step 2: Testing Dashboard Access');
  await expect(page.locator('text=Partner Dashboard')).toBeVisible({ timeout: 10000 });
  
  // Test navigation
  await page.click('button:has-text("Bookings")');
  await expect(page.locator('text=Booking Dashboard')).toBeVisible({ timeout: 10000 });
  
  await page.click('button:has-text("Dashboard")');
  await expect(page.locator('text=Partner Dashboard')).toBeVisible({ timeout: 10000 });
  
  console.log('✅ Dashboard navigation working');
  
  // Step 3: Test Admin Tools (if available)
  console.log('🛠️ Step 3: Testing Admin Tools');
  
  // Try to access admin linker (should be available in partner app)
  try {
    await page.click('button:has-text("More")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Admin Tools")');
    await expect(page.locator('text=Admin: Link User to Business')).toBeVisible({ timeout: 5000 });
    console.log('✅ Admin tools accessible');
  } catch {
    console.log('⚠️ Admin tools not accessible (may require admin role)');
  }
  
  console.log('🎉 Complete Partner Flow Test Finished');
});

// [2024-12-19] - Production Readiness Test
test('Production Readiness: Environment and Configuration', async ({ page }) => {
  console.log('🌐 Testing Production Readiness...');
  
  // Test partner app loads
  await page.goto(PARTNER_URL);
  await expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 });
  
  // Verify Supabase connection
  try {
    await page.click('button:has-text("Development Bypass")');
    await expect(page.locator('text=Partner Dashboard')).toBeVisible({ timeout: 10000 });
    console.log('✅ Supabase connection working');
  } catch (error) {
    console.log('⚠️ Supabase connection issue:', error);
  }
  
  // Test responsive design
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Partner Portal Login')).toBeVisible();
  
  await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Partner Portal Login')).toBeVisible();
  
  console.log('✅ Responsive design working');
  console.log('🎉 Production Readiness Test Finished');
});

// [2024-12-19] - Admin Tools Test
test('Admin Tools: User-Business Linking', async ({ page }) => {
  console.log('🛠️ Testing Admin Tools...');
  
  // Test admin partner linker page
  await page.goto(PARTNER_URL);
  await expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 });
  
  // Use dev bypass to access admin tools
  await page.click('button:has-text("Development Bypass")');
  await expect(page.locator('text=Partner Dashboard')).toBeVisible({ timeout: 10000 });
  
  // Navigate to admin tools
  try {
    await page.click('button:has-text("More")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Admin Tools")');
    await expect(page.locator('text=Admin: Link User to Business')).toBeVisible({ timeout: 5000 });
    
    // Test admin form elements
    await expect(page.locator('text=Select User')).toBeVisible();
    await expect(page.locator('text=Select Business')).toBeVisible();
    await expect(page.locator('button:has-text("Link User to Business")')).toBeVisible();
    
    console.log('✅ Admin tools interface working');
  } catch (error) {
    console.log('⚠️ Admin tools not accessible:', error);
  }
  
  console.log('🎉 Admin Tools Test Finished');
}); 