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
  /**
   * Determines if the event is visible to the entire community.
   * Often referred to as "Community Visible" in the UI.
   */
  isPublic: boolean;
  /**
   * Determines if the event is accessible only by invitation.
   * Mutually exclusive with isPublic.
   */
  isInviteOnly: boolean;
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
 * - `initialValues`: Initial form values
 * - `onSubmit`: Callback fired when form is submitted with valid data
 * - `onCancel`: Callback fired when form is cancelled
 * - `submitLabel`: Label text for the submit button
 * - `showCreateChat`: Whether to show the "Create Chat" toggle
 * - `showRegisterable`: Whether to show the "Is Registerable" toggle
 * - `showPublicToggle`: Whether to show the "Is Public" toggle
 * - `disableRecurrence`: Whether to disable recurrence options
 * - `submitting`: Whether the form is currently submitting
 * - `showRecurrenceToggle`: Whether to show the recurrence toggle
 * - `showCancelButton`: Whether to show the cancel button
 * - `readOnly`: If true, all fields are disabled (view-only/preview mode for non-editors)
 * - `hideSubmitButton`: If true, the built-in submit button is hidden (parent manages footer)
 * - `onStateChange`: Callback fired when the form state changes
 */
export interface IEventFormProps {
  initialValues: IEventFormValues;
  onSubmit: (payload: IEventFormSubmitPayload) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
  showCreateChat?: boolean;
  showRegisterable?: boolean;
  showPublicToggle?: boolean;

  disableRecurrence?: boolean;
  submitting?: boolean;
  showRecurrenceToggle?: boolean;
  showCancelButton?: boolean;
  /**
   * If true, all form fields are disabled (view-only mode).
   * Used when the PreviewModal is opened by a user who can't edit the event.
   */
  readOnly?: boolean;
  /**
   * If true, the built-in submit button is hidden.
   * Use when the parent component manages its own footer action buttons.
   */
  hideSubmitButton?: boolean;
  /**
   * Optional callback fired whenever the internal form state changes.
   * Useful for syncing state to a parent component that manages complex layout or options before submit.
   */
  onStateChange?: (state: IEventFormValues) => void;
  /**
   * Optional. When provided (e.g. from EventListCardModals), the recurrence modal is controlled by the parent.
   */
  customRecurrenceModalIsOpen?: boolean;
  setCustomRecurrenceModalIsOpen?: (
    state: boolean | ((prev: boolean) => boolean),
  ) => void;
  hideCustomRecurrenceModal?: () => void;
}
