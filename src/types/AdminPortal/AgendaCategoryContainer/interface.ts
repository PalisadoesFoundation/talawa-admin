import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
/**
 * Props for AgendaCategoryContainer component.
 */
export interface InterfaceAgendaCategoryContainerProps {
  agendaCategoryConnection: 'Organization';
  agendaCategoryData: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaCategoryRefetch: () => void;
}
