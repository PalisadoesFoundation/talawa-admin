import { describe, it, expect } from 'vitest';
import { resolveProfileNavigation } from './profileNavigation';

describe('resolveProfileNavigation', () => {
  it('returns user settings for user portal regardless of role', () => {
    expect(
      resolveProfileNavigation({
        portal: 'user',
        role: 'administrator',
      }),
    ).toBe('/user/settings');
  });

  it('returns user settings when role is regular even on admin portal', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'regular',
      }),
    ).toBe('/user/settings');
  });

  it('handles case-insensitive role values and returns user settings for regular', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'REGULAR',
      }),
    ).toBe('/user/settings');
  });

  it('routes to user settings when role is explicitly user', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'user',
      }),
    ).toBe('/user/settings');
  });

  it('routes to /admin/profile route for Administrator role', () => {
    expect(
      resolveProfileNavigation({
        portal: 'admin',
        role: 'Administrator',
      }),
    ).toBe('/admin/profile');
  });

  it('defaults portal to admin and returns admin route', () => {
    expect(
      resolveProfileNavigation({
        // portal omitted to use default
        role: 'administrator',
      }),
    ).toBe('/admin/profile');
  });
});
