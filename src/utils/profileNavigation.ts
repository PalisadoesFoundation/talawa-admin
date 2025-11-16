export type ProfilePortal = 'admin' | 'user';

export interface InterfaceProfileNavigationOptions {
  portal?: ProfilePortal;
  role?: string | null;
  orgId?: string | null;
}

/**
 * Resolves the appropriate profile route based on portal context, role, and org id.
 */
export const resolveProfileNavigation = ({
  portal = 'admin',
  role,
  orgId,
}: InterfaceProfileNavigationOptions): string => {
  const normalizedRole = (role ?? '').toLowerCase();
  const isRegularUser =
    portal === 'user' ||
    normalizedRole === 'regular' ||
    normalizedRole === 'user';

  if (isRegularUser) {
    return '/user/settings';
  }

  if (orgId && orgId.length > 0) {
    return `/member/${orgId}`;
  }

  return '/member';
};
