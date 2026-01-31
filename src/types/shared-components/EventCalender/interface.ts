/**
 * View type options for the EventCalendar component.
 */
export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
  YEAR = 'Year View',
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
