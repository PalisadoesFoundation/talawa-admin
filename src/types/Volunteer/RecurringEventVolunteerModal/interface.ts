/**
 * Props for the RecurringEventVolunteerModal component
 */
export interface InterfaceRecurringEventVolunteerModalProps {
  /** Controls the visibility of the modal */
  show: boolean;
  /** Callback function to hide/close the modal */
  onHide: () => void;
  /** The name of the recurring event */
  eventName: string;
  /** The date of the current event instance */
  eventDate: string;
  /** Callback when user chooses to volunteer for entire series */
  onSelectSeries: () => void;
  /** Callback when user chooses to volunteer for this instance only */
  onSelectInstance: () => void;
  /** Optional flag indicating if this is for joining a volunteer group */
  isForGroup?: boolean;
  /** Optional name of the volunteer group being joined */
  groupName?: string;
}
