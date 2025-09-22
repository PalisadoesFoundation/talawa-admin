import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MetricType } from 'web-vitals';

// Mock the web-vitals module
const mocks = vi.hoisted(() => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}));
vi.mock('web-vitals', () => mocks);
const {
  onCLS: mockOnCLS,
  onFCP: mockOnFCP,
  onINP: mockOnINP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
} = mocks;

describe('reportWebVitals', () => {
  let reportWebVitals: (onPerfEntry?: (metric: MetricType) => void) => void;

beforeEach(async () => {
  // Clear all mocks before each test
  vi.clearAllMocks();

  // Dynamically import the module to ensure fresh imports
  vi.resetModules();
  const module = await import('./reportWebVitals');
  reportWebVitals = module.default;
});

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(reportWebVitals).toBeDefined();
    expect(typeof reportWebVitals).toBe('function');
  });

  it('should not call web-vitals functions when onPerfEntry is undefined', async () => {
    reportWebVitals();

    // Wait for any async operations
    await vi.waitFor(() => {
      expect(mockOnCLS).not.toHaveBeenCalled();
      expect(mockOnFCP).not.toHaveBeenCalled();
      expect(mockOnLCP).not.toHaveBeenCalled();
      expect(mockOnTTFB).not.toHaveBeenCalled();
    });
  });

  it('should not call web-vitals functions when onPerfEntry is null', async () => {
    reportWebVitals(null as unknown as (metric: MetricType) => void);

    // Wait for any async operations
    await vi.waitFor(() => {
      expect(mockOnCLS).not.toHaveBeenCalled();
      expect(mockOnFCP).not.toHaveBeenCalled();
      expect(mockOnLCP).not.toHaveBeenCalled();
      expect(mockOnTTFB).not.toHaveBeenCalled();
    });
  });

  it('should not call web-vitals functions when onPerfEntry is not a function', async () => {
    reportWebVitals(
      'not a function' as unknown as (metric: MetricType) => void,
    );

    // Wait for any async operations
    await vi.waitFor(() => {
      expect(mockOnCLS).not.toHaveBeenCalled();
      expect(mockOnFCP).not.toHaveBeenCalled();
      expect(mockOnLCP).not.toHaveBeenCalled();
      expect(mockOnTTFB).not.toHaveBeenCalled();
    });
  });

  it('should call all web-vitals functions when onPerfEntry is a valid function', async () => {
    const mockCallback = vi.fn();

    reportWebVitals(mockCallback);

    // Wait for the dynamic import and function calls
    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(mockCallback);
      expect(mockOnFCP).toHaveBeenCalledWith(mockCallback);
      expect(mockOnLCP).toHaveBeenCalledWith(mockCallback);
      expect(mockOnTTFB).toHaveBeenCalledWith(mockCallback);
    });
  });

  it('should work with console.log as callback', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    reportWebVitals(console.log);

    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(console.log);
      expect(mockOnFCP).toHaveBeenCalledWith(console.log);
      expect(mockOnINP).toHaveBeenCalledWith(console.log);
      expect(mockOnLCP).toHaveBeenCalledWith(console.log);
      expect(mockOnTTFB).toHaveBeenCalledWith(console.log);
    });

    consoleSpy.mockRestore();
  });

  it('should work with arrow function callback', async () => {
    const arrowCallback = () => {
      // Mock implementation
    };

    reportWebVitals(arrowCallback);

    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(arrowCallback);
      expect(mockOnFCP).toHaveBeenCalledWith(arrowCallback);
      expect(mockOnINP).toHaveBeenCalledWith(arrowCallback);
      expect(mockOnLCP).toHaveBeenCalledWith(arrowCallback);
      expect(mockOnTTFB).toHaveBeenCalledWith(arrowCallback);
    });
  });

  it('should handle Function constructor instances', async () => {
    // Test with Function constructor to cover instanceof Function check
    const funcConstructor = new Function('metric', 'return metric;') as (
      metric: MetricType,
    ) => MetricType;

    reportWebVitals(funcConstructor);

    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(funcConstructor);
      expect(mockOnFCP).toHaveBeenCalledWith(funcConstructor);
      expect(mockOnINP).toHaveBeenCalledWith(funcConstructor);
      expect(mockOnLCP).toHaveBeenCalledWith(funcConstructor);
      expect(mockOnTTFB).toHaveBeenCalledWith(funcConstructor);
    });
  });
});
