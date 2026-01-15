/**
 * Props for EventRegistrantsModal component.
 */
export interface InterfaceEventRegistrantsModalProps {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

/**
 * Props for EventRegistrantsWrapper component.
 */
export interface InterfaceEventRegistrantsWrapperProps {
  eventId: string;
  orgId: string;
  onUpdate?: () => void;
}
