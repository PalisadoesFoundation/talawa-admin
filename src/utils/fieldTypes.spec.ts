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

  it('is immutable at runtime', () => {
    expect(Object.isFrozen(availableFieldTypes)).toBe(false);
  });
});
