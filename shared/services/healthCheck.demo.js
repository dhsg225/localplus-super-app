// [2024-07-29] - Demo file to demonstrate health check functionality
// This shows how the health check catches issues early

// Mock the health check functions for demo purposes
const mockSupabase = {
  from: (table) => ({
    select: (fields) => ({
      limit: (count) => ({
        timeout: (ms) => Promise.resolve({ data: [{ count: 1 }], error: null })
      })
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null })
  }
};

const mockValidation = {
  validateEnvironmentVariables: () => ({ isValid: true, errors: [] }),
  logValidationErrors: (result, context) => {
    if (!result.isValid) {
      console.error(`❌ ${context} Validation Failed:`, result.errors);
    } else {
      console.log(`✅ ${context} Validation Passed`);
    }
  }
};

// Mock health check result interface
const createHealthCheckResult = () => ({
  isHealthy: true,
  checks: {
    environment: { passed: false, errors: [] },
    database: { passed: false, errors: [] },
    authentication: { passed: false, errors: [] },
    mockData: { passed: false, errors: [] }
  },
  summary: '',
  timestamp: new Date().toISOString()
});

// Mock health check function
const performHealthCheck = async (options = {}) => {
  const startTime = Date.now();
  const result = createHealthCheckResult();
  
  console.log('🏥 Starting application health check...');

  // 1. Environment Variables Check
  try {
    const envValidation = mockValidation.validateEnvironmentVariables();
    result.checks.environment = {
      passed: envValidation.isValid,
      errors: envValidation.errors
    };
    
    if (options.verbose) {
      mockValidation.logValidationErrors(envValidation, 'Environment Variables');
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
      const { data, error } = await mockSupabase
        .from('businesses')
        .select('count')
        .limit(1)
        .timeout(5000);
      
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
      const { data: { session }, error } = await mockSupabase.auth.getSession();
      
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
      // Simulate mock data validation
      const mockValidation = { isValid: true, errors: [] };
      result.checks.mockData = {
        passed: mockValidation.isValid,
        errors: mockValidation.errors
      };
      
      if (options.verbose) {
        mockValidation.logValidationErrors(mockValidation, 'Mock Data Validation');
      }
      
      if (!mockValidation.isValid) {
        result.isHealthy = false;
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

// Mock health check functions
const quickHealthCheck = async () => {
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

const developmentHealthCheck = async () => {
  return performHealthCheck({
    skipDatabase: true, // Skip in dev to avoid network calls
    skipAuthentication: true, // Skip in dev
    skipMockData: false, // Always check mock data in dev
    verbose: true
  });
};

const logHealthCheckResult = (result) => {
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

// Test the health check functionality
const runDemo = async () => {
  console.log('🧪 Testing Health Check System:');
  console.log('This demonstrates how the health check catches issues early\n');

  // Test quick health check
  console.log('1️⃣ Quick Health Check:');
  const quickResult = await quickHealthCheck();
  console.log(`Quick check result: ${quickResult ? '✅ PASSED' : '❌ FAILED'}\n`);

  // Test development health check
  console.log('2️⃣ Development Health Check:');
  const devResult = await developmentHealthCheck();
  logHealthCheckResult(devResult);

  console.log('\n✅ Health check demo complete!');
  console.log('This system will help catch issues before they cause runtime failures.');
  console.log('\n🔧 Key Benefits:');
  console.log('• Validates environment variables on startup');
  console.log('• Tests database connectivity');
  console.log('• Checks authentication services');
  console.log('• Validates mock data format');
  console.log('• Provides clear error messages and recommendations');
  console.log('• Prevents white screen crashes');
};

// Run the demo
runDemo().catch(console.error);
