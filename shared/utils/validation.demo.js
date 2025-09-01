// [2024-07-29] - Demo file to demonstrate validation utility functionality
// This shows how the validation catches common mock data issues

// Mock the validation functions for demo purposes
const isValidUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const validateRestaurant = (restaurant) => {
  const errors = [];

  // Check required fields
  if (!restaurant.id) {
    errors.push('Restaurant ID is required');
  } else if (!isValidUUID(restaurant.id)) {
    errors.push(`Invalid UUID format: ${restaurant.id}`);
  }

  if (!restaurant.name) {
    errors.push('Restaurant name is required');
  }

  if (!restaurant.category_id) {
    errors.push('Category ID is required');
  }

  if (!restaurant.address) {
    errors.push('Address is required');
  }

  if (typeof restaurant.latitude !== 'number' || isNaN(restaurant.latitude)) {
    errors.push('Latitude must be a valid number');
  }

  if (typeof restaurant.longitude !== 'number' || isNaN(restaurant.longitude)) {
    errors.push('Longitude must be a valid number');
  }

  if (!restaurant.partnership_status) {
    errors.push('Partnership status is required');
  } else if (!['pending', 'active', 'suspended'].includes(restaurant.partnership_status)) {
    errors.push(`Invalid partnership status: ${restaurant.partnership_status}`);
  }

  if (!restaurant.created_at) {
    errors.push('Created at date is required');
  } else if (isNaN(Date.parse(restaurant.created_at))) {
    errors.push('Created at must be a valid date');
  }

  if (!restaurant.updated_at) {
    errors.push('Updated at date is required');
  } else if (isNaN(Date.parse(restaurant.updated_at))) {
    errors.push('Updated at must be a valid date');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const logValidationErrors = (result, context) => {
  if (!result.isValid) {
    console.error(`❌ ${context} Validation Failed:`);
    result.errors.forEach(error => {
      console.error(`   • ${error}`);
    });
    console.error(`\n🔧 Fix these issues to prevent runtime errors.\n`);
  } else {
    console.log(`✅ ${context} Validation Passed`);
  }
};

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

console.log('\n✅ Validation utility demo complete!');
console.log('This utility will help catch mock data issues before they cause runtime errors.');
console.log('\n🔧 Key Benefits:');
console.log('• Catches UUID format errors early');
console.log('• Validates required fields');
console.log('• Checks data types (numbers, dates)');
console.log('• Provides clear error messages');
console.log('• Prevents runtime crashes from invalid data');
