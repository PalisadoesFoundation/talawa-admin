import React from 'react';
import { render, screen, act, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import EventForm, { formatRecurrenceForPayload } from './EventForm';

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        const translations: Record<string, string> = {
          eventName: 'Name',
          enterName: 'Enter Name',
          enterDescription: 'Enter Description',
          allDay: 'All Day',
          recurring: 'Recurring',
          registerable: 'Is Registerable',
          createChat: 'Create Chat',
          doesNotRepeat: 'Does not repeat',
          custom: 'Custom',
          daily: 'Daily',
          weeklyOn: `Weekly on ${params?.day}`,
          monthlyOnDay: `Monthly on day ${params?.day}`,
          annuallyOn: `Annually on ${params?.month} ${params?.day}`,
          everyWeekday: 'Every weekday',
          monday: 'Monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday',
          january: 'January',
          february: 'February',
          march: 'March',
          april: 'April',
          may: 'May',
          june: 'June',
          july: 'July',
          august: 'August',
          september: 'September',
          october: 'October',
          november: 'November',
          december: 'December',
        };
        return translations[key] || key;
      },
    }),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  };
});

dayjs.extend(utc);
import type { IEventFormValues } from 'types/EventForm/interface';
import { Frequency, createDefaultRecurrenceRule } from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

// Mock the wrapper components instead of MUI directly to verify EventForm uses them
vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: vi.fn(
    (props: {
      label?: string;
      value: dayjs.Dayjs | null;
      onChange?: (date: dayjs.Dayjs | null) => void;
      minDate?: dayjs.Dayjs | null;
      'data-testid'?: string;
    }) => {
      const {
        label,
        value,
        onChange,
        minDate,
        'data-testid': dataTestId,
      } = props;
      return (
        <div data-testid="date-picker-wrapper">
          <input
            data-testid={dataTestId || label || 'date-picker-input'}
            value={value ? value.format('YYYY-MM-DD') : ''}
            onChange={(e) => {
              if (onChange) {
                const newDate = e.target.value ? dayjs(e.target.value) : null;
                if (
                  !minDate ||
                  !newDate ||
                  newDate.isAfter(minDate) ||
                  newDate.isSame(minDate)
                ) {
                  onChange(newDate);
                }
              }
            }}
          />
        </div>
      );
    },
  ),
}));

vi.mock('shared-components/TimePicker', () => ({
  __esModule: true,
  default: vi.fn(
    (props: {
      label?: string;
      value: dayjs.Dayjs | null;
      onChange?: (time: dayjs.Dayjs | null) => void;
      minTime?: dayjs.Dayjs | null;
      disabled?: boolean;
      'data-testid'?: string;
    }) => {
      const {
        label,
        value,
        onChange,
        minTime,
        disabled,
        'data-testid': dataTestId,
      } = props;
      const today = ['2025', '01', '01'].join('-'); // deterministic base date
      return (
        <div data-testid="time-picker-wrapper">
          <input
            data-testid={dataTestId || label || 'time-picker-input'}
            value={value ? value.format('HH:mm:ss') : ''}
            disabled={disabled}
            onChange={(e) => {
              if (!disabled && onChange) {
                const val = e.target.value;
                const newTime = val ? dayjs(today + 'T' + val) : null;
                if (
                  !minTime ||
                  !newTime ||
                  newTime.isAfter(minTime) ||
                  newTime.isSame(minTime)
                ) {
                  onChange(newTime);
                }
              }
            }}
          />
        </div>
      );
    },
  ),
}));

vi.mock('shared-components/Recurrence/CustomRecurrenceModal', () => ({
  __esModule: true,
  default: ({
    customRecurrenceModalIsOpen,
    setRecurrenceRuleState,
    setEndDate,
    hideCustomRecurrenceModal,
    setCustomRecurrenceModalIsOpen,
  }: {
    customRecurrenceModalIsOpen: boolean;
    setRecurrenceRuleState: (
      state:
        | InterfaceRecurrenceRule
        | ((prev: InterfaceRecurrenceRule) => InterfaceRecurrenceRule),
    ) => void;
    setEndDate: (state: Date | ((prev: Date) => Date)) => void;
    hideCustomRecurrenceModal: () => void;
    setCustomRecurrenceModalIsOpen: (state: boolean) => void;
  }) => {
    if (customRecurrenceModalIsOpen) {
      return (
        <div data-testid="customRecurrenceModalMock">
          <button
            type="button"
            data-testid="updateRecurrenceRule"
            onClick={() => {
              // Use dynamic date to avoid test staleness
              const newRule = createDefaultRecurrenceRule(
                dayjs().add(30, 'days').toDate(),
                Frequency.DAILY,
              );
              setRecurrenceRuleState(newRule);
            }}
          >
            Update Rule
          </button>
          <button
            type="button"
            data-testid="updateRecurrenceRuleFunction"
            onClick={() => {
              setRecurrenceRuleState((prev: InterfaceRecurrenceRule) => ({
                ...prev,
                interval: 2,
              }));
            }}
          >
            Update Rule Function
          </button>
          <button
            type="button"
            data-testid="updateEndDate"
            onClick={() => {
              // Use dynamic date to avoid test staleness
              setEndDate(dayjs().add(40, 'days').toDate());
            }}
          >
            Update End Date
          </button>
          <button
            type="button"
            data-testid="updateEndDateFunction"
            onClick={() => {
              setEndDate((prev: Date) => new Date(prev.getTime() + 86400000));
            }}
          >
            Update End Date Function
          </button>
          <button
            type="button"
            data-testid="setEndDateNull"
            onClick={() => {
              setEndDate(null as unknown as Date);
            }}
          >
            Set End Date Null
          </button>
          <button
            type="button"
            data-testid="setEndDateFunctionNull"
            onClick={() => {
              setEndDate(() => null as unknown as Date);
            }}
          >
            Set End Date Function Null
          </button>
          <button
            type="button"
            data-testid="closeModal"
            onClick={() => {
              hideCustomRecurrenceModal();
            }}
          >
            Close
          </button>
          <button
            type="button"
            data-testid="setModalOpen"
            onClick={() => {
              setCustomRecurrenceModalIsOpen(false);
            }}
          >
            Set Open False
          </button>
        </div>
      );
    }
    return null;
  },
}));

// Use future dates to ensure tests don't break when hardcoded dates become past dates
// These dates are calculated from a stable fixed timestamp
const FIXED_BASE_DATE = new Date(['2050', '01', '01T10:00:00.000Z'].join('-'));
const futureStartDate = dayjs
  .utc(FIXED_BASE_DATE)
  .add(30, 'day')
  .startOf('day')
  .toDate();
const futureEndDate = dayjs
  .utc(FIXED_BASE_DATE)
  .add(31, 'day')
  .startOf('day')
  .toDate();

const baseValues: IEventFormValues = {
  name: 'Test Event',
  description: 'Desc',
  location: 'Hall',
  startDate: futureStartDate,
  endDate: futureEndDate,
  startTime: '08:00:00',
  endTime: '10:00:00',
  allDay: true,
  isPublic: true,
  isInviteOnly: false,
  isRegisterable: true,
  recurrenceRule: null,
  createChat: false,
};
describe('EventForm', () => {
  const user = userEvent.setup();
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  test('submits with computed ISO dates for all-day event with future dates', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await user.click(screen.getByTestId('createEventBtn'));
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Event',
        // For future dates, startAtISO should be at midnight (start of day)
        startAtISO: dayjs.utc(futureStartDate).startOf('day').toISOString(),
        endAtISO: dayjs.utc(futureEndDate).endOf('day').toISOString(),
      }),
    );
  });

  describe('all-day event edge cases for today/past dates', () => {
    test('uses current time + buffer for all-day event when startDate is today and start of day is past', async () => {
      // Use shouldAdvanceTime:true so real async (React scheduler, Promises) still work
      // while Date.now() / new Date() return our controlled fake time
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const FAKE_TODAY = new Date(['2025', '01', '01T14:00:00.000Z'].join('-'));
      vi.setSystemTime(FAKE_TODAY);

      const handleSubmit = vi.fn();
      const todayValues: IEventFormValues = {
        ...baseValues,
        startDate: FAKE_TODAY,
        endDate: FAKE_TODAY, // Same day event
        allDay: true,
      };

      const beforeRender = dayjs.utc();

      render(
        <EventForm
          initialValues={todayValues}
          onSubmit={handleSubmit}
          onCancel={vi.fn()}
          submitLabel="Create"
        />,
      );

      // Use outer `user` - shouldAdvanceTime keeps real async working
      await user.click(screen.getByTestId('createEventBtn'));

      expect(handleSubmit).toHaveBeenCalled();
      const call = handleSubmit.mock.calls[0][0];

      // Verify startAtISO is near current time (not midnight)
      const startAt = dayjs(call.startAtISO);
      const startOfDay = dayjs.utc(FAKE_TODAY).startOf('day');

      // If start of day is in the past, startAtISO should be near now (not at midnight)
      if (startOfDay.isBefore(beforeRender)) {
        // startAtISO should be close to "now" (within a reasonable window)
        expect(startAt.isAfter(beforeRender.subtract(1, 'minute'))).toBe(true);
        // It should also be in the future (now + buffer)
        expect(startAt.isAfter(beforeRender)).toBe(true);
      }

      // endAtISO should be end of the end date
      const endAt = dayjs(call.endAtISO);
      const expectedEnd = dayjs.utc(FAKE_TODAY).endOf('day');
      expect(endAt.isSame(expectedEnd, 'minute')).toBe(true);
    });

    test('all-day event for today late at night results in short duration (known limitation)', async () => {
      // This test documents the current behavior when creating an all-day event
      // for "today" late in the day. The startAtISO gets adjusted to now + 10s,
      // but endAtISO remains endOf('day'), resulting in a potentially short event.
      //
      // IMPORTANT: This is a known limitation. If user creates an "all-day" event
      // at 11 PM for today:
      //   - startAtISO = ~11:00:10 PM
      //   - endAtISO = ~11:59:59 PM
      //   - Duration = ~1 hour (not a full day)
      //
      // This behavior is intentional to allow the API validation to pass
      // (startAt must be in the future). The alternative would be to push
      // the event to start the next day, but that changes user intent.

      const handleSubmit = vi.fn();
      const today = new Date();
      const todayValues: IEventFormValues = {
        ...baseValues,
        startDate: today,
        endDate: today,
        allDay: true,
      };

      render(
        <EventForm
          initialValues={todayValues}
          onSubmit={handleSubmit}
          onCancel={vi.fn()}
          submitLabel="Create"
        />,
      );

      await user.click(screen.getByTestId('createEventBtn'));

      expect(handleSubmit).toHaveBeenCalled();
      const call = handleSubmit.mock.calls[0][0];

      const startAt = dayjs(call.startAtISO);
      const endAt = dayjs(call.endAtISO);

      // Verify end is after start (event is valid)
      expect(endAt.isAfter(startAt)).toBe(true);

      // Document: the duration may be less than a full day
      // when start of day has already passed
      const durationHours = endAt.diff(startAt, 'hour');
      // Duration will be <= 24 hours (could be much less if created late in day)
      expect(durationHours).toBeLessThanOrEqual(24);
    });

    test('all-day event for future date uses midnight start time', async () => {
      const handleSubmit = vi.fn();
      // Use a future date that's definitely not today
      const futureDate = dayjs().add(7, 'day').toDate();
      const futureValues: IEventFormValues = {
        ...baseValues,
        startDate: futureDate,
        endDate: futureDate,
        allDay: true,
      };

      render(
        <EventForm
          initialValues={futureValues}
          onSubmit={handleSubmit}
          onCancel={vi.fn()}
          submitLabel="Create"
        />,
      );

      await act(async () => {
        await user.click(screen.getByTestId('createEventBtn'));
      });

      expect(handleSubmit).toHaveBeenCalled();
      const call = handleSubmit.mock.calls[0][0];

      const startAt = dayjs(call.startAtISO);
      const expectedStart = dayjs.utc(futureDate).startOf('day');

      // For future dates, start should be at midnight (start of day)
      expect(startAt.isSame(expectedStart)).toBe(true);

      // End should be end of the day
      const endAt = dayjs(call.endAtISO);
      const expectedEnd = dayjs.utc(futureDate).endOf('day');
      expect(endAt.isSame(expectedEnd, 'minute')).toBe(true);

      // Duration should be ~24 hours for a full day event
      const durationHours = endAt.diff(startAt, 'hour');
      expect(durationHours).toBeGreaterThanOrEqual(23); // Allow for slight rounding
    });

    test('all-day event spanning multiple days with past start adjusts only start time', async () => {
      const handleSubmit = vi.fn();
      const today = new Date();
      const tomorrow = dayjs(today).add(1, 'day').toDate();
      const multiDayValues: IEventFormValues = {
        ...baseValues,
        startDate: today, // Start today (past start of day)
        endDate: tomorrow, // End tomorrow
        allDay: true,
      };

      const beforeRender = dayjs.utc();

      render(
        <EventForm
          initialValues={multiDayValues}
          onSubmit={handleSubmit}
          onCancel={vi.fn()}
          submitLabel="Create"
        />,
      );

      await act(async () => {
        await user.click(screen.getByTestId('createEventBtn'));
      });

      expect(handleSubmit).toHaveBeenCalled();
      const call = handleSubmit.mock.calls[0][0];

      const startAt = dayjs(call.startAtISO);
      const endAt = dayjs(call.endAtISO);

      // Start should be adjusted if today's midnight has passed
      const startOfToday = dayjs.utc(today).startOf('day');
      if (startOfToday.isBefore(beforeRender)) {
        // startAtISO should be near "now", not at midnight
        expect(startAt.isAfter(beforeRender.subtract(1, 'minute'))).toBe(true);
      }

      // End should be end of tomorrow regardless
      const expectedEnd = dayjs.utc(tomorrow).endOf('day');
      expect(endAt.isSame(expectedEnd, 'minute')).toBe(true);

      // Event should span more than 24 hours when spanning to next day
      const durationHours = endAt.diff(startAt, 'hour');
      expect(durationHours).toBeGreaterThan(12); // At least half a day to next day's end
    });
  });

  test('enables recurrence toggle and opens custom modal', async () => {
    const handleSubmit = vi.fn();
    // Start with a rule so dropdown is visible
    // Use fixed base date instead of dynamic date to avoid test staleness
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle
      />,
    );

    // Recurrence is already enabled when rule exists, so dropdown is visible
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();
  });

  // TODO: Test 'handles time change when not all-day' removed - direct MUI picker input doesn't work in test environment

  test('formatRecurrenceForPayload formats recurrence rule', () => {
    // Use fixed base date instead of dynamic date to avoid test staleness
    const futureDate = dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate();
    const rule = createDefaultRecurrenceRule(futureDate, Frequency.WEEKLY);
    const result = formatRecurrenceForPayload(rule, futureDate);
    expect(result).toEqual(
      expect.objectContaining({
        frequency: Frequency.WEEKLY,
      }),
    );
  });

  test('formatRecurrenceForPayload returns null for null rule', () => {
    // Use fixed base date instead of dynamic date to avoid test staleness
    const result = formatRecurrenceForPayload(
      null,
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
    );
    expect(result).toBeNull();
  });

  test('formatRecurrenceForPayload throws error for invalid rule', () => {
    const invalidRule: InterfaceRecurrenceRule = {
      frequency: Frequency.DAILY,
      interval: 0, // Invalid interval
      never: false,
    };
    expect(() => {
      // Use fixed base date instead of dynamic date to avoid test staleness
      formatRecurrenceForPayload(
        invalidRule,
        dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      );
    }).toThrow();
  });

  test('prevents submission with empty name', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, name: '   ' }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('prevents submission with empty description', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, description: '   ' }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('prevents submission with empty location', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, location: '   ' }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('prevents submission with invalid recurrence rule', async () => {
    const handleSubmit = vi.fn();
    const invalidRule: InterfaceRecurrenceRule = {
      frequency: Frequency.DAILY,
      interval: 0,
      never: false,
    };
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: invalidRule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we don't need to toggle it. Just submit and it should fail validation.
    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('selects recurrence preset option', async () => {
    const handleSubmit = vi.fn();
    // Start with a rule so dropdown is visible
    // Use fixed base date instead of dynamic date to avoid test staleness
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists, so dropdown is visible
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    // Select daily option (index 1)
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[1]);
    });

    // Submit
    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          frequency: Frequency.DAILY,
        }),
      }),
    );
  });

  test('toggles recurrence off', async () => {
    const handleSubmit = vi.fn();
    // Use fixed base date instead of dynamic date to avoid test staleness
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
      />,
    );

    // Toggle recurrence off
    await act(async () => {
      await user.click(screen.getByTestId('recurringEventCheck'));
    });

    // Submit
    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: null,
      }),
    );
  });

  test('updates end date', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const endDateInput = screen.getByTestId('eventEndAt');
    // Use fixed base date instead of dynamic date to avoid test staleness
    const newEndDate = dayjs
      .utc(FIXED_BASE_DATE)
      .add(40, 'days')
      .format('YYYY-MM-DD');
    await act(async () => {
      await user.clear(endDateInput);
      await user.type(endDateInput, newEndDate);
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  test('updates start time and adjusts end time if needed', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, allDay: false }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const startTimeInput = screen.getByTestId('startTime');
    await act(async () => {
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '14:00:00');
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  test('updates end time', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, allDay: false }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const endTimeInput = screen.getByTestId('endTime');
    await act(async () => {
      await user.clear(endTimeInput);
      await user.type(endTimeInput, '15:00:00');
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  test('toggles all-day event', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, allDay: false }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('allDayEventCheck'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        allDay: true,
      }),
    );
  });

  describe('Event Visibility', () => {
    test('defaults to INVITE_ONLY when creating a new event', () => {
      // Create empty initial values typical for a "Create" scenario
      const newEventValues: IEventFormValues = {
        ...baseValues,
        name: '', // Empty name implies new
        isPublic: false,
        isInviteOnly: false,
      };

      render(
        <EventForm
          initialValues={newEventValues}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Create"
          showPublicToggle
        />,
      );

      // Verify Invite Only is checked by default
      expect(screen.getByTestId('visibilityInviteRadio')).toBeChecked();
      expect(screen.getByTestId('visibilityPublicRadio')).not.toBeChecked();
      expect(screen.getByTestId('visibilityOrgRadio')).not.toBeChecked();
    });

    test('populates visibility correctly from existing initialValues (PUBLIC)', () => {
      render(
        <EventForm
          initialValues={{ ...baseValues, isPublic: true, isInviteOnly: false }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Update"
          showPublicToggle
        />,
      );
      expect(screen.getByTestId('visibilityPublicRadio')).toBeChecked();
    });

    test('populates visibility correctly from existing initialValues (INVITE_ONLY)', () => {
      render(
        <EventForm
          initialValues={{ ...baseValues, isPublic: false, isInviteOnly: true }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Update"
          showPublicToggle
        />,
      );
      expect(screen.getByTestId('visibilityInviteRadio')).toBeChecked();
    });

    test('populates visibility correctly from existing initialValues (ORGANIZATION)', () => {
      render(
        <EventForm
          initialValues={{
            ...baseValues,
            isPublic: false,
            isInviteOnly: false,
          }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Update"
          showPublicToggle
        />,
      );
      expect(screen.getByTestId('visibilityOrgRadio')).toBeChecked();
    });

    test('updates visibility when initialValues change dynamically', () => {
      const { rerender } = render(
        <EventForm
          initialValues={{
            ...baseValues,
            isPublic: false, // Start as Invite Only
            isInviteOnly: true,
          }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Update"
          showPublicToggle
        />,
      );
      expect(screen.getByTestId('visibilityInviteRadio')).toBeChecked();

      // Rerender with Organization visibility
      rerender(
        <EventForm
          initialValues={{
            ...baseValues,
            name: 'Existing Event',
            isPublic: false,
            isInviteOnly: false,
          }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Update"
          showPublicToggle
        />,
      );
      expect(screen.getByTestId('visibilityOrgRadio')).toBeChecked();
    });

    test('toggles event visibility options correctly', async () => {
      const handleSubmit = vi.fn();
      render(
        <EventForm
          initialValues={{
            ...baseValues,
            isPublic: false,
            isInviteOnly: false, // Starts as ORGANIZATION
          }}
          onSubmit={handleSubmit}
          onCancel={vi.fn()}
          submitLabel="Create"
          showPublicToggle
        />,
      );

      // 1. Switch to PUBLIC
      await act(async () => {
        await user.click(screen.getByTestId('visibilityPublicRadio'));
      });
      // Submit and verify payload
      await act(async () => {
        await user.click(screen.getByTestId('createEventBtn'));
      });
      expect(handleSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPublic: true,
          isInviteOnly: false,
          isRegisterable: true, // Default
        }),
      );

      // 2. Switch to INVITE_ONLY
      await act(async () => {
        await user.click(screen.getByTestId('visibilityInviteRadio'));
      });
      await act(async () => {
        await user.click(screen.getByTestId('createEventBtn'));
      });
      expect(handleSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPublic: false,
          isInviteOnly: true,
        }),
      );

      // 3. Switch to ORGANIZATION
      await act(async () => {
        await user.click(screen.getByTestId('visibilityOrgRadio'));
      });
      await act(async () => {
        await user.click(screen.getByTestId('createEventBtn'));
      });
      expect(handleSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPublic: false,
          isInviteOnly: false,
        }),
      );
    });
  });

  describe('readOnly, hideSubmitButton, and onStateChange', () => {
    test('disables all form controls when readOnly is true', () => {
      render(
        <EventForm
          initialValues={{ ...baseValues, name: 'Test Event' }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Create"
          showRecurrenceToggle
          showPublicToggle
          readOnly={true}
        />,
      );
      expect(screen.getByTestId('eventTitleInput')).toBeDisabled();
      expect(screen.getByTestId('eventDescriptionInput')).toBeDisabled();
      expect(screen.getByTestId('eventLocationInput')).toBeDisabled();
      expect(screen.getByTestId('allDayEventCheck')).toBeDisabled();
      expect(screen.getByTestId('registerableEventCheck')).toBeDisabled();
      expect(screen.getByTestId('visibilityPublicRadio')).toBeDisabled();
      expect(screen.getByTestId('visibilityOrgRadio')).toBeDisabled();
      expect(screen.getByTestId('createEventBtn')).toBeDisabled();
    });

    test('hides submit button when hideSubmitButton is true', () => {
      render(
        <EventForm
          initialValues={baseValues}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Create"
          showRecurrenceToggle
          hideSubmitButton={true}
        />,
      );
      expect(screen.queryByTestId('createEventBtn')).not.toBeInTheDocument();
    });

    test('shows submit button when hideSubmitButton is false', () => {
      render(
        <EventForm
          initialValues={baseValues}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Create"
          showRecurrenceToggle
          hideSubmitButton={false}
        />,
      );
      expect(screen.getByTestId('createEventBtn')).toBeInTheDocument();
    });

    test('calls onStateChange when form state changes', async () => {
      const mockOnStateChange = vi.fn();
      render(
        <EventForm
          initialValues={baseValues}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Create"
          showRecurrenceToggle
          onStateChange={mockOnStateChange}
        />,
      );
      const titleInput = screen.getByTestId('eventTitleInput');
      await user.clear(titleInput);
      await user.type(titleInput, 'New Event Name');
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalled();
        const lastCall =
          mockOnStateChange.mock.calls[mockOnStateChange.mock.calls.length - 1];
        expect(lastCall[0].name).toBe('New Event Name');
      });
    });

    test('calls onStateChange when visibility changes', async () => {
      const mockOnStateChange = vi.fn();
      render(
        <EventForm
          initialValues={{
            ...baseValues,
            isPublic: false,
            isInviteOnly: false,
          }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          submitLabel="Create"
          showRecurrenceToggle
          showPublicToggle
          onStateChange={mockOnStateChange}
        />,
      );
      await user.click(screen.getByTestId('visibilityPublicRadio'));
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalled();
        const lastCall =
          mockOnStateChange.mock.calls[mockOnStateChange.mock.calls.length - 1];
        expect(lastCall[0].isPublic).toBe(true);
      });
    });

    test('does not crash when onStateChange is undefined', async () => {
      const mockOnSubmit = vi.fn();
      render(
        <EventForm
          initialValues={baseValues}
          onSubmit={mockOnSubmit}
          onCancel={vi.fn()}
          submitLabel="Create"
          showRecurrenceToggle
        />,
      );
      const titleInput = screen.getByTestId('eventTitleInput');
      await user.clear(titleInput);
      await user.type(titleInput, 'New Event');
      expect(titleInput).toHaveValue('New Event');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  test('handles explicitly undefined isRegisterable and createChat', () => {
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          isRegisterable: undefined as unknown as boolean,
          createChat: undefined as unknown as boolean,
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle
        showRegisterable
        showCreateChat
      />,
    );
    expect(screen.getByTestId('registerableEventCheck')).not.toBeChecked();
    expect(screen.getByTestId('createChatCheck')).not.toBeChecked();
  });

  test('should default createChat to false when explicitly null', () => {
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          createChat: null as unknown as boolean,
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
        showCreateChat
      />,
    );

    const createChatToggle = screen.getByTestId('createChatCheck');
    expect(createChatToggle).not.toBeChecked();
  });

  test('toggles registerable event', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, isRegisterable: false }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRegisterable
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('registerableEventCheck'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        isRegisterable: true,
      }),
    );
  });

  test('toggles create chat', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, createChat: false }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showCreateChat
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('createChatCheck'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        createChat: true,
      }),
    );
  });

  test('updates form fields', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const nameInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await act(async () => {
      await user.clear(nameInput);
      await user.type(nameInput, 'New Event Name');
      await user.clear(descInput);
      await user.type(descInput, 'New Description');
      await user.clear(locationInput);
      await user.type(locationInput, 'New Location');
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Event Name',
        description: 'New Description',
        location: 'New Location',
      }),
    );
  });

  test('handles CustomRecurrenceModal callbacks - setRecurrenceRuleState with value', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we can directly open the dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    // Update recurrence rule
    await act(async () => {
      await user.click(screen.getByTestId('updateRecurrenceRule'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          frequency: Frequency.DAILY,
        }),
      }),
    );
  });

  test('handles CustomRecurrenceModal callbacks - setRecurrenceRuleState with function', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we can directly open the dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    // Update recurrence rule with function
    await act(async () => {
      await user.click(screen.getByTestId('updateRecurrenceRuleFunction'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          interval: 2,
        }),
      }),
    );
  });

  test('handles CustomRecurrenceModal callbacks - setEndDate with value', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we can directly open the dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    // Update end date
    await act(async () => {
      await user.click(screen.getByTestId('updateEndDate'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endDate: expect.any(Date),
      }),
    );
  });

  test('handles CustomRecurrenceModal callbacks - setEndDate with function', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we can directly open the dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    // Update end date with function
    await act(async () => {
      await user.click(screen.getByTestId('updateEndDateFunction'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  test('handles CustomRecurrenceModal callbacks - hideCustomRecurrenceModal', async () => {
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we can directly open the dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();

    // Close modal
    await act(async () => {
      await user.click(screen.getByTestId('closeModal'));
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceModalMock'),
      ).not.toBeInTheDocument();
    });
  });

  test('handles CustomRecurrenceModal callbacks - setCustomRecurrenceModalIsOpen', async () => {
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // When showRecurrenceToggle is true and recurrenceRule exists, recurrence is already enabled
    // So we can directly open the dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();

    // Set modal open to false
    await act(async () => {
      await user.click(screen.getByTestId('setModalOpen'));
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceModalMock'),
      ).not.toBeInTheDocument();
    });
  });

  test('handles CustomRecurrenceModal callbacks - setCustomRecurrenceModalIsOpen with function', async () => {
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();

    // Mock the setCustomRecurrenceModalIsOpen to pass a function
    // The modal should close when the function returns false
    const modal = screen.getByTestId('customRecurrenceModalMock');
    const setOpenButton = modal.querySelector('[data-testid="setModalOpen"]');
    if (setOpenButton) {
      await act(async () => {
        await user.click(setOpenButton);
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId('customRecurrenceModalMock'),
        ).not.toBeInTheDocument();
      });
    }
  });

  test('updates start time and adjusts end time when new start is after end time', async () => {
    const handleSubmit = vi.fn();
    // Set initial times where endTime (14:00) is after startTime (10:00)
    // Use same date for start and end
    const testDate = dayjs.utc(FIXED_BASE_DATE).add(30, 'day').startOf('day');
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          allDay: false,
          startDate: testDate.toDate(),
          endDate: testDate.toDate(),
          startTime: '10:00:00',
          endTime: '14:00:00',
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const startTimeInput = screen.getByTestId('startTime');
    // Change start time to 16:00 (after current end time of 14:00)
    await act(async () => {
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '16:00:00');
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalled();
    const call = handleSubmit.mock.calls[0][0];
    // endAtISO should match startAtISO when start is after end (adjusted by form logic)
    expect(call.startAtISO).toBeTruthy();
    expect(call.endAtISO).toBeTruthy();
    const startAt = dayjs(call.startAtISO);
    const endAt = dayjs(call.endAtISO);
    // The end time should be adjusted to not be before start time
    expect(endAt.isSame(startAt) || endAt.isAfter(startAt)).toBe(true);
  });

  test('does not adjust end time when new start time is before end time', async () => {
    const handleSubmit = vi.fn();
    // Set initial times where endTime (14:00) is after startTime (10:00)
    const testDate = dayjs.utc(FIXED_BASE_DATE).add(30, 'day').startOf('day');
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          allDay: false,
          startDate: testDate.toDate(),
          endDate: testDate.toDate(),
          startTime: '10:00:00',
          endTime: '14:00:00',
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const startTimeInput = screen.getByTestId('startTime');
    // Change start time to 12:00 (still before end time of 14:00)
    await act(async () => {
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '12:00:00');
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalled();
    const call = handleSubmit.mock.calls[0][0];
    const startAt = dayjs(call.startAtISO);
    const endAt = dayjs(call.endAtISO);
    // The end time should still be after start time (not adjusted)
    expect(endAt.isAfter(startAt)).toBe(true);
    // Duration should be at least some positive value (end > start)
    const durationMinutes = endAt.diff(startAt, 'minute');
    expect(durationMinutes).toBeGreaterThan(0);
  });

  test('handles recurrence enabled but rule is null', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
      />,
    );

    // Enable recurrence but don't select a rule
    await act(async () => {
      await user.click(screen.getByTestId('recurringEventCheck'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: null,
      }),
    );
  });

  test('does not show recurrence toggle when showRecurrenceToggle is false', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={false}
      />,
    );

    expect(screen.queryByTestId('recurringEventCheck')).not.toBeInTheDocument();
  });

  test('does not show recurrence section when disableRecurrence is true', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        disableRecurrence
      />,
    );

    expect(
      screen.queryByTestId('recurrence-container'),
    ).not.toBeInTheDocument();
  });

  test('does not allow toggling recurrence when disabled', async () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        disableRecurrence
      />,
    );

    const toggle = screen.queryByTestId('recurringEventCheck');
    if (toggle) {
      const initialChecked = (toggle as HTMLInputElement).checked;
      await act(async () => {
        await user.click(toggle);
      });
      // Should not change when disabled
      expect((toggle as HTMLInputElement).checked).toBe(initialChecked);
    }
  });

  test('updates form state when initialValues change', () => {
    const { rerender } = render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const newValues: IEventFormValues = {
      ...baseValues,
      name: 'Updated Event',
      isPublic: false,
    };

    rerender(
      <EventForm
        initialValues={newValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const nameInput = screen.getByTestId('eventTitleInput') as HTMLInputElement;
    expect(nameInput.value).toBe('Updated Event');
  });

  test('handles cancel button', async () => {
    const handleCancel = vi.fn();
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
        submitLabel="Create"
        showCancelButton
      />,
    );

    await user.click(screen.getByTestId('eventFormCancelBtn'));
    expect(handleCancel).toHaveBeenCalled();
  });

  test('disables submit button when submitting', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        submitting
      />,
    );

    const submitButton = screen.getByTestId('createEventBtn');
    expect(submitButton).toBeDisabled();
  });

  test('buildRecurrenceOptions handles invalid date', () => {
    const invalidDate = new Date('invalid');
    // Need a rule for dropdown to show when showRecurrenceToggle is true
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          startDate: invalidDate,
          recurrenceRule: rule,
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
      />,
    );

    // Should still render without crashing
    expect(screen.getByTestId('recurrence-toggle')).toBeInTheDocument();
  });

  test('currentRecurrenceLabel returns matching preset label', async () => {
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists, so dropdown is visible
    const dropdown = screen.getByTestId('recurrence-toggle');
    expect(dropdown).toBeInTheDocument();
  });

  test('handles async onSubmit', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  // TODO: Test 'adjusts end date when start date is after end date' removed - direct MUI picker input doesn't work in test environment

  // TODO: Test 'adjusts end time when start time is after end time' removed - direct MUI picker input doesn't work in test environment

  test('handles date picker onChange with null', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const startDateInput = screen.getByTestId('eventStartAt');
    // Simulate onChange with null (date cleared)
    const datePicker = container.querySelector('[data-testid="eventStartAt"]');
    if (datePicker) {
      await act(async () => {
        // The mock DatePicker should handle null gracefully
        await user.clear(startDateInput);
      });
    }

    // Form should still be functional
    expect(startDateInput).toBeInTheDocument();
  });

  test('handles time picker onChange with null', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{ ...baseValues, allDay: false }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    const startTimeInput = screen.getByTestId('startTime');
    // The mock TimePicker should handle null gracefully
    await act(async () => {
      await user.clear(startTimeInput);
    });

    // Form should still be functional
    expect(startTimeInput).toBeInTheDocument();
  });

  test('selects weekly recurrence preset', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    const options = screen.getAllByTestId(/recurrence-item-/);
    // Index 2 is weekly
    await act(async () => {
      await user.click(options[2]);
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          frequency: Frequency.WEEKLY,
        }),
      }),
    );
  });

  test('selects monthly recurrence preset', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    const options = screen.getAllByTestId(/recurrence-item-/);
    // Index 3 is monthly
    await act(async () => {
      await user.click(options[3]);
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          frequency: Frequency.MONTHLY,
        }),
      }),
    );
  });

  test('selects annually recurrence preset', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    const options = screen.getAllByTestId(/recurrence-item-/);
    // Index 4 is annually
    await act(async () => {
      await user.click(options[4]);
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          frequency: Frequency.YEARLY,
        }),
      }),
    );
  });

  test('selects every weekday recurrence preset', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    const options = screen.getAllByTestId(/recurrence-item-/);
    // Index 5 is every weekday
    await act(async () => {
      await user.click(options[5]);
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: expect.objectContaining({
          frequency: Frequency.WEEKLY,
          byDay: expect.arrayContaining(['MO', 'TU', 'WE', 'TH', 'FR']),
        }),
      }),
    );
  });

  test('does not show CustomRecurrenceModal when recurrence is disabled', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        disableRecurrence
      />,
    );

    expect(
      screen.queryByTestId('customRecurrenceModalMock'),
    ).not.toBeInTheDocument();
  });

  test('does not show CustomRecurrenceModal when recurrenceRule is null', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    expect(
      screen.queryByTestId('customRecurrenceModalMock'),
    ).not.toBeInTheDocument();
  });

  test('handles setEndDate callback with null value', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]); // Custom...
    });

    // The mock modal doesn't have a button to set null, but the code handles it
    // by using prev.endDate as fallback
    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();
  });

  test('preserves endDate when setEndDate is called with null (fallback to prev.endDate)', async () => {
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    const initialEndDate = dayjs.utc(FIXED_BASE_DATE).add(31, 'day').toDate();
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          endDate: initialEndDate,
          recurrenceRule: rule,
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]);
    });

    const endDateInput = screen.getByTestId('eventEndAt');
    const expectedValue = dayjs.utc(initialEndDate).format('YYYY-MM-DD');
    expect(endDateInput).toHaveValue(expectedValue);

    await act(async () => {
      await user.click(screen.getByTestId('setEndDateNull'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('eventEndAt')).toHaveValue(expectedValue);
    });
  });

  test('preserves endDate when setEndDate is called with function returning null (fallback to prev.endDate)', async () => {
    const rule = createDefaultRecurrenceRule(
      dayjs.utc(FIXED_BASE_DATE).add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    const initialEndDate = dayjs.utc(FIXED_BASE_DATE).add(31, 'day').toDate();
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          endDate: initialEndDate,
          recurrenceRule: rule,
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });
    const options = screen.getAllByTestId(/recurrence-item-/);
    await act(async () => {
      await user.click(options[options.length - 1]);
    });

    const endDateInput = screen.getByTestId('eventEndAt');
    const expectedValue = dayjs.utc(initialEndDate).format('YYYY-MM-DD');
    expect(endDateInput).toHaveValue(expectedValue);

    await act(async () => {
      await user.click(screen.getByTestId('setEndDateFunctionNull'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('eventEndAt')).toHaveValue(expectedValue);
    });
  });

  test('does not show public toggle when showPublicToggle is false', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showPublicToggle={false}
      />,
    );

    expect(
      screen.queryByTestId('visibilityPublicRadio'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('visibilityOrgRadio')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('visibilityInviteRadio'),
    ).not.toBeInTheDocument();
  });

  test('does not show registerable toggle when showRegisterable is false', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRegisterable={false}
      />,
    );

    expect(
      screen.queryByTestId('registerableEventCheck'),
    ).not.toBeInTheDocument();
  });

  test('does not show create chat toggle when showCreateChat is false', () => {
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Create"
        showCreateChat={false}
      />,
    );

    expect(screen.queryByTestId('createChatCheck')).not.toBeInTheDocument();
  });

  test('creates default recurrence rule when selecting custom without existing rule', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.DAILY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    // Recurrence is already enabled when rule exists
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    const options = screen.getAllByTestId(/recurrence-item-/);
    // Select custom option
    await act(async () => {
      await user.click(options[options.length - 1]);
    });

    // Should create a default weekly rule and open modal
    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();
  });

  test('handles recurrence toggle when recurrence is already enabled', async () => {
    const handleSubmit = vi.fn();
    const rule = createDefaultRecurrenceRule(
      dayjs().add(30, 'days').toDate(),
      Frequency.WEEKLY,
    );
    render(
      <EventForm
        initialValues={{ ...baseValues, recurrenceRule: rule }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
      />,
    );

    // Toggle off (recurrence is enabled by default when rule exists)
    await act(async () => {
      await user.click(screen.getByTestId('recurringEventCheck'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: null,
      }),
    );
  });

  test('trims whitespace from form fields on submit', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={{
          ...baseValues,
          name: '  Test Event  ',
          description: '  Description  ',
          location: '  Location  ',
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
      />,
    );

    await act(async () => {
      await user.click(screen.getByTestId('createEventBtn'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Event',
        description: 'Description',
        location: 'Location',
      }),
    );
  });
  test('creates default recurrence rule when selecting custom with NO existing rule (coverage for line 120)', async () => {
    const handleSubmit = vi.fn();
    render(
      <EventForm
        initialValues={baseValues}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="Create"
        showRecurrenceToggle={true}
      />,
    );

    // Toggle recurrence ON
    await act(async () => {
      await user.click(screen.getByTestId('recurringEventCheck'));
    });

    // Click dropdown
    await act(async () => {
      await user.click(screen.getByTestId('recurrence-toggle'));
    });

    const options = screen.getAllByTestId(/recurrence-item-/);
    // Select custom option (last option)
    await act(async () => {
      await user.click(options[options.length - 1]);
    });

    // If default rule was created (line 120), the modal should be in the document
    expect(screen.getByTestId('customRecurrenceModalMock')).toBeInTheDocument();
  });
});
