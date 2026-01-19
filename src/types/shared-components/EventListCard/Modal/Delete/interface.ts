import type { InterfaceEventListCardProps } from 'types/shared-components/EventListCard/interface';
/**
 * Props for EventListCardDeleteModal.
 */
export interface IDeleteEventModalProps {
  eventListCardProps: InterfaceEventListCardProps;
  eventDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteEventHandler: (
    deleteOption?: 'single' | 'following' | 'all',
  ) => Promise<void>;
}

export type InterfaceDeleteEventModalProps = IDeleteEventModalProps;
