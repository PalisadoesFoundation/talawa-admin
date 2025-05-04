// src/components/ActionItemForm/actionItemMocks.spec.ts

import { describe, it, expect } from 'vitest';
import { MOCKS } from './OrganizationActionItem.mocks';

describe('Action Item GraphQL mocks', () => {
  it('should export a non-empty array of mocks', () => {
    expect(Array.isArray(MOCKS)).toBe(true);
    expect(MOCKS.length).toBeGreaterThan(0);
  });

  it('each mock has a request with query and variables, and a result with data', () => {
    for (const mock of MOCKS) {
      expect(mock).toHaveProperty('request');
      expect(mock).toHaveProperty('result');
      const { request, result } = mock as any;
      expect(request).toHaveProperty('query');
      expect(request).toHaveProperty('variables');
      expect(result).toHaveProperty('data');
    }
  });
});
