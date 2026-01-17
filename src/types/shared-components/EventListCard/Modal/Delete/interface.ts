/**
 * Props for EventListCardDeleteModal.
 */
import type { IEventListCard } from 'types/Event/interface';

export interface IDeleteEventModalProps {
    eventListCardProps: IEventListCard;
    eventDeleteModalIsOpen: boolean;
    toggleDeleteModal: () => void;
    deleteEventHandler: (
        deleteOption?: 'single' | 'following' | 'all',
    ) => Promise<void>;
}

export type InterfaceDeleteEventModalProps = IDeleteEventModalProps;
