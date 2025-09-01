// [2024-07-29] - Created comprehensive validation utilities to prevent mock data and UUID format errors
// This utility helps catch data format issues before they cause runtime errors

/**
 * Validates if a string is a valid UUID format
 * @param uuid - The string to validate
 * @returns boolean indicating if the UUID is valid
 */
export const isValidUUID = (uuid: string): boolean => {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Generates a valid UUID for development purposes
 * @returns A valid UUID string
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Validates a restaurant object against the Restaurant interface
 * @param restaurant - The restaurant object to validate
 * @returns Validation result with errors array
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateRestaurant = (restaurant: any): ValidationResult => {
  const errors: string[] = [];

  // Handle null/undefined cases
  if (!restaurant) {
    errors.push('Restaurant object is required');
    return {
      isValid: false,
      errors
    };
  }

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

/**
 * Validates a booking object
 * @param booking - The booking object to validate
 * @returns Validation result with errors array
 */
export const validateBooking = (booking: any): ValidationResult => {
  const errors: string[] = [];

  if (!booking.id) {
    errors.push('Booking ID is required');
  } else if (!isValidUUID(booking.id)) {
    errors.push(`Invalid UUID format: ${booking.id}`);
  }

  if (!booking.business_id) {
    errors.push('Business ID is required');
  } else if (!isValidUUID(booking.business_id)) {
    errors.push(`Invalid UUID format: ${booking.business_id}`);
  }

  if (!booking.customer_id) {
    errors.push('Customer ID is required');
  } else if (!isValidUUID(booking.customer_id)) {
    errors.push(`Invalid UUID format: ${booking.customer_id}`);
  }

  if (!booking.booking_date) {
    errors.push('Booking date is required');
  } else if (isNaN(Date.parse(booking.booking_date))) {
    errors.push('Booking date must be a valid date');
  }

  if (!booking.booking_time) {
    errors.push('Booking time is required');
  }

  if (typeof booking.party_size !== 'number' || isNaN(booking.party_size)) {
    errors.push('Party size must be a valid number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates environment variables
 * @returns Validation result with errors array
 */
export const validateEnvironmentVariables = (): ValidationResult => {
  const errors: string[] = [];

  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  requiredVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value) {
      errors.push(`Missing environment variable: ${varName}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Comprehensive validation for all mock data
 * @param mockData - Object containing all mock data
 * @returns Validation result with errors array
 */
export const validateAllMockData = (mockData: any): ValidationResult => {
  const errors: string[] = [];

  // Validate restaurants
  if (mockData.restaurants) {
    mockData.restaurants.forEach((restaurant: any, index: number) => {
      const result = validateRestaurant(restaurant);
      if (!result.isValid) {
        errors.push(`Restaurant ${index}: ${result.errors.join(', ')}`);
      }
    });
  }

  // Validate bookings
  if (mockData.bookings) {
    mockData.bookings.forEach((booking: any, index: number) => {
      const result = validateBooking(booking);
      if (!result.isValid) {
        errors.push(`Booking ${index}: ${result.errors.join(', ')}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Logs validation errors in a developer-friendly format
 * @param result - Validation result
 * @param context - Context for the validation (e.g., "Mock Data", "Environment Variables")
 */
export const logValidationErrors = (result: ValidationResult, context: string): void => {
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

/**
 * Development helper: Validates and fixes common mock data issues
 * @param mockData - The mock data to validate and potentially fix
 * @returns The validated/fixed mock data
 */
export const validateAndFixMockData = (mockData: any): any => {
  const result = validateAllMockData(mockData);
  
  if (!result.isValid) {
    console.warn('⚠️  Mock data validation failed. Attempting to fix common issues...');
    
    // Fix UUID issues
    if (mockData.restaurants) {
      mockData.restaurants.forEach((restaurant: any) => {
        if (restaurant.id && !isValidUUID(restaurant.id)) {
          console.log(`🔄 Fixing invalid UUID: ${restaurant.id} → ${generateUUID()}`);
          restaurant.id = generateUUID();
        }
      });
    }
    
    // Re-validate after fixes
    const fixedResult = validateAllMockData(mockData);
    if (fixedResult.isValid) {
      console.log('✅ Mock data fixed and now passes validation');
    } else {
      console.error('❌ Some issues could not be automatically fixed:', fixedResult.errors);
    }
  }
  
  return mockData;
};
