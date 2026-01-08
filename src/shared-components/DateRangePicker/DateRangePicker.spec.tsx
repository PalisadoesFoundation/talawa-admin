import React from 'react';
import dayjs from 'dayjs';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

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

  it('updates start date', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId(`${dataTestId}-start-input`), {
      target: { value: dayjs().add(5, 'days').format('YYYY-MM-DD') },
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('updates end date', () => {
    renderComponent({
      value: { startDate: dayjs().toDate(), endDate: null },
    });

    fireEvent.change(screen.getByTestId(`${dataTestId}-end-input`), {
      target: { value: dayjs().add(10, 'days').format('YYYY-MM-DD') },
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('auto-adjusts end date when start > end', () => {
    renderComponent({
      value: {
        startDate: dayjs().toDate(),
        endDate: dayjs().add(5, 'days').toDate(),
      },
    });

    fireEvent.change(screen.getByTestId(`${dataTestId}-start-input`), {
      target: { value: dayjs().add(10, 'days').format('YYYY-MM-DD') },
    });

    const emitted = onChangeMock.mock.calls[0][0] as IDateRangeValue;

    expect(emitted.startDate?.toDateString()).toBe(
      emitted.endDate?.toDateString(),
    );
  });

  it('respects disabled state', () => {
    renderComponent({ disabled: true });

    fireEvent.change(screen.getByTestId(`${dataTestId}-start-input`), {
      target: { value: dayjs().format('YYYY-MM-DD') },
    });

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

  it('does not call onChange when start date normalizes to null', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId(`${dataTestId}-start-input`), {
      target: { value: '' },
    });

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('does not call onChange when end date normalizes to null', () => {
    renderComponent({
      value: { startDate: new Date(), endDate: null },
    });

    fireEvent.change(screen.getByTestId(`${dataTestId}-end-input`), {
      target: { value: '' },
    });

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

  it('calls onChange when preset button is clicked', () => {
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
    fireEvent.click(presetButton);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    const emitted = onChangeMock.mock.calls[0][0];
    expect(emitted.startDate?.toDateString()).toBe(
      baseDate.toDate().toDateString(),
    );
    expect(emitted.endDate?.toDateString()).toBe(
      baseDate.add(7, 'days').toDate().toDateString(),
    );
  });

  it('does not call onChange when preset clicked while disabled', () => {
    const testPreset = {
      key: 'test',
      label: 'Test',
      getRange: () => ({ startDate: new Date(), endDate: new Date() }),
    };

    renderComponent({ presets: [testPreset], disabled: true });

    fireEvent.click(screen.getByTestId(`${dataTestId}-preset-test`));

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
    expect(helperElement.className).toContain('text-danger'); // Add this assertion
  });
});
