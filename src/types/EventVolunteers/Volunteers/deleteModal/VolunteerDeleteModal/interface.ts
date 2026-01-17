import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerDeleteModal component props.
 * Defines the properties required to control visibility, handle deletion logic,
 * and manage the specific volunteer data.
 */
export interface InterfaceDeleteVolunteerModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;

  /** Function to close the modal */
  hide: () => void;

  /** The volunteer object selected for deletion */
  volunteer: InterfaceEventVolunteerInfo;

  /** Callback function to refresh the volunteers list after deletion */
  refetchVolunteers: () => void;

  /** Optional flag indicating if the event is recurring */
  isRecurring?: boolean;

  /** Optional ID of the event associated with the volunteer */
  eventId?: string;
}
