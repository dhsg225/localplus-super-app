// [2024-07-29] - Created automated health check service to catch issues early
// This service validates critical system components before the app starts

import { supabase } from './supabase';
import { validateEnvironmentVariables, logValidationErrors } from '../utils/validation';

export interface HealthCheckResult {
  isHealthy: boolean;
  checks: {
    environment: { passed: boolean; errors: string[] };
    database: { passed: boolean; errors: string[] };
    authentication: { passed: boolean; errors: string[] };
    mockData: { passed: boolean; errors: string[] };
  };
  summary: string;
  timestamp: string;
}

export interface HealthCheckOptions {
  skipDatabase?: boolean;
  skipAuthentication?: boolean;
  skipMockData?: boolean;
  verbose?: boolean;
}

/**
 * Performs comprehensive health checks on the application
 * @param options - Configuration options for health checks
 * @returns HealthCheckResult with detailed status
 */
export const performHealthCheck = async (options: HealthCheckOptions = {}): Promise<HealthCheckResult> => {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    isHealthy: true,
    checks: {
      environment: { passed: false, errors: [] },
      database: { passed: false, errors: [] },
      authentication: { passed: false, errors: [] },
      mockData: { passed: false, errors: [] }
    },
    summary: '',
    timestamp: new Date().toISOString()
  };

  console.log('🏥 Starting application health check...');

  // 1. Environment Variables Check
  try {
    const envValidation = validateEnvironmentVariables();
    result.checks.environment = {
      passed: envValidation.isValid,
      errors: envValidation.errors
    };
    
    if (options.verbose) {
      logValidationErrors(envValidation, 'Environment Variables');
    }
    
    if (!envValidation.isValid) {
      result.isHealthy = false;
    }
  } catch (error) {
    result.checks.environment.errors.push(`Health check failed: ${error}`);
    result.isHealthy = false;
  }

  // 2. Database Connectivity Check
  if (!options.skipDatabase) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('count')
        .limit(1)
        .timeout(5000); // 5 second timeout
      
      if (error) {
        result.checks.database.errors.push(`Database connection failed: ${error.message}`);
        result.isHealthy = false;
      } else {
        result.checks.database.passed = true;
        if (options.verbose) {
          console.log('✅ Database connectivity check passed');
        }
      }
    } catch (error) {
      result.checks.database.errors.push(`Database health check failed: ${error}`);
      result.isHealthy = false;
    }
  } else {
    result.checks.database.passed = true; // Skipped
  }

  // 3. Authentication Service Check
  if (!options.skipAuthentication) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        result.checks.authentication.errors.push(`Auth service check failed: ${error.message}`);
        result.isHealthy = false;
      } else {
        result.checks.authentication.passed = true;
        if (options.verbose) {
          console.log('✅ Authentication service check passed');
        }
      }
    } catch (error) {
      result.checks.authentication.errors.push(`Auth health check failed: ${error}`);
      result.isHealthy = false;
    }
  } else {
    result.checks.authentication.passed = true; // Skipped
  }

  // 4. Mock Data Validation Check
  if (!options.skipMockData) {
    try {
      // Check if we're in development mode and validate mock data
      const devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
      if (devUserRaw) {
        // Import validation utilities dynamically to avoid circular dependencies
        const { validateAllMockData } = await import('../utils/validation');
        
        // Create sample mock data for validation
        const sampleMockData = {
          restaurants: [{
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: "Test Restaurant",
            category_id: 'steakhouse',
            address: '123 Test St',
            latitude: 35.7796,
            longitude: -80.8882,
            partnership_status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        };
        
        const mockValidation = validateAllMockData(sampleMockData);
        result.checks.mockData = {
          passed: mockValidation.isValid,
          errors: mockValidation.errors
        };
        
        if (options.verbose) {
          logValidationErrors(mockValidation, 'Mock Data Validation');
        }
        
        if (!mockValidation.isValid) {
          result.isHealthy = false;
        }
      } else {
        result.checks.mockData.passed = true; // Not in dev mode
      }
    } catch (error) {
      result.checks.mockData.errors.push(`Mock data validation failed: ${error}`);
      result.isHealthy = false;
    }
  } else {
    result.checks.mockData.passed = true; // Skipped
  }

  // Generate summary
  const totalChecks = Object.keys(result.checks).length;
  const passedChecks = Object.values(result.checks).filter(check => check.passed).length;
  const failedChecks = totalChecks - passedChecks;
  
  result.summary = `${passedChecks}/${totalChecks} health checks passed`;
  
  if (result.isHealthy) {
    result.summary += ' - System is healthy';
  } else {
    result.summary += ` - ${failedChecks} check(s) failed`;
  }

  const duration = Date.now() - startTime;
  
  if (result.isHealthy) {
    console.log(`✅ Health check completed in ${duration}ms - ${result.summary}`);
  } else {
    console.error(`❌ Health check completed in ${duration}ms - ${result.summary}`);
    console.error('Failed checks:');
    Object.entries(result.checks).forEach(([checkName, check]) => {
      if (!check.passed && check.errors.length > 0) {
        console.error(`  • ${checkName}: ${check.errors.join(', ')}`);
      }
    });
  }

  return result;
};

/**
 * Quick health check for critical systems only
 * @returns Promise<boolean> - true if critical systems are healthy
 */
export const quickHealthCheck = async (): Promise<boolean> => {
  try {
    const result = await performHealthCheck({
      skipDatabase: false,
      skipAuthentication: true,
      skipMockData: true,
      verbose: false
    });
    return result.isHealthy;
  } catch (error) {
    console.error('Quick health check failed:', error);
    return false;
  }
};

/**
 * Comprehensive health check with all validations
 * @returns Promise<HealthCheckResult> - Detailed health status
 */
export const fullHealthCheck = async (): Promise<HealthCheckResult> => {
  return performHealthCheck({
    skipDatabase: false,
    skipAuthentication: false,
    skipMockData: false,
    verbose: true
  });
};

/**
 * Health check specifically for development environment
 * @returns Promise<HealthCheckResult> - Development-focused health status
 */
export const developmentHealthCheck = async (): Promise<HealthCheckResult> => {
  return performHealthCheck({
    skipDatabase: true, // Skip in dev to avoid network calls
    skipAuthentication: true, // Skip in dev
    skipMockData: false, // Always check mock data in dev
    verbose: true
  });
};

/**
 * Logs health check results in a user-friendly format
 * @param result - Health check result to log
 */
export const logHealthCheckResult = (result: HealthCheckResult): void => {
  console.log('\n🏥 HEALTH CHECK RESULTS');
  console.log('='.repeat(50));
  console.log(`Status: ${result.isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
  console.log(`Summary: ${result.summary}`);
  console.log(`Timestamp: ${result.timestamp}`);
  
  Object.entries(result.checks).forEach(([checkName, check]) => {
    const status = check.passed ? '✅' : '❌';
    console.log(`${status} ${checkName.charAt(0).toUpperCase() + checkName.slice(1)}: ${check.passed ? 'PASSED' : 'FAILED'}`);
    
    if (!check.passed && check.errors.length > 0) {
      check.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
  });
  
  console.log('='.repeat(50));
  
  if (!result.isHealthy) {
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('• Check your .env file for missing variables');
    console.log('• Verify Supabase connection and credentials');
    console.log('• Ensure mock data follows correct format');
    console.log('• Check network connectivity');
  }
};
