import { describe, it, expect } from 'vitest';
import {
  TEST_ID_PEOPLE_CARD,
  TEST_ID_PEOPLE_SNO,
  ROUTE_USER,
  ROUTE_USER_ORG,
  FILE_NAME_TEMPLATE_BACKUP_ENV,
  IDENTIFIER_USER_ID,
  IDENTIFIER_ID,
  getDummyDateTime,
  DUMMY_DATE_TIME_PREFIX,
} from './common';

describe('common constants and helpers', () => {
  describe('TEST_ID_PEOPLE_CARD', () => {
    it('should format people card test id with valid id', () => {
      expect(TEST_ID_PEOPLE_CARD('123')).toBe('people-card-123');
    });

    it('should format people card test id with empty string', () => {
      expect(TEST_ID_PEOPLE_CARD('')).toBe('people-card-');
    });
  });

  describe('TEST_ID_PEOPLE_SNO', () => {
    it('should format people sno test id with valid id', () => {
      expect(TEST_ID_PEOPLE_SNO('456')).toBe('people-sno-456');
    });

    it('should format people sno test id with empty string', () => {
      expect(TEST_ID_PEOPLE_SNO('')).toBe('people-sno-');
    });
  });

  describe('ROUTE_USER', () => {
    it('should format user route with valid compId', () => {
      expect(ROUTE_USER('profile')).toBe('user/profile');
    });

    it('should format user route with empty compId', () => {
      expect(ROUTE_USER('')).toBe('user/');
    });
  });

  describe('ROUTE_USER_ORG', () => {
    it('should format user org route with valid compId and orgId', () => {
      expect(ROUTE_USER_ORG('events', 'org123')).toBe('user/events/org123');
    });

    it('should format user org route with valid compId and undefined orgId', () => {
      expect(ROUTE_USER_ORG('events', undefined)).toBe('user/events/');
    });

    it('should handle empty strings for compId and orgId', () => {
      expect(ROUTE_USER_ORG('', '')).toBe('user//');
    });
  });

  describe('FILE_NAME_TEMPLATE_BACKUP_ENV', () => {
    it('should format backup env filename with timestamp', () => {
      const timestamp = '20231026-120000';
      expect(FILE_NAME_TEMPLATE_BACKUP_ENV(timestamp)).toBe(
        `.env.${timestamp}`,
      );
    });

    it('should handle empty timestamp', () => {
      expect(FILE_NAME_TEMPLATE_BACKUP_ENV('')).toBe('.env.');
    });
  });

  describe('Identifier Constants', () => {
    it('IDENTIFIER_USER_ID should be userId', () => {
      expect(IDENTIFIER_USER_ID).toBe('userId');
    });

    it('IDENTIFIER_ID should be id', () => {
      expect(IDENTIFIER_ID).toBe('id');
    });
  });

  describe('getDummyDateTime', () => {
    it('should return combined dummy date time prefix and time', () => {
      const time = '10:30:00';
      expect(getDummyDateTime(time)).toBe(`${DUMMY_DATE_TIME_PREFIX}${time}`);
    });

    it('should handle empty time string', () => {
      expect(getDummyDateTime('')).toBe(DUMMY_DATE_TIME_PREFIX);
    });
  });
});
