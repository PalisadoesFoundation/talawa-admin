// Add explicit imports from vitest
import { describe, it, expect } from 'vitest';
import { props } from './EventListCardProps';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventListCardProps', () => {
  it('should export a non-empty props array', () => {
    expect(Array.isArray(props)).toBe(true);
    expect(props.length).toBeGreaterThan(0);
  });

  it('should have required event fields for each prop', () => {
    props.forEach((event) => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('startAt');
      expect(event).toHaveProperty('endAt');
      expect(event).toHaveProperty('allDay');
      expect(event).toHaveProperty('isPublic');
    });
  });

  it('should handle recurring event fields correctly', () => {
    props.forEach((event) => {
      expect(event).toHaveProperty('isRecurringEventTemplate');
      expect(event).toHaveProperty('baseEvent');
      expect(event).toHaveProperty('sequenceNumber');
      expect(event).toHaveProperty('totalCount');
      expect(event).toHaveProperty('hasExceptions');
      expect(event).toHaveProperty('progressLabel');
    });
  });

  it('should allow calling refetchEvents when provided', () => {
    props.forEach((event) => {
      if (event.refetchEvents) {
        expect(() => event.refetchEvents?.()).not.toThrow();
      }
    });
  });

  it('should support different user roles', () => {
    const roles = props.map((e) => e.userRole).filter(Boolean);
    expect(roles).toEqual(expect.arrayContaining(['REGULAR', 'ADMINISTRATOR']));
  });
});
