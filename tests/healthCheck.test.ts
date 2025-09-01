// [2024-07-29] - Comprehensive tests for health check system
// This ensures our validation systems are working correctly and catch regressions

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  performHealthCheck, 
  quickHealthCheck, 
  fullHealthCheck, 
  developmentHealthCheck,
  logHealthCheckResult 
} from '../shared/services/healthCheck';

// Mock the validation utilities
vi.mock('../shared/utils/validation', () => ({
  validateAllMockData: vi.fn(),
  validateEnvironmentVariables: vi.fn()
}));

// Mock Supabase client
vi.mock('../shared/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    })),
    auth: {
      getSession: vi.fn()
    }
  }
}));

// Mock environment variables
const mockEnv = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-key',
  NODE_ENV: 'development'
};

describe('Health Check System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    Object.defineProperty(import.meta, 'env', {
      value: mockEnv,
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('performHealthCheck', () => {
    it('should return healthy status when all checks pass', async () => {
      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(true);
      expect(result.checks).toHaveProperty('environment');
      expect(result.checks).toHaveProperty('database');
      expect(result.checks).toHaveProperty('auth');
      expect(result.checks).toHaveProperty('mockData');
    });

    it('should return unhealthy status when environment check fails', async () => {
      // Mock environment validation failure
      const { validateEnvironmentVariables } = await import('../shared/utils/validation');
      vi.mocked(validateEnvironmentVariables).mockResolvedValue({
        isValid: false,
        errors: ['Missing VITE_SUPABASE_URL']
      });

      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.environment.isHealthy).toBe(false);
      expect(result.checks.environment.errors).toContain('Missing VITE_SUPABASE_URL');
    });

    it('should return unhealthy status when database check fails', async () => {
      // Mock database failure
      const { supabase } = await import('../shared/services/supabase');
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Connection failed' } }))
        }))
      } as any);

      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.database.isHealthy).toBe(false);
      expect(result.checks.database.errors).toContain('Connection failed');
    });

    it('should return unhealthy status when auth check fails', async () => {
      // Mock auth failure
      const { supabase } = await import('../shared/services/supabase');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: null, error: { message: 'Auth service unavailable' } });

      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.auth.isHealthy).toBe(false);
      expect(result.checks.auth.errors).toContain('Auth service unavailable');
    });

    it('should return unhealthy status when mock data validation fails', async () => {
      // Mock mock data validation failure
      const { validateAllMockData } = await import('../shared/utils/validation');
      vi.mocked(validateAllMockData).mockResolvedValue({
        isValid: false,
        errors: ['Invalid UUID format in restaurant data']
      });

      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.mockData.isHealthy).toBe(false);
      expect(result.checks.mockData.errors).toContain('Invalid UUID format in restaurant data');
    });
  });

  describe('quickHealthCheck', () => {
    it('should perform only essential checks', async () => {
      const result = await quickHealthCheck();
      
      expect(result.isHealthy).toBeDefined();
      expect(result.checks).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should be faster than full health check', async () => {
      const startTime = Date.now();
      await quickHealthCheck();
      const quickTime = Date.now() - startTime;

      const fullStartTime = Date.now();
      await fullHealthCheck();
      const fullTime = Date.now() - fullStartTime;

      expect(quickTime).toBeLessThan(fullTime);
    });
  });

  describe('fullHealthCheck', () => {
    it('should perform comprehensive validation', async () => {
      const result = await fullHealthCheck();
      
      expect(result.isHealthy).toBeDefined();
      expect(result.checks).toHaveProperty('environment');
      expect(result.checks).toHaveProperty('database');
      expect(result.checks).toHaveProperty('auth');
      expect(result.checks).toHaveProperty('mockData');
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  describe('developmentHealthCheck', () => {
    it('should be optimized for development environment', async () => {
      const result = await developmentHealthCheck();
      
      expect(result.isHealthy).toBeDefined();
      expect(result.checks).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should handle development-specific issues gracefully', async () => {
      // Mock a development-specific issue
      const { validateEnvironmentVariables } = await import('../shared/utils/validation');
      vi.mocked(validateEnvironmentVariables).mockResolvedValue({
        isValid: false,
        errors: ['Development environment not configured']
      });

      const result = await developmentHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.environment.errors).toContain('Development environment not configured');
    });
  });

  describe('logHealthCheckResult', () => {
    it('should log healthy results correctly', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const healthyResult = {
        isHealthy: true,
        checks: {
          environment: { isHealthy: true, errors: [] },
          database: { isHealthy: true, errors: [] },
          auth: { isHealthy: true, errors: [] },
          mockData: { isHealthy: true, errors: [] }
        },
        timestamp: new Date().toISOString(),
        duration: 100
      };

      logHealthCheckResult(healthyResult);

      expect(consoleSpy).toHaveBeenCalledWith('✅ Health Check Result: HEALTHY');
      expect(consoleSpy).toHaveBeenCalledWith('⏱️  Duration: 100ms');
    });

    it('should log unhealthy results with detailed errors', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      const unhealthyResult = {
        isHealthy: false,
        checks: {
          environment: { isHealthy: false, errors: ['Missing API key'] },
          database: { isHealthy: true, errors: [] },
          auth: { isHealthy: true, errors: [] },
          mockData: { isHealthy: true, errors: [] }
        },
        timestamp: new Date().toISOString(),
        duration: 150
      };

      logHealthCheckResult(unhealthyResult);

      expect(consoleSpy).toHaveBeenCalledWith('❌ Health Check Result: UNHEALTHY');
      expect(consoleSpy).toHaveBeenCalledWith('⚠️  Environment Issues: Missing API key');
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Mock an unexpected error
      const { supabase } = await import('../shared/services/supabase');
      vi.mocked(supabase.from).mockImplementation(() => {
        throw new Error('Unexpected database error');
      });

      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.database.isHealthy).toBe(false);
      expect(result.checks.database.errors).toContain('Unexpected database error');
    });

    it('should continue checking other systems when one fails', async () => {
      // Mock environment failure but database success
      const { validateEnvironmentVariables } = await import('../shared/utils/validation');
      vi.mocked(validateEnvironmentVariables).mockResolvedValue({
        isValid: false,
        errors: ['Environment check failed']
      });

      const result = await performHealthCheck();
      
      expect(result.isHealthy).toBe(false);
      expect(result.checks.environment.isHealthy).toBe(false);
      expect(result.checks.database.isHealthy).toBe(true);
      expect(result.checks.auth.isHealthy).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should complete health checks within reasonable time', async () => {
      const startTime = Date.now();
      const result = await performHealthCheck();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      expect(result.duration).toBeGreaterThan(0);
      expect(result.duration).toBeLessThan(5000);
    });

    it('should handle concurrent health checks', async () => {
      const promises = [
        performHealthCheck(),
        performHealthCheck(),
        performHealthCheck()
      ];

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.isHealthy).toBeDefined();
        expect(result.timestamp).toBeDefined();
      });
    });
  });
});
