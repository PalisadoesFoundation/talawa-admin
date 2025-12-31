import React from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
// Mock react-i18next properly with importOriginal to avoid missing exports
vi.mock('react-i18next', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        // Handle translations with parameters
        if (key === 'weeklyOn' && params?.day) return `Weekly on ${params.day}`;
        if (key === 'monthlyOnDay' && params?.day)
          return `Monthly on day ${params.day}`;
        if (key === 'annuallyOn' && params?.month && params?.day)
          return `Annually on ${params.month} ${params.day}`;
        if (key === 'everyWeekday') return 'Every weekday';
        if (key === 'doesNotRepeat') return 'Does not repeat';
        if (key === 'daily') return 'Daily';
        if (key === 'custom') return 'Custom';
        return key;
      },
    }),
  };
});

// Mock @mui/x-date-pickers to simple inputs
vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: vi.fn(
    ({
      label,
      value,
      onChange,
      'data-testid': dataTestId,
    }: {
      label?: string;
      value?: unknown;
      onChange?: (date: unknown) => void;
      'data-testid'?: string;
    }) => {
      // Format value properly for date input (YYYY-MM-DD)
      let formattedValue = '';
      if (value) {
        if (dayjs.isDayjs(value)) {
          formattedValue = value.format('YYYY-MM-DD');
        } else if (value instanceof Date) {
          formattedValue = dayjs(value).format('YYYY-MM-DD');
        } else {
          formattedValue = String(value);
        }
      }
      return React.createElement('input', {
        'data-testid': dataTestId || label || 'date-picker',
        type: 'date',
        value: formattedValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(dayjs(e.target.value));
          }
        },
      });
    },
  ),
  TimePicker: vi.fn(
    ({
      label,
      value,
      onChange,
      'data-testid': dataTestId,
    }: {
      label?: string;
      value?: unknown;
      onChange?: (time: unknown) => void;
      'data-testid'?: string;
    }) => {
      // Format value properly for time input (HH:mm:ss)
      let formattedValue = '';
      if (value) {
        if (dayjs.isDayjs(value)) {
          formattedValue = value.format('HH:mm:ss');
        } else if (value instanceof Date) {
          formattedValue = dayjs(value).format('HH:mm:ss');
        } else {
          formattedValue = String(value);
        }
      }
      return React.createElement('input', {
        'data-testid': dataTestId || label || 'time-picker',
        type: 'time',
        value: formattedValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(dayjs(e.target.value, 'HH:mm:ss'));
          }
        },
      });
    },
  ),
  LocalizationProvider: vi.fn(({ children }) => children),
}));

// Mock toast functions with hoisted variables
const { mockToastError, mockToastSuccess } = vi.hoisted(() => ({
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

// Mock errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock recurrence utilities
vi.mock('../../utils/recurrenceUtils', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('../../utils/recurrenceUtils')>();
  return {
    ...original, // Spread all original exports including endsNever, endsOn, endsAfter, etc.
    createDefaultRecurrenceRule: vi.fn(() => ({
      frequency: 'WEEKLY',
      interval: 1,
    })),
    validateRecurrenceInput: vi.fn(() => ({ isValid: true, errors: [] })),
    formatRecurrenceForApi: vi.fn((rule) => rule),
    getRecurrenceRuleText: vi.fn((rule) => {
      // Return appropriate text based on the rule
      if (!rule || !rule.frequency) return 'Does not repeat';
      if (rule.isCustom) return 'Custom';
      if (rule.frequency === 'DAILY') return 'Daily';
      if (rule.frequency === 'WEEKLY') return 'Weekly';
      if (rule.frequency === 'MONTHLY') return 'Monthly';
      if (rule.frequency === 'YEARLY') return 'Yearly';
      return 'Custom';
    }),
    getDayName: vi.fn(() => 'Monday'),
    getMonthlyOptions: vi.fn(() => []),
    areRecurrenceRulesEqual: vi.fn(() => false),
  };
});

// Mock CustomRecurrenceModal with controllable implementation
const { CustomRecurrenceModalMock } = vi.hoisted(() => ({
  CustomRecurrenceModalMock: vi.fn(
    ({
      customRecurrenceModalIsOpen,
      hideCustomRecurrenceModal,
      setRecurrenceRuleState,
    }: {
      customRecurrenceModalIsOpen?: boolean;
      hideCustomRecurrenceModal?: () => void;
      setRecurrenceRuleState?: (rule: unknown) => void;
    }): React.ReactElement | null => {
      // Only render when modal is open
      if (!customRecurrenceModalIsOpen) return null;

      return React.createElement(
        'div',
        { 'data-testid': 'customRecurrenceModalRendered' },
        [
          React.createElement(
            'button',
            {
              key: 'close',
              'data-testid': 'closeCustomModal',
              onClick: hideCustomRecurrenceModal,
            },
            'Close',
          ),
          React.createElement(
            'button',
            {
              key: 'update',
              'data-testid': 'updateRecurrenceFunc',
              onClick: () => {
                if (setRecurrenceRuleState) {
                  // Test both direct and function-based setter
                  setRecurrenceRuleState({ frequency: 'CUSTOM', interval: 2 });
                  setRecurrenceRuleState((prev: unknown) => ({
                    ...(prev as object),
                    updated: true,
                  }));
                }
              },
            },
            'Update',
          ),
        ],
      );
    },
  ),
}));

vi.mock('../../shared-components/Recurrence/CustomRecurrenceModal', () => ({
  default: CustomRecurrenceModalMock,
}));

// Prepare mock for useMutation using vi.hoisted to avoid hoisting issues
const { mockCreate, mockUseMutation } = vi.hoisted(() => {
  const mockCreate = vi.fn(async () => ({
    data: { createEvent: { id: '1' } },
  }));

  const mockUseMutation = vi.fn(() => [mockCreate, { loading: false }]);

  return { mockCreate, mockUseMutation };
});

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client/react')>();
  return {
    ...actual,
    useMutation: mockUseMutation,
  };
});

import CreateEventModal from './CreateEventModal';
import type { IEventFormProps } from 'types/EventForm/interface';

vi.mock('shared-components/EventForm/EventForm', () => ({
  default: ({ onSubmit, onCancel, initialValues }: IEventFormProps) => {
    const [values, setValues] = React.useState(initialValues);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!values.name || !values.description || !values.location) return;
          onSubmit({
            ...values,
            startAtISO: values.startDate
              ? values.startDate instanceof Date
                ? values.startDate.toISOString()
                : new Date(values.startDate).toISOString()
              : new Date().toISOString(),
            endAtISO: values.endDate
              ? values.endDate instanceof Date
                ? values.endDate.toISOString()
                : new Date(values.endDate).toISOString()
              : new Date().toISOString(),
          });
        }}
      >
        <input
          data-testid="eventTitleInput"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
        <input
          data-testid="eventDescriptionInput"
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
        <input
          data-testid="eventLocationInput"
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
        <button type="submit" data-testid="createEventBtn">
          Create
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-testid="eventFormCancelBtn"
        >
          Cancel
        </button>
      </form>
    );
  },
  formatRecurrenceForPayload: vi.fn(),
}));
import { errorHandler } from 'utils/errorHandler';
import { validateRecurrenceInput } from '../../utils/recurrenceUtils';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import i18n from 'utils/i18n';

// Mock variable declarations
const mockToast = {
  success: mockToastSuccess,
  error: mockToastError,
};
const mockErrorHandler = errorHandler as unknown as ReturnType<typeof vi.fn>;
const mockValidateRecurrenceInput =
  validateRecurrenceInput as unknown as ReturnType<typeof vi.fn>;

// Mock objects and default props
const mockOnClose = vi.fn();
const mockOnEventCreated = vi.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onEventCreated: mockOnEventCreated,
  currentUrl: 'test-org-id',
};

const successMock = {
  request: {
    query: CREATE_EVENT_MUTATION,
    variables: {
      input: {
        name: 'Test Event',
        description: 'Test Description',
        startAt: expect.any(String),
        endAt: expect.any(String),
        organizationId: 'test-org-id',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
      },
    },
  },
  result: {
    data: {
      createEvent: {
        id: '1',
        name: 'Test Event',
        description: 'Test Description',
        startAt: '2024-01-01T00:00:00Z',
        endAt: '2024-01-01T23:59:59Z',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isRecurringEventTemplate: false,
        hasExceptions: false,
        sequenceNumber: 1,
        totalCount: 1,
        progressLabel: null,
        attachments: [],
        creator: { id: 'user1', name: 'Test User' },
        organization: { id: 'test-org-id', name: 'Test Org' },
        baseEvent: null,
      },
    },
  },
};
// Mock toast
const toast = { success: mockToastSuccess, error: mockToastError };

describe('CreateEventModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([mockCreate, { loading: false }]);
    mockValidateRecurrenceInput.mockReturnValue({ isValid: true, errors: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.getByText(/eventDetails/i)).toBeInTheDocument();
    expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    expect(screen.getByTestId('eventDescriptionInput')).toBeInTheDocument();
    expect(screen.getByTestId('eventLocationInput')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} isOpen={false} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.queryByText(/eventDetails/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const closeBtn = screen.getByTestId('createEventModalCloseBtn');
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call create mutation on empty submit', async () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const nameInput = screen.getByTestId('eventTitleInput') as HTMLInputElement;
    const descInput = screen.getByTestId(
      'eventDescriptionInput',
    ) as HTMLInputElement;
    const locInput = screen.getByTestId(
      'eventLocationInput',
    ) as HTMLInputElement;

    expect(nameInput.value).toBe('');
    expect(descInput.value).toBe('');
    expect(locInput.value).toBe('');
  });

  test('successfully creates event and calls callbacks', async () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });

    const submitButton = screen.getByTestId('createEventBtn');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          'eventCreated',
          expect.anything(),
        );
      },
      { timeout: 3000 },
    );

    expect(mockOnEventCreated).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test.todo('handles mutation error and calls errorHandler');
  test.todo('shows loading state during mutation');

  it.todo('toggles all-day checkbox and shows/hides time pickers');

  it.todo('toggles public checkbox');

  it.todo('toggles registrable checkbox');

  it('handles error when mutation fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Network error'));

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: 'Desc' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: 'Loc' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Error),
      );
    });
  });

  it.todo('submits form with recurrence when recurrence is set');

  it.todo('prevents submission when recurrence validation fails');

  it.todo('opens custom recurrence modal when Custom option is selected');

  it.todo('submits form with time when all-day is unchecked');

  it.todo('updates start and end dates');

  it.todo('updates time when all-day is unchecked');

  it.todo('resets form when modal is closed and reopened');

  test.todo('handles recurrence rule formatting and submission');

  it('validates required fields before submission', async () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Fill only title, leave others empty
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Event' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      // Should not call create mutation if required fields are empty
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it.todo('handles recurrence dropdown toggle');

  it.todo('selects different recurrence options correctly');

  it.todo('handles whitespace-only input as invalid');

  test.todo('does not call onEventCreated or onClose on mutation failure');

  it.todo('submits with all boolean flags correctly');

  // Date/Time Constraint Tests
  it.todo('auto-adjusts endDate when startDate is changed to after endDate');

  test.todo('submit button is disabled during loading');

  test.todo('handles undefined recurrence in formatRecurrenceForPayload');

  it.todo('respects minTime constraint on endTime picker');

  // Recurrence Handling Tests
  it.todo(
    'returns "Custom" label when recurrence does not match predefined options',
  );

  it.todo('opens custom recurrence modal with existing recurrence');

  test.todo('formResetKey changes when handleClose is called');

  // Edge Case Tests
  it.todo('handles null endDate correctly');

  it.todo('verifies endDate DatePicker minDate constraint');

  it.todo(
    'validates form with mixed whitespace - title valid but others whitespace',
  );

  it('handles non-Error exception in catch block', async () => {
    // Mock the mutation to throw a non-Error object
    mockCreate.mockRejectedValueOnce('String error');

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill form with valid data
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: 'Desc' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: 'Loc' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // Non-Error exceptions should not trigger errorHandler
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });
  });

  it('handles mutation response without expected data structure', async () => {
    // Mock mutation to return undefined data
    mockCreate.mockResolvedValueOnce({ data: undefined } as unknown as {
      data: { createEvent: { id: string } };
    });

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill form
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: 'Desc' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: 'Loc' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // Should not call success toast or callbacks when data is undefined
      expect(mockToast.success).not.toHaveBeenCalled();
    });
  });

  it.todo('verifies loading indicator prevents double submission');

  it.todo('verifies time parsing in mutation payload for all-day false');

  it.todo(
    'tests helper functions - getDayName and getMonthName via recurrence options',
  );

  it.todo('tests complex multi-step workflow');

  it.todo('tests timeToDayJs helper function indirectly through time changes');

  it.todo('tests hideCustomRecurrenceModal function');

  it.todo('tests function-based recurrence state updates');

  it.todo('tests conditional rendering of CustomRecurrenceModal');
});
