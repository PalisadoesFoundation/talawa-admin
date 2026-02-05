import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecurrenceMonthlySection } from './RecurrenceMonthlySection';
import {
  Frequency,
  WeekDays,
  getMonthlyOptions,
} from '../../utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from '../../utils/recurrenceUtils';
import dayjs from 'dayjs';

const defaultRecurrenceRule: InterfaceRecurrenceRule = {
  frequency: Frequency.MONTHLY,
  interval: 1,
  byMonthDay: [15],
  byDay: undefined,
  never: true,
};

const defaultProps = {
  frequency: Frequency.MONTHLY,
  recurrenceRuleState: defaultRecurrenceRule,
  setRecurrenceRuleState: vi.fn(),
  startDate: dayjs().year(2024).month(6).date(15).toDate(),
  t: (key: string) => key,
};

describe('RecurrenceMonthlySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders when frequency is MONTHLY', () => {
    render(<RecurrenceMonthlySection {...defaultProps} />);

    expect(screen.getByText('monthlyOn')).toBeInTheDocument();
    expect(screen.getByTestId('monthlyRecurrence-toggle')).toBeInTheDocument();
  });

  it('returns null when frequency is not MONTHLY', () => {
    const { container } = render(
      <RecurrenceMonthlySection
        {...defaultProps}
        frequency={Frequency.DAILY}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows byDate label by default', () => {
    render(<RecurrenceMonthlySection {...defaultProps} />);

    expect(screen.getByTestId('monthlyRecurrence-toggle')).toHaveTextContent(
      'Monthly on day 15',
    );
  });

  it('shows byWeekday label when byDay is present', () => {
    const ruleWithByDay: InterfaceRecurrenceRule = {
      ...defaultRecurrenceRule,
      byDay: [WeekDays.MO],
      byMonthDay: undefined,
    };

    render(
      <RecurrenceMonthlySection
        {...defaultProps}
        recurrenceRuleState={ruleWithByDay}
      />,
    );

    expect(screen.getByTestId('monthlyRecurrence-toggle')).toHaveTextContent(
      'Monthly on the third Monday',
    );
  });

  it('applies aria-label', () => {
    render(<RecurrenceMonthlySection {...defaultProps} />);

    expect(screen.getByTestId('monthlyRecurrence-toggle')).toHaveAttribute(
      'aria-label',
      'monthlyOn',
    );
  });

  it('should call setRecurrenceRuleState when byDate option is selected', async () => {
    const user = userEvent.setup();
    const setRecurrenceRuleState = vi.fn();

    render(
      <RecurrenceMonthlySection
        {...defaultProps}
        setRecurrenceRuleState={setRecurrenceRuleState}
      />,
    );

    await user.click(screen.getByTestId('monthlyRecurrence-toggle'));
    await user.click(screen.getByTestId('monthlyRecurrence-item-BY_DATE'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();

    const updater = setRecurrenceRuleState.mock.calls[0][0];
    expect(typeof updater).toBe('function');

    const prevState: InterfaceRecurrenceRule = {
      ...defaultRecurrenceRule,
      byDay: [WeekDays.MO],
    };

    const nextState = updater(prevState);

    expect(nextState.byMonthDay).toEqual([15]);
    expect(nextState.byDay).toBeUndefined();
  });

  it('should call setRecurrenceRuleState when byWeekday option is selected', async () => {
    const user = userEvent.setup();
    const setRecurrenceRuleState = vi.fn();

    render(
      <RecurrenceMonthlySection
        {...defaultProps}
        setRecurrenceRuleState={setRecurrenceRuleState}
      />,
    );

    await user.click(screen.getByTestId('monthlyRecurrence-toggle'));
    await user.click(screen.getByTestId('monthlyRecurrence-item-BY_WEEKDAY'));

    expect(setRecurrenceRuleState).toHaveBeenCalled();

    const updater = setRecurrenceRuleState.mock.calls[0][0];
    expect(typeof updater).toBe('function');

    const prevState: InterfaceRecurrenceRule = {
      ...defaultRecurrenceRule,
      byMonthDay: [15],
      byDay: undefined,
    };

    const nextState = updater(prevState);

    const expectedWeekday = getMonthlyOptions(defaultProps.startDate)
      .weekdayValue.day;

    expect(nextState.byDay).toEqual([expectedWeekday]);
    expect(nextState.byMonthDay).toBeUndefined();
  });
});
