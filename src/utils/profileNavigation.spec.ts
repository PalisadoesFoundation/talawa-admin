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

  it('returns member route with orgId for admin roles', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'administrator',
        orgId: '999',
      }),
    ).toBe('/member/999');
  });

  it('returns member route when org id is missing for admin', () => {
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

  it('returns member route when orgId is null for admin', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'administrator',
        orgId: null,
      }),
    ).toBe('/member');
  });

  it('handles case-insensitive role values and returns user settings for regular', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'REGULAR',
        orgId: '123',
      }),
    ).toBe('/user/settings');
  });

  it('routes to user settings when role is explicitly user', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'user',
        orgId: '999',
      }),
    ).toBe('/user/settings');
  });

  it('routes to member route for Administrator role', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'Administrator',
        orgId: '42',
      }),
    ).toBe('/member/42');
  });

  it('defaults portal to admin and returns member route', () => {
    expect(
      resolveProfileNavigation({
        // portal omitted to use default
        role: 'administrator',
        orgId: '7',
      }),
    ).toBe('/member/7');
  });
});
