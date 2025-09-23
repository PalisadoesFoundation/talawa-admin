import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MetricType } from 'web-vitals';

// Define WebVitalsCallback type locally since 'web-vitals' does not export it
type WebVitalsCallback = (metric: MetricType) => void;

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
  let reportWebVitals: (onPerfEntry?: WebVitalsCallback) => void;

  beforeEach(async () => {
    vi.clearAllMocks();
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

  it('should not call web-vitals functions when onPerfEntry is undefined', () => {
    reportWebVitals();
    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
    expect(mockOnINP).not.toHaveBeenCalled();
    expect(mockOnLCP).not.toHaveBeenCalled();
    expect(mockOnTTFB).not.toHaveBeenCalled();
  });

  it('should not call web-vitals functions when onPerfEntry is null', () => {
    reportWebVitals(null as unknown as WebVitalsCallback);
    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
    expect(mockOnINP).not.toHaveBeenCalled();
    expect(mockOnLCP).not.toHaveBeenCalled();
    expect(mockOnTTFB).not.toHaveBeenCalled();
  });

  it('should not call web-vitals functions when onPerfEntry is not a function', () => {
    reportWebVitals('not a function' as unknown as WebVitalsCallback);
    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
    expect(mockOnINP).not.toHaveBeenCalled();
    expect(mockOnLCP).not.toHaveBeenCalled();
    expect(mockOnTTFB).not.toHaveBeenCalled();
  });

  it('should call all web-vitals functions when onPerfEntry is a valid function', async () => {
    const mockCallback = vi.fn();

    reportWebVitals(mockCallback);

    // Wait for the dynamic import and function calls
    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(
        mockCallback,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnFCP).toHaveBeenCalledWith(mockCallback);
      expect(mockOnINP).toHaveBeenCalledWith(
        mockCallback,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnLCP).toHaveBeenCalledWith(mockCallback);
      expect(mockOnTTFB).toHaveBeenCalledWith(mockCallback);
    });
  });

  it('should work with console.log as callback', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    reportWebVitals(console.log);

    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(
        console.log,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnFCP).toHaveBeenCalledWith(console.log);
      expect(mockOnINP).toHaveBeenCalledWith(
        console.log,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
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
      expect(mockOnCLS).toHaveBeenCalledWith(
        arrowCallback,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnFCP).toHaveBeenCalledWith(arrowCallback);
      expect(mockOnINP).toHaveBeenCalledWith(
        arrowCallback,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnLCP).toHaveBeenCalledWith(arrowCallback);
      expect(mockOnTTFB).toHaveBeenCalledWith(arrowCallback);
    });
  });

  it('should accept functions created via Function constructor', async () => {
    // Test with Function constructor to cover instanceof Function check
    const funcConstructor = new Function('metric', 'return metric;') as (
      metric: MetricType,
    ) => MetricType;

    reportWebVitals(funcConstructor);

    await vi.waitFor(() => {
      expect(mockOnCLS).toHaveBeenCalledWith(
        funcConstructor,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnFCP).toHaveBeenCalledWith(funcConstructor);
      expect(mockOnINP).toHaveBeenCalledWith(
        funcConstructor,
        expect.objectContaining({
          reportAllChanges: true,
        }),
      );
      expect(mockOnLCP).toHaveBeenCalledWith(funcConstructor);
      expect(mockOnTTFB).toHaveBeenCalledWith(funcConstructor);
    });
  });
});
