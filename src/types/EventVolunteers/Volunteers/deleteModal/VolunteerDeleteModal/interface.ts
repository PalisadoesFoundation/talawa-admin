import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

export interface InterfaceDeleteVolunteerModal {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
  refetchVolunteers: () => void;
  // New props for recurring events
  isRecurring?: boolean;
  eventId?: string;
}