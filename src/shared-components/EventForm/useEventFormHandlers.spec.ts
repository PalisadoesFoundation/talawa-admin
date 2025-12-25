import { renderHook, act } from '@testing-library/react';
import { useEventFormHandlers } from './useEventFormHandlers';
import { vi } from 'vitest';
import type { IEventFormValues } from 'types/EventForm/interface';
import { Frequency } from 'utils/recurrenceUtils';

describe('useEventFormHandlers', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('toggleAllDay updates form state correctly', () => {
    const setFormState = vi.fn();
    const setRecurrenceEnabled = vi.fn();

    const { result } = renderHook(() =>
      useEventFormHandlers({
        setFormState,
        disableRecurrence: false,
        showRecurrenceToggle: true,
        setRecurrenceEnabled,
      }),
    );

    act(() => {
      result.current.toggleAllDay();
    });

    expect(setFormState).toHaveBeenCalledWith(expect.any(Function));

    // Test the updater function
    const updater = setFormState.mock.calls[0][0];
    const prevState: IEventFormValues = {
      name: 'Test',
      description: 'Desc',
      location: 'Location',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '08:00:00',
      endTime: '10:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: null,
      createChat: false,
    };

    const newState = updater(prevState);
    expect(newState.allDay).toBe(true);
    expect(newState.startTime).toBe('08:00:00');
    expect(newState.endTime).toBe('10:00:00');
  });

  test('toggleRecurrence enables recurrence when disabled', () => {
    const setFormState = vi.fn();
    const setRecurrenceEnabled = vi.fn();

    const { result } = renderHook(() =>
      useEventFormHandlers({
        setFormState,
        disableRecurrence: false,
        showRecurrenceToggle: true,
        setRecurrenceEnabled,
      }),
    );

    act(() => {
      result.current.toggleRecurrence();
    });

    expect(setRecurrenceEnabled).toHaveBeenCalledWith(expect.any(Function));

    // Test the updater function - when prev is false (disabled), it should become true
    const updater = setRecurrenceEnabled.mock.calls[0][0];
    const newValue = updater(false);
    expect(newValue).toBe(true);
    // When enabling (prev was false), formState should not be updated
    expect(setFormState).not.toHaveBeenCalled();
  });

  test('toggleRecurrence disables recurrence and clears rule when enabled', () => {
    const setFormState = vi.fn();
    const setRecurrenceEnabled = vi.fn();

    const { result } = renderHook(() =>
      useEventFormHandlers({
        setFormState,
        disableRecurrence: false,
        showRecurrenceToggle: true,
        setRecurrenceEnabled,
      }),
    );

    act(() => {
      result.current.toggleRecurrence();
    });

    expect(setRecurrenceEnabled).toHaveBeenCalledWith(expect.any(Function));

    // Test the updater function - when prev is true (enabled), it should become false
    const updater = setRecurrenceEnabled.mock.calls[0][0];
    const newValue = updater(true);
    expect(newValue).toBe(false);
    // When disabling (prev was true), formState should be updated to clear the rule
    expect(setFormState).toHaveBeenCalledWith(expect.any(Function));

    // Test the formState updater
    const formUpdater = setFormState.mock.calls[0][0];
    const prevFormState: IEventFormValues = {
      name: 'Test',
      description: 'Desc',
      location: 'Location',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '08:00:00',
      endTime: '10:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: { frequency: Frequency.DAILY, interval: 1, never: true },
      createChat: false,
    };

    const newFormState = formUpdater(prevFormState);
    expect(newFormState.recurrenceRule).toBeNull();
  });

  test('toggleRecurrence does nothing when disableRecurrence is true', () => {
    const setFormState = vi.fn();
    const setRecurrenceEnabled = vi.fn();

    const { result } = renderHook(() =>
      useEventFormHandlers({
        setFormState,
        disableRecurrence: true,
        showRecurrenceToggle: true,
        setRecurrenceEnabled,
      }),
    );

    act(() => {
      result.current.toggleRecurrence();
    });

    expect(setRecurrenceEnabled).not.toHaveBeenCalled();
    expect(setFormState).not.toHaveBeenCalled();
  });

  test('toggleRecurrence does nothing when showRecurrenceToggle is false', () => {
    const setFormState = vi.fn();
    const setRecurrenceEnabled = vi.fn();

    const { result } = renderHook(() =>
      useEventFormHandlers({
        setFormState,
        disableRecurrence: false,
        showRecurrenceToggle: false,
        setRecurrenceEnabled,
      }),
    );

    act(() => {
      result.current.toggleRecurrence();
    });

    expect(setRecurrenceEnabled).not.toHaveBeenCalled();
    expect(setFormState).not.toHaveBeenCalled();
  });
});
