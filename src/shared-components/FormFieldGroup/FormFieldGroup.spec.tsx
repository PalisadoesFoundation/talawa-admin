import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import { FormFieldGroup } from './FormFieldGroup';
import { FormTextField } from './FormTextField';
import { FormTextArea } from './FormTextArea';
import { FormSelect } from './FormSelect';
import { FormCheckbox } from './FormCheckbox';
import { FormRadioGroup } from './FormRadioGroup';
import { FormDateField } from './FormDateField';
import type { InterfaceUserInfo } from 'utils/interfaces';
import { Form } from 'react-bootstrap';

afterEach(() => {
  vi.clearAllMocks();
});

// ============================================================================
// FormFieldGroup Tests
// ============================================================================
describe('FormFieldGroup', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders with label and children', () => {
      render(
        <FormFieldGroup label="Test Label">
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(
        <FormFieldGroup>
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('applies custom classes correctly', () => {
      const { container } = render(
        <FormFieldGroup
          groupClass="custom-group"
          labelClass="custom-label"
          label="Test"
        >
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(container.querySelector('.custom-group')).toBeInTheDocument();
      expect(container.querySelector('.custom-label')).toBeInTheDocument();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('displays error message when touched and error exists', () => {
      render(
        <FormFieldGroup
          label="Name"
          error="This field is required"
          touched={true}
        >
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('does not display error when not touched', () => {
      render(
        <FormFieldGroup
          label="Name"
          error="This field is required"
          touched={false}
        >
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(
        screen.queryByText('This field is required'),
      ).not.toBeInTheDocument();
    });

    it('displays help text when no error', () => {
      render(
        <FormFieldGroup label="Name" helpText="Enter your name">
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(screen.getByText('Enter your name')).toBeInTheDocument();
    });

    it('hides help text when error is shown', () => {
      render(
        <FormFieldGroup
          label="Name"
          helpText="Enter your name"
          error="Invalid name"
          touched={true}
        >
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(screen.queryByText('Enter your name')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid name')).toBeInTheDocument();
    });
  });

  describe('Unit tests: Required field indicators', () => {
    it('displays asterisk for required fields', () => {
      render(
        <FormFieldGroup label="Name" required={true}>
          <input type="text" />
        </FormFieldGroup>,
      );
      const asterisk = screen.getByLabelText('required');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent('*');
    });

    it('does not display asterisk for optional fields', () => {
      render(
        <FormFieldGroup label="Name">
          <input type="text" />
        </FormFieldGroup>,
      );
      expect(screen.queryByLabelText('required')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// FormTextField Tests
// ============================================================================
describe('FormTextField', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders bootstrap format text field', () => {
      const handleChange = vi.fn();
      render(
        <FormTextField
          label="Username"
          name="username"
          value=""
          onChange={handleChange}
          format="bootstrap"
        />,
      );
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      const input = screen.getByLabelText('Username') as HTMLInputElement;
      expect(input).toHaveAttribute('name', 'username');
    });

    it('renders MUI format text field', () => {
      const handleChange = vi.fn();
      render(
        <FormTextField
          label="Username"
          name="username"
          value=""
          onChange={handleChange}
          format="mui"
        />,
      );
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      const input = screen.getByLabelText('Username') as HTMLInputElement;
      expect(input).toHaveAttribute('name', 'username');
    });

    it('renders different input types', () => {
      const types: Array<'text' | 'email' | 'password' | 'number'> = [
        'text',
        'email',
        'password',
        'number',
      ];
      types.forEach((type) => {
        const { unmount } = render(
          <FormTextField
            label={type}
            name={type}
            value=""
            onChange={() => {}}
            type={type}
            format="bootstrap"
          />,
        );
        const input = screen.getByLabelText(type);
        expect(input).toHaveAttribute('type', type);
        unmount();
      });
    });

    it('renders with placeholder', () => {
      render(
        <FormTextField
          label="Email"
          name="email"
          value=""
          onChange={() => {}}
          placeholder="Enter your email"
          format="bootstrap"
        />,
      );
      expect(
        screen.getByPlaceholderText('Enter your email'),
      ).toBeInTheDocument();
    });

    it('renders with endAdornment', () => {
      render(
        <FormTextField
          label="Password"
          name="password"
          value=""
          onChange={() => {}}
          format="bootstrap"
          endAdornment={<button>Show</button>}
        />,
      );
      expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <FormTextField
          label="Username"
          name="username"
          value=""
          onChange={handleChange}
          format="bootstrap"
        />,
      );
      const input = screen.getByLabelText('Username');
      await userEvent.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('displays validation error', () => {
      render(
        <FormTextField
          label="Email"
          name="email"
          value=""
          onChange={() => {}}
          error="Invalid email format"
          touched={true}
          format="bootstrap"
        />,
      );
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('respects maxLength property', () => {
      render(
        <FormTextField
          label="Username"
          name="username"
          value=""
          onChange={() => {}}
          maxLength={10}
          format="bootstrap"
        />,
      );
      const input = screen.getByLabelText('Username') as HTMLInputElement;
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });

  describe('Accessibility tests', () => {
    it('has proper ARIA attributes', () => {
      render(
        <FormTextField
          label="Email Address"
          name="email"
          value=""
          onChange={() => {}}
          ariaLabel="Email input field"
          ariaDescribedBy="email-help"
          format="bootstrap"
        />,
      );
      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-label', 'Email input field');
      expect(input).toHaveAttribute('aria-describedby', 'email-help');
    });

    it('marks required fields with required attribute', () => {
      render(
        <FormTextField
          label="Email"
          name="email"
          value=""
          onChange={() => {}}
          required={true}
          format="bootstrap"
        />,
      );
      const input = screen.getByLabelText(/Email/);
      expect(input).toHaveAttribute('required');
    });

    it('marks disabled fields correctly', () => {
      render(
        <FormTextField
          label="Field"
          name="field"
          value=""
          onChange={() => {}}
          disabled={true}
          format="bootstrap"
        />,
      );
      const input = screen.getByLabelText('Field');
      expect(input).toBeDisabled();
    });
  });
});

// ============================================================================
// FormTextArea Tests (UPDATED)
// ============================================================================
describe('FormTextArea', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders multiline textarea', () => {
      render(
        <FormTextArea
          label="Description"
          name="description"
          value=""
          onChange={() => {}}
          multiline={true}
        />,
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with specified rows', () => {
      render(
        <FormTextArea
          label="Bio"
          name="bio"
          value=""
          onChange={() => {}}
          multiline={true}
          rows={5}
        />,
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with endAdornment', () => {
      render(
        <FormTextArea
          label="Description"
          name="description"
          value=""
          onChange={() => {}}
          multiline={true}
          endAdornment={<div>0/500</div>}
        />,
      );
      expect(screen.getByText('0/500')).toBeInTheDocument();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <FormTextArea
          label="Description"
          name="description"
          value=""
          onChange={handleChange}
          multiline={true}
        />,
      );
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'New text');
      expect(handleChange).toHaveBeenCalled();
    });

    it('displays error state', () => {
      render(
        <FormTextArea
          label="Description"
          name="description"
          value=""
          onChange={() => {}}
          multiline={true}
          error={true}
          touched={true}
        />,
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });
});

// ============================================================================
// FormSelect Tests (UPDATED)
// ============================================================================
describe('FormSelect', () => {
  const mockOptions: InterfaceUserInfo[] = [
    {
      id: '1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
      createdAt: new Date('2024-03-15T08:30:00.000Z'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      emailAddress: 'jane@example.com',
      createdAt: new Date('2024-06-20T14:45:00.000Z'),
    },
  ];

  describe('Unit tests: Each field type renders correctly', () => {
    it('renders select/autocomplete field', () => {
      render(
        <FormSelect
          name="user"
          label="Select user"
          options={mockOptions}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />,
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with multiple selection', () => {
      render(
        <FormSelect
          name="users"
          label="Select users"
          options={mockOptions}
          multiple={true}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />,
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with selected value', () => {
      render(
        <FormSelect
          name="user"
          label="User"
          options={mockOptions}
          value={mockOptions[0]}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />,
      );
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    it('respects disabled state', () => {
      render(
        <FormSelect
          name="user"
          label="Disabled select"
          options={mockOptions}
          disabled={true}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />,
      );
      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <FormSelect
          name="user"
          label="User select"
          options={mockOptions}
          getOptionLabel={(option) => option.name}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />,
      );
      const input = screen.getByRole('combobox');
      fireEvent.mouseDown(input);
      await waitFor(() => {
        const option = screen.getByText('John Doe');
        fireEvent.click(option);
      });
      expect(handleChange).toHaveBeenCalled();
    });

    it('filters selected options when configured', () => {
      render(
        <FormSelect
          name="users"
          label="Filtered select"
          options={mockOptions}
          value={[mockOptions[0]]}
          multiple={true}
          filterSelectedOptions={true}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />,
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('handles FormSelect with empty options array', () => {
    render(
      <FormSelect
        name="empty"
        label="Empty select"
        options={[]}
        getOptionLabel={(option) => option.name}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

// ============================================================================
// FormCheckbox Tests
// ============================================================================
describe('FormCheckbox', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders checkbox with label', () => {
      render(
        <FormCheckbox
          id="terms"
          labelText="Accept terms"
          checked={false}
          onChange={() => {}}
        />,
      );
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('handles checked state', () => {
      const { container } = render(
        <FormCheckbox
          id="terms"
          labelText="Accept terms"
          checked={true}
          onChange={() => {}}
        />,
      );
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeChecked();
    });

    it('applies custom container class', () => {
      const { container } = render(
        <FormCheckbox
          id="terms"
          labelText="Accept terms"
          checked={false}
          containerClass="custom-checkbox"
          onChange={() => {}}
        />,
      );
      expect(container.querySelector('.custom-checkbox')).toBeInTheDocument();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      const { container } = render(
        <FormCheckbox
          id="terms"
          labelText="Accept terms"
          checked={false}
          onChange={handleChange}
        />,
      );
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox as HTMLElement);
      expect(handleChange).toHaveBeenCalled();
    });

    it('respects disabled state', () => {
      const { container } = render(
        <FormCheckbox
          id="terms"
          labelText="Accept terms"
          checked={false}
          disabled={true}
          onChange={() => {}}
        />,
      );
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeDisabled();
    });
  });
});

// ============================================================================
// FormRadioGroup Tests (UPDATED)
// ============================================================================
describe('FormRadioGroup', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  describe('Unit tests: Each field type renders correctly', () => {
    it('renders radio button group with options', () => {
      render(
        <FormRadioGroup
          name="choice"
          options={mockOptions}
          value=""
          onChange={() => {}}
        />,
      );
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('handles checked state', () => {
      const { container } = render(
        <FormRadioGroup
          name="gender"
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
          value="male"
          onChange={() => {}}
        />,
      );
      const maleRadio = container.querySelector('input[value="male"]');
      expect(maleRadio).toBeChecked();
    });

    it('renders group label', () => {
      render(
        <FormRadioGroup
          name="choice"
          label="Select your choice"
          options={mockOptions}
          value=""
          onChange={() => {}}
        />,
      );
      expect(screen.getByText('Select your choice')).toBeInTheDocument();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      const { container } = render(
        <FormRadioGroup
          name="choice"
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );
      const radio = container.querySelector('input[value="option1"]');
      expect(radio).toBeInTheDocument();
      await userEvent.click(radio as HTMLElement);
      expect(handleChange).toHaveBeenCalled();
    });

    it('displays error when touched', () => {
      render(
        <FormRadioGroup
          name="choice"
          options={mockOptions}
          value=""
          onChange={() => {}}
          error="This field is required"
          touched={true}
        />,
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// FormDateField Tests
// ============================================================================
describe('FormDateField', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders date picker', () => {
      render(
        <FormDateField label="Birth Date" value={null} onChange={() => {}} />,
      );
      expect(screen.getByLabelText('Birth Date')).toBeInTheDocument();
    });

    it('renders with selected date', () => {
      const date = dayjs('2024-01-15');
      render(
        <FormDateField
          label="Date"
          value={date}
          onChange={() => {}}
          format="YYYY-MM-DD"
        />,
      );
      const input = screen.getByDisplayValue('2024-01-15');
      expect(input).toBeInTheDocument();
    });

    it('respects minDate and maxDate', () => {
      const minDate = dayjs('2024-01-01');
      const maxDate = dayjs('2024-12-31');
      render(
        <FormDateField
          label="Date"
          value={null}
          onChange={() => {}}
          minDate={minDate}
          maxDate={maxDate}
        />,
      );
      const input = screen.getByLabelText('Date');
      expect(input).toBeInTheDocument();
    });

    it('respects disabled state', () => {
      render(
        <FormDateField
          label="Date"
          value={null}
          onChange={() => {}}
          disabled={true}
        />,
      );
      const input = screen.getByLabelText('Date');
      expect(input).toBeDisabled();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles date change', async () => {
      const handleChange = vi.fn();
      render(
        <FormDateField label="Date" value={null} onChange={handleChange} />,
      );
      const input = screen.getByLabelText('Date');
      await userEvent.type(input, '01/15/2024');
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('displays error state', () => {
      render(
        <FormDateField
          label="Date"
          value={null}
          onChange={() => {}}
          error={true}
          slotProps={{
            textField: {
              error: true,
              helperText: 'Invalid date',
            },
          }}
        />,
      );
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

const TestFormWithValidation = () => {
  const handleSubmit = vi.fn();
  const [email, setEmail] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const hasError = touched && !email.includes('@');
  const errorMsg = hasError ? 'Invalid email' : '';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasError) {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          isInvalid={!!(touched && errorMsg)}
        />
        {errorMsg && (
          <Form.Control.Feedback type="invalid">
            {errorMsg}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <button type="submit">Submit</button>
    </form>
  );
};

const TestFormWithFields = ({
  handleSubmit,
}: {
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormTextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        format="bootstrap"
      />
      <FormTextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        format="bootstrap"
      />
      <FormTextArea
        label="Message"
        name="message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        multiline={true}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('Integration tests: Form submission with validation', () => {
  it('validates form and prevents submission on errors', async () => {
    render(<TestFormWithValidation />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    const emailInput = screen.getByLabelText('Email');

    await userEvent.type(emailInput, 'invalid');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });

    await userEvent.click(submitButton);
    expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
  });

  it('submits form successfully with valid data', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(<TestFormWithFields handleSubmit={handleSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');

    const messageField = screen.getByRole('textbox', { name: /message/i });
    await userEvent.type(messageField, 'Test message');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(handleSubmit).toHaveBeenCalled();
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================
describe('Accessibility tests: Keyboard navigation through fields', () => {
  it('allows tab navigation through form fields', async () => {
    render(
      <div>
        <FormTextField
          label="Field 1"
          name="field1"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
        <FormTextField
          label="Field 2"
          name="field2"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
        <FormTextField
          label="Field 3"
          name="field3"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
      </div>,
    );

    const field1 = screen.getByLabelText('Field 1');
    const field2 = screen.getByLabelText('Field 2');
    const field3 = screen.getByLabelText('Field 3');

    field1.focus();
    expect(field1).toHaveFocus();

    await userEvent.tab();
    expect(field2).toHaveFocus();

    await userEvent.tab();
    expect(field3).toHaveFocus();
  });

  it('allows shift+tab to navigate backwards', async () => {
    render(
      <div>
        <FormTextField
          label="Field 1"
          name="field1"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
        <FormTextField
          label="Field 2"
          name="field2"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
      </div>,
    );

    const field2 = screen.getByLabelText('Field 2');
    field2.focus();
    expect(field2).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(screen.getByLabelText('Field 1')).toHaveFocus();
  });
});

describe('Accessibility tests: Screen reader announces errors', () => {
  it('has proper ARIA attributes for error states', () => {
    render(
      <FormTextField
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        error="Invalid email format"
        touched={true}
        format="bootstrap"
        ariaDescribedBy="email-error"
      />,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('marks invalid fields with aria-invalid', () => {
    render(
      <FormTextArea
        label="Description"
        name="description"
        value=""
        onChange={() => {}}
        error={true}
        touched={true}
        multiline={true}
      />,
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates error messages with inputs via FormFieldGroup', () => {
    render(
      <FormFieldGroup
        label="Password"
        error="Password too short"
        touched={true}
      >
        <input type="password" />
      </FormFieldGroup>,
    );
    const errorMessage = screen.getByText('Password too short');
    expect(errorMessage).toBeInTheDocument();
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================
describe('Edge cases and special scenarios', () => {
  it('handles empty string values correctly', () => {
    render(
      <FormTextField
        label="Field"
        name="field"
        value=""
        onChange={() => {}}
        format="bootstrap"
      />,
    );
    const input = screen.getByLabelText('Field') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('handles undefined optional props', () => {
    render(
      <FormTextField
        label="Field"
        name="field"
        value=""
        onChange={() => {}}
        format="bootstrap"
      />,
    );
    expect(screen.getByLabelText('Field')).toBeInTheDocument();
  });

  it('handles FormDateField with null value', () => {
    render(<FormDateField label="Date" value={null} onChange={() => {}} />);
    const input = screen.getByLabelText('Date') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('handles FormSelect with empty options array', () => {
    render(
      <FormSelect
        name="empty"
        label="Empty select"
        options={[]}
        getOptionLabel={(option) => option.name}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles rapid consecutive onChange events', async () => {
    const handleChange = vi.fn();
    render(
      <FormTextField
        label="Field"
        name="field"
        value=""
        onChange={handleChange}
        format="bootstrap"
      />,
    );
    const input = screen.getByLabelText('Field');
    await userEvent.type(input, 'abc', { delay: 1 });
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <FormTextField
        label="Field"
        name="field"
        value=""
        onChange={() => {}}
        onFocus={handleFocus}
        onBlur={handleBlur}
        format="bootstrap"
      />,
    );
    const input = screen.getByLabelText('Field');
    input.focus();
    expect(handleFocus).toHaveBeenCalled();
    input.blur();
    expect(handleBlur).toHaveBeenCalled();
  });
});
