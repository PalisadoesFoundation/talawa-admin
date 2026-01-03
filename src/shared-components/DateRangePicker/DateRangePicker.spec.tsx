import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import DateRangePicker from './DateRangePicker';
import type {
  IDateRangeValue,
  IDateRangePreset,
} from 'types/shared-components/DateRangePicker/interface';

type TestableInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  'data-testid'?: string;
};

type MockTextFieldParams = {
  inputProps: TestableInputProps;
};

type MockDatePickerProps = {
  value: unknown;
  onChange: (value: unknown) => void;
  slots?: {
    textField?: (params: MockTextFieldParams) => JSX.Element;
  };
  'data-testid'?: string;
};

vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: ({
    value,
    onChange,
    slots,
    'data-testid': dataTestId,
  }: MockDatePickerProps) => {
    const renderTextField = slots?.textField;
    if (!renderTextField) return null;

    const formattedValue =
      value instanceof Date ? value.toISOString().split('T')[0] : '';

    return renderTextField({
      inputProps: {
        value: formattedValue,
        'data-testid': dataTestId,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          onChange(new Date(`${inputValue}T00:00:00`));
        },
      },
    });
  },
}));

describe('DateRangePicker', () => {
  const dataTestId = 'date-range-picker-test';
  let onChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChangeMock = vi.fn();
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
        dataTestId={dataTestId}
      />,
    );
  }

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
  it('calls onChange when a preset is clicked', () => {
    const presets = [
      {
        key: 'today',
        label: 'Today',
        getRange: () => ({
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-01'),
        }),
      },
    ];

    renderComponent({ presets });

    fireEvent.click(screen.getByTestId(`${dataTestId}-preset-today`));

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('renders helperText when provided', () => {
    renderComponent({ helperText: 'Help text' });

    expect(screen.getByTestId(`${dataTestId}-helper`)).toHaveTextContent(
      'Help text',
    );
  });

  it('applies error state when error is true', () => {
    renderComponent({ error: true, helperText: 'Error text' });

    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('hides presets when showPresets is false', () => {
    renderComponent({
      presets: [
        {
          key: 'x',
          label: 'X',
          getRange: () => ({
            startDate: new Date(),
            endDate: new Date(),
          }),
        },
      ],
      showPresets: false,
    });

    expect(
      screen.queryByTestId(`${dataTestId}-preset-x`),
    ).not.toBeInTheDocument();
  });

  it('handles null startDate and endDate safely', () => {
    renderComponent({
      value: { startDate: null, endDate: null },
    });

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('normalizes partial range safely', () => {
    renderComponent({
      value: { startDate: new Date(), endDate: null },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('handles dayjs-like values safely', () => {
    const fakeDayjs = {
      toDate: () => new Date('2025-01-01'),
    };

    renderComponent({
      value: {
        startDate: fakeDayjs as unknown as Date,
        endDate: null,
      },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });

  it('handles invalid dates gracefully', () => {
    renderComponent({
      value: {
        startDate: new Date('invalid'),
        endDate: null,
      },
    });

    expect(screen.getByTestId(`${dataTestId}-start-input`)).toBeInTheDocument();
  });
  it('marks preset as active when range matches', () => {
    const d = new Date('2025-01-01');

    const presets = [
      {
        key: 'today',
        label: 'Today',
        getRange: () => ({ startDate: d, endDate: d }),
      },
    ];

    renderComponent({
      presets,
      value: { startDate: d, endDate: d },
    });

    expect(screen.getByTestId(`${dataTestId}-preset-today`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('does not mark preset active when range differs', () => {
    const presets = [
      {
        key: 'x',
        label: 'X',
        getRange: () => ({
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-01'),
        }),
      },
    ];

    renderComponent({
      presets,
      value: {
        startDate: new Date('2025-01-02'),
        endDate: new Date('2025-01-02'),
      },
    });

    expect(screen.getByTestId(`${dataTestId}-preset-x`)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
