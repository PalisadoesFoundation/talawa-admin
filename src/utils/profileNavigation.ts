export type ProfilePortal = 'admin' | 'user';

export interface InterfaceProfileNavigationOptions {
  portal?: ProfilePortal;
  role?: string | null;
}
/**
 * Resolves the appropriate profile route based on portal context, role, and org id.
 */
export const resolveProfileNavigation = ({
  portal = 'admin',
  role,
}: InterfaceProfileNavigationOptions): string => {
  const normalizedRole = (role ?? '').toLowerCase();
  const isRegularUser =
    portal === 'user' ||
    normalizedRole === 'regular' ||
    normalizedRole === 'user';

  if (isRegularUser) {
    return '/user/settings';
  }

  return `/admin/profile`;
};
