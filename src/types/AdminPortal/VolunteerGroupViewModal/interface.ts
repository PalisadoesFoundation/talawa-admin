import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Props for VolunteerGroupViewModal component.
 */
export interface InterfaceVolunteerGroupViewModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo;
}
