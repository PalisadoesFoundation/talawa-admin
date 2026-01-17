import type { IEventListCard } from 'types/Event/interface';
/**
 * Props for EventListCardDeleteModal.
 */
export interface IDeleteEventModalProps {
  eventListCardProps: IEventListCard;
  eventDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteEventHandler: (
    deleteOption?: 'single' | 'following' | 'all',
  ) => Promise<void>;
}

export type InterfaceDeleteEventModalProps = IDeleteEventModalProps;
