import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerGroupDeleteModal component props.
 *
 * @property isOpen - Boolean to control modal visibility.
 * @property hide - Function to close the modal.
 * @property group - The volunteer group object to be deleted.
 * @property refetchGroups - Callback to refresh the list after deletion.
 * @property isRecurring - (Optional) Whether the event is recurring.
 * @property eventId - (Optional) The ID of the specific event instance.
 */
export interface InterfaceDeleteVolunteerGroupModalProps {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
  isRecurring?: boolean;
  eventId?: string;
}