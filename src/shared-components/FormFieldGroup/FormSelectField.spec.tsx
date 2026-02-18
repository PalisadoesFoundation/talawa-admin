import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { FormSelectField } from './FormSelectField';
import React from 'react';

// Mock translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FormSelectField Component', () => {
  const defaultProps = {
    name: 'test-select',
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </>
    ),
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders with correct label and children options', () => {
    render(<FormSelectField {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('calls onChange with new value when option is selected', async () => {
    render(<FormSelectField {...defaultProps} />);

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'option1');

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith('option1');
  });

  test('displays error message and invalid state when touched and error is present', () => {
    const errorProps = {
      ...defaultProps,
      touched: true,
      error: 'This field is required',
    };

    render(<FormSelectField {...errorProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('is-invalid');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('does not display error when not touched even if error is present', () => {
    const errorProps = {
      ...defaultProps,
      touched: false,
      error: 'This field is required',
    };

    render(<FormSelectField {...errorProps} />);

    const select = screen.getByRole('combobox');
    expect(select).not.toHaveClass('is-invalid');
    expect(
      screen.queryByText('This field is required'),
    ).not.toBeInTheDocument();
  });

  test('sets aria-required attribute when required is true', () => {
    const requiredProps = {
      ...defaultProps,
      required: true,
    };

    render(<FormSelectField {...requiredProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
    expect(select).toHaveAttribute('aria-required', 'true');
    // Check for asterisk
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('renders help text when provided and no error', () => {
    const helpProps = {
      ...defaultProps,
      helpText: 'Select one option from the list',
    };

    render(<FormSelectField {...helpProps} />);

    expect(
      screen.getByText('Select one option from the list'),
    ).toBeInTheDocument();
  });

  test('hides help text when error is displayed', () => {
    const props = {
      ...defaultProps,
      helpText: 'Select one option from the list',
      touched: true,
      error: 'This field is required',
    };

    render(<FormSelectField {...props} />);

    expect(
      screen.queryByText('Select one option from the list'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('passes data-testid to select element', () => {
    const testIdProps = {
      ...defaultProps,
      'data-testid': 'custom-select',
    };

    render(<FormSelectField {...testIdProps} />);

    expect(screen.getByTestId('custom-select')).toBeInTheDocument();
  });
});
