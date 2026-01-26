import type { InterfaceEvent } from 'types/Event/interface';
import type { TFunction } from 'i18next';

/**
 * Event list card props extending InterfaceEvent.
 * @remarks refetchEvents is optional and triggers a refresh when provided.
 */
export interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}
/**
 * Props for EventListCardModals component.
 * @param eventListCardProps - The event card properties including event details.
 * @param eventModalIsOpen - Whether the modal is currently visible.
 * @param hideViewModal - Callback to close the modal.
 * @param t - Translation function scoped to 'translation' namespace.
 * @param tCommon - Translation function for common strings.
 */

export interface InterfaceEventListCardModalsProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  // Use TFunction to match expected types and avoid $TFunctionBrand errors
  t: TFunction<'translation', undefined>;
  tCommon: TFunction<'translation', undefined>;
}
