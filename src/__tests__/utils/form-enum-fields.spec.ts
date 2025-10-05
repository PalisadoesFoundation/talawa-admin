import { describe, it, expect } from 'vitest';

import {
  countryOptions,
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
  userRoleEnum,
} from '../../utils/formEnumFields';

const assertUniqueValues = (entries: Array<{ value: string }>): void => {
  const uniqueValues = new Set(entries.map((entry) => entry.value));
  expect(uniqueValues.size).toBe(entries.length);
};

describe('formEnumFields exports', () => {
  it('provides unique option values for every enumeration set', () => {
    [
      countryOptions,
      educationGradeEnum,
      maritalStatusEnum,
      genderEnum,
      employmentStatusEnum,
      userRoleEnum,
    ].forEach(assertUniqueValues);
  });

  it('includes key country, grade, and role entries expected by the UI', () => {
    expect(countryOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'in', label: 'India' }),
        expect.objectContaining({ value: 'us', label: 'United States' }),
        expect.objectContaining({ value: 'gb', label: 'United Kingdom' }),
      ]),
    );

    expect(educationGradeEnum[0]).toEqual(
      expect.objectContaining({ value: 'no_grade', label: 'No-Grade' }),
    );
    expect(educationGradeEnum[educationGradeEnum.length - 1]).toEqual(
      expect.objectContaining({ value: 'graduate', label: 'Graduate' }),
    );

    expect(userRoleEnum).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'USER', label: 'User' }),
        expect.objectContaining({ value: 'ADMIN', label: 'Admin' }),
        expect.objectContaining({ value: 'SUPERADMIN', label: 'Super Admin' }),
        expect.objectContaining({ value: 'NON_USER', label: 'Non-User' }),
      ]),
    );
  });

  it('supports accessibility-sensitive categories like gender and employment status', () => {
    expect(genderEnum).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'male', label: 'Male' }),
        expect.objectContaining({ value: 'female', label: 'Female' }),
        expect.objectContaining({ value: 'intersex', label: 'Intersex' }),
      ]),
    );

    expect(employmentStatusEnum).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'full_time', label: 'Full-Time' }),
        expect.objectContaining({ value: 'part_time', label: 'Part-Time' }),
        expect.objectContaining({ value: 'unemployed', label: 'Unemployed' }),
      ]),
    );

    expect(maritalStatusEnum).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'single', label: 'Single' }),
        expect.objectContaining({ value: 'married', label: 'Married' }),
        expect.objectContaining({ value: 'widowed', label: 'Widowed' }),
      ]),
    );
  });
});
