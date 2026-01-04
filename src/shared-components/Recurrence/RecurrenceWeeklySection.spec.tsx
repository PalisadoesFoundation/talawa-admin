import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecurrenceWeeklySection } from './RecurrenceWeeklySection';
import { Frequency, WeekDays, Days } from '../../utils/recurrenceUtils';

const defaultProps = {
  frequency: Frequency.WEEKLY,
  byDay: [WeekDays.MO, WeekDays.WE],
  onDayClick: vi.fn(),
  onWeekdayKeyDown: vi.fn(),
  t: (key: string) => key,
};

describe('RecurrenceWeeklySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render when frequency is WEEKLY', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      expect(screen.getByText('repeatsOn')).toBeInTheDocument();
      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons).toHaveLength(7);
    });

    it('should return null when frequency is not WEEKLY', () => {
      const { container } = render(
        <RecurrenceWeeklySection
          {...defaultProps}
          frequency={Frequency.DAILY}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render all 7 day buttons', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons).toHaveLength(7);
    });

    it('should highlight selected days', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      // Monday (index 1) and Wednesday (index 3) should be selected
      expect(dayButtons[1]).toHaveAttribute('aria-pressed', 'true');
      expect(dayButtons[3]).toHaveAttribute('aria-pressed', 'true');
    });

    it('should not highlight unselected days', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      // Sunday (index 0) should not be selected
      expect(dayButtons[0]).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have correct aria-label for the day group', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'repeatsOn');
    });
  });

  describe('Props Handling', () => {
    it('should handle undefined byDay prop', () => {
      render(<RecurrenceWeeklySection {...defaultProps} byDay={undefined} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      // All days should be unselected (aria-pressed will be undefined/null when byDay is undefined)
      dayButtons.forEach((button) => {
        const ariaPressed = button.getAttribute('aria-pressed');
        // When byDay is undefined, aria-pressed will be undefined (null in DOM)
        expect(ariaPressed === null || ariaPressed === undefined).toBe(true);
      });
    });

    it('should handle empty byDay array', () => {
      render(<RecurrenceWeeklySection {...defaultProps} byDay={[]} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      // All days should be unselected
      dayButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('should handle all days selected', () => {
      render(
        <RecurrenceWeeklySection
          {...defaultProps}
          byDay={[
            WeekDays.SU,
            WeekDays.MO,
            WeekDays.TU,
            WeekDays.WE,
            WeekDays.TH,
            WeekDays.FR,
            WeekDays.SA,
          ]}
        />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      dayButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onDayClick when a day button is clicked', async () => {
      const user = userEvent.setup();
      const onDayClick = vi.fn();

      render(
        <RecurrenceWeeklySection {...defaultProps} onDayClick={onDayClick} />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      await user.click(dayButtons[0]); // Click Sunday

      expect(onDayClick).toHaveBeenCalledWith(Days[0]);
    });

    it('should call onDayClick for each day when clicked', async () => {
      const user = userEvent.setup();
      const onDayClick = vi.fn();

      render(
        <RecurrenceWeeklySection {...defaultProps} onDayClick={onDayClick} />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');

      // Click each day
      for (let i = 0; i < dayButtons.length; i++) {
        await user.click(dayButtons[i]);
        expect(onDayClick).toHaveBeenCalledWith(Days[i]);
      }

      expect(onDayClick).toHaveBeenCalledTimes(7);
    });

    it('should call onDayClick when Enter key is pressed', () => {
      const onDayClick = vi.fn();

      render(
        <RecurrenceWeeklySection {...defaultProps} onDayClick={onDayClick} />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      const button = dayButtons[0] as HTMLButtonElement;

      // Create a real keyboard event
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      button.dispatchEvent(event);

      // Verify preventDefault was called and onDayClick was called
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(onDayClick).toHaveBeenCalledWith(Days[0]);

      preventDefaultSpy.mockRestore();
    });

    it('should call onDayClick when Space key is pressed', () => {
      const onDayClick = vi.fn();

      render(
        <RecurrenceWeeklySection {...defaultProps} onDayClick={onDayClick} />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      const button = dayButtons[1] as HTMLButtonElement;

      // Create a real keyboard event
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      button.dispatchEvent(event);

      // Verify preventDefault was called and onDayClick was called
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(onDayClick).toHaveBeenCalledWith(Days[1]);

      preventDefaultSpy.mockRestore();
    });

    it('should call onWeekdayKeyDown for other keys', () => {
      const onWeekdayKeyDown = vi.fn();

      render(
        <RecurrenceWeeklySection
          {...defaultProps}
          onWeekdayKeyDown={onWeekdayKeyDown}
        />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      const arrowKeyEvent = {
        key: 'ArrowRight',
      } as unknown as React.KeyboardEvent<HTMLButtonElement>;

      fireEvent.keyDown(dayButtons[0], arrowKeyEvent);

      expect(onWeekdayKeyDown).toHaveBeenCalled();
      const callArgs = onWeekdayKeyDown.mock.calls[0];
      expect(callArgs[0].key).toBe('ArrowRight');
      expect(callArgs[1]).toBe(0);
    });

    it('should have correct aria-label for each day button', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      dayButtons.forEach((button) => {
        expect(button).toHaveAttribute(
          'aria-label',
          expect.stringContaining('select'),
        );
      });
    });

    it('should have tabIndex 0 for keyboard navigation', () => {
      render(<RecurrenceWeeklySection {...defaultProps} />);

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      dayButtons.forEach((button) => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single day selection', () => {
      render(
        <RecurrenceWeeklySection {...defaultProps} byDay={[WeekDays.MO]} />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons[1]).toHaveAttribute('aria-pressed', 'true');
      expect(dayButtons[0]).toHaveAttribute('aria-pressed', 'false');
    });

    it('should handle multiple consecutive days', () => {
      render(
        <RecurrenceWeeklySection
          {...defaultProps}
          byDay={[WeekDays.MO, WeekDays.TU, WeekDays.WE]}
        />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons[1]).toHaveAttribute('aria-pressed', 'true');
      expect(dayButtons[2]).toHaveAttribute('aria-pressed', 'true');
      expect(dayButtons[3]).toHaveAttribute('aria-pressed', 'true');
    });

    it('should handle non-consecutive days', () => {
      render(
        <RecurrenceWeeklySection
          {...defaultProps}
          byDay={[WeekDays.SU, WeekDays.WE, WeekDays.FR]}
        />,
      );

      const dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(dayButtons[3]).toHaveAttribute('aria-pressed', 'true');
      expect(dayButtons[5]).toHaveAttribute('aria-pressed', 'true');
    });

    it('should handle frequency changes dynamically', () => {
      const { rerender } = render(
        <RecurrenceWeeklySection {...defaultProps} />,
      );

      expect(screen.getByText('repeatsOn')).toBeInTheDocument();

      rerender(
        <RecurrenceWeeklySection
          {...defaultProps}
          frequency={Frequency.DAILY}
        />,
      );

      expect(screen.queryByText('repeatsOn')).not.toBeInTheDocument();
    });
  });

  describe('State Changes', () => {
    it('should update selected state when byDay prop changes', () => {
      const { rerender } = render(
        <RecurrenceWeeklySection {...defaultProps} byDay={[WeekDays.MO]} />,
      );

      let dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons[1]).toHaveAttribute('aria-pressed', 'true');

      rerender(
        <RecurrenceWeeklySection {...defaultProps} byDay={[WeekDays.FR]} />,
      );

      dayButtons = screen.getAllByTestId('recurrenceWeekDay');
      expect(dayButtons[1]).toHaveAttribute('aria-pressed', 'false');
      expect(dayButtons[5]).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
