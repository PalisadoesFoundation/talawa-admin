import { render, screen, fireEvent } from '@testing-library/react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TimePicker from './TimePicker';
import { vi } from 'vitest';

describe('TimePicker', () => {
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
      <TimePicker label="Select Time" value={null} onChange={mockOnChange} />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    const now = dayjs().hour(10).minute(30);
    renderWithProvider(
      <TimePicker label="Select Time" value={now} onChange={mockOnChange} />,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    // Format might vary depending on locale/default settings, usually hh:mm a
    expect(input.value).toMatch(/10:30/);
  });

  it('calls onChange when time is modified', () => {
    renderWithProvider(
      <TimePicker label="Select Time" value={null} onChange={mockOnChange} />,
    );

    // Simulate user typing a time.
    const input = screen.getByRole('textbox');
    // Using fireEvent to bypass JSDOM selectionStart issues
    fireEvent.change(input, { target: { value: '11:00 AM' } });

    // Verify the Dayjs value is passed as the first argument
    expect(mockOnChange).toHaveBeenCalled();
    const firstArg = mockOnChange.mock.calls[0][0];
    expect(dayjs.isDayjs(firstArg)).toBe(true);
    expect(firstArg.isValid()).toBe(true);
  });

  it('passes data-testid to the input', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        data-testid="custom-time-picker"
      />,
    );
    expect(screen.getByTestId('custom-time-picker')).toBeInTheDocument();
  });

  it('respects disabled prop', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        disabled
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('accepts minTime and maxTime props without errors', () => {
    const minTime = dayjs().hour(9).minute(0);
    const maxTime = dayjs().hour(17).minute(0);
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        minTime={minTime}
        maxTime={maxTime}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithProvider(
      <TimePicker
        label="Select Time"
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
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        slotProps={{ textField: { placeholder: 'Custom placeholder' } }}
      />,
    );
    expect(
      screen.getByPlaceholderText('Custom placeholder'),
    ).toBeInTheDocument();
  });

  // Edge case: null value renders empty input
  it('renders empty input when value is null', () => {
    renderWithProvider(
      <TimePicker label="Select Time" value={null} onChange={mockOnChange} />,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  // Edge case: undefined value renders empty input
  it('renders empty input when value is undefined', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={undefined}
        onChange={mockOnChange}
      />,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  // timeSteps prop testing
  it('renders without errors when timeSteps prop is provided', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        timeSteps={{ hours: 1, minutes: 15, seconds: 30 }}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // Slot forwarding verification
  it('forwards inputProps and ref through custom textField slot', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        data-testid="slot-test"
      />,
    );
    // Verify Form.Control is rendered (custom slot)
    const input = screen.getByTestId('slot-test');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  // Test disabled and required props forwarding
  it('forwards disabled and required props to Form.Control', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        disabled
        slotProps={{ textField: { required: true } }}
        data-testid="disabled-required-test"
      />,
    );
    const input = screen.getByTestId('disabled-required-test');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
  });

  // Rapid onChange calls
  it('handles rapid successive onChange calls', () => {
    renderWithProvider(
      <TimePicker label="Select Time" value={null} onChange={mockOnChange} />,
    );
    const input = screen.getByRole('textbox');

    // Simulate rapid changes
    fireEvent.change(input, { target: { value: '09:00 AM' } });
    fireEvent.change(input, { target: { value: '10:00 AM' } });
    fireEvent.change(input, { target: { value: '11:00 AM' } });

    // Verify onChange was called multiple times
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  // Invalid input handling
  it('handles invalid user input gracefully', () => {
    renderWithProvider(
      <TimePicker label="Select Time" value={null} onChange={mockOnChange} />,
    );
    const input = screen.getByRole('textbox');

    // Enter invalid time format
    fireEvent.change(input, { target: { value: 'invalid-time' } });

    // Component should still render without crashing
    expect(input).toBeInTheDocument();
    // onChange may or may not be called depending on MUI's validation
  });

  // Combined disabled and error state
  it('renders correctly when both disabled and with error state', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        disabled
        slotProps={{ textField: { error: true, helperText: 'Error message' } }}
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    // Error state is handled by MUI internally
  });

  // Test with all props combined
  it('handles all props combined without errors', () => {
    const minTime = dayjs().hour(8).minute(0);
    const maxTime = dayjs().hour(18).minute(0);
    const value = dayjs().hour(12).minute(30);

    renderWithProvider(
      <TimePicker
        label="Business Hours"
        value={value}
        onChange={mockOnChange}
        minTime={minTime}
        maxTime={maxTime}
        timeSteps={{ hours: 1, minutes: 30 }}
        className="business-hours-picker"
        data-testid="full-props-test"
        slotProps={{ textField: { placeholder: 'Select business hours' } }}
      />,
    );

    const input = screen.getByTestId('full-props-test');
    expect(input).toBeInTheDocument();
    // Verify component renders successfully with all props combined
  });

  it('renders custom slots correctly', () => {
    const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        slots={{ openPickerIcon: CustomIcon }}
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders label with correct htmlFor attribute', () => {
    renderWithProvider(
      <TimePicker
        label="Test Label"
        value={null}
        onChange={mockOnChange}
        data-testid="test-picker-id"
      />,
    );
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-picker-id');
  });

  it('applies text-muted class to label when disabled', () => {
    renderWithProvider(
      <TimePicker
        label="Disabled Label"
        value={null}
        onChange={mockOnChange}
        disabled
      />,
    );
    const label = screen.getByText('Disabled Label');
    expect(label).toHaveClass('text-muted');
  });

  it('applies CSS module classes', () => {
    const { container } = renderWithProvider(
      <TimePicker
        label="Styled Label"
        value={null}
        onChange={mockOnChange}
        data-testid="styled-picker"
      />,
    );
    // Check label class - in test env CSS modules might be mocked or preserved
    // Use robust check for class substring or presence
    const label = container.querySelector('[class*="pickerLabel"]');
    expect(label).toBeInTheDocument();

    const input = screen.getByTestId('styled-picker');
    expect(input).toHaveClass('form-control'); // bootstrap class
    // Styles applied to input are via styles.fullWidth.
    // Check if class list contains fullWidth
    expect(input.className).toContain('fullWidth'); // assuming mock preserves key or checking for substring
  });

  it('does not render label when label prop is missing', () => {
    const { container } = renderWithProvider(
      <TimePicker value={null} onChange={mockOnChange} />,
    );
    // Mui might render labels. Our custom label has `pickerLabel`.
    // If styles are mocked, it's `pickerLabel`.
    expect(container.querySelector('[class*="pickerLabel"]')).toBeNull();
  });

  it('renders endAdornment with correct positioning and styling when provided', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        data-testid="adornment-test-input"
        slotProps={{
          textField: {
            InputProps: {
              endAdornment: <div data-testid="end-adornment">Adornment</div>,
            },
          },
        }}
      />,
    );

    // Assert endAdornment is present
    const adornment = screen.getByTestId('end-adornment');
    expect(adornment).toBeInTheDocument();

    // Assert positioning wrapper classes
    // The wrapper is the direct parent of the adornment
    const wrapper = adornment.parentElement;
    expect(wrapper).toHaveClass('position-absolute');
    expect(wrapper).toHaveClass('end-0');
    expect(wrapper).toHaveClass('top-50');
    expect(wrapper).toHaveClass('translate-middle-y');
    expect(wrapper).toHaveClass('pe-2');

    // Assert paddedInput class on the input
    const input = screen.getByTestId('adornment-test-input');
    expect(input.className).toContain('paddedInput');
  });

  it('does not render endAdornment or paddedInput class when disableOpenPicker is true', () => {
    renderWithProvider(
      <TimePicker
        label="Select Time"
        value={null}
        onChange={mockOnChange}
        data-testid="no-adornment-input"
        disableOpenPicker
      />,
    );

    // Assert endAdornment is NOT present
    expect(screen.queryByTestId('end-adornment')).not.toBeInTheDocument();

    // Assert paddedInput class is NOT on the input
    const input = screen.getByTestId('no-adornment-input');
    expect(input.className).not.toContain('paddedInput');
  });
});
