import { describe, expect, it } from 'vitest';
import { PACKAGE_NAMES } from './types';
import type { PackageName } from './types';

describe('install/types', () => {
  it('defines PACKAGE_NAMES in the expected order', () => {
    expect(PACKAGE_NAMES).toEqual(['typescript', 'docker']);
  });

  it('PackageName matches the PACKAGE_NAMES values', () => {
    // This ensures that all runtime values are assignable to the union type.
    const values: PackageName[] = [...PACKAGE_NAMES];
    expect(values).toEqual(['typescript', 'docker']);

    // And this ensures that unexpected values are rejected at compile time.
    // @ts-expect-error - "git" is not part of PackageName
    const _invalid: PackageName = 'git';
    void _invalid;
  });
});
