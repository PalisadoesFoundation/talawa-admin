import { describe, it, expect } from 'vitest';
import {
  Iso3166Alpha2CountryCode,
  UserEducationGrade,
  UserEmploymentStatus,
  UserMaritalStatus,
  UserNatalSex,
  UserRole,
  AdvertisementTypePg,
} from './interfaces';

describe('src/utils/interfaces.ts enums', () => {
  describe('Iso3166Alpha2CountryCode', () => {
    it('contains expected country codes', () => {
      expect(Iso3166Alpha2CountryCode.in).toBe('in');
      expect(Iso3166Alpha2CountryCode.us).toBe('us');
      expect(Iso3166Alpha2CountryCode.gb).toBe('gb');
    });

    it('has a large set of ISO codes', () => {
      expect(Object.keys(Iso3166Alpha2CountryCode).length).toBeGreaterThan(200);
    });
  });

  describe('UserEducationGrade', () => {
    it('defines all supported education grades', () => {
      expect(UserEducationGrade.GRADE_1).toBe('grade_1');
      expect(UserEducationGrade.GRADE_12).toBe('grade_12');
      expect(UserEducationGrade.KG).toBe('kg');
      expect(UserEducationGrade.PRE_KG).toBe('pre_kg');
      expect(UserEducationGrade.NO_GRADE).toBe('no_grade');
      expect(UserEducationGrade.GRADUATE).toBe('graduate');
    });
  });

  describe('UserEmploymentStatus', () => {
    it('defines valid employment statuses', () => {
      expect(UserEmploymentStatus.FULL_TIME).toBe('full_time');
      expect(UserEmploymentStatus.PART_TIME).toBe('part_time');
      expect(UserEmploymentStatus.UNEMPLOYED).toBe('unemployed');
    });
  });

  describe('UserMaritalStatus', () => {
    it('defines valid marital statuses', () => {
      expect(UserMaritalStatus.SINGLE).toBe('single');
      expect(UserMaritalStatus.MARRIED).toBe('married');
      expect(UserMaritalStatus.DIVORCED).toBe('divorced');
      expect(UserMaritalStatus.WIDOWED).toBe('widowed');
      expect(UserMaritalStatus.ENGAGED).toBe('engaged');
      expect(UserMaritalStatus.SEPARATED).toBe('separated');
    });
  });

  describe('UserNatalSex', () => {
    it('defines valid natal sex values', () => {
      expect(UserNatalSex.MALE).toBe('male');
      expect(UserNatalSex.FEMALE).toBe('female');
      expect(UserNatalSex.INTERSEX).toBe('intersex');
    });
  });

  describe('UserRole', () => {
    it('defines valid user roles', () => {
      expect(UserRole.Administrator).toBe('administrator');
      expect(UserRole.Regular).toBe('regular');
    });
  });

  describe('AdvertisementTypePg', () => {
    it('defines valid advertisement types', () => {
      expect(AdvertisementTypePg.BANNER).toBe('banner');
      expect(AdvertisementTypePg.MENU).toBe('menu');
      expect(AdvertisementTypePg.POP_UP).toBe('pop_up');
    });
  });
});
