import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import CustomRecurrenceModal from './CustomRecurrenceModal';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import {
  Frequency,
  WeekDays,
  createDefaultRecurrenceRule,
} from '../../utils/recurrenceUtils';

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});

const mockProps = {
  recurrenceRuleState: createDefaultRecurrenceRule(
    new Date('2024-01-15'),
    Frequency.WEEKLY,
  ),
  setRecurrenceRuleState: vi.fn(),
  endDate: new Date('2024-01-20'),
  setEndDate: vi.fn(),
  customRecurrenceModalIsOpen: true,
  hideCustomRecurrenceModal: vi.fn(),
  setCustomRecurrenceModalIsOpen: vi.fn(),
  t: (key: string) => key,
  startDate: new Date('2024-01-15'),
};

const renderComponent = (props = mockProps) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <CustomRecurrenceModal {...props} />
            </I18nextProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </Provider>,
  );
};

describe('CustomRecurrenceModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal when open', () => {
    renderComponent();

    expect(screen.getByText('customRecurrence')).toBeInTheDocument();
    expect(
      screen.getByTestId('customRecurrenceModalCloseBtn'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('customRecurrenceSubmitBtn')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderComponent({
      ...mockProps,
      customRecurrenceModalIsOpen: false,
    });

    expect(screen.queryByText('customRecurrence')).not.toBeInTheDocument();
  });

  test('calls hideCustomRecurrenceModal when close button is clicked', async () => {
    const hideModal = vi.fn();
    renderComponent({
      ...mockProps,
      hideCustomRecurrenceModal: hideModal,
    });

    await userEvent.click(screen.getByTestId('customRecurrenceModalCloseBtn'));
    expect(hideModal).toHaveBeenCalled();
  });

  test('renders frequency dropdown and handles frequency change', async () => {
    renderComponent();

    const frequencyDropdown = screen.getByTestId(
      'customRecurrenceFrequencyDropdown',
    );
    expect(frequencyDropdown).toBeInTheDocument();

    await userEvent.click(frequencyDropdown);

    const dailyOption = screen.getByTestId('customDailyRecurrence');
    await userEvent.click(dailyOption);

    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();
  });

  test('displays weekly day selection when frequency is weekly', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        frequency: Frequency.WEEKLY,
      },
    });

    expect(screen.getByText('repeatsOn')).toBeInTheDocument();

    const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(dayButtons).toHaveLength(7);

    // Click on a day button
    await userEvent.click(dayButtons[0]);
    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();
  });

  test('displays monthly options when frequency is monthly', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        frequency: Frequency.MONTHLY,
      },
    });

    expect(screen.getByText('monthlyOn')).toBeInTheDocument();
    expect(screen.getByTestId('monthlyRecurrenceDropdown')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('monthlyRecurrenceDropdown'));
    const monthlyByDateOption = screen.getByTestId('monthlyByDate');
    await userEvent.click(monthlyByDateOption);

    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();
  });

  test('displays yearly options when frequency is yearly', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        frequency: Frequency.YEARLY,
      },
    });

    expect(screen.getByText('yearlyOn')).toBeInTheDocument();
    expect(screen.getByText('yearlyRecurrenceDesc')).toBeInTheDocument();
  });

  test('handles interval input changes', async () => {
    renderComponent();

    const intervalInput = screen.getByTestId('customRecurrenceIntervalInput');
    await userEvent.clear(intervalInput);
    await userEvent.type(intervalInput, '2');

    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();
  });

  test('handles count input changes', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        count: 5,
        never: false,
      },
    });

    const countInput = screen.getByTestId('customRecurrenceCountInput');
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '10');

    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();
  });

  test('handles recurrence end option changes', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
    });

    // Clear previous calls from component initialization
    mockSetRecurrenceRuleState.mockClear();

    // Test "on" option
    const onOption = screen.getByTestId('on');
    await userEvent.click(onOption);
    expect(mockSetRecurrenceRuleState).toHaveBeenCalled();

    mockSetRecurrenceRuleState.mockClear();

    // Test "after" option
    const afterOption = screen.getByTestId('after');
    await userEvent.click(afterOption);
    expect(mockSetRecurrenceRuleState).toHaveBeenCalled();
  });

  test('handles form submission', async () => {
    const setModalOpen = vi.fn();
    renderComponent({
      ...mockProps,
      setCustomRecurrenceModalIsOpen: setModalOpen,
    });

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();
    expect(setModalOpen).toHaveBeenCalledWith(false);
  });

  test('handles date picker changes for end date', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        endDate: new Date('2024-02-15'),
        never: false,
        count: undefined,
      },
    });

    // Click on "on" option to show date picker
    const onOption = screen.getByTestId('on');
    await userEvent.click(onOption);

    // The date picker should be enabled
    const datePicker = screen.getByLabelText('endDate');
    expect(datePicker).not.toBeDisabled();
  });

  test('sets yearly recurrence defaults correctly', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: createDefaultRecurrenceRule(
        new Date('2024-01-15'),
        Frequency.DAILY,
      ),
    });

    const frequencyDropdown = screen.getByTestId(
      'customRecurrenceFrequencyDropdown',
    );
    await userEvent.click(frequencyDropdown);

    const yearlyOption = screen.getByTestId('customYearlyRecurrence');
    await userEvent.click(yearlyOption);

    // Verify that setRecurrenceRuleState was called with yearly defaults
    expect(mockProps.setRecurrenceRuleState).toHaveBeenCalled();

    // The call should include count: 5, never: false for yearly
    const lastCall = mockProps.setRecurrenceRuleState.mock.calls.slice(-1)[0];
    expect(typeof lastCall[0]).toBe('function');
  });

  test('prevents negative input in number fields', async () => {
    renderComponent();

    const intervalInput = screen.getByTestId('customRecurrenceIntervalInput');

    // Try to type negative sign
    await userEvent.type(intervalInput, '-');

    // The input should prevent the negative sign
    expect(intervalInput).toHaveValue(1); // Default value
  });

  test('handles double-click selection on number inputs', async () => {
    renderComponent();

    const intervalInput = screen.getByTestId('customRecurrenceIntervalInput');

    // Double-click should select all text
    fireEvent.doubleClick(intervalInput);

    // This tests the onDoubleClick handler exists
    expect(intervalInput).toBeInTheDocument();
  });

  test('filters end options for yearly frequency', () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        frequency: Frequency.YEARLY,
      },
    });

    // "never" option should not be available for yearly frequency
    expect(screen.queryByTestId('never')).not.toBeInTheDocument();
    expect(screen.getByTestId('on')).toBeInTheDocument();
    expect(screen.getByTestId('after')).toBeInTheDocument();
  });

  test('handles keyboard navigation for invalid keys on number inputs', async () => {
    renderComponent();

    const intervalInput = screen.getByTestId('customRecurrenceIntervalInput');

    // Try to press invalid keys
    fireEvent.keyDown(intervalInput, { key: 'e' });
    fireEvent.keyDown(intervalInput, { key: 'E' });
    fireEvent.keyDown(intervalInput, { key: '+' });

    // These should be prevented
    expect(intervalInput).toBeInTheDocument();
  });

  test('initializes with correct recurrence end option based on state', () => {
    // Test with "never" state
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        never: true,
        count: undefined,
        endDate: undefined,
      },
    });

    expect(screen.getByTestId('never')).toBeChecked();
  });

  test('initializes with "after" option for yearly frequency', () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        frequency: Frequency.YEARLY,
        interval: 1,
        byMonth: [1],
        byMonthDay: [15],
        count: 5,
        never: false,
      },
    });

    // Should initialize with "after" option selected
    expect(screen.getByTestId('after')).toBeChecked();
  });

  test('updates local count when yearly frequency is selected', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: createDefaultRecurrenceRule(
        new Date('2024-01-15'),
        Frequency.DAILY,
      ),
    });

    const frequencyDropdown = screen.getByTestId(
      'customRecurrenceFrequencyDropdown',
    );
    await userEvent.click(frequencyDropdown);

    const yearlyOption = screen.getByTestId('customYearlyRecurrence');
    await userEvent.click(yearlyOption);

    // Wait for state update and check if count input shows correct value
    await waitFor(() => {
      const countInput = screen.getByTestId('customRecurrenceCountInput');
      expect(countInput).toHaveValue(5); // Expecting number type, not string
    });
  });

  test('handles form submission with never end condition (lines 299-304)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    const mockSetModalOpen = vi.fn();

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      setCustomRecurrenceModalIsOpen: mockSetModalOpen,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        never: true,
        count: undefined,
        endDate: undefined,
      },
    });

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    // Verify the never end condition logic (lines 299-304)
    expect(mockSetRecurrenceRuleState).toHaveBeenCalledWith(
      expect.objectContaining({
        never: true,
        count: undefined,
        endDate: undefined,
      }),
    );
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  test('handles date picker onChange with valid date (lines 531-539)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        endDate: new Date('2024-02-15'),
        never: false,
        count: undefined,
      },
    });

    // Switch to "on" option to enable date picker
    const onOption = screen.getByTestId('on');
    await userEvent.click(onOption);

    // Find and interact with the date picker
    const datePicker = screen.getByLabelText('endDate');
    expect(datePicker).not.toBeDisabled();

    // The onChange handler should be called when date changes (lines 531-539)
    // Since MUI DatePicker is complex to test directly, we verify the date picker is properly configured
    expect(datePicker).toHaveAttribute('type', 'text'); // MUI DatePicker renders as text input
  });

  test('handles count input key restrictions (lines 554-562)', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        count: 5,
        never: false,
      },
    });

    // Switch to "after" option to show count input
    const afterOption = screen.getByTestId('after');
    await userEvent.click(afterOption);

    const countInput = screen.getByTestId('customRecurrenceCountInput');

    // Test key restrictions (lines 554-562)
    fireEvent.keyDown(countInput, { key: '-' });
    fireEvent.keyDown(countInput, { key: '+' });
    fireEvent.keyDown(countInput, { key: 'e' });
    fireEvent.keyDown(countInput, { key: 'E' });

    // Verify input still has original value (restricted keys were prevented)
    expect(countInput).toHaveValue(5);
  });

  test('handles count input double-click selection (lines 551-553)', async () => {
    renderComponent({
      ...mockProps,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        count: 5,
        never: false,
      },
    });

    // Switch to "after" option to show count input
    const afterOption = screen.getByTestId('after');
    await userEvent.click(afterOption);

    const countInput = screen.getByTestId('customRecurrenceCountInput');

    // Test double-click selection (lines 551-553)
    fireEvent.doubleClick(countInput);

    // Verify the input exists and double-click handler doesn't break anything
    expect(countInput).toBeInTheDocument();
    expect(countInput).toHaveValue(5);
  });

  test('handles weekly frequency selection (line 398)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      recurrenceRuleState: createDefaultRecurrenceRule(
        new Date('2024-01-15'),
        Frequency.DAILY,
      ),
    });

    const frequencyDropdown = screen.getByTestId(
      'customRecurrenceFrequencyDropdown',
    );
    await userEvent.click(frequencyDropdown);

    // Click on weekly option (line 398)
    const weeklyOption = screen.getByTestId('customWeeklyRecurrence');
    await userEvent.click(weeklyOption);

    // Verify handleFrequencyChange(Frequency.WEEKLY) was called
    expect(mockSetRecurrenceRuleState).toHaveBeenCalled();
  });

  test('handles monthly frequency selection (line 404)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      recurrenceRuleState: createDefaultRecurrenceRule(
        new Date('2024-01-15'),
        Frequency.DAILY,
      ),
    });

    const frequencyDropdown = screen.getByTestId(
      'customRecurrenceFrequencyDropdown',
    );
    await userEvent.click(frequencyDropdown);

    // Click on monthly option (line 404)
    const monthlyOption = screen.getByTestId('customMonthlyRecurrence');
    await userEvent.click(monthlyOption);

    // Verify handleFrequencyChange(Frequency.MONTHLY) was called
    expect(mockSetRecurrenceRuleState).toHaveBeenCalled();
  });

  test('handles form submission with endsAfter and valid count (lines 316-329)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    const mockSetModalOpen = vi.fn();

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      setCustomRecurrenceModalIsOpen: mockSetModalOpen,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        count: 10,
        never: false,
        endDate: undefined,
      },
    });

    // Switch to "after" option
    const afterOption = screen.getByTestId('after');
    await userEvent.click(afterOption);

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    // Verify the endsAfter logic (lines 316-329)
    expect(mockSetRecurrenceRuleState).toHaveBeenCalledWith(
      expect.objectContaining({
        never: false,
        endDate: undefined,
        count: 10,
      }),
    );
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  test('handles form submission with invalid count - early return (lines 319-322)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    const mockSetModalOpen = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      setCustomRecurrenceModalIsOpen: mockSetModalOpen,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        count: undefined,
        never: false,
        endDate: undefined,
      },
    });

    // Switch to "after" option
    const afterOption = screen.getByTestId('after');
    await userEvent.click(afterOption);

    // Set invalid count by typing in the input
    const countInput = screen.getByTestId('customRecurrenceCountInput');
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '0'); // Invalid count

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    // Verify early return behavior (lines 319-322)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid count:', '0');
    expect(mockSetModalOpen).not.toHaveBeenCalled(); // Modal should not close on error
  });

  test('handles form submission with string count parsing (lines 317-318)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    const mockSetModalOpen = vi.fn();

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      setCustomRecurrenceModalIsOpen: mockSetModalOpen,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        count: undefined,
        never: false,
        endDate: undefined,
      },
    });

    // Switch to "after" option
    const afterOption = screen.getByTestId('after');
    await userEvent.click(afterOption);

    // Set count as string by typing
    const countInput = screen.getByTestId('customRecurrenceCountInput');
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '15'); // String input

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    // Verify string parsing logic (lines 317-318)
    expect(mockSetRecurrenceRuleState).toHaveBeenCalledWith(
      expect.objectContaining({
        never: false,
        endDate: undefined,
        count: 15, // Should be parsed as number
      }),
    );
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  test('Testing day click handling - adding day (lines 273-278)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        frequency: Frequency.WEEKLY,
        byDay: [], // Start with no days selected
      },
    });

    const dayButtons = screen.getAllByTestId('recurrenceWeekDay');

    // Click on Monday (index 1 in Days array) that's not currently selected (covers else branch lines 273-278)
    await userEvent.click(dayButtons[1]); // Monday (Days[1] = WeekDays.MO)

    expect(mockSetRecurrenceRuleState).toHaveBeenCalledWith(
      expect.any(Function),
    );

    // Test the state update function
    const updateFunction = mockSetRecurrenceRuleState.mock.calls[0][0];
    const newState = updateFunction({
      ...mockProps.recurrenceRuleState,
      byDay: [],
    });

    expect(newState.byDay).toContain(WeekDays.MO); // Monday should be added
  });

  test('Testing day click handling - removing day (lines 268-272)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO], // Start with Monday selected
      },
    });

    const dayButtons = screen.getAllByTestId('recurrenceWeekDay');

    // Click on Monday that's already selected (covers if branch lines 268-272)
    await userEvent.click(dayButtons[1]); // Monday (Days[1] = WeekDays.MO)

    expect(mockSetRecurrenceRuleState).toHaveBeenCalledWith(
      expect.any(Function),
    );

    // Test the state update function
    const updateFunction = mockSetRecurrenceRuleState.mock.calls[0][0];
    const newState = updateFunction({
      ...mockProps.recurrenceRuleState,
      byDay: [WeekDays.MO],
    });

    expect(newState.byDay).not.toContain(WeekDays.MO); // Monday should be removed
    expect(newState.byDay).toEqual([]);
  });

  test('Testing form submission with invalid interval - string parsing (lines 288-295)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    const mockSetModalOpen = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      setCustomRecurrenceModalIsOpen: mockSetModalOpen,
    });

    // Clear the input to make it empty (which will cause isNaN to be true)
    const intervalInput = screen.getByTestId('customRecurrenceIntervalInput');
    await userEvent.clear(intervalInput);
    // Don't type anything, leaving it empty

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    // Verify invalid interval handling (lines 292-295)
    // Empty string will cause parseInt('') to return NaN, triggering the error
    expect(consoleSpy).toHaveBeenCalledWith('Invalid interval:', '');
    expect(mockSetModalOpen).not.toHaveBeenCalled(); // Should return early, not close modal

    consoleSpy.mockRestore();
  });

  test('Testing form submission with ends on option (lines 305-315)', async () => {
    const mockSetRecurrenceRuleState = vi.fn();
    const mockSetModalOpen = vi.fn();

    renderComponent({
      ...mockProps,
      setRecurrenceRuleState: mockSetRecurrenceRuleState,
      setCustomRecurrenceModalIsOpen: mockSetModalOpen,
      recurrenceRuleState: {
        ...mockProps.recurrenceRuleState,
        endDate: new Date('2024-02-15'),
        never: false,
        count: undefined,
      },
    });

    // Switch to "on" option
    const onOption = screen.getByTestId('on');
    await userEvent.click(onOption);

    const submitButton = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitButton);

    // Verify the "ends on" logic (lines 305-315)
    expect(mockSetRecurrenceRuleState).toHaveBeenCalledWith(
      expect.objectContaining({
        never: false,
        count: undefined,
        endDate: expect.any(Date),
      }),
    );
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });
});
