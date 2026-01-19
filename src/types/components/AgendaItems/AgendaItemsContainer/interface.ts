import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaItemCategoryInfo,
} from 'utils/interfaces';

/**
 * Props for AgendaItemsContainer component.
 */
export interface InterfaceAgendaItemsContainerProps {
  agendaItemConnection: 'Event';
  agendaItemData: InterfaceAgendaItemInfo[] | undefined;
  agendaItemRefetch: () => void;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
}
