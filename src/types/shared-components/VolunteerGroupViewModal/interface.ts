import { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Props for VolunteerGroupViewModal component.
 */
export interface InterfaceVolunteerGroupViewModalProps {
  /** Indicates whether the modal is open. */
  isOpen: boolean;
  /** Function to close the modal. */
  hide: () => void;
  /** The volunteer group information to display. */
  group: InterfaceVolunteerGroupInfo;
}
