/**
 * Interface for the AgendaItemsDeleteModal component props.
 *
 * @property agendaItemDeleteModalIsOpen - Boolean to control modal visibility.
 * @property toggleDeleteModal - Function to close the modal.
 * @property deleteAgendaItemHandler - Function to execute the deletion logic.
 * @property t - Translation function for specific namespace.
 * @property tCommon - Translation function for common namespace.
 */
export interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaItemHandler: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}
