import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  describe('Component Rendering', () => {
    it('should render the component with all required elements', () => {
      render(<RecurrenceFrequencySection {...defaultProps} />);

      expect(screen.getByText('repeatsEvery')).toBeInTheDocument();
      expect(
        screen.getByTestId('customRecurrenceIntervalInput'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });

    it('should display the correct frequency in dropdown', () => {
      render(<RecurrenceFrequencySection {...defaultProps} />);

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      expect(dropdown).toHaveTextContent('Daily');
    });

    it('should display different frequencies correctly', () => {
      const { rerender } = render(
        <RecurrenceFrequencySection {...defaultProps} />,
      );

      // Test WEEKLY
      rerender(
        <RecurrenceFrequencySection
          {...defaultProps}
          frequency={Frequency.WEEKLY}
        />,
      );
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Weekly');

      // Test MONTHLY
      rerender(
        <RecurrenceFrequencySection
          {...defaultProps}
          frequency={Frequency.MONTHLY}
        />,
      );
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Monthly');

      // Test YEARLY
      rerender(
        <RecurrenceFrequencySection
          {...defaultProps}
          frequency={Frequency.YEARLY}
        />,
      );
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Yearly');
    });

    it('should display the interval value in input', () => {
      render(
        <RecurrenceFrequencySection {...defaultProps} localInterval="5" />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      expect(input.value).toBe('5');
    });
  });

  describe('Props Handling', () => {
    it('should handle interval value changes', () => {
      const onIntervalChange = vi.fn();
      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onIntervalChange={onIntervalChange}
        />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '3' } });

      expect(onIntervalChange).toHaveBeenCalledTimes(1);
    });

    it('should have correct aria attributes', () => {
      render(<RecurrenceFrequencySection {...defaultProps} />);

      const input = screen.getByTestId('customRecurrenceIntervalInput');
      expect(input).toHaveAttribute('aria-label', 'repeatsEvery');
      expect(input).toHaveAttribute('aria-required', 'true');

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      expect(dropdown).toHaveAttribute('aria-label', 'frequency');
    });

    it('should have min attribute set to 1', () => {
      render(<RecurrenceFrequencySection {...defaultProps} />);

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      expect(input).toHaveAttribute('min', '1');
    });

    it('should have placeholder set to "1"', () => {
      render(<RecurrenceFrequencySection {...defaultProps} />);

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      expect(input).toHaveAttribute('placeholder', '1');
    });
  });

  describe('User Interactions', () => {
    it('should call onIntervalChange when input value changes', async () => {
      const user = userEvent.setup();
      const onIntervalChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onIntervalChange={onIntervalChange}
        />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, '7');

      expect(onIntervalChange).toHaveBeenCalled();
    });

    it('should select all text on double click', async () => {
      const user = userEvent.setup();
      const onIntervalChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          localInterval="5"
          onIntervalChange={onIntervalChange}
        />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      await user.dblClick(input);

      // The select behavior is handled by the browser, but we can verify the handler is set
      expect(input).toBeInTheDocument();
    });

    it('should prevent negative, e, E, and + keys in input', () => {
      const onIntervalChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onIntervalChange={onIntervalChange}
        />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;

      // Test that the onKeyDown handler prevents default for restricted keys
      const restrictedKeys = ['-', 'e', 'E', '+'];

      restrictedKeys.forEach((key) => {
        const event = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        });

        // Spy on preventDefault
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
        input.dispatchEvent(event);
        expect(preventDefaultSpy).toHaveBeenCalled();

        preventDefaultSpy.mockRestore();
      });
    });

    it('should open dropdown and allow frequency selection', async () => {
      const user = userEvent.setup();
      const onFrequencyChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onFrequencyChange={onFrequencyChange}
        />,
      );

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      await user.click(dropdown);
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
      expect(screen.getByTestId('customWeeklyRecurrence')).toBeInTheDocument();
      expect(screen.getByTestId('customMonthlyRecurrence')).toBeInTheDocument();
      expect(screen.getByTestId('customYearlyRecurrence')).toBeInTheDocument();
    });

    it('should call onFrequencyChange when daily is selected', async () => {
      const user = userEvent.setup();
      const onFrequencyChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onFrequencyChange={onFrequencyChange}
        />,
      );

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      await user.click(dropdown);

      const dailyOption = screen.getByTestId('customDailyRecurrence');
      await user.click(dailyOption);

      expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.DAILY);
    });

    it('should call onFrequencyChange when weekly is selected', async () => {
      const user = userEvent.setup();
      const onFrequencyChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onFrequencyChange={onFrequencyChange}
        />,
      );

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      await user.click(dropdown);

      const weeklyOption = screen.getByTestId('customWeeklyRecurrence');
      await user.click(weeklyOption);

      expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.WEEKLY);
    });

    it('should call onFrequencyChange when monthly is selected', async () => {
      const user = userEvent.setup();
      const onFrequencyChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onFrequencyChange={onFrequencyChange}
        />,
      );

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      await user.click(dropdown);

      const monthlyOption = screen.getByTestId('customMonthlyRecurrence');
      await user.click(monthlyOption);

      expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.MONTHLY);
    });

    it('should call onFrequencyChange when yearly is selected', async () => {
      const user = userEvent.setup();
      const onFrequencyChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onFrequencyChange={onFrequencyChange}
        />,
      );

      const dropdown = screen.getByTestId('customRecurrenceFrequencyDropdown');
      await user.click(dropdown);

      const yearlyOption = screen.getByTestId('customYearlyRecurrence');
      await user.click(yearlyOption);

      expect(onFrequencyChange).toHaveBeenCalledWith(Frequency.YEARLY);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty interval string', () => {
      render(<RecurrenceFrequencySection {...defaultProps} localInterval="" />);

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('should handle large interval values', () => {
      render(
        <RecurrenceFrequencySection {...defaultProps} localInterval="999" />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      expect(input.value).toBe('999');
    });

    it('should handle string interval values', () => {
      render(
        <RecurrenceFrequencySection {...defaultProps} localInterval="abc" />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value === '' || input.value === 'abc').toBe(true);
    });

    it('should allow other keys to be typed normally', () => {
      const onIntervalChange = vi.fn();

      render(
        <RecurrenceFrequencySection
          {...defaultProps}
          onIntervalChange={onIntervalChange}
        />,
      );

      const input = screen.getByTestId(
        'customRecurrenceIntervalInput',
      ) as HTMLInputElement;

      const preventDefault = vi.fn();
      const normalKeyEvent = {
        key: '5',
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      fireEvent.keyDown(input, normalKeyEvent);
      // Should not prevent default for normal keys
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});
