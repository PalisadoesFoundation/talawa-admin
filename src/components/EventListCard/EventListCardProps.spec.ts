import { describe, it, expect } from 'vitest';
import { props } from './EventListCardProps';

describe('EventListCardProps', () => {
  it('should export props array', () => {
    expect(props).toBeDefined();
    expect(Array.isArray(props)).toBe(true);
  });

  it('should have 7 prop objects in the array', () => {
    expect(props).toHaveLength(7);
  });

  it('props[0] should have default/empty values', () => {
    const prop = props[0];
    expect(prop.key).toBe('');
    expect(prop.id).toBe('');
    expect(prop.location).toBe('');
    expect(prop.name).toBe('');
    expect(prop.description).toBe('');
    expect(prop.startAt).toBe('');
    expect(prop.endAt).toBe('');
    expect(prop.startTime).toBe('');
    expect(prop.endTime).toBe('');
    expect(prop.allDay).toBe(false);
    expect(prop.isPublic).toBe(false);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
    expect(prop.attendees).toEqual([]);
    expect(prop.creator).toEqual({});
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[0] refetchEvents should be a callable function', () => {
    const prop = props[0];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('props[1] should have event details for "Shelter for Dogs"', () => {
    const prop = props[1];
    expect(prop.key).toBe('123');
    expect(prop.id).toBe('1');
    expect(prop.location).toBe('India');
    expect(prop.name).toBe('Shelter for Dogs');
    expect(prop.description).toBe('This is shelter for dogs event');
    expect(prop.startAt).toBe('2022-03-19T02:00:00Z');
    expect(prop.endAt).toBe('2022-03-26T06:00:00Z');
    expect(prop.startTime).toBe('02:00');
    expect(prop.endTime).toBe('06:00');
    expect(prop.allDay).toBe(false);
    expect(prop.isPublic).toBe(true);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
    expect(prop.attendees).toEqual([]);
    expect(prop.creator).toEqual({});
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[1] refetchEvents should be a callable function', () => {
    const prop = props[1];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('props[2] should have REGULAR user role and allDay true', () => {
    const prop = props[2];
    expect(prop.userRole).toBe('REGULAR');
    expect(prop.key).toBe('123');
    expect(prop.id).toBe('1');
    expect(prop.location).toBe('India');
    expect(prop.name).toBe('Shelter for Dogs');
    expect(prop.description).toBe('This is shelter for dogs event');
    expect(prop.startAt).toBe('2022-03-19T02:00:00Z');
    expect(prop.endAt).toBe('2022-03-26T06:00:00Z');
    expect(prop.startTime).toBe('02:00');
    expect(prop.endTime).toBe('06:00');
    expect(prop.allDay).toBe(true);
    expect(prop.isPublic).toBe(true);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
  });

  it('props[2] should have creator with id, name, and emailAddress', () => {
    const prop = props[2];
    expect(prop.creator).toBeDefined();
    expect(prop.creator.id).toBe('123');
    expect(prop.creator.name).toBe('Joe David');
    expect(prop.creator.emailAddress).toBe('joe@example.com');
  });

  it('props[2] should have one attendee', () => {
    const prop = props[2];
    expect(prop.attendees).toHaveLength(1);
    expect(prop.attendees[0].id).toBe('234');
    expect(prop.attendees[0].name).toBe('Attendee 1');
    expect(prop.attendees[0].emailAddress).toBe('attendee1@example.com');
  });

  it('props[2] should have recurring event fields', () => {
    const prop = props[2];
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[2] refetchEvents should be a callable function', () => {
    const prop = props[2];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('props[3] should have REGULAR user role with different attendee', () => {
    const prop = props[3];
    expect(prop.userRole).toBe('REGULAR');
    expect(prop.key).toBe('123');
    expect(prop.id).toBe('1');
    expect(prop.location).toBe('India');
    expect(prop.name).toBe('Shelter for Dogs');
    expect(prop.description).toBe('This is shelter for dogs event');
    expect(prop.startAt).toBe('2022-03-19T02:00:00Z');
    expect(prop.endAt).toBe('2022-03-26T06:00:00Z');
    expect(prop.startTime).toBe('02:00');
    expect(prop.endTime).toBe('06:00');
    expect(prop.allDay).toBe(true);
    expect(prop.isPublic).toBe(true);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
  });

  it('props[3] should have creator details', () => {
    const prop = props[3];
    expect(prop.creator).toBeDefined();
    expect(prop.creator.id).toBe('123');
    expect(prop.creator.name).toBe('Joe David');
    expect(prop.creator.emailAddress).toBe('joe@example.com');
  });

  it('props[3] should have one attendee with different details', () => {
    const prop = props[3];
    expect(prop.attendees).toHaveLength(1);
    expect(prop.attendees[0].id).toBe('456');
    expect(prop.attendees[0].name).toBe('Attendee 2');
    expect(prop.attendees[0].emailAddress).toBe('attendee2@example.com');
  });

  it('props[3] should have recurring event fields', () => {
    const prop = props[3];
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[3] refetchEvents should be a callable function', () => {
    const prop = props[3];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('props[4] should have ADMINISTRATOR user role', () => {
    const prop = props[4];
    expect(prop.userRole).toBe('ADMINISTRATOR');
    expect(prop.key).toBe('123');
    expect(prop.id).toBe('1');
    expect(prop.location).toBe('India');
    expect(prop.name).toBe('Shelter for Cats');
    expect(prop.description).toBe('This is shelter for cat event');
    expect(prop.startAt).toBe('2022-03-19T09:00:00Z');
    expect(prop.endAt).toBe('2022-03-19T17:00:00Z');
    expect(prop.startTime).toBe('09:00:00');
    expect(prop.endTime).toBe('17:00:00');
    expect(prop.allDay).toBe(false);
    expect(prop.isPublic).toBe(true);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
    expect(prop.attendees).toEqual([]);
    expect(prop.creator).toEqual({});
  });

  it('props[4] should have recurring event fields', () => {
    const prop = props[4];
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[4] refetchEvents should be a callable function', () => {
    const prop = props[4];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('props[5] should have ADMINISTRATOR user role with allDay true and null times', () => {
    const prop = props[5];
    expect(prop.userRole).toBe('ADMINISTRATOR');
    expect(prop.key).toBe('123');
    expect(prop.id).toBe('1');
    expect(prop.location).toBe('India');
    expect(prop.name).toBe('Shelter for Cats');
    expect(prop.description).toBe('This is shelter for cat event');
    expect(prop.startAt).toBe('2022-03-17T00:00:00Z');
    expect(prop.endAt).toBe('2022-03-17T23:59:59Z');
    expect(prop.startTime).toBe(null);
    expect(prop.endTime).toBe(null);
    expect(prop.allDay).toBe(true);
    expect(prop.isPublic).toBe(true);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
    expect(prop.attendees).toEqual([]);
    expect(prop.creator).toEqual({});
  });

  it('props[5] should have recurring event fields', () => {
    const prop = props[5];
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[5] refetchEvents should be a callable function', () => {
    const prop = props[5];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('props[6] should have ADMINISTRATOR user role with allDay true and null times', () => {
    const prop = props[6];
    expect(prop.userRole).toBe('ADMINISTRATOR');
    expect(prop.key).toBe('123');
    expect(prop.id).toBe('1');
    expect(prop.location).toBe('India');
    expect(prop.name).toBe('Shelter for Cats');
    expect(prop.description).toBe('This is shelter for cat event');
    expect(prop.startAt).toBe('2022-03-17T00:00:00Z');
    expect(prop.endAt).toBe('2022-03-17T23:59:59Z');
    expect(prop.startTime).toBe(null);
    expect(prop.endTime).toBe(null);
    expect(prop.allDay).toBe(true);
    expect(prop.isPublic).toBe(true);
    expect(prop.isRegisterable).toBe(false);
    expect(prop.refetchEvents).toBeDefined();
    expect(typeof prop.refetchEvents).toBe('function');
    expect(prop.attendees).toEqual([]);
    expect(prop.creator).toEqual({});
  });

  it('props[6] should have recurring event fields', () => {
    const prop = props[6];
    expect(prop.isRecurringEventTemplate).toBe(false);
    expect(prop.baseEvent).toBe(null);
    expect(prop.sequenceNumber).toBe(null);
    expect(prop.totalCount).toBe(null);
    expect(prop.hasExceptions).toBe(false);
    expect(prop.progressLabel).toBe(null);
  });

  it('props[6] refetchEvents should be a callable function', () => {
    const prop = props[6];
    expect(() => prop.refetchEvents?.()).not.toThrow();
  });

  it('all props should have the required event properties', () => {
    props.forEach((prop) => {
      expect(prop).toHaveProperty('id');
      expect(prop).toHaveProperty('location');
      expect(prop).toHaveProperty('name');
      expect(prop).toHaveProperty('description');
      expect(prop).toHaveProperty('startAt');
      expect(prop).toHaveProperty('endAt');
      expect(prop).toHaveProperty('allDay');
      expect(prop).toHaveProperty('isPublic');
      expect(prop).toHaveProperty('isRegisterable');
      expect(prop).toHaveProperty('refetchEvents');
      expect(prop).toHaveProperty('attendees');
      expect(prop).toHaveProperty('creator');
      expect(prop).toHaveProperty('isRecurringEventTemplate');
      expect(prop).toHaveProperty('baseEvent');
      expect(prop).toHaveProperty('sequenceNumber');
      expect(prop).toHaveProperty('totalCount');
      expect(prop).toHaveProperty('hasExceptions');
      expect(prop).toHaveProperty('progressLabel');
    });
  });

  it('all refetchEvents functions should be callable without errors', () => {
    props.forEach((prop) => {
      expect(() => prop.refetchEvents?.()).not.toThrow();
    });
  });

  it('should have proper type definitions for attendees array', () => {
    props.forEach((prop) => {
      expect(Array.isArray(prop.attendees)).toBe(true);
    });
  });

  it('should have proper type definitions for creator object', () => {
    props.forEach((prop) => {
      expect(typeof prop.creator).toBe('object');
      expect(prop.creator).not.toBe(null);
    });
  });

  it('should verify user roles are either REGULAR, ADMINISTRATOR, or undefined', () => {
    props.forEach((prop) => {
      if (prop.userRole) {
        expect(['REGULAR', 'ADMINISTRATOR']).toContain(prop.userRole);
      }
    });
  });

  it('should verify allDay is a boolean for all props', () => {
    props.forEach((prop) => {
      expect(typeof prop.allDay).toBe('boolean');
    });
  });

  it('should verify isPublic is a boolean for all props', () => {
    props.forEach((prop) => {
      expect(typeof prop.isPublic).toBe('boolean');
    });
  });

  it('should verify isRegisterable is a boolean for all props', () => {
    props.forEach((prop) => {
      expect(typeof prop.isRegisterable).toBe('boolean');
    });
  });

  it('should verify isRecurringEventTemplate is a boolean for all props', () => {
    props.forEach((prop) => {
      expect(typeof prop.isRecurringEventTemplate).toBe('boolean');
    });
  });

  it('should verify hasExceptions is a boolean for all props', () => {
    props.forEach((prop) => {
      expect(typeof prop.hasExceptions).toBe('boolean');
    });
  });
});
