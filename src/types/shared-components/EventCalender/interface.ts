/**
 * View type options for the EventCalendar component.
 */
export enum ViewType {
  DAY = 'day',
  MONTH = 'monthView',
  YEAR = 'yearView',
}

/**
 * Props for EventHeader component.
 */
export interface IEventHeaderProps {
  viewType: ViewType;
  handleChangeView: (item: string | null) => void;
  showInviteModal: () => void;
}

export type InterfaceEventHeaderProps = IEventHeaderProps;
