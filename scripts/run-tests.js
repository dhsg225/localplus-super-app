#!/usr/bin/env node

// [2024-07-29] - Test runner script for LocalPlus development safeguards
// This script runs all automated tests to ensure our validation systems are working correctly

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running LocalPlus Development Safeguards Test Suite...\n');

const tests = [
  {
    name: 'Health Check System Tests',
    command: 'npm run test:health',
    description: 'Validates health check functionality and error handling'
  },
  {
    name: 'Validation Utility Tests',
    command: 'npm run test:validation',
    description: 'Tests data validation functions and edge cases'
  },
  {
    name: 'Pre-commit Hook Tests',
    command: 'npm run test:hooks',
    description: 'Validates Git hook functionality and issue detection'
  },
  {
    name: 'Integration Tests',
    command: 'npm run test:integration',
    description: 'Tests complete safeguard system integration'
  }
];

let passedTests = 0;
let failedTests = 0;

async function runTest(test) {
  console.log(`🔍 Running: ${test.name}`);
  console.log(`   ${test.description}`);
  
  try {
    const result = execSync(test.command, { 
      stdio: 'pipe',
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log(`✅ ${test.name} - PASSED\n`);
    passedTests++;
    return true;
  } catch (error) {
    console.log(`❌ ${test.name} - FAILED`);
    console.log(`   Error: ${error.message}`);
    if (error.stdout) {
      console.log(`   Output: ${error.stdout}`);
    }
    if (error.stderr) {
      console.log(`   Errors: ${error.stderr}`);
    }
    console.log('');
    failedTests++;
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...\n');
  
  for (const test of tests) {
    await runTest(test);
  }
  
  console.log('📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Your development safeguards are working correctly.');
    console.log('   The LocalPlus project is protected against common development issues.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    console.log('   This may indicate issues with your safeguard implementations.');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('LocalPlus Development Safeguards Test Runner');
  console.log('');
  console.log('Usage: node scripts/run-tests.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --health       Run only health check tests');
  console.log('  --validation   Run only validation tests');
  console.log('  --hooks        Run only pre-commit hook tests');
  console.log('  --integration  Run only integration tests');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/run-tests.js                    # Run all tests');
  console.log('  node scripts/run-tests.js --health          # Run health check tests only');
  console.log('  node scripts/run-tests.js --validation      # Run validation tests only');
  process.exit(0);
}

// Run specific test if requested
if (args.includes('--health')) {
  const healthTest = tests.find(t => t.name.includes('Health'));
  if (healthTest) {
    runTest(healthTest).then(success => process.exit(success ? 0 : 1));
  }
} else if (args.includes('--validation')) {
  const validationTest = tests.find(t => t.name.includes('Validation'));
  if (validationTest) {
    runTest(validationTest).then(success => process.exit(success ? 0 : 1));
  }
} else if (args.includes('--hooks')) {
  const hooksTest = tests.find(t => t.name.includes('Hook'));
  if (hooksTest) {
    runTest(hooksTest).then(success => process.exit(success ? 0 : 1));
  }
} else if (args.includes('--integration')) {
  const integrationTest = tests.find(t => t.name.includes('Integration'));
  if (integrationTest) {
    runTest(integrationTest).then(success => process.exit(success ? 0 : 1));
  }
} else {
  // Run all tests
  runAllTests();
}
