/**
 * Interface for the AgendaItemsDeleteModal component props.
 */
export interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaItemHandler: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

