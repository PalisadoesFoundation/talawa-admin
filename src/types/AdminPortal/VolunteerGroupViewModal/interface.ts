import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Props for VolunteerGroupViewModal component.
 */
export interface InterfaceVolunteerGroupViewModalProps {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo;
}
