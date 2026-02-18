import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 *  Props for GroupModal component.
 */

export interface InterfaceGroupModalProps {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  group: InterfaceVolunteerGroupInfo;
  refetchGroups: () => void;
}
