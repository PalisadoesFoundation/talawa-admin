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

type TestableInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  'data-testid'?: string;
};

type MockTextFieldParams = {
  inputProps: TestableInputProps;
  ref?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  required?: boolean;
};

type MockDatePickerProps = {
  value: unknown;
  onChange: (value: unknown) => void;
  minDate?: unknown;
  slots?: {
    textField?: (params: MockTextFieldParams) => JSX.Element;
  };
  'data-testid'?: string;
};

const datePickerSpy = vi.fn();

vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: ({
    value,
    onChange,
    minDate,
    slots,
    'data-testid': dataTestId,
  }: MockDatePickerProps) => {
    datePickerSpy({ minDate });

    const renderTextField = slots?.textField;
    if (!renderTextField) return null;

    const formattedValue =
      value instanceof Date && !Number.isNaN(value.getTime())
        ? value.toISOString().split('T')[0]
        : '';

    return renderTextField({
      inputProps: {
        value: formattedValue,
        'data-testid': dataTestId,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          if (!inputValue) {
            onChange(undefined);
            return;
          }
          onChange(new Date(`${inputValue}T00:00:00`));
        },
      },
    });
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
    vi.restoreAllMocks();
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
      target: { value: '2025-01-05' },
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('updates end date', () => {
    renderComponent({
      value: { startDate: new Date('2025-01-01'), endDate: null },
    });

    fireEvent.change(screen.getByTestId(`${dataTestId}-end-input`), {
      target: { value: '2025-01-10' },
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('auto-adjusts end date when start > end', () => {
    renderComponent({
      value: {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-05'),
      },
    });

    fireEvent.change(screen.getByTestId(`${dataTestId}-start-input`), {
      target: { value: '2025-01-10' },
    });

    const emitted = onChangeMock.mock.calls[0][0] as IDateRangeValue;

    expect(emitted.startDate?.toDateString()).toBe(
      emitted.endDate?.toDateString(),
    );
  });

  it('respects disabled state', () => {
    renderComponent({ disabled: true });

    fireEvent.change(screen.getByTestId(`${dataTestId}-start-input`), {
      target: { value: '2025-01-01' },
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
    const start = new Date('2025-01-05');

    renderComponent({
      value: { startDate: start, endDate: null },
    });

    const endPickerCall = datePickerSpy.mock.calls.find(
      (call) => call[0]?.minDate !== undefined,
    );

    expect(dayjs(endPickerCall?.[0].minDate).toDate()).toEqual(start);
  });

  it('calls onChange when preset button is clicked', () => {
    const testPreset = {
      key: 'last7days',
      label: 'Last 7 Days',
      getRange: () => ({
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-07'),
      }),
    };

    renderComponent({ presets: [testPreset] });

    const presetButton = screen.getByTestId(`${dataTestId}-preset-last7days`);
    fireEvent.click(presetButton);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    const emitted = onChangeMock.mock.calls[0][0];
    expect(emitted.startDate?.toDateString()).toBe('Wed Jan 01 2025');
    expect(emitted.endDate?.toDateString()).toBe('Tue Jan 07 2025');
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
