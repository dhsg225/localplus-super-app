// [2024-07-29] - Test file to demonstrate validation utility functionality
// This shows how the validation catches common mock data issues

import { 
  isValidUUID, 
  generateUUID, 
  validateRestaurant, 
  validateBooking,
  validateEnvironmentVariables,
  logValidationErrors 
} from './validation';

// Test UUID validation
console.log('🧪 Testing UUID Validation:');
console.log('Valid UUID:', isValidUUID('550e8400-e29b-41d4-a716-446655440000')); // Should be true
console.log('Invalid UUID:', isValidUUID('mock-restaurant-123')); // Should be false
console.log('Generated UUID:', generateUUID()); // Should generate valid UUID

// Test restaurant validation
console.log('\n🧪 Testing Restaurant Validation:');
const validRestaurant = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: "Test Restaurant",
  category_id: 'steakhouse',
  address: '123 Test St',
  latitude: 35.7796,
  longitude: -80.8882,
  partnership_status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const invalidRestaurant = {
  id: 'invalid-id',
  name: "Test Restaurant",
  // Missing required fields
  latitude: 'not-a-number',
  longitude: 'not-a-number'
};

console.log('Valid restaurant validation:');
const validResult = validateRestaurant(validRestaurant);
logValidationErrors(validResult, 'Valid Restaurant');

console.log('Invalid restaurant validation:');
const invalidResult = validateRestaurant(invalidRestaurant);
logValidationErrors(invalidResult, 'Invalid Restaurant');

// Test environment variable validation
console.log('\n🧪 Testing Environment Variable Validation:');
const envResult = validateEnvironmentVariables();
logValidationErrors(envResult, 'Environment Variables');

console.log('\n✅ Validation utility test complete!');
console.log('This utility will help catch mock data issues before they cause runtime errors.');
