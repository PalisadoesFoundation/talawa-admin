import { InterfaceEvent } from 'types/Event/interface';

/**
 * Extended event interface for EventListCard with optional refetch capability.
 */
export interface InterfaceEventListCard extends InterfaceEvent {
  /** Callback to refetch events after mutations. */
  refetchEvents?: () => void;
}

/**
 * Props for EventListCardModals component.
 */
export interface InterfaceEventListCardModalsProps {
  /** Event card properties including event details. */
  eventListCardProps: InterfaceEventListCard;
  /** Whether the event modal is currently open. */
  eventModalIsOpen: boolean;
  /** Callback to hide the view modal. */
  hideViewModal: () => void;
  /** Translation function for localized strings. */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** Translation function for common localized strings. */
  tCommon: (key: string) => string;
}
