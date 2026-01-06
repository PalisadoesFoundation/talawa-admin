/**
 * Constants for User Roles.
 */
export const USER_ROLES = {
  ADMIN: 'administrator',
  USER: 'regular',
  // Add other roles as needed
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
