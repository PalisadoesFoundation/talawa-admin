/**
 * Tests for EventForm visibility utilities.
 */
import { describe, it, expect } from 'vitest';
import { getVisibilityType } from './visibilityUtils';

describe('getVisibilityType', () => {
  it('should return PUBLIC when isPublic is true', () => {
    expect(getVisibilityType(true, false)).toBe('PUBLIC');
  });

  it('should return PUBLIC when both isPublic and isInviteOnly are true', () => {
    // isPublic takes precedence
    expect(getVisibilityType(true, true)).toBe('PUBLIC');
  });

  it('should return INVITE_ONLY when isInviteOnly is true and isPublic is false', () => {
    expect(getVisibilityType(false, true)).toBe('INVITE_ONLY');
  });

  it('should return ORGANIZATION when both flags are false', () => {
    expect(getVisibilityType(false, false)).toBe('ORGANIZATION');
  });

  it('should return ORGANIZATION when both flags are undefined', () => {
    expect(getVisibilityType()).toBe('ORGANIZATION');
  });

  it('should return ORGANIZATION when flags are undefined or false', () => {
    expect(getVisibilityType(undefined, undefined)).toBe('ORGANIZATION');
    expect(getVisibilityType(undefined, false)).toBe('ORGANIZATION');
    expect(getVisibilityType(false, undefined)).toBe('ORGANIZATION');
  });

  it('should return INVITE_ONLY when only isInviteOnly is true', () => {
    expect(getVisibilityType(undefined, true)).toBe('INVITE_ONLY');
  });
});
