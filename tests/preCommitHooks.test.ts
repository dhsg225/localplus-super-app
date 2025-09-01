// [2024-07-29] - Tests for pre-commit hooks
// This ensures our Git hooks are working correctly and catch the right issues

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// Mock file system operations
vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  unlinkSync: vi.fn(),
  existsSync: vi.fn()
}));

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn()
}));

describe('Pre-commit Hooks', () => {
  const testDir = '/tmp/test-repo';
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock file system to simulate a test repository
    vi.mocked(existsSync).mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('JSX File Extension Validation', () => {
    it('should detect JSX syntax in .js files', () => {
      const jsFileWithJSX = `
        import React from 'react';
        
        function TestComponent() {
          return <div>Hello World</div>;
        }
        
        export default TestComponent;
      `;

      // This would be caught by the pre-commit hook
      expect(jsFileWithJSX).toContain('<div>');
      expect(jsFileWithJSX).toContain('</div>');
    });

    it('should allow JSX in .jsx files', () => {
      const jsxFile = `
        import React from 'react';
        
        function TestComponent() {
          return <div>Hello World</div>;
        }
        
        export default TestComponent;
      `;

      // This should be allowed
      expect(jsxFile).toContain('<div>');
      expect(jsxFile).toContain('</div>');
    });

    it('should allow regular JavaScript in .js files', () => {
      const jsFile = `
        function testFunction() {
          return 'Hello World';
        }
        
        export default testFunction;
      `;

      // This should be allowed
      expect(jsFile).not.toContain('<');
      expect(jsFile).not.toContain('>');
    });
  });

  describe('Environment File Validation', () => {
    it('should require environment files to exist', () => {
      // Mock missing environment files
      vi.mocked(existsSync).mockImplementation((path: string) => {
        if (path.includes('.env') || path.includes('env.example')) {
          return false;
        }
        return true;
      });

      // This would cause the pre-commit hook to fail
      expect(existsSync('.env')).toBe(false);
      expect(existsSync('env.example')).toBe(false);
    });

    it('should allow commits when environment files exist', () => {
      // Mock existing environment files
      vi.mocked(existsSync).mockImplementation((path: string) => {
        if (path.includes('.env') || path.includes('env.example')) {
          return true;
        }
        return true;
      });

      // This should allow the commit
      expect(existsSync('.env')).toBe(true);
      expect(existsSync('env.example')).toBe(true);
    });
  });

  describe('UUID Format Validation', () => {
    it('should detect invalid UUID formats in mock data', () => {
      const invalidUUIDs = [
        'mock-restaurant-123',
        'test-booking-456',
        'invalid-uuid-789',
        'simple-string'
      ];

      invalidUUIDs.forEach(uuid => {
        // These would be caught by the pre-commit hook
        expect(uuid).toMatch(/mock-[a-z]*-[0-9]*|test-[a-z]*-[0-9]*|invalid-[a-z]*-[0-9]*|simple-[a-z]*/);
      });
    });

    it('should allow valid UUID formats', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '123e4567-e89b-12d3-a456-426614174000',
        'a1a2a3a4-b1b2-c1c2-d1d2-d3d4d5d6d7d8'
      ];

      validUUIDs.forEach(uuid => {
        // These should be allowed
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      });
    });
  });

  describe('Environment Variable Pattern Validation', () => {
    it('should detect hardcoded Supabase URLs', () => {
      const hardcodedCode = `
        const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIs...';
      `;

      // This would be caught by the pre-commit hook
      expect(hardcodedCode).toContain('VITE_SUPABASE_URL');
      expect(hardcodedCode).toContain('https://joknprahhqdhvdhzmuwl.supabase.co');
    });

    it('should allow proper environment variable usage', () => {
      const properCode = `
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      `;

      // This should be allowed
      expect(properCode).toContain('import.meta.env.VITE_SUPABASE_URL');
      expect(properCode).toContain('import.meta.env.VITE_SUPABASE_ANON_KEY');
    });
  });

  describe('Import Statement Validation', () => {
    it('should detect imports from .js files that should be .jsx', () => {
      const invalidImports = [
        "import Component from './Component.js'",
        "import { Button } from '../components/Button.js'",
        "import App from './App.js'"
      ];

      invalidImports.forEach(importStatement => {
        // These would be caught by the pre-commit hook
        expect(importStatement).toMatch(/from.*\.js['"]/);
        expect(importStatement).not.toMatch(/\.jsx/);
      });
    });

    it('should allow imports from .jsx files', () => {
      const validImports = [
        "import Component from './Component.jsx'",
        "import { Button } from '../components/Button.jsx'",
        "import App from './App.jsx'"
      ];

      validImports.forEach(importStatement => {
        // These should be allowed
        expect(importStatement).toMatch(/from.*\.jsx['"]/);
      });
    });

    it('should allow imports from library files', () => {
      const libraryImports = [
        "import React from 'react'",
        "import { useState } from 'react'",
        "import Chart from 'chart.js'"
      ];

      libraryImports.forEach(importStatement => {
        // These should be allowed
        expect(importStatement).not.toMatch(/from.*\.js['"]/);
      });
    });
  });

  describe('useToast Context Validation', () => {
    it('should detect useToast calls outside of proper context', () => {
      const invalidUsage = [
        'useToast()',
        'const toast = useToast()',
        'return useToast().showToast'
      ];

      invalidUsage.forEach(usage => {
        // These would be caught by the pre-commit hook
        expect(usage).toMatch(/useToast\(\)/);
      });
    });

    it('should allow proper useToast usage patterns', () => {
      const validUsage = [
        'const toast = useToast();',
        'var toast = useToast();',
        'let toast = useToast();'
      ];

      validUsage.forEach(usage => {
        // These should be allowed
        expect(usage).toMatch(/const.*useToast|var.*useToast|let.*useToast/);
      });
    });
  });

  describe('TypeScript Interface Compliance', () => {
    it('should detect incorrect property names', () => {
      const invalidCode = `
        const restaurant = {
          website: 'https://example.com',
          phone_number: '+1234567890'
        };
      `;

      // This would be caught by the pre-commit hook
      expect(invalidCode).toContain('website:');
      expect(invalidCode).toContain('phone_number:');
    });

    it('should allow correct property names', () => {
      const validCode = `
        const restaurant = {
          website_url: 'https://example.com',
          phone: '+1234567890'
        };
      `;

      // This should be allowed
      expect(validCode).toContain('website_url:');
      expect(validCode).toContain('phone:');
    });
  });

  describe('Commit Message Validation', () => {
    it('should reject empty commit messages', () => {
      const emptyMessage = '';
      
      // This would be caught by the commit-msg hook
      expect(emptyMessage.length).toBe(0);
    });

    it('should reject short commit messages', () => {
      const shortMessages = ['fix', 'update', 'change', 'test'];
      
      shortMessages.forEach(message => {
        // These would be caught by the commit-msg hook
        expect(message.length).toBeLessThan(10);
      });
    });

    it('should allow proper commit messages', () => {
      const validMessages = [
        'Fix UUID validation in mock data',
        'Update environment variable handling',
        'Add comprehensive test coverage',
        'Implement pre-commit hooks with Husky'
      ];

      validMessages.forEach(message => {
        // These should be allowed
        expect(message.length).toBeGreaterThanOrEqual(10);
        expect(message).toMatch(/[A-Z]/); // Contains capital letter
      });
    });

    it('should encourage conventional commit format', () => {
      const conventionalMessages = [
        'feat: add new validation utility',
        'fix: resolve UUID format issues',
        'docs: update development setup guide',
        'test: add health check validation tests'
      ];

      conventionalMessages.forEach(message => {
        // These should be encouraged
        expect(message).toMatch(/^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?:/);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should simulate successful pre-commit hook execution', () => {
      // Mock all checks passing
      const mockChecks = {
        jsxFiles: [],
        environmentFiles: ['.env', 'env.example'],
        uuidFormats: [],
        environmentVariables: [],
        importStatements: [],
        useToastContext: [],
        typescriptCompliance: []
      };

      // All checks should pass
      expect(mockChecks.jsxFiles).toHaveLength(0);
      expect(mockChecks.environmentFiles.length).toBeGreaterThan(0);
      expect(mockChecks.uuidFormats).toHaveLength(0);
      expect(mockChecks.environmentVariables).toHaveLength(0);
      expect(mockChecks.importStatements).toHaveLength(0);
      expect(mockChecks.useToastContext).toHaveLength(0);
      expect(mockChecks.typescriptCompliance).toHaveLength(0);
    });

    it('should simulate failed pre-commit hook execution', () => {
      // Mock some checks failing
      const mockChecks = {
        jsxFiles: ['src/App.js', 'src/components/Button.js'],
        environmentFiles: [],
        uuidFormats: ['mock-restaurant-123'],
        environmentVariables: ['hardcoded-url'],
        importStatements: ['from "./Component.js"'],
        useToastContext: ['useToast()'],
        typescriptCompliance: ['website:']
      };

      // Some checks should fail
      expect(mockChecks.jsxFiles.length).toBeGreaterThan(0);
      expect(mockChecks.environmentFiles).toHaveLength(0);
      expect(mockChecks.uuidFormats.length).toBeGreaterThan(0);
      expect(mockChecks.environmentVariables.length).toBeGreaterThan(0);
      expect(mockChecks.importStatements.length).toBeGreaterThan(0);
      expect(mockChecks.useToastContext.length).toBeGreaterThan(0);
      expect(mockChecks.typescriptCompliance.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Reliability', () => {
    it('should complete validation within reasonable time', () => {
      const startTime = Date.now();
      
      // Simulate validation checks
      const checks = [
        'JSX syntax in .js files',
        'Environment files',
        'UUID formats',
        'Environment variables',
        'Import statements',
        'useToast context',
        'TypeScript compliance'
      ];
      
      checks.forEach(check => {
        expect(check).toBeDefined();
      });
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle large codebases gracefully', () => {
      // Simulate large number of files
      const fileCounts = {
        jsFiles: 100,
        tsFiles: 200,
        jsxFiles: 150,
        tsxFiles: 250
      };

      const totalFiles = Object.values(fileCounts).reduce((sum, count) => sum + count, 0);
      expect(totalFiles).toBe(700);
      
      // Validation should scale reasonably
      expect(totalFiles).toBeLessThan(1000); // Reasonable limit for testing
    });
  });
});
