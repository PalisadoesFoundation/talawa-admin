/**
 * Interface definitions for EventListCardPreviewModal component
 */

import type { Dispatch, SetStateAction } from 'react';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import type { InterfaceEventListCardProps } from 'types/shared-components/EventListCard/interface';

/**
 * User role enum for event permissions
 */
export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  REGULAR = 'REGULAR',
}

/**
 * Form state interface for event details
 */
export interface InterfaceEventFormState {
  name: string;
  eventdescrip: string;
  location: string;
  startTime: string;
  endTime: string;
}

/**
 * Props for the EventListCardPreviewModal component.
 */
export interface InterfacePreviewEventModalProps {
  eventListCardProps: InterfaceEventListCardProps;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  isRegistered?: boolean;
  userId: string;
  eventStartDate: Date;
  eventEndDate: Date;
  setEventStartDate: Dispatch<SetStateAction<Date>>;
  setEventEndDate: Dispatch<SetStateAction<Date>>;
  alldaychecked: boolean;
  setAllDayChecked: Dispatch<SetStateAction<boolean>>;
  publicchecked: boolean;
  setPublicChecked: Dispatch<SetStateAction<boolean>>;
  registrablechecked: boolean;
  setRegistrableChecked: Dispatch<SetStateAction<boolean>>;
  formState: InterfaceEventFormState;
  setFormState: (state: InterfaceEventFormState) => void;
  registerEventHandler: () => Promise<void>;
  handleEventUpdate: () => Promise<void>;
  openEventDashboard: () => void;
  recurrence: InterfaceRecurrenceRule | null;
  setRecurrence: Dispatch<SetStateAction<InterfaceRecurrenceRule | null>>;
  customRecurrenceModalIsOpen: boolean;
  setCustomRecurrenceModalIsOpen: Dispatch<SetStateAction<boolean>>;
}
