import type { InterfaceEventListCardProps } from 'types/shared-components/EventListCard/interface';

/**
 * Props for EventListCardModals component.
 */
export interface InterfaceEventListCardModalsProps {
  /** Event card properties including event details. */
  eventListCardProps: InterfaceEventListCardProps;
  /** Whether the event modal is currently open. */
  eventModalIsOpen: boolean;
  /** Callback to hide the view modal. */
  hideViewModal: () => void;
  /** Translation function for localized strings. */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** Translation function for common localized strings. */
  tCommon: (key: string) => string;
}

// Re-export for backward compatibility if needed
export type InterfaceEventListCard = InterfaceEventListCardProps;
