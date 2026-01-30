/**
 * Props for EventHeader component.
 */
export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
  YEAR = 'Year View',
}

export interface IEventHeaderProps {
  viewType: ViewType;
  handleChangeView: (item: string | null) => void;
  showInviteModal: () => void;
}

export type InterfaceEventHeaderProps = IEventHeaderProps;
