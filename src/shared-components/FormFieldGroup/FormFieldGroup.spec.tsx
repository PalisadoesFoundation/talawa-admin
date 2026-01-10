import { render, screen, fireEvent } from '@testing-library/react';
import { FormFieldGroup } from './FormFieldGroup';
import { FormTextField } from './FormTextField';

describe('FormFieldGroup', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders label and required indicator', () => {
    render(
      <FormFieldGroup name="n" label="Name" required>
        <input />
      </FormFieldGroup>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
  });

  test('renders help text when no error is shown', () => {
    render(
      <FormFieldGroup
        name="email"
        label="Email"
        helpText="helper"
        touched={false}
      >
        <input />
      </FormFieldGroup>,
    );

    expect(screen.getByText('helper')).toBeInTheDocument();
  });

  test('renders error when touched and error exists', () => {
    render(
      <FormFieldGroup name="email" label="Email" error="Invalid email" touched>
        <input />
      </FormFieldGroup>,
    );

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  test('does not render help text when error is shown', () => {
    render(
      <FormFieldGroup
        name="email"
        label="Email"
        helpText="helper"
        error="Invalid"
        touched
      >
        <input />
      </FormFieldGroup>,
    );

    expect(screen.queryByText('helper')).toBeNull();
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });
});

describe('FormTextField', () => {
  test('renders input with value and calls onChange', () => {
    const onChange = vi.fn();

    render(
      <FormTextField
        name="email"
        label="Email"
        value="a"
        onChange={onChange}
      />,
    );

    const input = screen.getByDisplayValue('a');
    fireEvent.change(input, { target: { value: 'b' } });

    expect(onChange).toHaveBeenCalledWith('b');
  });

  test('applies invalid state when touched and error exist', () => {
    render(
      <FormTextField
        name="email"
        label="Email"
        value="x"
        onChange={() => {}}
        error="Invalid"
        touched
      />,
    );

    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  test('respects input type prop', () => {
    render(
      <FormTextField
        name="password"
        label="Password"
        type="password"
        value="123"
        onChange={() => {}}
      />,
    );

    const input = screen.getByDisplayValue('123') as HTMLInputElement;
    expect(input.type).toBe('password');
  });
});
