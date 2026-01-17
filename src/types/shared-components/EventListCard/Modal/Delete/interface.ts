import type { IEventListCard } from 'types/Event/interface';

export interface IDeleteEventModalProps {
    eventListCardProps: IEventListCard;
    eventDeleteModalIsOpen: boolean;
    toggleDeleteModal: () => void;
    t: (key: string) => string;
    tCommon: (key: string) => string;
    deleteEventHandler: (
        deleteOption?: 'single' | 'following' | 'all',
    ) => Promise<void>;
}

export type InterfaceDeleteEventModalProps = IDeleteEventModalProps;
