/**
 * Event list card props extending InterfaceEvent.
 * `@remarks` refetchEvents is optional and triggers a refresh when provided.
 */
import type { InterfaceEvent } from 'types/Event/interface';
import type { TFunction } from 'i18next';

export interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}
/**
 * Props for EventListCardModals component.
 */

export interface InterfaceEventListCardModalsProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  // Use TFunction to match expected types and avoid $TFunctionBrand errors
  t: TFunction<'translation', undefined>;
  tCommon: TFunction<'translation', undefined>;
}
