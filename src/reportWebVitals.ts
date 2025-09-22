/**
 * @fileoverview Web Vitals reporting utility for performance monitoring.
 * @description This module provides functionality to measure and report Core Web Vitals
 * including CLS, FCP, LCP, TTFB, and INP metrics using web-vitals 5.1.0.
 *
 * @see {@link https://web.dev/vitals/} - Web Vitals documentation
 * @see {@link https://github.com/GoogleChrome/web-vitals} - web-vitals library
 */

import type { MetricType } from 'web-vitals';

/**
 * Reports Core Web Vitals metrics to a callback function.
 *
 * This function dynamically imports the web-vitals library to avoid increasing
 * the bundle size for users who don't need performance monitoring. It measures
 * the following Core Web Vitals:
 *
 * - **CLS** (Cumulative Layout Shift): Measures visual stability
 * - **FCP** (First Contentful Paint): Measures loading performance
 * - **LCP** (Largest Contentful Paint): Measures loading performance
 * - **TTFB** (Time to First Byte): Measures server responsiveness
 * - **INP** (Interaction to Next Paint): Measures interaction responsiveness (new in v5.x)
 *
 * @param onPerfEntry - Optional callback function to handle metric data
 * @returns void
 *
 * @example
 * ```typescript
 * import reportWebVitals from './reportWebVitals';
 *
 * // Report to console
 * reportWebVitals(console.log);
 *
 * // Report to analytics service
 * reportWebVitals((metric) => {
 *   analytics.track('Web Vitals', metric);
 * });
 * ```
 */
const reportWebVitals = (onPerfEntry?: (metric: MetricType) => void): void => {
  // Use typeof check instead of instanceof for better cross-realm compatibility
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals')
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        // Register all Core Web Vitals observers
        onCLS(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
        onINP(onPerfEntry); // New metric in web-vitals 5.x (replaces FID)
      })
      .catch((error: Error) => {
        // Handle potential import errors gracefully in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to load web-vitals library:', error.message);
        }
      });
  }
};

export default reportWebVitals;
