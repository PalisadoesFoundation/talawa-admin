import type { User } from 'types/Event/type';

/**
 * Interface for EventCard component props.
 */
export interface InterfaceEventCardProps {
  /** Unique identifier for the event */
  id: string;
  /** Name or title of the event */
  name: string;
  /** Detailed description of the event */
  description: string;
  /** Physical or virtual location of the event */
  location: string;
  /** ISO string for the event start date/time */
  startAt: string;
  /** ISO string for the event end date/time */
  endAt: string;
  /** formatted start time string (optional) */
  startTime?: string | null;
  /** formatted end time string (optional) */
  endTime?: string | null;
  /** Information about the user who created the event */
  creator: Partial<User>;
  /** List of users attending the event */
  attendees: Partial<User>[];
  /**
   * Determines if the event is restricted to invited participants only.
   * When true, only invited users can see and access the event.
   */
  isInviteOnly: boolean;
}
