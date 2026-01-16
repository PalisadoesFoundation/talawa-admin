import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerDeleteModal component props.
 *
 * @property isOpen - Boolean to control modal visibility.
 * @property hide - Function to close the modal.
 * @property volunteer - The volunteer object to be deleted.
 * @property refetchVolunteers - Callback to refresh the list after deletion.
 * @property isRecurring - (Optional) Whether the event is recurring.
 * @property eventId - (Optional) The ID of the specific event instance.
 */
export interface InterfaceDeleteVolunteerModalProps {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
  refetchVolunteers: () => void;
  isRecurring?: boolean;
  eventId?: string;
}