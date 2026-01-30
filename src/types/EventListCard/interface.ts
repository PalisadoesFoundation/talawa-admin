import type { InterfaceEvent } from 'types/Event/interface';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
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

/**
 * Input payload for updating an event. Optional fields are included only when changed.
 */
export interface InterfaceEventUpdateInput {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  isPublic?: boolean;
  isRegisterable?: boolean;
  isInviteOnly?: boolean;
  allDay?: boolean;
  startAt?: string;
  endAt?: string;
  /**
   * Recurrence rule for the event.
   * This field is used for updating the recurrence pattern.
   */
  recurrence?: InterfaceRecurrenceRule | null;
}

/**
 * Form state captured from the EventListCard edit modal.
 */
export interface InterfaceFormState {
  name: string;
  eventDescription: string;
  location: string;
  startTime: string;
  endTime: string;
}

/**
 * Arguments for the updateEventHandler function.
 */
export interface InterfaceUpdateEventHandlerProps {
  eventListCardProps: InterfaceEventListCard;
  formState: InterfaceFormState;
  allDayChecked: boolean;
  publicChecked: boolean;
  registerableChecked: boolean;
  inviteOnlyChecked: boolean;
  eventStartDate: Date;
  eventEndDate: Date;
  recurrence: InterfaceRecurrenceRule | null;
  updateOption: 'single' | 'following' | 'entireSeries';
  hasRecurrenceChanged?: boolean;
  t: TFunction<'translation', undefined>;
  hideViewModal: () => void;
  setEventUpdateModalIsOpen: (isOpen: boolean) => void;
  refetchEvents?: () => void;
}
