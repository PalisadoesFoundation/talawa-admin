import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerGroupDeleteModal component props.
 * Defines the properties required to control visibility, handle deletion logic,
 * and manage the specific volunteer group data.
 */
export interface InterfaceDeleteVolunteerGroupModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;

  /** Function to close the modal */
  hide: () => void;

  /** The volunteer group object selected for deletion */
  group: InterfaceVolunteerGroupInfo | null;

  /** Callback function to refresh the groups list after deletion */
  refetchGroups: () => void;

  /** Optional flag indicating if the event is recurring */
  isRecurring?: boolean;

  /** Optional ID of the event associated with the group */
  eventId?: string;
}

