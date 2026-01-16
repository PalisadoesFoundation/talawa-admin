import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

export interface InterfaceDeleteVolunteerGroupModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
  // New props for recurring events
  isRecurring?: boolean;
  eventId?: string;
}