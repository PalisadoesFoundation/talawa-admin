import type { InterfaceCalendarProps } from 'types/Event/interface';

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

/**
 * Props for EventCalendar component.
 */
export interface InterfaceEventCalenderProps extends InterfaceCalendarProps {
  onMonthChange: (month: number, year: number) => void;
  currentMonth: number;
  currentYear: number;
}
