import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecurrenceMonthlySection } from './RecurrenceMonthlySection';
import { Frequency, WeekDays } from '../../utils/recurrenceUtils';
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
  startDate: dayjs().year(2024).month(6).date(15).toDate(), // July 15, 2024 (3rd Monday)
  t: (key: string) => key,
};

describe('RecurrenceMonthlySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render when frequency is MONTHLY', () => {
      render(<RecurrenceMonthlySection {...defaultProps} />);

      expect(screen.getByText('monthlyOn')).toBeInTheDocument();
      expect(
        screen.getByTestId('monthlyRecurrenceDropdown'),
      ).toBeInTheDocument();
    });

    it('should return null when frequency is not MONTHLY', () => {
      const { container } = render(
        <RecurrenceMonthlySection
          {...defaultProps}
          frequency={Frequency.DAILY}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should display byDate option when byDay is undefined', () => {
      render(<RecurrenceMonthlySection {...defaultProps} />);

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 15');
    });

    it('should display byWeekday option when byDay is defined', () => {
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

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on the third Monday');
    });
  });

  describe('Props Handling', () => {
    it('should use getMonthlyOptions to generate options', () => {
      render(<RecurrenceMonthlySection {...defaultProps} />);

      // Verify the dropdown shows the correct text based on startDate
      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 15');
    });

    it('should handle different start dates', () => {
      const { rerender } = render(
        <RecurrenceMonthlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(1).toDate()}
        />,
      );

      let dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 1');

      rerender(
        <RecurrenceMonthlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(11).date(31).toDate()}
        />,
      );

      dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 31');
    });

    it('should have correct aria-label', () => {
      render(<RecurrenceMonthlySection {...defaultProps} />);

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveAttribute('aria-label', 'monthlyOn');
    });
  });

  describe('User Interactions', () => {
    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup();

      render(<RecurrenceMonthlySection {...defaultProps} />);

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      await user.click(dropdown);

      // Check that dropdown menu item is available
      expect(screen.getByTestId('monthlyByDate')).toBeInTheDocument();
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

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      await user.click(dropdown);

      const byDateOption = screen.getByTestId('monthlyByDate');
      await user.click(byDateOption);

      expect(setRecurrenceRuleState).toHaveBeenCalled();
      const callArg = setRecurrenceRuleState.mock.calls[0][0];

      // Verify it's a function that updates state correctly
      if (typeof callArg === 'function') {
        const prevState: InterfaceRecurrenceRule = {
          ...defaultRecurrenceRule,
          byDay: [WeekDays.MO],
        };
        const newState = callArg(prevState);
        expect(newState.byMonthDay).toEqual([15]);
        expect(newState.byDay).toBeUndefined();
      }
    });

    it('should update state correctly when switching to byDate', async () => {
      const user = userEvent.setup();
      const setRecurrenceRuleState = vi.fn();
      const ruleWithByDay: InterfaceRecurrenceRule = {
        ...defaultRecurrenceRule,
        byDay: [WeekDays.MO],
        byMonthDay: undefined,
      };

      render(
        <RecurrenceMonthlySection
          {...defaultProps}
          recurrenceRuleState={ruleWithByDay}
          setRecurrenceRuleState={setRecurrenceRuleState}
        />,
      );

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      await user.click(dropdown);

      const byDateOption = screen.getByTestId('monthlyByDate');
      await user.click(byDateOption);

      expect(setRecurrenceRuleState).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle start date on first day of month', () => {
      render(
        <RecurrenceMonthlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(1).toDate()}
        />,
      );

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 1');
    });

    it('should handle start date on last day of month', () => {
      render(
        <RecurrenceMonthlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(31).toDate()}
        />,
      );

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 31');
    });

    it('should handle February in leap year', () => {
      render(
        <RecurrenceMonthlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(1).date(29).toDate()}
        />,
      );

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 29');
    });

    it('should handle February in non-leap year', () => {
      render(
        <RecurrenceMonthlySection
          {...defaultProps}
          startDate={dayjs().year(2023).month(1).date(28).toDate()}
        />,
      );

      const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 28');
    });

    it('should handle different months correctly', () => {
      const months = [
        dayjs().year(2024).month(0).date(15).toDate(),
        dayjs().year(2024).month(5).date(15).toDate(),
        dayjs().year(2024).month(11).date(15).toDate(),
      ];

      months.forEach((startDate) => {
        const { unmount } = render(
          <RecurrenceMonthlySection {...defaultProps} startDate={startDate} />,
        );

        const dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
        expect(dropdown).toHaveTextContent('Monthly on day 15');
        unmount();
      });
    });

    it('should handle frequency changes dynamically', () => {
      const { rerender } = render(
        <RecurrenceMonthlySection {...defaultProps} />,
      );

      expect(screen.getByText('monthlyOn')).toBeInTheDocument();

      rerender(
        <RecurrenceMonthlySection
          {...defaultProps}
          frequency={Frequency.DAILY}
        />,
      );

      expect(screen.queryByText('monthlyOn')).not.toBeInTheDocument();
    });
  });

  describe('State Changes', () => {
    it('should update display when recurrenceRuleState changes', () => {
      const { rerender } = render(
        <RecurrenceMonthlySection {...defaultProps} />,
      );

      let dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 15');

      const newRule: InterfaceRecurrenceRule = {
        ...defaultRecurrenceRule,
        byDay: [WeekDays.MO],
        byMonthDay: undefined,
      };

      rerender(
        <RecurrenceMonthlySection
          {...defaultProps}
          recurrenceRuleState={newRule}
        />,
      );

      dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on the third Monday');
    });

    it('should handle switching between byDate and byWeekday', () => {
      const { rerender } = render(
        <RecurrenceMonthlySection {...defaultProps} />,
      );

      // Initially showing byDate
      let dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on day 15');

      // Switch to byWeekday (July 15, 2024 is a Monday)
      const ruleWithByDay: InterfaceRecurrenceRule = {
        ...defaultRecurrenceRule,
        byDay: [WeekDays.MO],
        byMonthDay: undefined,
      };

      rerender(
        <RecurrenceMonthlySection
          {...defaultProps}
          recurrenceRuleState={ruleWithByDay}
        />,
      );

      dropdown = screen.getByTestId('monthlyRecurrenceDropdown');
      expect(dropdown).toHaveTextContent('Monthly on the third Monday');
    });
  });
});
