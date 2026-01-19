/**
 * Props for AgendaCategoryContainer component.
 */
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
export interface InterfaceAgendaCategoryContainerProps {
  agendaCategoryConnection: 'Organization';
  agendaCategoryData: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaCategoryRefetch: () => void;
}
