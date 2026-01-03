import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecurrenceYearlySection } from './RecurrenceYearlySection';
import { Frequency } from '../../utils/recurrenceUtils';
import dayjs from 'dayjs';

const defaultProps = {
  frequency: Frequency.YEARLY,
  startDate: dayjs().year(2024).month(6).date(21).toDate(), // July 21, 2024
  t: (key: string) => key,
};

describe('RecurrenceYearlySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render when frequency is YEARLY', () => {
      render(<RecurrenceYearlySection {...defaultProps} />);

      expect(screen.getByText('yearlyOn')).toBeInTheDocument();
      expect(screen.getByText('yearlyRecurrenceDesc')).toBeInTheDocument();
    });

    it('should return null when frequency is not YEARLY', () => {
      const { container } = render(
        <RecurrenceYearlySection
          {...defaultProps}
          frequency={Frequency.DAILY}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should display the correct month and day from startDate', () => {
      render(<RecurrenceYearlySection {...defaultProps} />);

      // July 21
      expect(screen.getByText(/July/)).toBeInTheDocument();
      expect(screen.getByText(/21/)).toBeInTheDocument();
    });

    it('should display description text', () => {
      render(<RecurrenceYearlySection {...defaultProps} />);

      expect(screen.getByText('yearlyRecurrenceDesc')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should handle different start dates correctly', () => {
      const { rerender } = render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(1).toDate()}
        />,
      );

      // January 1
      expect(screen.getByText(/January/)).toBeInTheDocument();
      expect(screen.getByText(/1/)).toBeInTheDocument();

      rerender(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(11).date(31).toDate()}
        />,
      );

      // December 31
      expect(screen.getByText(/December/)).toBeInTheDocument();
      expect(screen.getByText(/31/)).toBeInTheDocument();
    });

    it('should display all months correctly', () => {
      const months = [
        { month: 0, name: 'January', day: 15 },
        { month: 1, name: 'February', day: 14 },
        { month: 2, name: 'March', day: 15 },
        { month: 3, name: 'April', day: 15 },
        { month: 4, name: 'May', day: 15 },
        { month: 5, name: 'June', day: 15 },
        { month: 6, name: 'July', day: 15 },
        { month: 7, name: 'August', day: 15 },
        { month: 8, name: 'September', day: 15 },
        { month: 9, name: 'October', day: 15 },
        { month: 10, name: 'November', day: 15 },
        { month: 11, name: 'December', day: 15 },
      ];

      months.forEach(({ month, name, day }) => {
        const { unmount } = render(
          <RecurrenceYearlySection
            {...defaultProps}
            startDate={
              new Date(
                `2024-${String(month + 1).padStart(2, '0')}-${day}T10:00:00.000Z`,
              )
            }
          />,
        );

        expect(screen.getByText(new RegExp(name))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(String(day)))).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle different days of the month', () => {
      const days = [1, 15, 28, 31];

      days.forEach((day) => {
        const { unmount } = render(
          <RecurrenceYearlySection
            {...defaultProps}
            startDate={
              new Date(`2024-07-${String(day).padStart(2, '0')}T10:00:00.000Z`)
            }
          />,
        );

        expect(screen.getByText(new RegExp(String(day)))).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle different years', () => {
      const years = [2020, 2024, 2025, 2030];

      years.forEach((year) => {
        const { unmount } = render(
          <RecurrenceYearlySection
            {...defaultProps}
            startDate={dayjs().year(year).month(6).date(21).toDate()}
          />,
        );

        expect(screen.getByText(/July/)).toBeInTheDocument();
        expect(screen.getByText(/21/)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle February 29 in leap year', () => {
      render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(1).date(29).toDate()}
        />,
      );

      expect(screen.getByText(/February/)).toBeInTheDocument();
      expect(screen.getByText(/29/)).toBeInTheDocument();
    });

    it('should handle February 28 in non-leap year', () => {
      render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2023).month(1).date(28).toDate()}
        />,
      );

      expect(screen.getByText(/February/)).toBeInTheDocument();
      expect(screen.getByText(/28/)).toBeInTheDocument();
    });

    it('should handle first day of year', () => {
      render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(1).toDate()}
        />,
      );

      expect(screen.getByText(/January/)).toBeInTheDocument();
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('should handle last day of year', () => {
      render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(11).date(31).toDate()}
        />,
      );

      expect(screen.getByText(/December/)).toBeInTheDocument();
      expect(screen.getByText(/31/)).toBeInTheDocument();
    });

    it('should handle months with 30 days', () => {
      render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(3).date(30).toDate()}
        />,
      );

      expect(screen.getByText(/April/)).toBeInTheDocument();
      expect(screen.getByText(/30/)).toBeInTheDocument();
    });

    it('should handle months with 31 days', () => {
      render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(31).toDate()}
        />,
      );

      expect(screen.getByText(/January/)).toBeInTheDocument();
      expect(screen.getByText(/31/)).toBeInTheDocument();
    });
  });

  describe('State Changes', () => {
    it('should update display when startDate changes', () => {
      const { rerender } = render(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(0).date(15).toDate()}
        />,
      );

      expect(screen.getByText(/January/)).toBeInTheDocument();
      expect(screen.getByText(/15/)).toBeInTheDocument();

      rerender(
        <RecurrenceYearlySection
          {...defaultProps}
          startDate={dayjs().year(2024).month(5).date(20).toDate()}
        />,
      );

      expect(screen.getByText(/June/)).toBeInTheDocument();
      expect(screen.getByText(/20/)).toBeInTheDocument();
    });

    it('should handle frequency changes dynamically', () => {
      const { rerender } = render(
        <RecurrenceYearlySection {...defaultProps} />,
      );

      expect(screen.getByText('yearlyOn')).toBeInTheDocument();

      rerender(
        <RecurrenceYearlySection
          {...defaultProps}
          frequency={Frequency.DAILY}
        />,
      );

      expect(screen.queryByText('yearlyOn')).not.toBeInTheDocument();
    });
  });

  describe('Translation Function', () => {
    it('should use translation function for labels', () => {
      const t = vi.fn((key: string) => key);

      render(<RecurrenceYearlySection {...defaultProps} t={t} />);

      expect(t).toHaveBeenCalledWith('yearlyOn');
      expect(t).toHaveBeenCalledWith('yearlyRecurrenceDesc');
    });

    it('should display translated text', () => {
      const t = (key: string) => `translated_${key}`;

      render(<RecurrenceYearlySection {...defaultProps} t={t} />);

      expect(screen.getByText('translated_yearlyOn')).toBeInTheDocument();
      expect(
        screen.getByText('translated_yearlyRecurrenceDesc'),
      ).toBeInTheDocument();
    });
  });
});
