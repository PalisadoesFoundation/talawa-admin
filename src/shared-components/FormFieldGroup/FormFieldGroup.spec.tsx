import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormFieldGroup } from './FormFieldGroup';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';

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

  test('renders inline mode with label', () => {
    render(
      <FormFieldGroup name="email" label="Email" inline>
        <input />
      </FormFieldGroup>,
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('renders inline mode without label when hideLabel is true', () => {
    render(
      <FormFieldGroup name="email" label="Email" inline hideLabel>
        <input />
      </FormFieldGroup>,
    );

    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });

  test('inline mode shows error when touched', () => {
    render(
      <FormFieldGroup
        name="email"
        label="Email"
        error="Invalid email"
        touched
        inline
      >
        <input />
      </FormFieldGroup>,
    );

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  test('inline mode does not show help text when error exists', () => {
    render(
      <FormFieldGroup
        name="email"
        label="Email"
        helpText="helper"
        error="Invalid"
        touched
        inline
      >
        <input />
      </FormFieldGroup>,
    );

    expect(screen.queryByText('helper')).not.toBeInTheDocument();
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  test('renders children correctly in non-inline mode', () => {
    render(
      <FormFieldGroup name="test" label="Test">
        <input type="checkbox" />
      </FormFieldGroup>,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});

describe('FormTextField', () => {
  test('renders input with value and calls onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FormTextField
        name="email"
        label="Email"
        value="a"
        onChange={onChange}
      />,
    );

    const input = screen.getByDisplayValue('a');
    await user.type(input, 'ab');

    expect(onChange).toHaveBeenCalledWith('ab');
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

  test('renders with placeholder', () => {
    render(
      <FormTextField
        name="search"
        label="Search"
        placeholder="Enter search term"
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByPlaceholderText('Enter search term'),
    ).toBeInTheDocument();
  });

  test('renders with startAdornment', () => {
    render(
      <FormTextField
        name="search"
        label="Search"
        value=""
        onChange={() => {}}
        startAdornment={<span>@</span>}
      />,
    );

    expect(screen.getByText('@')).toBeInTheDocument();
  });

  test('renders with endAdornment', () => {
    render(
      <FormTextField
        name="search"
        label="Search"
        value=""
        onChange={() => {}}
        endAdornment={<span>$</span>}
      />,
    );

    expect(screen.getByText('$')).toBeInTheDocument();
  });

  test('renders with both startAdornment and endAdornment', () => {
    render(
      <FormTextField
        name="amount"
        label="Amount"
        value="100"
        onChange={() => {}}
        startAdornment={<span>$</span>}
        endAdornment={<span>.00</span>}
      />,
    );

    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('.00')).toBeInTheDocument();
  });

  test('renders as disabled when disabled prop is true', () => {
    render(
      <FormTextField
        name="email"
        label="Email"
        value="test@example.com"
        onChange={() => {}}
        disabled
      />,
    );

    const input = screen.getByDisplayValue(
      'test@example.com',
    ) as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  test('respects different input types', () => {
    const { rerender } = render(
      <FormTextField
        name="number"
        label="Number"
        type="number"
        value="42"
        onChange={() => {}}
      />,
    );

    let input = screen.getByDisplayValue('42') as HTMLInputElement;
    expect(input.type).toBe('number');

    rerender(
      <FormTextField
        name="tel"
        label="Phone"
        type="tel"
        value="1234567890"
        onChange={() => {}}
      />,
    );

    input = screen.getByDisplayValue('1234567890') as HTMLInputElement;
    expect(input.type).toBe('tel');
  });

  test('handles empty string value', () => {
    render(
      <FormTextField name="input" label="Input" value="" onChange={() => {}} />,
    );

    expect(screen.queryByDisplayValue('')).toBeInTheDocument();
  });

  test('does not call onChange when disabled', async () => {
    const onChange = vi.fn();

    render(
      <FormTextField
        name="email"
        label="Email"
        value="test"
        onChange={onChange}
        disabled
      />,
    );

    const input = screen.getByDisplayValue('test');
    await userEvent.type(input, 'new');

    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders help text below input in non-inline mode', () => {
    render(
      <FormTextField
        name="email"
        label="Email"
        value="test@example.com"
        onChange={() => {}}
        helpText="Enter your email address"
      />,
    );

    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  test('hides help text when error is shown', () => {
    render(
      <FormTextField
        name="email"
        label="Email"
        value="invalid"
        onChange={() => {}}
        error="Invalid email format"
        touched
        helpText="Enter your email address"
      />,
    );

    expect(
      screen.queryByText('Enter your email address'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  test('renders with custom data-testid', () => {
    render(
      <FormTextField
        name="email"
        label="Email"
        value="test"
        onChange={() => {}}
        data-testid="custom-input"
      />,
    );

    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  test('passes additional props to Form.Control', () => {
    render(
      <FormTextField
        name="email"
        label="Email"
        value="test"
        onChange={() => {}}
        maxLength={50}
        autoComplete="email"
      />,
    );

    const input = screen.getByDisplayValue('test') as HTMLInputElement;
    expect(input.maxLength).toBe(50);
    expect(input.autocomplete).toBe('email');
  });

  test('does not spread type attribute when as="textarea"', () => {
    render(
      <FormTextField
        name="notes"
        label="Notes"
        value="test notes"
        onChange={() => {}}
        as="textarea"
      />,
    );

    const textarea = screen.getByDisplayValue('test notes');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).not.toHaveAttribute('type');
  });

  test('handles undefined onChange handler gracefully', async () => {
    const user = userEvent.setup();
    render(
      <FormTextField
        name="notes"
        label="Notes"
        value=""
        onChange={undefined}
      />,
    );

    const input = screen.getByRole('textbox');
    // Should not throw
    await user.type(input, 'test');
    expect(input).toBeInTheDocument();
  });
});

describe('FormSelectField', () => {
  test('renders select with options', () => {
    const onChange = vi.fn();

    render(
      <FormSelectField
        name="country"
        label="Country"
        value="us"
        onChange={onChange}
      >
        <option value="">Select country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
      </FormSelectField>,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  test('calls onChange when selection changes', async () => {
    const onChange = vi.fn();

    render(
      <FormSelectField
        name="country"
        label="Country"
        value="us"
        onChange={onChange}
      >
        <option value="">Select country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
      </FormSelectField>,
    );

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'uk');

    expect(onChange).toHaveBeenCalledWith('uk');
  });

  test('shows required indicator', () => {
    render(
      <FormSelectField
        name="country"
        label="Country"
        value=""
        onChange={() => {}}
        required
      >
        <option value="">Select country</option>
      </FormSelectField>,
    );

    expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
  });

  test('shows error when touched and error exists', () => {
    render(
      <FormSelectField
        name="country"
        label="Country"
        value=""
        onChange={() => {}}
        error="Please select a country"
        touched
      >
        <option value="">Select country</option>
      </FormSelectField>,
    );

    expect(screen.getByText('Please select a country')).toBeInTheDocument();
  });

  test('renders help text when no error', () => {
    render(
      <FormSelectField
        name="country"
        label="Country"
        value="us"
        onChange={() => {}}
        helpText="Select your country of residence"
      >
        <option value="">Select country</option>
        <option value="us">United States</option>
      </FormSelectField>,
    );

    expect(
      screen.getByText('Select your country of residence'),
    ).toBeInTheDocument();
  });

  test('hides help text when error is shown', () => {
    render(
      <FormSelectField
        name="country"
        label="Country"
        value=""
        onChange={() => {}}
        error="Please select a country"
        touched
        helpText="Select your country"
      >
        <option value="">Select country</option>
      </FormSelectField>,
    );

    expect(screen.queryByText('Select your country')).not.toBeInTheDocument();
  });

  test('renders with initial value selected', () => {
    render(
      <FormSelectField
        name="role"
        label="Role"
        value="admin"
        onChange={() => {}}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </FormSelectField>,
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('admin');
  });

  test('renders multiple options correctly', () => {
    render(
      <FormSelectField
        name="category"
        label="Category"
        value=""
        onChange={() => {}}
      >
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
        <option value="home">Home & Garden</option>
      </FormSelectField>,
    );

    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Home & Garden')).toBeInTheDocument();
  });

  test('renders as disabled when required attribute is set', () => {
    render(
      <FormSelectField
        name="country"
        label="Country"
        value=""
        onChange={() => {}}
        required
      >
        <option value="">Select country</option>
      </FormSelectField>,
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.required).toBe(true);
  });

  test('renders with data-testid attribute', () => {
    render(
      <FormSelectField
        name="country"
        label="Country"
        value=""
        onChange={() => {}}
        data-testid="country-select"
      >
        <option value="">Select</option>
      </FormSelectField>,
    );

    expect(screen.getByTestId('country-select')).toBeInTheDocument();
  });

  test('handles empty value selection', async () => {
    const onChange = vi.fn();

    render(
      <FormSelectField
        name="country"
        label="Country"
        value="us"
        onChange={onChange}
      >
        <option value="">None</option>
        <option value="us">United States</option>
      </FormSelectField>,
    );

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '');

    expect(onChange).toHaveBeenCalledWith('');
  });

  test('renders children conditionally', () => {
    const options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ];

    render(
      <FormSelectField name="test" label="Test" value="" onChange={() => {}}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </FormSelectField>,
    );

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });
});
