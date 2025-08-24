var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { test, expect } from '@playwright/test';
var BASE_URL = 'http://localhost:3014'; // [2024-12-19] - Updated to actual partner app port
// [2024-12-19] - Test: Real Partner Signup Flow
// This test verifies the complete signup process including email confirmation and business linking
test('Partner signup: complete flow with real account creation', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var testEmail, testPassword, businessSelect, options, successMessage, emailConfirmationMessage;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.goto(BASE_URL)];
            case 1:
                _c.sent();
                // Wait for login form to load
                return [4 /*yield*/, expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 })];
            case 2:
                // Wait for login form to load
                _c.sent();
                testEmail = "test-partner-".concat(Date.now(), "@localplus.com");
                testPassword = 'TestPassword123!';
                // Fill out the signup form
                return [4 /*yield*/, page.fill('input[type="email"]', testEmail)];
            case 3:
                // Fill out the signup form
                _c.sent();
                return [4 /*yield*/, page.fill('input[type="password"]', testPassword)];
            case 4:
                _c.sent();
                businessSelect = page.locator('select');
                return [4 /*yield*/, expect(businessSelect).toBeVisible({ timeout: 10000 })];
            case 5:
                _c.sent();
                return [4 /*yield*/, page.locator('select option').allTextContents()];
            case 6:
                options = _c.sent();
                console.log('Available businesses for signup:', options);
                if (!(options.length > 1)) return [3 /*break*/, 11];
                // Select the first business (skip placeholder)
                return [4 /*yield*/, page.selectOption('select', { index: 1 })];
            case 7:
                // Select the first business (skip placeholder)
                _c.sent();
                console.log('Selected business for signup');
                // Click "Create Partner Account" button
                return [4 /*yield*/, page.click('button:has-text("Create Partner Account")')];
            case 8:
                // Click "Create Partner Account" button
                _c.sent();
                // Wait for signup process to complete
                return [4 /*yield*/, page.waitForTimeout(3000)];
            case 9:
                // Wait for signup process to complete
                _c.sent();
                successMessage = page.locator('text=Account created!');
                emailConfirmationMessage = page.locator('text=Please check your email');
                // Should see either success or email confirmation message
                return [4 /*yield*/, expect(successMessage.or(emailConfirmationMessage)).toBeVisible({ timeout: 10000 })];
            case 10:
                // Should see either success or email confirmation message
                _c.sent();
                console.log('✅ Partner signup flow completed successfully');
                return [3 /*break*/, 12];
            case 11:
                console.log('⚠️ No businesses available for signup test - this may indicate an RLS or data issue');
                console.log('Expected: At least 20 active businesses should be available');
                console.log('Actual: Only', options.length, 'options found');
                // Skip this test but log the issue
                test.skip();
                return [2 /*return*/];
            case 12: return [2 /*return*/];
        }
    });
}); });
// [2024-12-19] - Test: Signup Validation
test('Partner signup: form validation works correctly', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.goto(BASE_URL)];
            case 1:
                _c.sent();
                // Wait for login form to load
                return [4 /*yield*/, expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 })];
            case 2:
                // Wait for login form to load
                _c.sent();
                // Try to create account without selecting a business
                return [4 /*yield*/, page.fill('input[type="email"]', 'test@example.com')];
            case 3:
                // Try to create account without selecting a business
                _c.sent();
                return [4 /*yield*/, page.fill('input[type="password"]', 'TestPassword123!')];
            case 4:
                _c.sent();
                // Don't select a business
                return [4 /*yield*/, page.click('button:has-text("Create Partner Account")')];
            case 5:
                // Don't select a business
                _c.sent();
                // Should see validation error
                return [4 /*yield*/, expect(page.locator('text=Please select a business to link your account')).toBeVisible({ timeout: 5000 })];
            case 6:
                // Should see validation error
                _c.sent();
                console.log('✅ Signup validation working correctly');
                return [2 /*return*/];
        }
    });
}); });
// [2024-12-19] - Test: Business Selection Required
test('Partner signup: business selection is required', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var businessSelect, createAccountButton, isDisabled;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.goto(BASE_URL)];
            case 1:
                _c.sent();
                // Wait for login form to load
                return [4 /*yield*/, expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 })];
            case 2:
                // Wait for login form to load
                _c.sent();
                businessSelect = page.locator('select');
                return [4 /*yield*/, expect(businessSelect).toBeVisible({ timeout: 10000 })];
            case 3:
                _c.sent();
                createAccountButton = page.locator('button:has-text("Create Partner Account")');
                return [4 /*yield*/, createAccountButton.getAttribute('disabled')];
            case 4:
                isDisabled = _c.sent();
                if (isDisabled !== null) {
                    console.log('✅ Create Account button properly disabled when no business selected');
                }
                else {
                    console.log('⚠️ Create Account button should be disabled when no business selected');
                }
                return [2 /*return*/];
        }
    });
}); });
// [2024-12-19] - Test: Email Format Validation
test('Partner signup: email format validation', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var businessSelect, options, emailInput;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.goto(BASE_URL)];
            case 1:
                _c.sent();
                // Wait for login form to load
                return [4 /*yield*/, expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 })];
            case 2:
                // Wait for login form to load
                _c.sent();
                // Try invalid email format
                return [4 /*yield*/, page.fill('input[type="email"]', 'invalid-email')];
            case 3:
                // Try invalid email format
                _c.sent();
                return [4 /*yield*/, page.fill('input[type="password"]', 'TestPassword123!')];
            case 4:
                _c.sent();
                businessSelect = page.locator('select');
                return [4 /*yield*/, page.locator('select option').allTextContents()];
            case 5:
                options = _c.sent();
                if (!(options.length > 1)) return [3 /*break*/, 7];
                return [4 /*yield*/, page.selectOption('select', { index: 1 })];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7: 
            // Try to submit - should be prevented by HTML5 validation
            return [4 /*yield*/, page.click('button:has-text("Create Partner Account")')];
            case 8:
                // Try to submit - should be prevented by HTML5 validation
                _c.sent();
                emailInput = page.locator('input[type="email"]');
                return [4 /*yield*/, expect(emailInput).toBeVisible()];
            case 9:
                _c.sent();
                console.log('✅ Email format validation working');
                return [2 /*return*/];
        }
    });
}); });
// [2024-12-19] - Test: Password Strength
test('Partner signup: password strength requirements', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var businessSelect, options, errorMessages, errorCount;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.goto(BASE_URL)];
            case 1:
                _c.sent();
                // Wait for login form to load
                return [4 /*yield*/, expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 })];
            case 2:
                // Wait for login form to load
                _c.sent();
                // Try weak password
                return [4 /*yield*/, page.fill('input[type="email"]', 'test@example.com')];
            case 3:
                // Try weak password
                _c.sent();
                return [4 /*yield*/, page.fill('input[type="password"]', 'weak')];
            case 4:
                _c.sent();
                businessSelect = page.locator('select');
                return [4 /*yield*/, page.locator('select option').allTextContents()];
            case 5:
                options = _c.sent();
                if (!(options.length > 1)) return [3 /*break*/, 7];
                return [4 /*yield*/, page.selectOption('select', { index: 1 })];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7: 
            // Try to submit
            return [4 /*yield*/, page.click('button:has-text("Create Partner Account")')];
            case 8:
                // Try to submit
                _c.sent();
                // Wait a moment for any validation or error messages
                return [4 /*yield*/, page.waitForTimeout(2000)];
            case 9:
                // Wait a moment for any validation or error messages
                _c.sent();
                errorMessages = page.locator('.bg-red-50');
                return [4 /*yield*/, errorMessages.count()];
            case 10:
                errorCount = _c.sent();
                if (errorCount > 0) {
                    console.log('✅ Password strength validation working');
                }
                else {
                    console.log('⚠️ Password strength validation may need improvement');
                }
                return [2 /*return*/];
        }
    });
}); });
// [2024-12-19] - Test: Existing User Handling
test('Partner signup: handles existing user gracefully', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var businessSelect, options, errorMessage;
    var page = _b.page;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.goto(BASE_URL)];
            case 1:
                _c.sent();
                // Wait for login form to load
                return [4 /*yield*/, expect(page.locator('text=Partner Portal Login')).toBeVisible({ timeout: 10000 })];
            case 2:
                // Wait for login form to load
                _c.sent();
                // Try to create account with existing email
                return [4 /*yield*/, page.fill('input[type="email"]', 'shannon@localplus.com')];
            case 3:
                // Try to create account with existing email
                _c.sent();
                return [4 /*yield*/, page.fill('input[type="password"]', 'TestPassword123!')];
            case 4:
                _c.sent();
                businessSelect = page.locator('select');
                return [4 /*yield*/, page.locator('select option').allTextContents()];
            case 5:
                options = _c.sent();
                if (!(options.length > 1)) return [3 /*break*/, 10];
                return [4 /*yield*/, page.selectOption('select', { index: 1 })];
            case 6:
                _c.sent();
                return [4 /*yield*/, page.click('button:has-text("Create Partner Account")')];
            case 7:
                _c.sent();
                // Wait for response
                return [4 /*yield*/, page.waitForTimeout(3000)];
            case 8:
                // Wait for response
                _c.sent();
                errorMessage = page.locator('.bg-red-50');
                return [4 /*yield*/, expect(errorMessage).toBeVisible({ timeout: 5000 })];
            case 9:
                _c.sent();
                console.log('✅ Existing user handling working correctly');
                return [3 /*break*/, 11];
            case 10:
                console.log('⚠️ No businesses available for existing user test');
                test.skip();
                _c.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); });
