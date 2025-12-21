import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

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

export interface IEventFormValues extends IEventFormBase {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

export interface IEventFormSubmitPayload extends IEventFormBase {
  startAtISO: string;
  endAtISO: string;
  startDate: Date;
  endDate: Date;
}

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
