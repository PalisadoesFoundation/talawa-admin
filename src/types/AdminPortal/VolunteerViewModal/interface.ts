import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';

/**
 * Props for VolunteerViewModal component.
 */
export interface InterfaceVolunteerViewModalProps {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
}
