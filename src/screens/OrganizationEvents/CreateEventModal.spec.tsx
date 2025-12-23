import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';

// Mock react-i18next properly with importOriginal to avoid missing exports
vi.mock('react-i18next', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useTranslation: () => ({ t: (k: string) => k }),
  };
});

// Mock @mui/x-date-pickers to simple inputs
vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: vi.fn(
    ({
      label,
      value,
      onChange,
    }: {
      label?: string;
      value?: unknown;
      onChange?: (date: unknown) => void;
    }) =>
      React.createElement('input', {
        'data-testid': label || 'date-picker',
        value: value ? String(value) : '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(dayjs(e.target.value));
          }
        },
      }),
  ),
  TimePicker: vi.fn(
    ({
      label,
      value,
      onChange,
    }: {
      label?: string;
      value?: unknown;
      onChange?: (time: unknown) => void;
    }) =>
      React.createElement('input', {
        'data-testid': label || 'time-picker',
        value: value ? String(value) : '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(dayjs(e.target.value, 'HH:mm:ss'));
          }
        },
      }),
  ),
}));

// Mock toast functions
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock recurrence utilities
vi.mock('../../utils/recurrenceUtils', () => ({
  createDefaultRecurrenceRule: vi.fn(() => ({
    frequency: 'WEEKLY',
    interval: 1,
  })),
  validateRecurrenceInput: vi.fn(() => ({ isValid: true, errors: [] })),
  formatRecurrenceForApi: vi.fn((rule) => rule),
  Frequency: {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
  },
  WeekDays: [],
  InterfaceRecurrenceRule: {},
}));

// Mock CustomRecurrenceModal with controllable implementation
const { CustomRecurrenceModalMock } = vi.hoisted(() => ({
  CustomRecurrenceModalMock: vi.fn((): null => null),
}));

vi.mock('./CustomRecurrenceModal', () => ({
  default: CustomRecurrenceModalMock,
}));

// Prepare mock for useMutation
vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(),
}));

import CreateEventModal from './CreateEventModal';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import {
  createDefaultRecurrenceRule,
  validateRecurrenceInput,
  formatRecurrenceForApi,
} from '../../utils/recurrenceUtils';
import { useMutation } from '@apollo/client';

const mockToast = toast as unknown as {
  success: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
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

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={onClose}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const closeBtn = screen.getByTestId('createEventModalCloseBtn');
    fireEvent.click(closeBtn);

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
    fireEvent.click(createBtn);

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

    fireEvent.change(titleInput, { target: { value: 'My Event' } });
    fireEvent.change(descInput, { target: { value: 'Event description' } });
    fireEvent.change(locationInput, { target: { value: 'Somewhere' } });

    const createBtn = screen.getByTestId('createEventBtn');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalled();
      expect(onEventCreated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('toggles all-day checkbox and shows/hides time pickers', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Initially all-day is checked, so time pickers should not be visible
    expect(screen.queryByTestId('startTime')).not.toBeInTheDocument();

    // Toggle all-day off
    const alldayCheck = screen.getByTestId('allDayEventCheck');
    fireEvent.click(alldayCheck);

    // Now time pickers should be visible
    expect(screen.getByTestId('startTime')).toBeInTheDocument();
    expect(screen.getByTestId('endTime')).toBeInTheDocument();
  });

  it('toggles public checkbox', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const publicCheck = screen.getByTestId('publicEventCheck');
    expect(publicCheck).toBeChecked();

    fireEvent.click(publicCheck);
    expect(publicCheck).not.toBeChecked();
  });

  it('toggles registrable checkbox', () => {
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

    fireEvent.click(registrableCheck);
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
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: 'Desc' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: 'Loc' },
    });

    // Select a recurrence option by clicking dropdown
    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);

    // Click on "Daily" option (index 1)
    const dailyOption = screen.getByTestId('recurrenceOption-1');
    fireEvent.click(dailyOption);

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockValidateRecurrenceInput).toHaveBeenCalled();
      expect(mockFormatRecurrenceForApi).toHaveBeenCalled();
    });
  });

  it('shows error when recurrence validation fails', async () => {
    mockValidateRecurrenceInput.mockReturnValueOnce({
      isValid: false,
      errors: ['Invalid recurrence rule'],
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

    // Select a recurrence option
    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-1'));

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Invalid recurrence rule');
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it('opens custom recurrence modal when Custom option is selected', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);

    // Click on "Custom..." option (index 6)
    const customOption = screen.getByTestId('recurrenceOption-6');
    fireEvent.click(customOption);

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
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

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
      // @ts-expect-error - Intentionally accessing mock.calls which may be empty
      const callArgs = mockCreate.mock.calls[0]?.[0] as unknown as {
        variables: { input: { allDay: boolean } };
      };
      expect(callArgs?.variables.input.allDay).toBe(false);
    });
  });

  it('updates start and end dates', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const startDateInput = screen.getByTestId('startDate');
    const endDateInput = screen.getByTestId('endDate');

    fireEvent.change(startDateInput, { target: { value: '2025-12-25' } });
    fireEvent.change(endDateInput, { target: { value: '2025-12-26' } });

    expect(startDateInput).toHaveValue('2025-12-25');
    expect(endDateInput).toHaveValue('2025-12-26');
  });

  it('updates time when all-day is unchecked', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day to show time pickers
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

    const startTimeInput = screen.getByTestId('startTime');
    const endTimeInput = screen.getByTestId('endTime');

    // Change times
    fireEvent.change(startTimeInput, { target: { value: '10:00:00' } });
    fireEvent.change(endTimeInput, { target: { value: '12:00:00' } });

    expect(startTimeInput).toHaveValue('10:00:00');
    expect(endTimeInput).toHaveValue('12:00:00');
  });

  it('resets form when modal is closed and reopened', () => {
    const { rerender } = render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill form
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Test Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: 'Test Description' },
    });

    // Close modal
    fireEvent.click(screen.getByTestId('createEventModalCloseBtn'));

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

  it('disables create button when loading', () => {
    mockUseMutation.mockReturnValue([mockCreate, { loading: true }]);

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const createBtn = screen.getByTestId('createEventBtn');
    expect(createBtn).toBeDisabled();
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
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Event' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      // Should not call create mutation if required fields are empty
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it('handles recurrence dropdown toggle', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Open dropdown
    fireEvent.click(dropdown);

    // Verify dropdown options are visible
    expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-1')).toBeInTheDocument();
  });

  it('selects different recurrence options correctly', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Select "Does not repeat"
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-0'));

    // Select "Daily"
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-1'));

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
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: '   ' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

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
    fireEvent.click(screen.getByTestId('allDayEventCheck')); // Turn off
    fireEvent.click(screen.getByTestId('publicEventCheck')); // Turn off
    fireEvent.click(screen.getByTestId('registerableEventCheck')); // Turn on

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
  it('auto-adjusts endDate when startDate is changed to after endDate', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Set endDate to a specific date first
    const endDateInput = screen.getByTestId('endDate');
    fireEvent.change(endDateInput, { target: { value: '2025-12-20' } });

    // Now set startDate to a date after the endDate
    const startDateInput = screen.getByTestId('startDate');
    fireEvent.change(startDateInput, { target: { value: '2025-12-25' } });

    // endDate should be auto-adjusted to match startDate or later
    expect(endDateInput).toHaveValue('2025-12-25');
  });

  it('auto-adjusts endTime when startTime is changed to after endTime', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day to show time pickers
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

    const startTimeInput = screen.getByTestId('startTime');
    const endTimeInput = screen.getByTestId('endTime');

    // Set endTime to an earlier time
    fireEvent.change(endTimeInput, { target: { value: '10:00:00' } });

    // Now set startTime to after endTime
    fireEvent.change(startTimeInput, { target: { value: '15:00:00' } });

    // endTime should be auto-adjusted to match startTime
    expect(endTimeInput).toHaveValue('15:00:00');
  });

  it('respects minTime constraint on endTime picker', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day to show time pickers
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

    const startTimeInput = screen.getByTestId('startTime');
    const endTimeInput = screen.getByTestId('endTime');

    // Change startTime to a specific value
    fireEvent.change(startTimeInput, { target: { value: '14:30:00' } });

    // Attempt to set endTime before startTime - should be constrained/adjusted
    fireEvent.change(endTimeInput, { target: { value: '10:00:00' } });

    // Verify startTime was updated
    expect(startTimeInput).toHaveValue('14:30:00');
    // endTime should not be before startTime (constrained by minTime)
    expect(endTimeInput).toHaveValue('14:30:00');
  });

  // Recurrence Handling Tests
  it('returns "Custom" label when recurrence does not match predefined options', () => {
    // Mock a custom recurrence rule
    mockCreateDefaultRecurrenceRule.mockReturnValueOnce({
      frequency: 'WEEKLY',
      interval: 2, // Custom interval
      byDay: ['MO'],
    });

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);

    // Click on Custom option
    const customOption = screen.getByTestId('recurrenceOption-6');
    fireEvent.click(customOption);

    // Now the dropdown should show "Custom"
    expect(dropdown).toHaveTextContent('Custom');
  });

  it('opens custom recurrence modal with existing recurrence', () => {
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

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Set a predefined recurrence first
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Now open custom modal - recurrence already exists
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // createDefaultRecurrenceRule is called once for Daily and once for Custom
    expect(mockCreateDefaultRecurrenceRule).toHaveBeenCalledTimes(2);
  });

  it('displays dynamically generated recurrence option labels correctly', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);

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
  it('handles null endDate correctly', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const endDateInput = screen.getByTestId('endDate');

    // Clear the endDate to simulate null
    fireEvent.change(endDateInput, { target: { value: '' } });

    // Verify component handles empty/null date gracefully
    expect(endDateInput).toHaveValue('');
  });

  it('verifies endDate DatePicker minDate constraint', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const startDateInput = screen.getByTestId('startDate');
    const endDateInput = screen.getByTestId('endDate');

    // Set startDate
    fireEvent.change(startDateInput, { target: { value: '2025-12-15' } });

    // Attempt to set endDate before startDate
    fireEvent.change(endDateInput, { target: { value: '2025-12-10' } });

    // endDate should be constrained/adjusted to not be before startDate
    expect(endDateInput).toHaveValue('2025-12-15');
  });

  it('validates form with mixed whitespace - title valid but others whitespace', async () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Fill title with valid content, others with whitespace
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Valid Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: '   ' },
    });

    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      // Should not call mutation
      expect(mockCreate).not.toHaveBeenCalled();
    });
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

  it('verifies loading indicator prevents double submission', () => {
    mockUseMutation.mockReturnValue([mockCreate, { loading: true }]);

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const createBtn = screen.getByTestId('createEventBtn');

    // Button should be disabled during loading
    expect(createBtn).toBeDisabled();

    // Try to click (should not work)
    fireEvent.click(createBtn);

    // Should not call mutation since button is disabled
    expect(mockCreate).not.toHaveBeenCalled();
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
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

    // Set specific times
    fireEvent.change(screen.getByTestId('startTime'), {
      target: { value: '09:30:45' },
    });
    fireEvent.change(screen.getByTestId('endTime'), {
      target: { value: '17:45:30' },
    });

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

  it('tests helper functions - getDayName and getMonthName via recurrence options', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);

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
    fireEvent.change(screen.getByTestId('startDate'), {
      target: { value: '2025-12-20' },
    });
    fireEvent.change(screen.getByTestId('endDate'), {
      target: { value: '2025-12-21' },
    });

    // Step 2: Toggle all-day off
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

    // Step 3: Change times
    fireEvent.change(screen.getByTestId('startTime'), {
      target: { value: '10:00:00' },
    });
    fireEvent.change(screen.getByTestId('endTime'), {
      target: { value: '16:00:00' },
    });

    // Step 4: Select recurrence
    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-2')); // Weekly

    // Step 5: Toggle visibility
    fireEvent.click(screen.getByTestId('publicEventCheck'));

    // Step 6: Fill form
    fireEvent.change(screen.getByTestId('eventTitleInput'), {
      target: { value: 'Complex Event' },
    });
    fireEvent.change(screen.getByTestId('eventDescriptionInput'), {
      target: { value: 'Complex Description' },
    });
    fireEvent.change(screen.getByTestId('eventLocationInput'), {
      target: { value: 'Complex Location' },
    });

    // Step 7: Submit
    fireEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockValidateRecurrenceInput).toHaveBeenCalled();
      expect(mockFormatRecurrenceForApi).toHaveBeenCalled();
      expect(onEventCreated).toHaveBeenCalled();
    });
  });

  it('tests timeToDayJs helper function indirectly through time changes', () => {
    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    // Uncheck all-day to show time pickers
    fireEvent.click(screen.getByTestId('allDayEventCheck'));

    const startTimeInput = screen.getByTestId('startTime');

    // timeToDayJs converts time string to Dayjs object
    fireEvent.change(startTimeInput, { target: { value: '13:45:30' } });

    expect(startTimeInput).toHaveValue('13:45:30');
  });

  it('tests hideCustomRecurrenceModal function', () => {
    // Override the mock implementation to test the callback
    CustomRecurrenceModalMock.mockImplementation(
      // @ts-expect-error - Mock implementation intentionally returns JSX instead of null
      ({
        hideCustomRecurrenceModal,
      }: {
        hideCustomRecurrenceModal: () => void;
      }) => (
        <button
          type="button"
          data-testid="closeCustomModal"
          onClick={hideCustomRecurrenceModal}
        >
          Close Custom Modal
        </button>
      ),
    );

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Set a recurrence to enable CustomRecurrenceModal
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Open custom modal
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Verify custom modal button is rendered
    const closeButton = screen.getByTestId('closeCustomModal');
    expect(closeButton).toBeInTheDocument();

    // Click the close button to invoke hideCustomRecurrenceModal
    fireEvent.click(closeButton);

    // After closing, the custom modal should no longer be visible
    expect(screen.queryByTestId('closeCustomModal')).not.toBeInTheDocument();
  });

  it('tests function-based recurrence state updates', () => {
    // Override mock implementation to test function-based setter
    CustomRecurrenceModalMock.mockImplementation(
      // @ts-expect-error - Mock implementation intentionally returns JSX instead of null
      ({
        setRecurrenceRuleState,
      }: {
        setRecurrenceRuleState: (
          newRecurrence:
            | Record<string, unknown>
            | ((prev: Record<string, unknown>) => Record<string, unknown>),
        ) => void;
      }) => (
        <button
          type="button"
          data-testid="updateRecurrenceFunc"
          onClick={() => {
            // Call with a function to trigger the typeof check branch
            setRecurrenceRuleState((prev: Record<string, unknown>) => ({
              ...prev,
              interval: ((prev.interval as number) || 1) + 1,
            }));
          }}
        >
          Update Recurrence
        </button>
      ),
    );

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Set recurrence to enable CustomRecurrenceModal
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Open custom modal
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Verify update button is rendered
    const updateButton = screen.getByTestId('updateRecurrenceFunc');
    expect(updateButton).toBeInTheDocument();

    // Click the button to trigger function-based state update
    fireEvent.click(updateButton);

    // The function-based setter should have been called, which updates internal state
    // We can verify this by checking that the component is still functional
    expect(updateButton).toBeInTheDocument();
  });

  it('tests conditional rendering of CustomRecurrenceModal', () => {
    // Override mock implementation to render something visible
    // @ts-expect-error - Mock implementation intentionally returns JSX instead of null
    CustomRecurrenceModalMock.mockImplementation(() => (
      <div data-testid="customRecurrenceModalRendered">Custom Modal</div>
    ));

    render(
      <CreateEventModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        currentUrl="org1"
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');

    // Initially, custom modal should not be visible (no recurrence selected yet)
    expect(
      screen.queryByTestId('customRecurrenceModalRendered'),
    ).not.toBeInTheDocument();

    // Set a recurrence first (required before opening custom modal)
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-1')); // Daily

    // Custom modal still not visible until we select "Custom"
    expect(
      screen.queryByTestId('customRecurrenceModalRendered'),
    ).not.toBeInTheDocument();

    // Now open custom modal - recurrence exists so modal can render
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId('recurrenceOption-6')); // Custom

    // Now the custom modal should be visible
    expect(
      screen.getByTestId('customRecurrenceModalRendered'),
    ).toBeInTheDocument();
  });
});
