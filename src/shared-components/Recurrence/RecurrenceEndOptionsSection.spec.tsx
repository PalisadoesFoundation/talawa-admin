import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecurrenceEndOptionsSection } from './RecurrenceEndOptionsSection';
import { Frequency } from '../../utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from '../../utils/recurrenceUtils';
import dayjs from 'dayjs';

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: (props: {
    label: string;
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    disabled?: boolean;
    slotProps?: { textField?: { 'aria-label'?: string } };
    'data-testid'?: string;
    'data-cy'?: string;
  }) => {
    const { label, value, onChange, disabled, slotProps } = props;
    const testId = props['data-testid'];
    const dataCy = props['data-cy'];

    return (
      <div>
        <label htmlFor="date-picker-input">{label}</label>
        <input
          id="date-picker-input"
          type="text"
          data-testid={testId}
          data-cy={dataCy}
          disabled={disabled}
          aria-label={slotProps?.textField?.['aria-label']}
          value={value ? value.format('YYYY-MM-DD') : ''}
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
      </div>
    );
  },
}));

const defaultRecurrenceRule: InterfaceRecurrenceRule = {
  frequency: Frequency.DAILY,
  interval: 1,
  never: true,
  endDate: undefined,
  count: undefined,
};

const defaultProps = {
  frequency: Frequency.DAILY,
  selectedRecurrenceEndOption: 'never' as const,
  recurrenceRuleState: defaultRecurrenceRule,
  localCount: '1',
  onRecurrenceEndOptionChange: vi.fn(),
  onCountChange: vi.fn(),
  setRecurrenceRuleState: vi.fn(),
  t: (key: string) => key,
};

describe('RecurrenceEndOptionsSection', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component with all required elements', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      expect(screen.getByText('ends')).toBeInTheDocument();
      expect(screen.getByTestId('never')).toBeInTheDocument();
      expect(screen.getByTestId('on')).toBeInTheDocument();
      expect(screen.getByTestId('after')).toBeInTheDocument();
    });

    it('should render all end option radio buttons', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      const neverOption = screen.getByTestId('never');
      const onOption = screen.getByTestId('on');
      const afterOption = screen.getByTestId('after');

      expect(neverOption).toBeInTheDocument();
      expect(onOption).toBeInTheDocument();
      expect(afterOption).toBeInTheDocument();
    });

    it('should render DatePicker when endsOn option is available', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      expect(
        screen.getByTestId('customRecurrenceEndDatePicker'),
      ).toBeInTheDocument();
    });

    it('should render count input when endsAfter option is available', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      expect(
        screen.getByTestId('customRecurrenceCountInput'),
      ).toBeInTheDocument();
    });

    it('should check the selected option', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      const neverOption = screen.getByTestId('never') as HTMLInputElement;
      expect(neverOption.checked).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should handle different selectedRecurrenceEndOption values', () => {
      const { rerender } = render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      let neverOption = screen.getByTestId('never') as HTMLInputElement;
      expect(neverOption.checked).toBe(true);

      rerender(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const onOption = screen.getByTestId('on') as HTMLInputElement;
      expect(onOption.checked).toBe(true);

      rerender(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="after"
          />
        </>,
      );

      const afterOption = screen.getByTestId('after') as HTMLInputElement;
      expect(afterOption.checked).toBe(true);
    });

    it('should display localCount value in input', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} localCount="5" />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;
      expect(countInput.value).toBe('5');
    });

    it('should display endDate in DatePicker when provided', () => {
      // Use dynamic future date to avoid test staleness
      const futureEndDate = dayjs().add(1, 'year').endOf('year');
      const endDate = futureEndDate.toDate();
      const ruleWithEndDate: InterfaceRecurrenceRule = {
        ...defaultRecurrenceRule,
        endDate,
        never: false,
      };

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            recurrenceRuleState={ruleWithEndDate}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;
      expect(datePicker.value).toBe(futureEndDate.format('YYYY-MM-DD'));
    });

    it('should use current date as default when endDate is undefined', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;
      expect(datePicker.value).toBeTruthy();
    });

    it('should filter out never option for YEARLY frequency', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            frequency={Frequency.YEARLY}
          />
        </>,
      );

      expect(screen.queryByTestId('never')).not.toBeInTheDocument();
      expect(screen.getByTestId('on')).toBeInTheDocument();
      expect(screen.getByTestId('after')).toBeInTheDocument();
    });

    it('should show never option for non-YEARLY frequencies', () => {
      const frequencies = [
        Frequency.DAILY,
        Frequency.WEEKLY,
        Frequency.MONTHLY,
      ];

      frequencies.forEach((frequency) => {
        const { unmount } = render(
          <>
            <RecurrenceEndOptionsSection
              {...defaultProps}
              frequency={frequency}
            />
          </>,
        );

        expect(screen.getByTestId('never')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onRecurrenceEndOptionChange when option is changed', async () => {
      const user = userEvent.setup();
      const onRecurrenceEndOptionChange = vi.fn();

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            onRecurrenceEndOptionChange={onRecurrenceEndOptionChange}
          />
        </>,
      );

      const onOption = screen.getByTestId('on') as HTMLInputElement;
      await user.click(onOption);

      expect(onRecurrenceEndOptionChange).toHaveBeenCalled();
    });

    it('should call onCountChange when count input changes', async () => {
      const user = userEvent.setup();
      const onCountChange = vi.fn();

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            onCountChange={onCountChange}
            selectedRecurrenceEndOption="after"
          />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;
      await user.clear(countInput);
      await user.type(countInput, '10');

      expect(onCountChange).toHaveBeenCalled();
    });

    it('should select all text on double click in count input', async () => {
      const user = userEvent.setup();
      const selectSpy = vi.fn();
      // Override HTMLInputElement.prototype.select to track calls
      const originalSelect = HTMLInputElement.prototype.select;
      HTMLInputElement.prototype.select = selectSpy;

      try {
        render(
          <>
            <RecurrenceEndOptionsSection
              {...defaultProps}
              localCount="5"
              selectedRecurrenceEndOption="after"
            />
          </>,
        );

        const countInput = screen.getByTestId(
          'customRecurrenceCountInput',
        ) as HTMLInputElement;

        // Fire double click event
        await user.dblClick(countInput);

        expect(selectSpy).toHaveBeenCalled();
      } finally {
        // Restore original
        HTMLInputElement.prototype.select = originalSelect;
      }
    });

    it('should prevent negative, e, E, and + keys in count input', () => {
      const onCountChange = vi.fn();

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            onCountChange={onCountChange}
          />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;

      const keysToPrevent = ['-', '+', 'e', 'E'];

      keysToPrevent.forEach((key) => {
        const event = new KeyboardEvent('keydown', {
          key: key,
          bubbles: true,
          cancelable: true,
        });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        countInput.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
        preventDefaultSpy.mockRestore();
      });
    });

    it('should call setRecurrenceRuleState when date is changed', async () => {
      const user = userEvent.setup();
      const setRecurrenceRuleState = vi.fn();

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            setRecurrenceRuleState={setRecurrenceRuleState}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;

      // Use dynamic date to avoid test staleness
      const futureDateStr = dayjs().add(30, 'days').format('MM/DD/YYYY');
      await user.clear(datePicker);
      await user.type(datePicker, futureDateStr);

      await waitFor(() => {
        expect(setRecurrenceRuleState).toHaveBeenCalled();
      });
    });

    it('should disable DatePicker when endsOn is not selected', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="never"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;
      expect(datePicker.disabled).toBe(true);
    });

    it('should enable DatePicker when endsOn is selected', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;
      expect(datePicker.disabled).toBe(false);
    });

    it('should disable count input when endsAfter is not selected', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="never"
          />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;
      expect(countInput.disabled).toBe(true);
    });

    it('should enable count input when endsAfter is selected', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="after"
          />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;
      expect(countInput.disabled).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty count string', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} localCount="" />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;
      expect(countInput.value).toBe('');
    });

    it('should handle large count values', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} localCount="999" />
        </>,
      );

      const countInput = screen.getByTestId(
        'customRecurrenceCountInput',
      ) as HTMLInputElement;
      expect(countInput.value).toBe('999');
    });

    it('should handle null date change gracefully', async () => {
      const user = userEvent.setup();
      const setRecurrenceRuleState = vi.fn();
      // Use dynamic future date to avoid test staleness
      const testRecurrenceRule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        endDate: dayjs().add(1, 'year').endOf('year').toDate(),
        never: false,
        count: 10,
      };

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            recurrenceRuleState={testRecurrenceRule}
            setRecurrenceRuleState={setRecurrenceRuleState}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;

      // Simulate clearing the date
      await user.clear(datePicker);

      // Verify setRecurrenceRuleState was called
      expect(setRecurrenceRuleState).toHaveBeenCalledTimes(1);

      // Extract the callback function and verify the resulting state
      const callArg = setRecurrenceRuleState.mock.calls[0][0];
      const newState = callArg(testRecurrenceRule);
      expect(newState.endDate).toBeUndefined();
      expect(newState.never).toBe(false);
      expect(newState.count).toBeUndefined();
    });

    it('should have correct aria attributes', () => {
      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="after"
          />
        </>,
      );

      const countInput = screen.getByTestId('customRecurrenceCountInput');
      expect(countInput).toHaveAttribute('aria-label', 'occurrences');
      expect(countInput).toHaveAttribute('aria-required', 'true');

      const datePicker = screen.getByTestId('customRecurrenceEndDatePicker');
      expect(datePicker).toHaveAttribute('aria-label', 'endDate');
    });

    it('should have correct data-cy attributes', () => {
      render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      expect(screen.getByTestId('never')).toHaveAttribute(
        'data-cy',
        'recurrenceEndOption-never',
      );
      expect(screen.getByTestId('on')).toHaveAttribute(
        'data-cy',
        'recurrenceEndOption-on',
      );
      expect(screen.getByTestId('after')).toHaveAttribute(
        'data-cy',
        'recurrenceEndOption-after',
      );
    });
  });

  describe('State Changes', () => {
    it('should update state correctly when date changes', async () => {
      const user = userEvent.setup();
      const setRecurrenceRuleState = vi.fn();

      render(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            setRecurrenceRuleState={setRecurrenceRuleState}
            selectedRecurrenceEndOption="on"
          />
        </>,
      );

      const datePicker = screen.getByTestId(
        'customRecurrenceEndDatePicker',
      ) as HTMLInputElement;

      // Use dynamic date to avoid test staleness
      const futureDateStr = dayjs().add(30, 'days').format('MM/DD/YYYY');
      await user.clear(datePicker);
      await user.type(datePicker, futureDateStr);

      await waitFor(() => {
        expect(setRecurrenceRuleState).toHaveBeenCalled();
      });

      // Verify the state update function - get the LAST call (after all typing)
      const lastCallIdx = setRecurrenceRuleState.mock.calls.length - 1;
      const callArg = setRecurrenceRuleState.mock.calls[lastCallIdx][0];
      if (typeof callArg === 'function') {
        const prevState = defaultRecurrenceRule;
        const newState = callArg(prevState);
        expect(newState.endDate).toBeDefined();
        expect(newState.never).toBe(false);
        expect(newState.count).toBeUndefined();
      }
    });

    it('should update when selectedRecurrenceEndOption changes', () => {
      const { rerender } = render(
        <>
          <RecurrenceEndOptionsSection {...defaultProps} />
        </>,
      );

      let neverOption = screen.getByTestId('never') as HTMLInputElement;
      expect(neverOption.checked).toBe(true);

      rerender(
        <>
          <RecurrenceEndOptionsSection
            {...defaultProps}
            selectedRecurrenceEndOption="after"
          />
        </>,
      );

      const afterOption = screen.getByTestId('after') as HTMLInputElement;
      expect(afterOption.checked).toBe(true);
    });
  });
});
