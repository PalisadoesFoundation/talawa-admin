/**
 * Interface for RecurringEventVolunteerModal component props
 */
export interface InterfaceRecurringEventVolunteerModalProps {
  /**
   * Whether the modal is visible
   */
  show: boolean;

  /**
   * Callback function to hide/close the modal
   */
  onHide: () => void;

  /**
   * Name of the event
   */
  eventName: string;

  /**
   * Date of the event instance (ISO string format)
   */
  eventDate: string;

  /**
   * Callback when user selects to volunteer for the entire series
   */
  onSelectSeries: () => void;

  /**
   * Callback when user selects to volunteer for a single instance
   */
  onSelectInstance: () => void;

  /**
   * Whether this is for joining a volunteer group (vs individual volunteering)
   */
  isForGroup?: boolean;

  /**
   * Name of the volunteer group (required when isForGroup is true)
   */
  groupName?: string;
}
