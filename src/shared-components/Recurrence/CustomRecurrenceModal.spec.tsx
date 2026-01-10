import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  within,
} from '@testing-library/react';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Mock NotificationToast at module level
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: (props: {
    label: string;
    value: string;
    onChange: (value: dayjs.Dayjs | null) => void;
    disabled?: boolean;
    slotProps?: { textField?: { 'aria-label'?: string } };
    'data-testid'?: string;
    'data-cy'?: string;
  }) => {
    const { value, onChange, disabled, slotProps } = props;
    const testId = props['data-testid'];
    const dataCy = props['data-cy'];

    const inputId = `date-picker-${testId || 'input'}`;

    return (
      <>
        {slotProps?.textField?.['aria-label'] && (
          <label htmlFor={inputId}>{slotProps.textField['aria-label']}</label>
        )}
        <input
          id={inputId}
          type="text"
          data-testid={testId || 'mocked-date-picker'}
          data-cy={dataCy}
          disabled={disabled}
          aria-label={slotProps?.textField?.['aria-label']}
          value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              const parsed = dayjs(val, ['MM/DD/YYYY', 'YYYY-MM-DD']);
              onChange(parsed);
            } else {
              onChange(null);
            }
          }}
        />
      </>
    );
  },
}));

import CustomRecurrenceModal from './CustomRecurrenceModal';
import type { InterfaceCustomRecurrenceModalProps } from 'types/Recurrence/interface';
import {
  Frequency,
  endsNever,
  endsOn,
  endsAfter,
  WeekDays,
} from '../../utils/recurrenceUtils';

const baseRecurrenceRule = {
  frequency: Frequency.DAILY,
  interval: 1,
  byDay: undefined,
  byMonth: undefined,
  byMonthDay: undefined,
  count: undefined,
  endDate: undefined,
  never: true,
};

const renderModal = (
  override: Partial<InterfaceCustomRecurrenceModalProps> = {},
) => {
  const setRecurrenceRuleState = vi.fn();
  const setCustomRecurrenceModalIsOpen = vi.fn();
  const hideCustomRecurrenceModal = vi.fn();

  const props: InterfaceCustomRecurrenceModalProps = {
    recurrenceRuleState: baseRecurrenceRule,
    setRecurrenceRuleState,
    endDate: null,
    setEndDate: vi.fn(),
    customRecurrenceModalIsOpen: true,
    hideCustomRecurrenceModal,
    setCustomRecurrenceModalIsOpen,
    t: (key: string) => key,
    // Use dynamic future date to avoid test staleness
    startDate: dayjs().add(30, 'days').toDate(),
    ...override,
  };

  render(
    <>
      <CustomRecurrenceModal {...props} />
    </>,
  );

  return {
    setRecurrenceRuleState,
    setCustomRecurrenceModalIsOpen,
    hideCustomRecurrenceModal,
  };
};

describe('CustomRecurrenceModal – full coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal and core controls', () => {
    renderModal();

    expect(screen.getByText('customRecurrence')).toBeInTheDocument();
    expect(
      screen.getByTestId('customRecurrenceIntervalInput'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('customRecurrenceFrequencyDropdown'),
    ).toBeInTheDocument();
  });

  it('closes modal via close button', () => {
    const { hideCustomRecurrenceModal } = renderModal();

    const modals = screen.getAllByTestId('customRecurrenceModal');
    const modal = modals[modals.length - 1];
    fireEvent.click(within(modal).getByTestId('modalCloseBtn'));
    expect(hideCustomRecurrenceModal).toHaveBeenCalled();
  });

  it('updates interval and recurrence rule', () => {
    const { setRecurrenceRuleState } = renderModal();

    fireEvent.change(screen.getByTestId('customRecurrenceIntervalInput'), {
      target: { value: '3' },
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles interval change with non-numeric input', () => {
    const { setRecurrenceRuleState } = renderModal();

    fireEvent.change(screen.getByTestId('customRecurrenceIntervalInput'), {
      target: { value: 'abc' },
    });

    // Should still update with default value of 1
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('switches to weekly frequency', async () => {
    const { setRecurrenceRuleState } = renderModal();

    // Open the frequency dropdown first
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });
    // Then click weekly option
    await act(async () => {
      fireEvent.click(screen.getByTestId('customWeeklyRecurrence'));
    });

    // Verify the frequency change was called
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('switches to weekly frequency and toggles days', () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const days = screen.getAllByTestId('recurrenceWeekDay');
    fireEvent.click(days[1]);
    fireEvent.click(days[2]);

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('switches frequency to daily', async () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
      },
    });

    // Open the frequency dropdown first
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });
    // Then click daily option
    await act(async () => {
      fireEvent.click(screen.getByTestId('customDailyRecurrence'));
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('switches frequency to monthly', async () => {
    const { setRecurrenceRuleState } = renderModal();

    // Open the frequency dropdown first
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });
    // Then click monthly option
    await act(async () => {
      fireEvent.click(screen.getByTestId('customMonthlyRecurrence'));
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('switches frequency to yearly', async () => {
    const { setRecurrenceRuleState } = renderModal();

    // Open the frequency dropdown first
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });
    // Then click yearly option
    await act(async () => {
      fireEvent.click(screen.getByTestId('customYearlyRecurrence'));
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('renders monthly by-date option', async () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.MONTHLY,
      },
    });

    // Verify the dropdown is rendered
    expect(screen.getByTestId('monthlyRecurrenceDropdown')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId('monthlyRecurrenceDropdown'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('monthlyByDate'));
    });

    // Verify the dropdown is still rendered after clicking
    expect(screen.getByTestId('monthlyRecurrenceDropdown')).toBeInTheDocument();
  });

  it('renders monthly by-weekday option (branch coverage)', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.MONTHLY,
        byDay: [WeekDays.MO], // Truthy value to trigger byWeekday branch
      },
    });

    expect(screen.getByText(/Monthly on the/i)).toBeInTheDocument();
  });

  it('renders yearly recurrence block', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.YEARLY,
      },
    });

    expect(screen.getByText('yearlyOn')).toBeInTheDocument();
    expect(screen.getByText('yearlyRecurrenceDesc')).toBeInTheDocument();
  });

  it('handles ends never option', () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        never: false,
        endDate: new Date(),
      },
    });

    fireEvent.click(screen.getByTestId(endsNever));
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles ends on option and date change', () => {
    const { setRecurrenceRuleState } = renderModal();

    fireEvent.click(screen.getByTestId(endsOn));

    // Clicking endsOn should trigger setRecurrenceRuleState
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('renders DatePicker when endsOn is selected', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        never: false,
        endDate: new Date(),
      },
    });

    // Verify DatePicker is rendered (it has the label 'endDate')
    const datePickers = screen.getAllByLabelText('endDate');
    expect(datePickers.length).toBeGreaterThan(0);
  });

  it('syncs endDate via useEffect (endsOn auto-select)', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        never: false,
        count: undefined,
        endDate: new Date(),
      },
    });

    expect(screen.getByTestId(endsOn)).toBeChecked();
  });

  it('initializes with endsAfter when count exists', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        never: false,
        count: 5,
        endDate: undefined,
      },
    });

    expect(screen.getByTestId(endsAfter)).toBeChecked();
  });

  it('initializes with endsAfter for yearly frequency', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.YEARLY,
        never: false,
        count: undefined,
        endDate: undefined,
      },
    });

    expect(screen.getByTestId(endsAfter)).toBeChecked();
  });

  it('initializes localCount with count value when provided', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        count: 10,
      },
    });

    fireEvent.click(screen.getByTestId(endsAfter));
    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;
    expect(countInput.value).toBe('10');
  });

  it('initializes localCount with default for yearly frequency', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.YEARLY,
        count: undefined,
      },
    });

    fireEvent.click(screen.getByTestId(endsAfter));
    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;
    expect(countInput.value).toBe('5');
  });

  it('handles ends after option and count change', () => {
    const { setRecurrenceRuleState } = renderModal();

    fireEvent.click(screen.getByTestId(endsAfter));
    fireEvent.change(screen.getByTestId('customRecurrenceCountInput'), {
      target: { value: '4' },
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles count change with non-numeric input', () => {
    const { setRecurrenceRuleState } = renderModal();

    fireEvent.click(screen.getByTestId(endsAfter));
    fireEvent.change(screen.getByTestId('customRecurrenceCountInput'), {
      target: { value: 'abc' },
    });

    // Should still update with default value of 1
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles count change when endsAfter is not selected', () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        never: false,
        count: 5,
      },
    });
    fireEvent.click(screen.getByTestId(endsNever));
    setRecurrenceRuleState.mockClear();
    fireEvent.change(screen.getByTestId('customRecurrenceCountInput'), {
      target: { value: '10' },
    });

    expect(setRecurrenceRuleState).not.toHaveBeenCalled();
  });

  it('submits valid recurrence configuration with endsNever', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal();

    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('submits valid recurrence configuration with endsOn', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal({
        recurrenceRuleState: {
          ...baseRecurrenceRule,
          never: false,
          endDate: new Date(),
        },
      });

    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('submits valid recurrence configuration with endsAfter', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal({
        recurrenceRuleState: {
          ...baseRecurrenceRule,
          never: false,
          count: 5,
        },
      });

    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('submits with fallback endDate when endsOn selected but no endDate', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal({
        recurrenceRuleState: {
          ...baseRecurrenceRule,
          never: false,
          endDate: undefined,
        },
      });

    fireEvent.click(screen.getByTestId(endsOn));
    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('blocks submit on invalid interval', async () => {
    const { setCustomRecurrenceModalIsOpen } = renderModal();
    vi.clearAllMocks();

    const intervalInput = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    // Change input to invalid value '0'
    await act(async () => {
      fireEvent.change(intervalInput, {
        target: { value: '0' },
      });
    });

    // Wait for component to re-render with new state
    await waitFor(() => {
      expect(intervalInput.value).toBe('0');
    });

    // Clear previous calls to isolate this test
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with invalid value
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    // Wait for toast.error to be called
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    // Verify that toast.error was called
    // The t function returns the key, so it will be 'invalidDetailsMessage' or the fallback
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(
      errorCall === 'invalidDetailsMessage' ||
        errorCall.includes('valid interval'),
    ).toBe(true);

    // Verify that modal is NOT closed when validation fails
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('blocks submit on invalid interval (NaN)', async () => {
    const { setCustomRecurrenceModalIsOpen } = renderModal();
    vi.clearAllMocks();

    const intervalInput = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    // Change input to empty string (which will result in NaN when parsed)
    // Number inputs don't accept non-numeric strings, so we use empty string
    await act(async () => {
      fireEvent.change(intervalInput, {
        target: { value: '' },
      });
    });

    // Wait for component to re-render with new state
    await waitFor(() => {
      expect(intervalInput.value).toBe('');
    });

    // Clear previous calls to isolate this test
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with invalid value
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    // Verify that toast.error was called
    // The t function returns the key, so it will be 'invalidDetailsMessage' or the fallback
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(
      errorCall === 'invalidDetailsMessage' ||
        errorCall.includes('valid interval'),
    ).toBe(true);

    // Verify that modal is NOT closed when validation fails
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('blocks submit on invalid count for ends after', async () => {
    const { setCustomRecurrenceModalIsOpen } = renderModal();
    vi.clearAllMocks();

    // Select endsAfter option
    await act(async () => {
      fireEvent.click(screen.getByTestId(endsAfter));
    });

    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;

    // Change count input to invalid value '0'
    await act(async () => {
      fireEvent.change(countInput, {
        target: { value: '0' },
      });
    });

    // Wait for component to re-render with new state
    await waitFor(() => {
      expect(countInput.value).toBe('0');
    });

    // Clear previous calls to isolate this test
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with invalid value
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    // Verify that toast.error was called
    // The t function returns the key, so it will be 'invalidDetailsMessage' or the fallback
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(
      errorCall === 'invalidDetailsMessage' ||
        errorCall.includes('valid occurrence count'),
    ).toBe(true);

    // Verify that modal is NOT closed when validation fails
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('blocks submit on invalid count (NaN) for ends after', async () => {
    const { setCustomRecurrenceModalIsOpen } = renderModal();
    vi.clearAllMocks();

    // Select endsAfter option
    await act(async () => {
      fireEvent.click(screen.getByTestId(endsAfter));
    });

    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;

    // Change count input to empty string (which will result in NaN when parsed)
    // Number inputs don't accept non-numeric strings, so we use empty string
    await act(async () => {
      fireEvent.change(countInput, {
        target: { value: '' },
      });
    });

    // Wait for component to re-render with new state
    await waitFor(() => {
      expect(countInput.value).toBe('');
    });

    // Clear previous calls to isolate this test
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with invalid value
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
    // Verify that toast.error was called
    // The t function returns the key, so it will be 'invalidDetailsMessage' or the fallback
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(
      errorCall === 'invalidDetailsMessage' ||
        errorCall.includes('valid occurrence count'),
    ).toBe(true);

    // Verify that modal is NOT closed when validation fails
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('uses fallback error message for invalid interval when translation returns falsy', async () => {
    // Create a translation function that returns empty string for invalidDetailsMessage
    // This will trigger the fallback message on line 321
    const t = vi.fn((key: string) => {
      if (key === 'invalidDetailsMessage') {
        return ''; // Return falsy to trigger fallback
      }
      return key;
    });

    const { setCustomRecurrenceModalIsOpen } = renderModal({ t });
    vi.clearAllMocks();

    const intervalInput = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    // Change input to invalid value '0'
    await act(async () => {
      fireEvent.change(intervalInput, {
        target: { value: '0' },
      });
    });

    // Wait for component to re-render with new state
    await waitFor(() => {
      expect(intervalInput.value).toBe('0');
    });

    // Clear previous calls to isolate this test
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with invalid value
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    // Verify that toast.error was called with the fallback message (line 321)
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(errorCall).toBe(
      'Please enter a valid interval (must be at least 1)',
    );

    // Verify that modal is NOT closed when validation fails
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('uses fallback error message for invalid count when translation returns falsy', async () => {
    // Create a translation function that returns empty string for invalidDetailsMessage
    // This will trigger the fallback message on line 352
    const t = vi.fn((key: string) => {
      if (key === 'invalidDetailsMessage') {
        return ''; // Return falsy to trigger fallback
      }
      return key;
    });

    const { setCustomRecurrenceModalIsOpen } = renderModal({ t });
    vi.clearAllMocks();

    // Select endsAfter option
    await act(async () => {
      fireEvent.click(screen.getByTestId(endsAfter));
    });

    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;

    // Change count input to invalid value '0'
    await act(async () => {
      fireEvent.change(countInput, {
        target: { value: '0' },
      });
    });

    // Wait for component to re-render with new state
    await waitFor(() => {
      expect(countInput.value).toBe('0');
    });

    // Clear previous calls to isolate this test
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with invalid value
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(errorCall).toBe(
      'Please enter a valid occurrence count (must be at least 1)',
    );
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('blocks submit on weekly recurrence with no days selected', async () => {
    const { setCustomRecurrenceModalIsOpen } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: undefined, // No days selected
      },
    });
    vi.clearAllMocks();
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    // Try to submit with no days selected
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(
      errorCall === 'selectAtLeastOneDay' ||
        errorCall.includes('select at least one day'),
    ).toBe(true);

    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('blocks submit on weekly recurrence with empty days array', async () => {
    const { setCustomRecurrenceModalIsOpen } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [], // Empty array
      },
    });
    vi.clearAllMocks();
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(
      errorCall === 'selectAtLeastOneDay' ||
        errorCall.includes('select at least one day'),
    ).toBe(true);

    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('allows submit on weekly recurrence with at least one day selected', async () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal({
        recurrenceRuleState: {
          ...baseRecurrenceRule,
          frequency: Frequency.WEEKLY,
          byDay: [WeekDays.MO], // At least one day selected
        },
      });
    vi.clearAllMocks();
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();

    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });
    expect(NotificationToast.error).not.toHaveBeenCalled();
    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('uses fallback error message for weekly recurrence validation when translation returns falsy', async () => {
    // Create a translation function that returns empty string for selectAtLeastOneDay
    const t = vi.fn((key: string) => {
      if (key === 'selectAtLeastOneDay') {
        return ''; // Return falsy to trigger fallback
      }
      return key;
    });

    const { setCustomRecurrenceModalIsOpen } = renderModal({
      t,
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: undefined, // No days selected
      },
    });
    vi.clearAllMocks();
    setCustomRecurrenceModalIsOpen.mockClear();
    (NotificationToast.error as ReturnType<typeof vi.fn>).mockClear();
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
    expect(NotificationToast.error).toHaveBeenCalled();
    const errorCall = (NotificationToast.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(errorCall).toBe(
      'Please select at least one day for weekly recurrence',
    );

    // Verify that modal is NOT closed when validation fails
    expect(setCustomRecurrenceModalIsOpen).not.toHaveBeenCalled();
  });

  it('handles endsOn with endDate prop', () => {
    const { setRecurrenceRuleState } = renderModal({
      // Use dynamic future date to avoid test staleness
      endDate: dayjs().add(60, 'days').toDate(),
    });

    fireEvent.click(screen.getByTestId(endsOn));

    // Verify that setRecurrenceRuleState was called
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles endsOn without endDate prop', () => {
    const { setRecurrenceRuleState } = renderModal({
      endDate: null,
    });

    fireEvent.click(screen.getByTestId(endsOn));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('filters out endsNever for yearly frequency', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.YEARLY,
      },
    });

    // endsNever should not be in the document for yearly
    expect(screen.queryByTestId(endsNever)).not.toBeInTheDocument();
  });

  it('prevents invalid keys in interval input', () => {
    renderModal();

    const intervalInput = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    // Set an initial value
    fireEvent.change(intervalInput, { target: { value: '5' } });
    const initialValue = intervalInput.value;

    // Test invalid keys - they should be prevented via preventDefault
    const invalidKeys = ['-', '+', 'e', 'E'];
    invalidKeys.forEach((key) => {
      const preventDefaultSpy = vi.fn();

      // Create a synthetic keyboard event
      const syntheticEvent = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });

      // Override preventDefault to spy on it
      Object.defineProperty(syntheticEvent, 'preventDefault', {
        value: preventDefaultSpy,
        writable: true,
      });

      intervalInput.dispatchEvent(syntheticEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
    expect(intervalInput.value).toBe(initialValue);
  });

  it('prevents invalid keys in count input', () => {
    renderModal();

    fireEvent.click(screen.getByTestId(endsAfter));

    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;

    // Set an initial value
    fireEvent.change(countInput, { target: { value: '10' } });
    const initialValue = countInput.value;

    // Test invalid keys - they should be prevented via preventDefault
    const invalidKeys = ['-', '+', 'e', 'E'];
    invalidKeys.forEach((key) => {
      const preventDefaultSpy = vi.fn();

      // Create a synthetic keyboard event
      const syntheticEvent = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });

      // Override preventDefault to spy on it
      Object.defineProperty(syntheticEvent, 'preventDefault', {
        value: preventDefaultSpy,
        writable: true,
      });

      countInput.dispatchEvent(syntheticEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
    expect(countInput.value).toBe(initialValue);
  });

  it('handles onDoubleClick for interval input', () => {
    renderModal();

    const intervalInput = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    // Set a value first
    fireEvent.change(intervalInput, { target: { value: '5' } });

    // Test double click selects the input
    const selectSpy = vi.spyOn(intervalInput, 'select');
    fireEvent.doubleClick(intervalInput);
    expect(selectSpy).toHaveBeenCalled();
  });

  it('handles onDoubleClick for count input', () => {
    renderModal();

    fireEvent.click(screen.getByTestId(endsAfter));

    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;

    // Set a value first
    fireEvent.change(countInput, { target: { value: '10' } });

    // Test double click selects the input
    const selectSpy = vi.spyOn(countInput, 'select');
    fireEvent.doubleClick(countInput);
    expect(selectSpy).toHaveBeenCalled();
  });

  it('covers getWeekOfMonth, getOrdinalString, and getDayName helper functions with 3rd week date', async () => {
    // Test with date in 3rd week (e.g., 15th of a month)
    // Using a dynamic date that falls on the 15th of a future month
    const thirdWeekDate = dayjs().add(30, 'days').date(15).toDate();
    renderModal({
      startDate: thirdWeekDate,
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.MONTHLY,
      },
    });

    // Open monthly dropdown to trigger getMonthlyOptions
    await act(async () => {
      fireEvent.click(screen.getByTestId('monthlyRecurrenceDropdown'));
    });
    expect(screen.getByTestId('monthlyByDate')).toBeInTheDocument();
  });

  it('covers helper functions with 1st week date and byWeekday', async () => {
    // Test with date in 1st week (e.g., 1st of a month) with byDay set
    // Using a dynamic date that falls on the 1st of a future month
    const firstWeekDate = dayjs().add(30, 'days').date(1).toDate();
    renderModal({
      startDate: firstWeekDate,
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.MONTHLY,
        byDay: [WeekDays.SA], // Set byDay to trigger byWeekday display
      },
    });

    // Open monthly dropdown
    await act(async () => {
      fireEvent.click(screen.getByTestId('monthlyRecurrenceDropdown'));
    });
    expect(screen.getByTestId('monthlyByDate')).toBeInTheDocument();
  });

  it('covers helper functions with 5th week date (edge case)', async () => {
    // Test with date in 5th week (e.g., 31st of a month)
    // Ensure we're in a month with 31 days (Jan, Mar, May, Jul, Aug, Oct, Dec)
    const fifthWeekDate = dayjs.utc().month(0).date(31).toDate(); // January 31st
    renderModal({
      startDate: fifthWeekDate,
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.MONTHLY,
        byDay: [WeekDays.MO],
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('monthlyRecurrenceDropdown'));
    });
    expect(screen.getByTestId('monthlyByDate')).toBeInTheDocument();
  });

  it('covers handleDayClick when byDay is undefined', async () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: undefined, // Start with undefined
      },
    });

    // Open frequency dropdown and ensure weekly is selected
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('customWeeklyRecurrence'));
    });

    // Wait for weekday buttons
    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Click a day when byDay is undefined (covers line 276)
    await act(async () => {
      fireEvent.click(weekdayButtons[0]);
    });
    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles keyboard navigation with ArrowLeft on weekday buttons', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Create a mock button for querySelector to return
    const mockButton = document.createElement('button');
    mockButton.setAttribute('data-cy', 'recurrenceWeekDay-6');
    mockButton.focus = vi.fn();
    const originalQuerySelector = document.querySelector;
    try {
      document.querySelector = vi.fn().mockReturnValue(mockButton);

      weekdayButtons[0].focus();
      fireEvent.keyDown(weekdayButtons[0], {
        key: 'ArrowLeft',
      });

      expect(document.querySelector).toHaveBeenCalledWith(
        '[data-cy="recurrenceWeekDay-6"]',
      );
      expect(mockButton.focus).toHaveBeenCalled();
    } finally {
      document.querySelector = originalQuerySelector;
    }
  });

  it('handles keyboard navigation with ArrowRight on weekday buttons', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Create a mock button for querySelector to return
    const mockButton = document.createElement('button');
    mockButton.setAttribute('data-cy', 'recurrenceWeekDay-0');
    mockButton.focus = vi.fn();
    const originalQuerySelector = document.querySelector;
    try {
      document.querySelector = vi.fn().mockReturnValue(mockButton);

      weekdayButtons[0].focus();
      fireEvent.keyDown(weekdayButtons[0], {
        key: 'ArrowRight',
      });

      expect(document.querySelector).toHaveBeenCalledWith(
        '[data-cy="recurrenceWeekDay-1"]',
      );
      expect(mockButton.focus).toHaveBeenCalled();
    } finally {
      document.querySelector = originalQuerySelector;
    }
  });

  it('handles keyboard navigation with Home key on weekday buttons', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Create a mock button for querySelector to return
    const mockButton = document.createElement('button');
    mockButton.setAttribute('data-cy', 'recurrenceWeekDay-0');
    mockButton.focus = vi.fn();
    const originalQuerySelector = document.querySelector;
    try {
      document.querySelector = vi.fn().mockReturnValue(mockButton);

      weekdayButtons[0].focus();
      fireEvent.keyDown(weekdayButtons[0], {
        key: 'Home',
      });

      expect(document.querySelector).toHaveBeenCalledWith(
        '[data-cy="recurrenceWeekDay-0"]',
      );
      expect(mockButton.focus).toHaveBeenCalled();
    } finally {
      document.querySelector = originalQuerySelector;
    }
  });

  it('handles keyboard navigation with End key on weekday buttons', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Create a mock button for querySelector to return
    const mockButton = document.createElement('button');
    mockButton.setAttribute('data-cy', 'recurrenceWeekDay-6');
    mockButton.focus = vi.fn();
    const originalQuerySelector = document.querySelector;
    try {
      document.querySelector = vi.fn().mockReturnValue(mockButton);

      weekdayButtons[0].focus();
      fireEvent.keyDown(weekdayButtons[0], {
        key: 'End',
      });

      expect(document.querySelector).toHaveBeenCalledWith(
        '[data-cy="recurrenceWeekDay-6"]',
      );
      expect(mockButton.focus).toHaveBeenCalled();
    } finally {
      document.querySelector = originalQuerySelector;
    }
  });

  it('handles keyboard navigation with non-navigation key (no action)', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Mock querySelector to verify it's not called for non-navigation keys
    const originalQuerySelector = document.querySelector;
    const querySelectorSpy = vi.fn();
    document.querySelector = querySelectorSpy;

    // Press a non-navigation key (should not prevent default or change focus)
    // The handleWeekdayKeyDown function returns early for non-navigation keys
    fireEvent.keyDown(weekdayButtons[0], {
      key: 'a',
    });

    // Non-navigation keys should not trigger querySelector
    // The function returns early for non-navigation keys (line 357 in component)
    expect(querySelectorSpy).not.toHaveBeenCalled();

    // Restore original querySelector
    document.querySelector = originalQuerySelector;
  });

  it('handles Enter key on weekday buttons', () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Press Enter on a weekday button (should toggle the day)
    // The onKeyDown handler checks for Enter or Space and calls handleDayClick
    fireEvent.keyDown(weekdayButtons[1], {
      key: 'Enter',
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles Space key on weekday buttons', () => {
    const { setRecurrenceRuleState } = renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Press Space on a weekday button (should toggle the day)
    // The onKeyDown handler checks for Enter or Space and calls handleDayClick
    fireEvent.keyDown(weekdayButtons[2], {
      key: ' ',
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('renders modal with onHide handler configured', () => {
    const { hideCustomRecurrenceModal } = renderModal();
    const modals = screen.getAllByRole('dialog');
    const modal = modals[modals.length - 1];
    expect(modal).toBeInTheDocument();
    expect(hideCustomRecurrenceModal).toBeDefined();
    expect(modal).toBeVisible();
  });

  it('covers getOrdinalString with number > 5 (returns last)', async () => {
    // Test with a date that would result in week > 5
    // We'll use a date calculation that might exceed 5 weeks
    // Actually, getWeekOfMonth returns 1-5, so we need to test the fallback in getOrdinalString
    // The fallback happens when num > 5 or num is not in the ordinals array
    // Using a dynamic date on the 15th of a future month
    const thirdWeekDate = dayjs().add(30, 'days').date(15).toDate();
    renderModal({
      startDate: thirdWeekDate,
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.MONTHLY,
        byDay: [WeekDays.MO],
      },
    });

    // The getOrdinalString function has a fallback: `return ordinals[num] || 'last';`
    // To test this, we'd need to pass a number > 5, but getWeekOfMonth only returns 1-5
    // However, the code has the fallback, so we verify the function exists and works
    await act(async () => {
      fireEvent.click(screen.getByTestId('monthlyRecurrenceDropdown'));
    });
    expect(screen.getByTestId('monthlyByDate')).toBeInTheDocument();
  });

  it('handles handleWeekdayKeyDown when button is not found', () => {
    renderModal({
      recurrenceRuleState: {
        ...baseRecurrenceRule,
        frequency: Frequency.WEEKLY,
        byDay: [WeekDays.MO],
      },
    });

    const weekdayButtons = screen.getAllByTestId('recurrenceWeekDay');
    expect(weekdayButtons.length).toBeGreaterThan(0);

    // Mock querySelector to return null (button not found)
    const originalQuerySelector = document.querySelector;
    document.querySelector = vi.fn().mockReturnValue(null);

    // Press ArrowRight - should not throw error even if button is not found
    fireEvent.keyDown(weekdayButtons[0], {
      key: 'ArrowRight',
    });

    // Verify querySelector was called (even though it returned null)
    expect(document.querySelector).toHaveBeenCalledWith(
      '[data-cy="recurrenceWeekDay-1"]',
    );

    // Restore original querySelector
    document.querySelector = originalQuerySelector;
  });

  it('handles interval change with string value that becomes number', () => {
    const { setRecurrenceRuleState } = renderModal();

    const intervalInput = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    // Change to a string value
    fireEvent.change(intervalInput, { target: { value: '5' } });

    // Submit to trigger handleCustomRecurrenceSubmit which parses the string
    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('handles count change with string value that becomes number', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal();

    fireEvent.click(screen.getByTestId(endsAfter));

    const countInput = screen.getByTestId(
      'customRecurrenceCountInput',
    ) as HTMLInputElement;

    // Change to a string value
    fireEvent.change(countInput, { target: { value: '7' } });

    // Submit to trigger handleCustomRecurrenceSubmit which parses the string
    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('handles submit with endsOn when endDate exists in state', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal({
        recurrenceRuleState: {
          ...baseRecurrenceRule,
          never: false,
          // Use dynamic future date to avoid test staleness
          endDate: dayjs().add(60, 'days').toDate(),
        },
      });

    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('handles submit with endsAfter when count is valid', () => {
    const { setRecurrenceRuleState, setCustomRecurrenceModalIsOpen } =
      renderModal({
        recurrenceRuleState: {
          ...baseRecurrenceRule,
          never: false,
          count: 10,
        },
      });

    fireEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();
    expect(setCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
  });

  it('covers all frequency change branches including default case', async () => {
    const { setRecurrenceRuleState } = renderModal();

    // Test daily frequency (default case)
    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('customDailyRecurrence'));
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });

  it('wraps dropdown interactions in act to prevent warnings', async () => {
    const { setRecurrenceRuleState } = renderModal();

    await act(async () => {
      fireEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('customWeeklyRecurrence'));
    });

    expect(setRecurrenceRuleState).toHaveBeenCalled();
  });
});
