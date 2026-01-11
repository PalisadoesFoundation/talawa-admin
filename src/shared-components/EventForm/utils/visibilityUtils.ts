/**
 * Event visibility utilities for EventForm component.
 */

/**
 * Represents the visibility level of an event.
 * - PUBLIC: Visible to everyone
 * - ORGANIZATION: Visible to organization members only
 * - INVITE_ONLY: Visible only to invited attendees
 */
export type EventVisibility = 'PUBLIC' | 'ORGANIZATION' | 'INVITE_ONLY';

/**
 * Determines the visibility type based on boolean flags.
 * @param isPublic - Whether the event is public
 * @param isInviteOnly - Whether the event is invite-only
 * @returns The corresponding EventVisibility value
 */
export const getVisibilityType = (
  isPublic?: boolean,
  isInviteOnly?: boolean,
): EventVisibility => {
  if (isPublic) return 'PUBLIC';
  if (isInviteOnly) return 'INVITE_ONLY';
  return 'ORGANIZATION';
};
