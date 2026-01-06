import { render, screen, fireEvent } from '@testing-library/react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DatePicker from './DatePicker';
import { vi } from 'vitest';

describe('DatePicker', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOnChange = vi.fn();

  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {component}
      </LocalizationProvider>,
    );
  };

  it('renders correctly with label', () => {
    renderWithProvider(
      <DatePicker label="Select Date" value={null} onChange={mockOnChange} />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    const today = dayjs();
    renderWithProvider(
      <DatePicker label="Select Date" value={today} onChange={mockOnChange} />,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe(today.format('MM/DD/YYYY'));
  });

  it('calls onChange when date is selected', () => {
    renderWithProvider(
      <DatePicker label="Select Date" value={null} onChange={mockOnChange} />,
    );

    // Simulate user typing a date
    const input = screen.getByRole('textbox');
    // Using fireEvent to bypass JSDOM selectionStart issues with MUI + custom slots
    fireEvent.change(input, { target: { value: '01/01/2023' } });

    expect(mockOnChange).toHaveBeenCalled();
    // Verify a Dayjs-like object is passed
    const call = mockOnChange.mock.calls[0][0];
    expect(call).toBeTruthy();
    expect(typeof call?.format).toBe('function');
  });

  it('passes data-testid to the input', () => {
    renderWithProvider(
      <DatePicker
        label="Select Date"
        value={null}
        onChange={mockOnChange}
        data-testid="custom-date-picker"
      />,
    );
    expect(screen.getByTestId('custom-date-picker')).toBeInTheDocument();
  });

  it('respects disabled prop', () => {
    renderWithProvider(
      <DatePicker
        label="Select Date"
        value={null}
        onChange={mockOnChange}
        disabled
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
  it('accepts minDate and maxDate props without errors', () => {
    const minDate = dayjs().add(10, 'day');
    const maxDate = dayjs().add(20, 'day');
    renderWithProvider(
      <DatePicker
        label="Select Date"
        value={null}
        onChange={mockOnChange}
        minDate={minDate}
        maxDate={maxDate}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithProvider(
      <DatePicker
        label="Select Date"
        value={null}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );
    // Verify className is applied to the component wrapper
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('passes slotProps to textField', () => {
    renderWithProvider(
      <DatePicker
        label="Select Date"
        value={null}
        onChange={mockOnChange}
        slotProps={{ textField: { placeholder: 'Custom placeholder' } }}
      />,
    );
    expect(
      screen.getByPlaceholderText('Custom placeholder'),
    ).toBeInTheDocument();
  });
});
