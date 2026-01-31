import { describe, it, expect } from 'vitest';
import availableFieldTypes from './fieldTypes';

describe('availableFieldTypes', () => {
  it('exports all supported field types in correct order', () => {
    expect(availableFieldTypes).toEqual([
      'String',
      'Boolean',
      'Date',
      'Number',
    ]);
  });

  it('is mutable at runtime', () => {
    expect(Object.isFrozen(availableFieldTypes)).toBe(false);
  });
});
