/**
 * Replacement for vi.clearAllMocks() that properly resets all mocks.
 * Addresses shared component UI element cleanup (item 5 of 14).
 */
import { vi } from 'vitest';

export function clearAllMocksSafely(): void {
  // Clear all mock instances, implementations, and results
  vi.clearAllMocks();
  
  // Additionally reset modules that may have cached state
  vi.resetModules();
  
  // Clear any DOM side effects from previous tests
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Clear localStorage/sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any pending timers
  vi.useFakeTimers()?.clearAll();
}

// Auto-register as afterEach hook if in test context
if (typeof afterEach === 'function') {
  afterEach(clearAllMocksSafely);
}