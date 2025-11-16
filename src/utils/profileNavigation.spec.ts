import { describe, it, expect } from 'vitest';
import { resolveProfileNavigation } from './profileNavigation';

describe('resolveProfileNavigation', () => {
  it('returns user settings for user portal regardless of role', () => {
    expect(
      resolveProfileNavigation({
        portal: 'user',
        role: 'administrator',
        orgId: '123',
      }),
    ).toBe('/user/settings');
  });

  it('returns user settings when role is regular even on admin portal', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'regular',
        orgId: '321',
      }),
    ).toBe('/user/settings');
  });

  it('returns member route with org id for admin roles', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'administrator',
        orgId: '999',
      }),
    ).toBe('/member/999');
  });

  it('falls back to generic member route when org id is missing', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'administrator',
        orgId: '',
      }),
    ).toBe('/member');
  });

  it('returns member route when role is undefined on admin portal', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: undefined,
        orgId: '123',
      }),
    ).toBe('/member/123');
  });

  it('handles null orgId gracefully for admin', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'administrator',
        orgId: null,
      }),
    ).toBe('/member');
  });

  it('handles case-insensitive role values', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'REGULAR',
        orgId: '123',
      }),
    ).toBe('/user/settings');
  });
});
