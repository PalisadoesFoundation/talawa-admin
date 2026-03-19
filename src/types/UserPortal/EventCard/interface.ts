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
  /** ISO string for the event start date/time (nullable for all-day events) */
  startAt: string | null;
  /** ISO string for the event end date/time (nullable for all-day events) */
  endAt: string | null;
  /** Date string (YYYY-MM-DD) for all-day event start */
  startDate?: string | null;
  /** Date string (YYYY-MM-DD) for all-day event end */
  endDate?: string | null;
  /** Whether the event is all day */
  allDay?: boolean;
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
