/**
 * Volunteer Status Mapper Utility
 *
 * Centralizes the mapping of volunteer membership statuses to StatusBadge variants.
 * This ensures consistency across all volunteer-related screens (Invitations, UpcomingEvents, etc.).
 *
 */

import type { StatusVariant } from 'types/shared-components/StatusBadge/interface';

/**
 * Maps volunteer membership status to StatusBadge variant.
 *
 * This function provides a single source of truth for status→variant mapping,
 * ensuring consistent visual representation across the application.
 *
 * @param status - The membership status string (e.g., 'requested', 'invited', 'accepted', 'rejected')
 * @returns Object containing the StatusBadge variant
 *
 * @example
 * ```typescript
 * const badgeProps = mapVolunteerStatusToVariant('invited');
 * // Returns: { variant: 'pending' }
 * ```
 */
export const mapVolunteerStatusToVariant = (
  status: string,
): { variant: StatusVariant } => {
  switch (status) {
    case 'requested':
    case 'invited':
      return { variant: 'pending' };
    case 'accepted':
      return { variant: 'accepted' };
    case 'rejected':
      return { variant: 'declined' };
    default:
      return { variant: 'no_response' };
  }
};
