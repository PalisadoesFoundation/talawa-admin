import React from 'react';
import dayjs from 'dayjs';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateRangePicker from './DateRangePicker';
import type {
  IDateRangeValue,
  IDateRangePreset,
} from 'types/shared-components/DateRangePicker/interface';

/* -------------------------------------------------------------------------- */
/*                                MUI MOCK                                     */
/* -------------------------------------------------------------------------- */

const datePickerSpy = vi.fn();

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    minDate,
    slotProps,
    'data-testid': dataTestId,
  }: {
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    minDate?: dayjs.Dayjs;
    slotProps?: {
      textField: {
        'aria-label'?: string;
        inputProps?: { 'aria-label': string };
      };
    };
    'data-testid': string;
  }) => {
    datePickerSpy({ minDate });

    const formattedValue =
      value && value.isValid() ? value.format('MM/DD/YYYY') : '';

    return (
      <input
        type="text"
        value={formattedValue}
        data-testid={dataTestId}
        aria-label={
          slotProps?.textField?.['aria-label'] ||
          slotProps?.textField?.inputProps?.['aria-label']
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          if (!inputValue) {
            onChange?.(null);
            return;
          }
          onChange?.(dayjs(inputValue, ['MM/DD/YYYY', 'YYYY-MM-DD']));
        }}
      />
    );
  },
}));

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                     */
/* -------------------------------------------------------------------------- */

describe('DateRangePicker', () => {
  const dataTestId = 'date-range-picker-test';
  let onChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChangeMock = vi.fn();
    datePickerSpy.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent(
    props?: Partial<{
      value: IDateRangeValue;
      presets: IDateRangePreset[];
      disabled: boolean;
      error: boolean;
      helperText: string;
      showPresets: boolean;
      className: string;
    }>,
  ) {
    render(
      <DateRangePicker
        value={props?.value ?? { startDate: null, endDate: null }}
        onChange={onChangeMock}
        presets={props?.presets}
        disabled={props?.disabled}
        error={props?.error}
        helperText={props?.helperText}
        showPresets={props?.showPresets}
        className={props?.className}
        dataTestId={dataTestId}
      />,
    );
  }

  /* ----------------------- Existing core behaviour ------------------------ */

  it('renders start and end inputs', () => {
    renderComponent();

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-end-input`)).toBeInTheDocument();
  });

  it('updates start date', async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByTestId(`${dataTestId}-start-input`);
    await user.clear(input);
    await user.paste(dayjs().add(5, 'days').format('YYYY-MM-DD'));

    expect(onChangeMock).toHaveBeenCalled();
    const lastCall =
      onChangeMock.mock.calls[onChangeMock.mock.calls.length - 1][0];
    const expectedDate = dayjs().add(5, 'days');
    expect(lastCall.startDate.toDateString()).toBe(
      expectedDate.toDate().toDateString(),
    );
  });

  it('updates end date', async () => {
    const user = userEvent.setup();
    renderComponent({
      value: { startDate: dayjs().toDate(), endDate: null },
    });

    const input = screen.getByTestId(`${dataTestId}-end-input`);
    await user.clear(input);
    await user.paste(dayjs().add(10, 'days').format('YYYY-MM-DD'));

    expect(onChangeMock).toHaveBeenCalled();
    const lastCall =
      onChangeMock.mock.calls[onChangeMock.mock.calls.length - 1][0];
    const expectedDate = dayjs().add(10, 'days');
    expect(lastCall.endDate.toDateString()).toBe(
      expectedDate.toDate().toDateString(),
    );
  });

  it('auto-adjusts end date when start > end', async () => {
    const user = userEvent.setup();
    renderComponent({
      value: {
        startDate: dayjs().toDate(),
        endDate: dayjs().add(5, 'days').toDate(),
      },
    });

    const input = screen.getByTestId(`${dataTestId}-start-input`);
    await user.clear(input);
    await user.type(input, dayjs().add(10, 'days').format('YYYY-MM-DD'));

    const emitted = onChangeMock.mock.calls[0][0] as IDateRangeValue;

    expect(emitted.startDate?.toDateString()).toBe(
      emitted.endDate?.toDateString(),
    );
  });

  it('respects disabled state', async () => {
    const user = userEvent.setup();
    renderComponent({ disabled: true });

    const input = screen.getByTestId(`${dataTestId}-start-input`);
    // userEvent might throw if interacting with disabled element, or just no-op.
    // Usually type() throws on disabled. Let's try typing.
    try {
      await user.type(input, dayjs().format('YYYY-MM-DD'));
    } catch {
      // Expected
    }

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('renders helperText when provided', () => {
    renderComponent({ helperText: 'Help text' });

    expect(screen.getByTestId(`${dataTestId}-helper`)).toHaveTextContent(
      'Help text',
    );
  });

  it('applies error state', () => {
    renderComponent({ error: true, helperText: 'Error text' });

    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('applies custom className to root container', () => {
    renderComponent({ className: 'custom-class' });

    const root = screen.getByTestId(dataTestId);
    expect(root.className).toContain('custom-class');
  });

  it('does not call onChange when start date normalizes to null', async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByTestId(`${dataTestId}-start-input`);
    await user.clear(input);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('does not call onChange when end date normalizes to null', async () => {
    const user = userEvent.setup();
    renderComponent({
      value: { startDate: new Date(), endDate: null },
    });

    const input = screen.getByTestId(`${dataTestId}-end-input`);
    await user.clear(input);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('handles non-Date, non-Dayjs object safely', () => {
    renderComponent({
      value: { startDate: { foo: 'bar' } as unknown as Date, endDate: null },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('handles dayjs-like object with invalid date', () => {
    const invalidDayjs = {
      toDate: () => new Date('invalid'),
    };

    renderComponent({
      value: { startDate: invalidDayjs as unknown as Date, endDate: null },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('renders presets by default when showPresets is undefined', () => {
    renderComponent({
      presets: [
        {
          key: 'default',
          label: 'Default',
          getRange: () => ({
            startDate: new Date(),
            endDate: new Date(),
          }),
        },
      ],
    });

    expect(
      screen.getByTestId(`${dataTestId}-preset-default`),
    ).toBeInTheDocument();
  });

  it('handles active preset when preset returns null dates', () => {
    renderComponent({
      presets: [
        {
          key: 'null',
          label: 'Null',
          getRange: () => ({ startDate: null, endDate: null }),
        },
      ],
      value: { startDate: null, endDate: null },
    });

    expect(screen.getByTestId(`${dataTestId}-preset-null`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
  it('passes startDate as minDate to end DatePicker', () => {
    const start = dayjs().add(5, 'days').toDate();

    renderComponent({
      value: { startDate: start, endDate: null },
    });

    const endPickerCall = datePickerSpy.mock.calls.find(
      (call) => call[0]?.minDate !== undefined,
    );

    expect(dayjs(endPickerCall?.[0].minDate).toDate()).toEqual(start);
  });

  it('calls onChange when preset button is clicked', async () => {
    const user = userEvent.setup();
    const baseDate = dayjs();
    const testPreset = {
      key: 'last7days',
      label: 'Last 7 Days',
      getRange: () => ({
        startDate: baseDate.toDate(),
        endDate: baseDate.add(7, 'days').toDate(),
      }),
    };

    renderComponent({ presets: [testPreset] });

    const presetButton = screen.getByTestId(`${dataTestId}-preset-last7days`);
    await user.click(presetButton);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    const emitted = onChangeMock.mock.calls[0][0];
    expect(emitted.startDate?.toDateString()).toBe(
      baseDate.toDate().toDateString(),
    );
    expect(emitted.endDate?.toDateString()).toBe(
      baseDate.add(7, 'days').toDate().toDateString(),
    );
  });

  it('does not call onChange when preset clicked while disabled', async () => {
    const user = userEvent.setup();
    const testPreset = {
      key: 'test',
      label: 'Test',
      getRange: () => ({ startDate: new Date(), endDate: new Date() }),
    };

    renderComponent({ presets: [testPreset], disabled: true });

    // button is likely disabled, so user.click might throw or no-op
    const btn = screen.getByTestId(`${dataTestId}-preset-test`);
    // Ensure button is disabled
    expect(btn).toBeDisabled();

    // Attempt click if possible, or verify disabled state prevents interaction
    // Replacing fireEvent.click with user.click on disabled element usually throws or does nothing.
    // We can just assert it is disabled which implies it won't fire.
    // But to match previous test intent:
    try {
      await user.click(btn);
    } catch {
      // Expected
    }

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('hides presets when showPresets is false', () => {
    renderComponent({
      presets: [
        {
          key: 'test',
          label: 'Test',
          getRange: () => ({ startDate: new Date(), endDate: new Date() }),
        },
      ],
      showPresets: false,
    });

    expect(
      screen.queryByTestId(`${dataTestId}-preset-test`),
    ).not.toBeInTheDocument();
  });

  it('handles empty value object safely', () => {
    renderComponent({
      value: {} as IDateRangeValue,
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('handles invalid native Date object', () => {
    renderComponent({
      value: {
        startDate: new Date('invalid'),
        endDate: null,
      },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('handles primitive value safely in normalizeToDate', () => {
    renderComponent({
      value: {
        startDate: 123 as unknown as Date,
        endDate: null,
      },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('handles undefined presets safely', () => {
    renderComponent({ presets: undefined });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('renders presets when showPresets is explicitly true', () => {
    renderComponent({
      presets: [
        {
          key: 'explicit',
          label: 'Explicit',
          getRange: () => ({
            startDate: new Date(),
            endDate: new Date(),
          }),
        },
      ],
      showPresets: true,
    });

    expect(
      screen.getByTestId(`${dataTestId}-preset-explicit`),
    ).toBeInTheDocument();
  });

  it('does not render presets when presets array is empty', () => {
    renderComponent({ presets: [] });

    expect(
      screen.queryByTestId(`${dataTestId}-preset-`),
    ).not.toBeInTheDocument();
  });

  it('applies text-danger class when error is true', () => {
    renderComponent({ error: true, helperText: 'Error text' });

    const helperElement = screen.getByTestId(`${dataTestId}-helper`);
    expect(helperElement).toHaveTextContent('Error text');
    expect(helperElement.className).toContain('text-danger');
  });

  it('covers normalizeToDate early return for undefined', () => {
    renderComponent({
      value: {
        startDate: undefined as unknown as Date,
        endDate: undefined as unknown as Date,
      },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('covers isDayjsLike false branch with plain object', () => {
    renderComponent({
      value: {
        startDate: { random: true } as unknown as Date,
        endDate: null,
      },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('covers activePresetKey when presets exist but none match', () => {
    renderComponent({
      presets: [
        {
          key: 'no-match',
          label: 'No Match',
          getRange: () => ({
            startDate: new Date(2000, 1, 1),
            endDate: new Date(2000, 1, 2),
          }),
        },
      ],
      value: {
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    expect(
      screen.getByTestId(`${dataTestId}-preset-no-match`),
    ).toBeInTheDocument();
  });

  it('covers handleStartChange early return when disabled', async () => {
    const user = userEvent.setup();
    renderComponent({ disabled: true });

    const input = screen.getByTestId(`${dataTestId}-start-input`);
    try {
      await user.type(input, dayjs().format('YYYY-MM-DD'));
    } catch {
      // Expected
    }

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('covers handleStartChange early return when normalized start is null', async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByTestId(`${dataTestId}-start-input`);
    await user.clear(input);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('covers handleEndChange early return when disabled', async () => {
    const user = userEvent.setup();
    renderComponent({
      disabled: true,
      value: { startDate: new Date(), endDate: null },
    });

    const input = screen.getByTestId(`${dataTestId}-end-input`);
    try {
      await user.type(input, dayjs().add(3, 'days').format('YYYY-MM-DD'));
    } catch {
      // Expected
    }

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('covers handleEndChange early return when normalized endDate is null', async () => {
    const user = userEvent.setup();
    renderComponent({
      value: { startDate: new Date(), endDate: null },
    });

    const input = screen.getByTestId(`${dataTestId}-end-input`);
    await user.clear(input);

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
