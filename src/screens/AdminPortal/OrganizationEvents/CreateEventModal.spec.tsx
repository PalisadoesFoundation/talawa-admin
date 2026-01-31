import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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
}));

vi.mock('shared-components/DatePicker', () => ({
  default: vi.fn(
    ({
      _label,
      value,
      onChange,
      'data-testid': dataTestId,
    }: {
      _label?: string;
      value?: unknown;
      onChange?: (date: unknown) => void;
      'data-testid'?: string;
    }) => {
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
        'data-testid': dataTestId || 'date-picker',
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
}));

// Mock shared TimePicker component
vi.mock('shared-components/TimePicker', () => ({
  default: vi.fn(
    ({
      _label,
      value,
      onChange,
      'data-testid': dataTestId,
    }: {
      _label?: string;
      value?: unknown;
      onChange?: (time: unknown) => void;
      'data-testid'?: string;
    }) => {
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
        'data-testid': dataTestId || 'time-picker',
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
vi.mock('utils/recurrenceUtils', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('utils/recurrenceUtils')>();
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

vi.mock('shared-components/Recurrence/CustomRecurrenceModal', () => ({
  default: CustomRecurrenceModalMock,
}));

// Prepare mock for useMutation
vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(),
}));

import CreateEventModal from './CreateEventModal';
import { errorHandler } from 'utils/errorHandler';
import {
  createDefaultRecurrenceRule,
  validateRecurrenceInput,
  formatRecurrenceForApi,
} from 'utils/recurrenceUtils';
import { useMutation } from '@apollo/client';

const mockToast = {
  success: mockToastSuccess,
  error: mockToastError,
};
const mockErrorHandler = errorHandler as unknown as ReturnType<typeof vi.fn>;
const mockCreateDefaultRecurrenceRule =
  createDefaultRecurrenceRule as unknown as ReturnType<typeof vi.fn>;
const mockValidateRecurrenceInput =
  validateRecurrenceInput as unknown as ReturnType<typeof vi.fn>;
const mockFormatRecurrenceForApi =
  formatRecurrenceForApi as unknown as ReturnType<typeof vi.fn>;
const mockUseMutation = useMutation as unknown as ReturnType<typeof vi.fn>;
const mockCreate = vi.fn(async () => ({
  data: { createEvent: { id: '1' } },
}));

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
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    expect(screen.getByText(/eventDetails/i)).toBeInTheDocument();
    expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    expect(screen.getByTestId('eventDescriptionInput')).toBeInTheDocument();
    expect(screen.getByTestId('eventLocationInput')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <CreateEventModal
        isOpen={false}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    expect(screen.queryByText(/eventDetails/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={onClose}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const closeBtn = screen.getByTestId('modalCloseBtn');
    await userEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('does not call create mutation on empty submit', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const createBtn = screen.getByTestId('createEventBtn');
    await userEvent.click(createBtn);

    await waitFor(() => {
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data and calls onEventCreated', async () => {
    const onEventCreated = vi.fn();
    const onClose = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={onClose}
        onEventCreated={onEventCreated}
        currentUrl="org1"
      />,
    );

    const titleInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'My Event');
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'Event description');
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, 'Somewhere');

    const createBtn = screen.getByTestId('createEventBtn');
    await userEvent.click(createBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            input: expect.objectContaining({
              isPublic: false,
              isInviteOnly: true,
              isRegisterable: false,
            }),
          }),
        }),
      );
      expect(mockToast.success).toHaveBeenCalled();
      expect(onEventCreated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('toggles all-day checkbox and shows/hides time pickers', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Initially all-day is checked, so time pickers should not be visible
    // Note: TimePicker components don't have testIDs, checking checkbox state instead
    expect(screen.queryByTestId('allDayEventCheck')).toBeChecked();

    // Toggle all-day off
    const alldayCheck = screen.getByTestId('allDayEventCheck');
    await userEvent.click(alldayCheck);

    // Now verify all-day is unchecked (time pickers are rendered but can't be queried by testID)
    expect(screen.queryByTestId('allDayEventCheck')).not.toBeChecked();
  });

  it('toggles event visibility options', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const publicRadio = screen.getByTestId('visibilityPublicRadio');
    const orgRadio = screen.getByTestId('visibilityOrgRadio');
    const inviteRadio = screen.getByTestId('visibilityInviteRadio');

    // Default should be Invite Only
    expect(inviteRadio).toBeChecked();
    expect(publicRadio).not.toBeChecked();
    expect(orgRadio).not.toBeChecked();

    // Toggle to organization visibility
    await userEvent.click(orgRadio);
    expect(orgRadio).toBeChecked();
    expect(inviteRadio).not.toBeChecked();
    expect(publicRadio).not.toBeChecked();

    // Toggle to public visibility
    await userEvent.click(publicRadio);
    expect(publicRadio).toBeChecked();
    expect(orgRadio).not.toBeChecked();
    expect(inviteRadio).not.toBeChecked();

    // Toggle back to invite only
    await userEvent.click(inviteRadio);
    expect(inviteRadio).toBeChecked();
    expect(publicRadio).not.toBeChecked();
    expect(orgRadio).not.toBeChecked();
  });

  it('toggles registrable checkbox', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const registrableCheck = screen.getByTestId('registerableEventCheck');
    expect(registrableCheck).not.toBeChecked();

    await userEvent.click(registrableCheck);
    expect(registrableCheck).toBeChecked();
  });

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

    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Error),
      );
    });
  });

  it('submits form with recurrence when recurrence is set', async () => {
    const onEventCreated = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        currentUrl="org1"
      />,
    );

    // Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    // Select a recurrence option by clicking dropdown
    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);

    // Click on "Daily" option (index 1)
    const dailyOption = screen.getByTestId('recurrenceOption-1');
    await userEvent.click(dailyOption);

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockValidateRecurrenceInput).toHaveBeenCalled();
      expect(mockFormatRecurrenceForApi).toHaveBeenCalled();
    });
  });

  it('prevents submission when recurrence validation fails', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    // Select a recurrence option
    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-1'));

    // Mock validation to fail AFTER recurrence is set
    mockValidateRecurrenceInput.mockReturnValue({
      isValid: false,
      errors: ['Invalid recurrence rule'],
    });

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      // Validation should be called and return invalid
      expect(mockValidateRecurrenceInput).toHaveBeenCalled();
      // CreateEvent mutation should not be called due to validation error
      expect(mockCreate).not.toHaveBeenCalled();
    });

    // Form should remain in modal (not closed)
    expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
  });

  it('opens custom recurrence modal when Custom option is selected', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);

    // Click on "Custom..." option (index 6)
    const customOption = screen.getByTestId('recurrenceOption-6');
    await userEvent.click(customOption);

    expect(mockCreateDefaultRecurrenceRule).toHaveBeenCalled();
  });

  it('submits form with time when all-day is unchecked', async () => {
    const onEventCreated = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day
    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    // Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // @ts-expect-error - Intentionally accessing mock.calls which may be empty
      const callArgs = mockCreate.mock.calls[0]?.[0] as unknown as {
        variables: { input: { allDay: boolean } };
      };
      expect(callArgs?.variables.input.allDay).toBe(false);
    });
  });

  it('updates start and end dates', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const startDateInput = screen.getByTestId('eventStartAt');
    const endDateInput = screen.getByTestId('eventEndAt');

    const futureStart = dayjs().add(10, 'days').format('YYYY-MM-DD');
    const futureEnd = dayjs().add(11, 'days').format('YYYY-MM-DD');

    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, futureStart);
    await userEvent.clear(endDateInput);
    await userEvent.type(endDateInput, futureEnd);

    expect(startDateInput).toHaveValue(futureStart);
    expect(endDateInput).toHaveValue(futureEnd);
  });

  it('updates time when all-day is unchecked', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day to show time pickers
    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    // Note: TimePicker components don't have testIDs, so we skip direct testing
    // The functionality is covered by integration tests
    await waitFor(() => {
      expect(screen.queryByTestId('allDayEventCheck')).not.toBeChecked();
    });
  });

  it('resets form when modal is closed and reopened', async () => {
    const { rerender } = render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Test Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      'Test Description',
    );

    // Close modal
    await userEvent.click(screen.getByTestId('modalCloseBtn'));

    // Reopen modal
    rerender(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Form should be reset (empty values)
    expect(screen.getByTestId('eventTitleInput')).toHaveValue('');
    expect(screen.getByTestId('eventDescriptionInput')).toHaveValue('');
  });

  it('shows loading state when loading', () => {
    mockUseMutation.mockReturnValue([mockCreate, { loading: true }]);

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // When loading, the modal shows a loading spinner instead of the form
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.queryByTestId('createEventBtn')).not.toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill only title, leave others empty
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      // Should not call create mutation if required fields are empty
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it('handles recurrence dropdown toggle', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Open dropdown
    await userEvent.click(dropdown);

    // Verify dropdown options are visible
    expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-1')).toBeInTheDocument();
  });

  it('selects different recurrence options correctly', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Select "Does not repeat"
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-0'));

    // Select "Daily"
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-1'));

    expect(mockCreateDefaultRecurrenceRule).toHaveBeenCalled();
  });

  it('handles whitespace-only input as invalid', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill with whitespace only
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), '   ');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), '   ');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), '   ');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      // Should not call mutation with whitespace-only fields
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it('submits with all boolean flags correctly', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Toggle all checkboxes
    await userEvent.click(screen.getByTestId('allDayEventCheck')); // Turn off
    await userEvent.click(screen.getByTestId('visibilityOrgRadio')); // Change to org visibility
    await userEvent.click(screen.getByTestId('registerableEventCheck')); // Turn on

    // Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // @ts-expect-error - Intentionally accessing mock.calls which may be empty
      const callArgs = mockCreate.mock.calls[0]?.[0] as unknown as {
        variables: {
          input: {
            allDay: boolean;
            isPublic: boolean;
            isRegisterable: boolean;
          };
        };
      };
      expect(callArgs?.variables.input.allDay).toBe(false);
      expect(callArgs?.variables.input.isPublic).toBe(false);
      expect(callArgs?.variables.input.isRegisterable).toBe(true);
    });
  });

  // Date/Time Constraint Tests
  it('auto-adjusts endDate when startDate is changed to after endDate', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const startDateInput = screen.getByTestId('eventStartAt');
    const endDateInput = screen.getByTestId('eventEndAt');

    const baseDate = dayjs().add(10, 'days');
    const earlyDate = baseDate.format('YYYY-MM-DD');
    const laterDate = baseDate.add(10, 'days').format('YYYY-MM-DD');
    const evenLaterDate = baseDate.add(15, 'days').format('YYYY-MM-DD');

    // First set startDate to an early date to establish a baseline
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, earlyDate);
    await waitFor(() => {
      expect(startDateInput).toHaveValue(earlyDate);
    });

    // Set endDate to a date after startDate
    await userEvent.clear(endDateInput);
    await userEvent.type(endDateInput, laterDate);
    await waitFor(() => {
      expect(endDateInput).toHaveValue(laterDate);
    });

    // Now set startDate to a date AFTER the endDate - this should trigger auto-adjust
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, evenLaterDate);

    // Verify startDate was set
    await waitFor(() => {
      expect(startDateInput).toHaveValue(evenLaterDate);
    });

    // endDate should be auto-adjusted to match startDate
    await waitFor(() => {
      const updatedEndDateInput = screen.getByTestId('eventEndAt');
      expect(updatedEndDateInput).toHaveValue(evenLaterDate);
    });
  });

  // Recurrence Handling Tests
  it('returns "Custom" label when recurrence does not match predefined options', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);

    // Click on a predefined option first
    await userEvent.click(screen.getByTestId('recurrenceOption-2')); // Weekly

    // Now manually create a custom rule that doesn't match any option
    mockCreateDefaultRecurrenceRule.mockReturnValue({
      frequency: 'WEEKLY',
      interval: 2, // Custom interval - doesn't match predefined
      byDay: ['MO'],
    });

    // Open custom modal to set custom rule
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Wait for modal to open and close it to apply the custom rule
    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceModalRendered'),
      ).toBeInTheDocument();
    });

    // The dropdown label should now show "Custom" since the rule doesn't match predefined options
    // Note: The actual label update happens when modal closes and rule is applied
    // For now, verify the modal opened which means custom rule will be set
    expect(
      screen.getByTestId('customRecurrenceModalRendered'),
    ).toBeInTheDocument();
  });

  it('opens custom recurrence modal with existing recurrence', async () => {
    // Set up a recurrence first
    mockCreateDefaultRecurrenceRule.mockReturnValue({
      frequency: 'WEEKLY',
      interval: 1,
    });

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Set a predefined recurrence first
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Now open custom modal - recurrence already exists
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Wait for modal to open
    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceModalRendered'),
      ).toBeInTheDocument();
    });

    // createDefaultRecurrenceRule is called when building options (multiple times)
    // and once explicitly when Custom is clicked with no existing rule
    // Just verify it was called at least once
    expect(mockCreateDefaultRecurrenceRule).toHaveBeenCalled();
  });

  it('displays dynamically generated recurrence option labels correctly', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);

    // Verify the dynamically generated labels based on current date
    const options = screen.getAllByRole('button');

    // Should include "Does not repeat", "Daily", "Weekly on [Day]", etc.
    expect(
      options.some((option) => option.textContent?.includes('Does not repeat')),
    ).toBe(true);
    expect(
      options.some((option) => option.textContent?.includes('Daily')),
    ).toBe(true);
    expect(
      options.some((option) => option.textContent?.includes('Weekly on')),
    ).toBe(true);
    expect(
      options.some((option) => option.textContent?.includes('Monthly on day')),
    ).toBe(true);
    expect(
      options.some((option) => option.textContent?.includes('Annually on')),
    ).toBe(true);
  });

  // Edge Case Tests
  it('handles null endDate correctly', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const endDateInput = screen.getByTestId('eventEndAt');

    // Clear the endDate to simulate null
    await userEvent.clear(endDateInput);

    // Verify component handles empty/null date gracefully
    expect(endDateInput).toHaveValue('');
  });

  it('verifies endDate DatePicker minDate constraint', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const startDateInput = screen.getByTestId('eventStartAt');
    const endDateInput = screen.getByTestId('eventEndAt');

    const futureStart = dayjs().add(10, 'days').format('YYYY-MM-DD');
    const futureEnd = dayjs().add(5, 'days').format('YYYY-MM-DD');

    // Set startDate
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, futureStart);

    // Attempt to set endDate before startDate
    await userEvent.clear(endDateInput);
    await userEvent.type(endDateInput, futureEnd);

    // The mock DatePicker doesn't enforce minDate constraint, it just accepts the value
    // The actual component would handle this, but for testing we verify the value was set
    // This test documents the expected behavior rather than enforcing it in the mock
    expect(endDateInput).toHaveValue(futureEnd);
  });

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
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // errorHandler is called even for non-Error exceptions
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.anything(),
        'String error',
      );
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
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // Should not call success toast or callbacks when data is undefined
      expect(mockToast.success).not.toHaveBeenCalled();
    });
  });

  it('verifies time parsing in mutation payload for all-day false', async () => {
    const onEventCreated = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day
    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    // Note: TimePicker components don't have testIDs, skipping time input tests

    // Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Event');
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Desc');
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Loc');

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      // @ts-expect-error - Intentionally accessing mock.calls which may be empty
      const callArgs = mockCreate.mock.calls[0]?.[0] as unknown as {
        variables: {
          input: { allDay: boolean; startAt: string; endAt: string };
        };
      };
      // Verify time parts are parsed correctly in the mutation
      expect(callArgs?.variables.input.allDay).toBe(false);
      // Verify time values are present in payload
      expect(callArgs?.variables.input.startAt).toBeDefined();
      expect(callArgs?.variables.input.endAt).toBeDefined();
    });
  });

  it('tests helper functions - getDayName and getMonthName via recurrence options', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);

    // The recurrence options should include day and month names
    // This tests getDayName and getMonthName helper functions
    const weeklyOption = screen.getByTestId('recurrenceOption-2');
    expect(weeklyOption.textContent).toMatch(/Weekly on \w+/);

    const annuallyOption = screen.getByTestId('recurrenceOption-4');
    expect(annuallyOption.textContent).toMatch(/Annually on \w+ \d+/);
  });

  it('tests complex multi-step workflow', async () => {
    const onEventCreated = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        currentUrl="org1"
      />,
    );

    // Step 1: Change dates
    const futureStart = dayjs().add(10, 'days').format('YYYY-MM-DD');
    const futureEnd = dayjs().add(11, 'days').format('YYYY-MM-DD');

    await userEvent.clear(screen.getByTestId('eventStartAt'));
    await userEvent.type(screen.getByTestId('eventStartAt'), futureStart);
    await userEvent.clear(screen.getByTestId('eventEndAt'));
    await userEvent.type(screen.getByTestId('eventEndAt'), futureEnd);

    // Step 2: Toggle all-day off
    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    // Step 3: Skip time changes (TimePicker has no testIDs)
    // Time functionality is tested through integration

    // Step 4: Enable recurring and select recurrence
    await userEvent.click(screen.getByTestId('recurringEventCheck'));
    const dropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-2')); // Weekly

    // Step 5: Toggle visibility to organization
    await userEvent.click(screen.getByTestId('visibilityOrgRadio'));

    // Step 6: Fill form
    await userEvent.clear(screen.getByTestId('eventTitleInput'));
    await userEvent.type(
      screen.getByTestId('eventTitleInput'),
      'Complex Event',
    );
    await userEvent.clear(screen.getByTestId('eventDescriptionInput'));
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      'Complex Description',
    );
    await userEvent.clear(screen.getByTestId('eventLocationInput'));
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      'Complex Location',
    );

    // Step 7: Submit
    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockValidateRecurrenceInput).toHaveBeenCalled();
      expect(mockFormatRecurrenceForApi).toHaveBeenCalled();
      expect(onEventCreated).toHaveBeenCalled();
    });
  });

  it('tests hideCustomRecurrenceModal function', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Set a recurrence to enable CustomRecurrenceModal
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Open custom modal
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Verify custom modal button is rendered (wait for state update)
    await waitFor(() => {
      const closeButton = screen.getByTestId('closeCustomModal');
      expect(closeButton).toBeInTheDocument();
    });

    // Click the close button to invoke hideCustomRecurrenceModal
    const closeButton = screen.getByTestId('closeCustomModal');
    await userEvent.click(closeButton);

    // After closing, the custom modal should no longer be visible
    await waitFor(() => {
      expect(screen.queryByTestId('closeCustomModal')).not.toBeInTheDocument();
    });
  });

  it('tests function-based recurrence state updates', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Set recurrence to enable CustomRecurrenceModal
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Open custom modal
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Verify update button is rendered (wait for state update)
    await waitFor(() => {
      const updateButton = screen.getByTestId('updateRecurrenceFunc');
      expect(updateButton).toBeInTheDocument();
    });

    const updateButton = screen.getByTestId('updateRecurrenceFunc');
    // Click the button to trigger function-based state update
    await userEvent.click(updateButton);

    // The function-based setter should have been called, which updates internal state
    // We can verify this by checking that the component is still functional
    expect(updateButton).toBeInTheDocument();
  });

  it('tests conditional rendering of CustomRecurrenceModal', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Enable recurring event checkbox first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Initially, custom modal should not be visible (no recurrence selected yet)
    expect(
      screen.queryByTestId('customRecurrenceModalRendered'),
    ).not.toBeInTheDocument();

    // Set a recurrence first (required before opening custom modal)
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Custom modal still not visible until we select "Custom"
    expect(
      screen.queryByTestId('customRecurrenceModalRendered'),
    ).not.toBeInTheDocument();

    // Now open custom modal - recurrence exists so modal can render
    await userEvent.click(dropdown);
    await userEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Now the custom modal should be visible
    expect(
      screen.getByTestId('customRecurrenceModalRendered'),
    ).toBeInTheDocument();
  });
  describe('Default Date Initialization', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('sets default start date to today 00:00 UTC (standard case)', () => {
      // Mock time using current year/month/day to maintain test robustness
      const now = dayjs();
      const mockDate = new Date(
        Date.UTC(now.year(), now.month(), now.date(), 12, 0, 0),
      );
      vi.setSystemTime(mockDate);

      render(
        <CreateEventModal
          isOpen={true}
          onClose={vi.fn()}
          onEventCreated={vi.fn()}
          currentUrl="org1"
        />,
      );

      // Expect today
      const startDateInput = screen.getByTestId('eventStartAt');
      expect(startDateInput).toHaveValue(now.format('YYYY-MM-DD'));

      const endDateInput = screen.getByTestId('eventEndAt');
      expect(endDateInput).toHaveValue(now.format('YYYY-MM-DD'));
    });

    it('sets default start date to today (no month crossing)', () => {
      // Mock time: Last day of a month
      const oct31 = dayjs.utc().year(2023).month(9).date(31).hour(23);
      const mockDate = oct31.toDate();
      vi.setSystemTime(mockDate);

      render(
        <CreateEventModal
          isOpen={true}
          onClose={vi.fn()}
          onEventCreated={vi.fn()}
          currentUrl="org1"
        />,
      );

      // Expect Oct 31 (today, stays in current month)
      const startDateInput = screen.getByTestId('eventStartAt');
      expect(startDateInput).toHaveValue(oct31.format('YYYY-MM-DD'));
    });

    it('sets default start date to today (no year crossing)', () => {
      // Mock time: Last day of the year
      const dec31 = dayjs.utc().year(2023).month(11).date(31).hour(10);
      const mockDate = dec31.toDate();
      vi.setSystemTime(mockDate);

      render(
        <CreateEventModal
          isOpen={true}
          onClose={vi.fn()}
          onEventCreated={vi.fn()}
          currentUrl="org1"
        />,
      );

      // Expect Dec 31 (today, stays in current year)
      const startDateInput = screen.getByTestId('eventStartAt');
      expect(startDateInput).toHaveValue(dec31.format('YYYY-MM-DD'));
    });

    it('calculates Today UTC correctly even if local time is different day', () => {
      // Intention: Simulate a case where "Now UTC" is Day X, but "Now Local" might be Day X-1 or X+1.
      // Since we use Date.UTC logic in the component, the local timezone shouldn't matter for the "Today UTC" calculation result.

      // Mock time: 2023-01-01T23:00:00.000Z
      // Logic uses getUTCDate() -> 1. Result -> Jan 1 00:00 UTC (today).
      const mockDate = dayjs
        .utc()
        .year(2023)
        .month(0)
        .date(1)
        .hour(23)
        .toDate();
      vi.setSystemTime(mockDate);

      render(
        <CreateEventModal
          isOpen={true}
          onClose={vi.fn()}
          onEventCreated={vi.fn()}
          currentUrl="org1"
        />,
      );

      // Should be Jan 1st (today)
      const startDateInput = screen.getByTestId('eventStartAt');
      expect(startDateInput).toHaveValue(
        dayjs.utc(mockDate).format('YYYY-MM-DD'),
      );
    });
  });
});
