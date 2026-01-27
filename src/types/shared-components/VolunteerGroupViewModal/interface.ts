import { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Props for VolunteerGroupViewModal component
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param group - The volunteer group information to display.
 */
export interface InterfaceVolunteerGroupViewModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo;
}
