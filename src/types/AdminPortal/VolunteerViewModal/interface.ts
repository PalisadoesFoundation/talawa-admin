import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

/**
 * Props for VolunteerViewModal component.
 */
export interface InterfaceVolunteerViewModal {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
}
