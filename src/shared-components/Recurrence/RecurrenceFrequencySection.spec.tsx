import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecurrenceFrequencySection } from './RecurrenceFrequencySection';
import { Frequency } from '../../utils/recurrenceUtils';

const defaultProps = {
  frequency: Frequency.DAILY,
  localInterval: '1',
  onIntervalChange: vi.fn(),
  onFrequencyChange: vi.fn(),
  t: (key: string) => key,
};

describe('RecurrenceFrequencySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required elements', () => {
    render(<RecurrenceFrequencySection {...defaultProps} />);
    expect(screen.getAllByText('repeatsEvery').length).toBeGreaterThan(0);
    expect(
      screen.getByTestId('customRecurrenceIntervalInput'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('customRecurrenceFrequencyDropdown'),
    ).toBeInTheDocument();
  });

  it('shows correct frequency label', () => {
    render(<RecurrenceFrequencySection {...defaultProps} />);
    expect(
      screen.getByTestId('customRecurrenceFrequencyDropdown'),
    ).toHaveTextContent('Daily');
  });

  it('handles interval changes', async () => {
    const user = userEvent.setup();
    const onIntervalChange = vi.fn();
    render(
      <RecurrenceFrequencySection
        {...defaultProps}
        onIntervalChange={onIntervalChange}
      />,
    );

    const input = screen.getByTestId('customRecurrenceIntervalInput');
    await user.clear(input);
    await user.type(input, '5');
    expect(onIntervalChange).toHaveBeenCalled();
  });

  it('prevents invalid keys in interval input', async () => {
    const user = userEvent.setup();
    render(<RecurrenceFrequencySection {...defaultProps} />);

    const input = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    const initialValue = input.value;

    await user.type(input, '-');
    await user.type(input, '+');
    await user.type(input, 'e');
    await user.type(input, 'E');

    expect(input.value).toBe(initialValue);
  });

  it('renders all frequency options', async () => {
    const user = userEvent.setup();
    render(<RecurrenceFrequencySection {...defaultProps} />);

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    expect(screen.getByTestId('customWeeklyRecurrence')).toBeInTheDocument();
    expect(screen.getByTestId('customMonthlyRecurrence')).toBeInTheDocument();
    expect(screen.getByTestId('customYearlyRecurrence')).toBeInTheDocument();
  });

  it('selects interval text on double click', async () => {
    const user = userEvent.setup();
    render(<RecurrenceFrequencySection {...defaultProps} />);

    const input = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;

    const selectSpy = vi.spyOn(input, 'select');
    await user.dblClick(input);
    expect(selectSpy).toHaveBeenCalled();
  });

  it('applies aria-label to frequency dropdown', () => {
    render(<RecurrenceFrequencySection {...defaultProps} />);
    const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
    expect(dropdown).toHaveAttribute('aria-label', 'frequency');
  });

  it('calls onFrequencyChange when a frequency is selected', async () => {
    const user = userEvent.setup();
    const onFrequencyChange = vi.fn();
    render(
      <RecurrenceFrequencySection
        {...defaultProps}
        onFrequencyChange={onFrequencyChange}
      />,
    );

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    await user.click(screen.getByTestId('customWeeklyRecurrence'));
    expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.WEEKLY);
  });

  it('calls onFrequencyChange for daily frequency', async () => {
    const user = userEvent.setup();
    const onFrequencyChange = vi.fn();
    render(
      <RecurrenceFrequencySection
        {...defaultProps}
        onFrequencyChange={onFrequencyChange}
      />,
    );

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    await user.click(screen.getByTestId('customDailyRecurrence'));
    expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.DAILY);
  });

  it('calls onFrequencyChange for monthly frequency', async () => {
    const user = userEvent.setup();
    const onFrequencyChange = vi.fn();
    render(
      <RecurrenceFrequencySection
        {...defaultProps}
        onFrequencyChange={onFrequencyChange}
      />,
    );

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    await user.click(screen.getByTestId('customMonthlyRecurrence'));
    expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.MONTHLY);
  });

  it('calls onFrequencyChange for yearly frequency', async () => {
    const user = userEvent.setup();
    const onFrequencyChange = vi.fn();
    render(
      <RecurrenceFrequencySection
        {...defaultProps}
        onFrequencyChange={onFrequencyChange}
      />,
    );

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));
    await user.click(screen.getByTestId('customYearlyRecurrence'));
    expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.YEARLY);
  });

  it('handles empty interval safely', () => {
    render(<RecurrenceFrequencySection {...defaultProps} localInterval="" />);
    const input = screen.getByTestId(
      'customRecurrenceIntervalInput',
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
