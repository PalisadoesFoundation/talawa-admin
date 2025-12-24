/**
 * Feature flag utilities for conditional feature enablement.
 * @module utils/featureFlags
 */

/**
 * Checks if the invite-only feature is enabled via environment variable.
 * @returns true if REACT_APP_ENABLE_INVITE_ONLY is set to 'true', false otherwise
 */
export const isInviteOnlyEnabled = (): boolean => {
  return process.env.REACT_APP_ENABLE_INVITE_ONLY === 'true';
};
