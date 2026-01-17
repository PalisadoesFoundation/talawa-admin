import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerGroupDeleteModal component props.
 */
export interface InterfaceDeleteVolunteerGroupModalProps {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
  isRecurring?: boolean;
  eventId?: string;
}

