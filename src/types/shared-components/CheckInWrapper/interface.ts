/**
 * Props for CheckInWrapper component.
 */
export interface InterfaceCheckInWrapperProps {
  /** The unique identifier of the event for which members are being checked in. */
  eventId: string;
  /** Optional callback invoked after check-in updates. */
  onCheckInUpdate?: () => void;
}
