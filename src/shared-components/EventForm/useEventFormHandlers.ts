/**
 * Custom hook for EventForm toggle handlers.
 * @module EventForm/useEventFormHandlers
 */
import type { Dispatch, SetStateAction } from 'react';
import type { IEventFormValues } from 'types/EventForm/interface';

interface IUseEventFormHandlersProps {
  setFormState: Dispatch<SetStateAction<IEventFormValues>>;
  disableRecurrence: boolean;
  showRecurrenceToggle: boolean;
  setRecurrenceEnabled: Dispatch<SetStateAction<boolean>>;
}

/**
 * Hook that provides toggle handlers for EventForm.
 * @param props - Handler configuration props
 * @returns Object containing toggle handler functions
 */
export const useEventFormHandlers = ({
  setFormState,
  disableRecurrence,
  showRecurrenceToggle,
  setRecurrenceEnabled,
}: IUseEventFormHandlersProps) => {
  const toggleAllDay = (): void => {
    setFormState((prev) => ({
      ...prev,
      allDay: !prev.allDay,
      startTime: prev.startTime,
      endTime: prev.endTime,
    }));
  };

  const toggleRecurrence = (): void => {
    if (disableRecurrence || !showRecurrenceToggle) return;
    setRecurrenceEnabled((prev) => {
      // Clear recurrence rule when disabling (prev was true, becoming false)
      if (prev) {
        setFormState((formPrev) => ({
          ...formPrev,
          recurrenceRule: null,
        }));
      }
      return !prev;
    });
  };

  return { toggleAllDay, toggleRecurrence };
};
