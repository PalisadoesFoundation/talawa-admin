import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';

// Mock react-i18next properly with importOriginal to avoid missing exports
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    useTranslation: () => ({ t: (k: string) => k }),
  };
});

// Mock @mui/x-date-pickers to simple inputs
vi.mock('@mui/x-date-pickers', () => {
  const React = require('react');
  const dayjs = require('dayjs');
  return {
    DatePicker: (props: any) =>
      React.createElement('input', {
        'data-testid': props.label || 'date-picker',
        value: props.value ? String(props.value) : '',
        onChange: (e: any) => {
          if (props.onChange) {
            props.onChange(dayjs(e.target.value));
          }
        },
      }),
    TimePicker: (props: any) =>
      React.createElement('input', {
        'data-testid': props.label || 'time-picker',
        value: props.value ? String(props.value) : '',
        onChange: (e: any) => {
          if (props.onChange) {
            props.onChange(dayjs(e.target.value, 'HH:mm:ss'));
          }
        },
      }),
  };
});

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

// Mock CustomRecurrenceModal
vi.mock('./CustomRecurrenceModal', () => ({
  default: () => null,
}));

// Prepare mock for useMutation
vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(() => [
    vi.fn(async (_args?: any) => ({ data: { createEvent: { id: '1' } } })),
    { loading: false },
  ]),
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
const mockCreate = vi.fn(async (_args?: any) => ({
  data: { createEvent: { id: '1' } },
}));

describe('CreateEventModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([mockCreate, { loading: false }]);
    mockValidateRecurrenceInput.mockReturnValue({ isValid: true, errors: [] });
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
    const alldayCheck = screen.getByTestId('alldayCheck');
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

    const publicCheck = screen.getByTestId('ispublicCheck');
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

    const registrableCheck = screen.getByTestId('registrableCheck');
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
      expect(mockErrorHandler).toHaveBeenCalled();
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
    fireEvent.click(screen.getByTestId('alldayCheck'));

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
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.variables.input.allDay).toBe(false);
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

    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
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
    fireEvent.click(screen.getByTestId('alldayCheck'));

    const startTimeInput = screen.getByTestId('startTime');
    const endTimeInput = screen.getByTestId('endTime');

    // Change times
    fireEvent.change(startTimeInput, { target: { value: '10:00:00' } });
    fireEvent.change(endTimeInput, { target: { value: '12:00:00' } });

    expect(startTimeInput).toBeInTheDocument();
    expect(endTimeInput).toBeInTheDocument();
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
    fireEvent.click(screen.getByTestId('alldayCheck')); // Turn off
    fireEvent.click(screen.getByTestId('ispublicCheck')); // Turn off
    fireEvent.click(screen.getByTestId('registrableCheck')); // Turn on

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
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.variables.input.allDay).toBe(false);
      expect(callArgs.variables.input.isPublic).toBe(false);
      expect(callArgs.variables.input.isRegisterable).toBe(true);
    });
  });
});
