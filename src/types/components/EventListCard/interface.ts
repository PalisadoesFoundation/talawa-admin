/**
 * Interface definitions for EventListCard component
 */

import type { InterfaceEvent } from 'types/Event/interface';

/**
 * Props for the EventListCard component.
 */
export interface InterfaceEventListCardProps extends InterfaceEvent {
  /**
   * Optional callback function to refetch events after an action.
   */
  refetchEvents?: () => void;
}
