import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerDeleteModal component props.
 */
export interface InterfaceDeleteVolunteerModalProps {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
  refetchVolunteers: () => void;
  isRecurring?: boolean;
  eventId?: string;
}

