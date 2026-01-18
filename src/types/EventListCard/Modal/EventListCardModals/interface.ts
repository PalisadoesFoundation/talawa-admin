import { InterfaceEvent } from 'types/Event/interface';

export interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

export interface InterfaceEventListCardModalsProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  tCommon: (key: string) => string;
}
