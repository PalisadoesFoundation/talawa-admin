/**
 * Interface for the AgendaItemsDeleteModal component props.
 * Defines the visibility state, event handlers, and translation functions required by the modal.
 */
export interface InterfaceAgendaItemsDeleteModalProps {
  /** Controls whether the delete confirmation modal is visible */
  agendaItemDeleteModalIsOpen: boolean;

  /** Function to toggle or close the modal visibility */
  toggleDeleteModal: () => void;

  /** Event handler to execute the logic for deleting an agenda item */
  deleteAgendaItemHandler: () => void;

  /** Translation function for specific namespaces */
  t: (key: string) => string;

  /** Common translation function for shared strings */
  tCommon: (key: string) => string;
}
