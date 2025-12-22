import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

/**
 * Base interface containing common fields for event form data.
 * @internal
 */
interface IEventFormBase {
  name: string;
  description: string;
  location: string;
  allDay: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
  recurrenceRule: InterfaceRecurrenceRule | null;
  createChat?: boolean;
}

/**
 * Form values interface for event creation/editing.
 * Extends base fields with Date objects and time strings for form inputs.
 */
export interface IEventFormValues extends IEventFormBase {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

/**
 * Payload interface for event form submission.
 * Extends base fields with ISO timestamp strings for API transmission.
 */
export interface IEventFormSubmitPayload extends IEventFormBase {
  startAtISO: string;
  endAtISO: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Props interface for the EventForm component.
 * Provides a reusable form for creating and editing events across Admin and User portals.
 *
 * @property initialValues - Initial form values
 * @property onSubmit - Callback fired when form is submitted with valid data
 * @property onCancel - Callback fired when form is cancelled
 * @property submitLabel - Label text for the submit button
 * @property t - Translation function for event-specific keys
 * @property tCommon - Translation function for common keys
 * @property showCreateChat - Whether to show the "Create Chat" toggle
 * @property showRegisterable - Whether to show the "Is Registerable" toggle
 * @property showPublicToggle - Whether to show the "Is Public" toggle
 * @property disableRecurrence - Whether to disable recurrence options
 * @property submitting - Whether the form is currently submitting
 * @property showRecurrenceToggle - Whether to show the recurrence toggle
 * @property showCancelButton - Whether to show the cancel button
 */
export interface IEventFormProps {
  initialValues: IEventFormValues;
  onSubmit: (payload: IEventFormSubmitPayload) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
  t: (key: string, options?: Record<string, unknown>) => string;
  tCommon: (key: string, options?: Record<string, unknown>) => string;
  showCreateChat?: boolean;
  showRegisterable?: boolean;
  showPublicToggle?: boolean;
  disableRecurrence?: boolean;
  submitting?: boolean;
  showRecurrenceToggle?: boolean;
  showCancelButton?: boolean;
}
