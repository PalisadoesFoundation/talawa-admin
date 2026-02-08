import type { InterfaceEvent, InterfaceIOrgList } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';

/**
 * Filters events based on user role, organization data, and user ID.
 *
 * - No user info: only public events
 * - Administrators: all events
 * - Regular users: public + invite-only (if creator/attendee) + org-member events
 */
export const filterEventData = (
  eventData: InterfaceEvent[],
  orgData?: InterfaceIOrgList,
  userRole?: string,
  userId?: string,
): InterfaceEvent[] => {
  if (!eventData) return [];

  if (!userRole || !userId) {
    return eventData.filter((event) => event.isPublic);
  }

  if (userRole === UserRole.ADMINISTRATOR) {
    return eventData;
  }

  return eventData.filter((event) => {
    if (event.creator && event.creator.id === userId) {
      return true;
    }

    if (event.isPublic) {
      return true;
    }

    if (event.isInviteOnly) {
      return event.attendees?.some(
        (attendee) => attendee.id === userId,
      ) ?? false;
    }

    if (!orgData?.members) {
      return false;
    }

    return orgData.members.edges?.some(
      (edge) => edge.node.id === userId,
    ) ?? false;
  });
};
