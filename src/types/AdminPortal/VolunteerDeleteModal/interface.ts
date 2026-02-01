import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

/**
 * Props for VolunteerDeleteModal component.
 */
export interface InterfaceVolunteerDeleteModalProps {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
  refetchVolunteers: () => void;
  isRecurring?: boolean;
  eventId?: string;
}
