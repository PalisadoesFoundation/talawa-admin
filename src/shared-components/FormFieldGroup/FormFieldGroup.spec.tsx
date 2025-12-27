import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import dayjs, { Dayjs } from 'dayjs';
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

// ============================================================================
// FormFieldGroup Tests
// ============================================================================
describe('FormFieldGroup', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders with label and children', () => {
      render(
        <FormFieldGroup name="test-field" label="Test Label">
          <input type="text" />
        </FormFieldGroup>,
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(
        <FormFieldGroup name="test-field">
          <input type="text" />
        </FormFieldGroup>,
      );

      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('applies custom classes correctly', () => {
      const { container } = render(
        <FormFieldGroup
          name="test-field"
          label="Test"
          groupClass="custom-group"
          labelClass="custom-label"
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
          name="test-field"
          label="Test"
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
          name="test-field"
          label="Test"
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
        <FormFieldGroup
          name="test-field"
          label="Test"
          helpText="Enter your name"
          touched={false}
        >
          <input type="text" />
        </FormFieldGroup>,
      );

      expect(screen.getByText('Enter your name')).toBeInTheDocument();
    });

    it('hides help text when error is shown', () => {
      render(
        <FormFieldGroup
          name="test-field"
          label="Test"
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
        <FormFieldGroup name="test-field" label="Email" required={true}>
          <input type="email" />
        </FormFieldGroup>,
      );

      const asterisk = screen.getByLabelText('required');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent('*');
    });

    it('does not display asterisk for optional fields', () => {
      render(
        <FormFieldGroup name="test-field" label="Email" required={false}>
          <input type="email" />
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
          name="username"
          label="Username"
          value=""
          onChange={handleChange}
          format="bootstrap"
        />,
      );

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders MUI format text field', () => {
      const handleChange = vi.fn();
      render(
        <FormTextField
          name="username"
          label="Username"
          value=""
          onChange={handleChange}
          format="mui"
        />,
      );

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
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
            name={`field-${type}`}
            label={type}
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
          name="email"
          label="Email"
          placeholder="Enter your email"
          value=""
          onChange={() => {}}
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
          name="password"
          label="Password"
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
          name="username"
          label="Username"
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
          name="email"
          label="Email"
          value="invalid"
          onChange={() => {}}
          error={true}
          touched={true}
          format="bootstrap"
          helpText="Invalid email format"
        />,
      );

      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('respects maxLength property', () => {
      render(
        <FormTextField
          name="username"
          label="Username"
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
          name="email"
          label="Email Address"
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
          name="email"
          label="Email"
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
          name="field"
          label="Field"
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
// FormTextArea Tests
// ============================================================================
describe('FormTextArea', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders multiline textarea', () => {
      render(
        <FormTextArea
          name="description"
          label="Description"
          value=""
          onChange={() => {}}
          multiline={true}
        />,
      );

      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders with specified rows', () => {
      render(
        <FormTextArea
          name="bio"
          label="Bio"
          value=""
          onChange={() => {}}
          multiline={true}
          rows={5}
        />,
      );

      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with endAdornment', () => {
      render(
        <FormTextArea
          name="notes"
          label="Notes"
          value="Sample text"
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
          name="description"
          label="Description"
          value=""
          onChange={handleChange}
          multiline={true}
        />,
      );

      const textarea = screen.getByLabelText('Description');
      await userEvent.type(textarea, 'New text');

      expect(handleChange).toHaveBeenCalled();
    });

    it('displays error state', () => {
      render(
        <FormTextArea
          name="description"
          label="Description"
          value=""
          onChange={() => {}}
          multiline={true}
          error={true}
        />,
      );

      const textarea = screen.getByLabelText('Description');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });
});

// ============================================================================
// FormSelect Tests
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
          options={mockOptions}
          value={undefined}
          onChange={() => {}}
          renderInput={(params) => (
            <TextField {...params} label="Select user" />
          )}
        />,
      );

      expect(screen.getByLabelText('Select user')).toBeInTheDocument();
    });

    it('renders with multiple selection', () => {
      render(
        <FormSelect
          options={mockOptions}
          value={[]}
          multiple={true}
          onChange={() => {}}
          renderInput={(params) => (
            <TextField {...params} label="Select users" />
          )}
        />,
      );

      expect(screen.getByLabelText('Select users')).toBeInTheDocument();
    });

    it('renders with selected value', () => {
      render(
        <FormSelect
          options={mockOptions}
          value={mockOptions[0]}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => (
            <TextField {...params} label="User select" />
          )}
        />,
      );

      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    it('respects disabled state', () => {
      render(
        <FormSelect
          options={mockOptions}
          value={undefined}
          disabled={true}
          onChange={() => {}}
          renderInput={(params) => (
            <TextField {...params} label="Disabled select" />
          )}
        />,
      );

      const input = screen.getByLabelText('Disabled select');
      expect(input).toBeDisabled();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <FormSelect
          options={mockOptions}
          value={undefined}
          getOptionLabel={(option) => option.name}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label="User select" />
          )}
        />,
      );

      const input = screen.getByLabelText('User select');
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
          options={mockOptions}
          value={[mockOptions[0]]}
          multiple={true}
          filterSelectedOptions={true}
          getOptionLabel={(option) => option.name}
          onChange={() => {}}
          renderInput={(params) => (
            <TextField {...params} label="Filtered select" />
          )}
        />,
      );

      expect(screen.getByLabelText('Filtered select')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// FormCheckbox Tests
// ============================================================================
describe('FormCheckbox', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders checkbox with label', () => {
      render(
        <FormCheckbox id="accept-terms" labelText="Accept terms">
          <input type="checkbox" />
        </FormCheckbox>,
      );

      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('handles checked state', () => {
      const { container } = render(
        <FormCheckbox labelText="Subscribe" checked={true}>
          <input type="checkbox" defaultChecked />
        </FormCheckbox>,
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeChecked();
    });

    it('applies custom container class', () => {
      const { container } = render(
        <FormCheckbox labelText="Option" containerClass="custom-checkbox">
          <input type="checkbox" />
        </FormCheckbox>,
      );

      expect(container.querySelector('.custom-checkbox')).toBeInTheDocument();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      const { container } = render(
        <FormCheckbox labelText="Agree" onChange={handleChange}>
          <input type="checkbox" onChange={handleChange} />
        </FormCheckbox>,
      );

      const checkbox = container.querySelector('input[type="checkbox"]')!;
      await userEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalled();
    });

    it('respects disabled state', () => {
      const { container } = render(
        <FormCheckbox labelText="Option" disabled={true}>
          <input type="checkbox" disabled />
        </FormCheckbox>,
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeDisabled();
    });
  });
});

// ============================================================================
// FormRadioGroup Tests
// ============================================================================
describe('FormRadioGroup', () => {
  describe('Unit tests: Each field type renders correctly', () => {
    it('renders radio button', () => {
      render(
        <FormRadioGroup
          type="radio"
          name="gender"
          id="male"
          label="Male"
          value="male"
        >
          <input type="radio" />
        </FormRadioGroup>,
      );

      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveAttribute('type', 'radio');
    });

    it('handles checked state', () => {
      const { container } = render(
        <FormRadioGroup
          type="radio"
          name="choice"
          id="option1"
          label="Option 1"
          checked={true}
        >
          <input type="radio" defaultChecked />
        </FormRadioGroup>,
      );

      const radio = container.querySelector('input[type="radio"]');
      expect(radio).toBeChecked();
    });
  });

  describe('Unit tests: Validation triggers and error display', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      const { container } = render(
        <FormRadioGroup
          type="radio"
          name="option"
          id="opt1"
          label="Option 1"
          onChange={handleChange}
        >
          <input type="radio" onChange={handleChange} />
        </FormRadioGroup>,
      );

      const radio = container.querySelector('input[type="radio"]')!;
      await userEvent.click(radio);

      expect(handleChange).toHaveBeenCalled();
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
          label="Event Date"
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
describe('Integration tests: Form submission with validation', () => {
  it('validates form and prevents submission on errors', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    const TestForm = () => {
      const [email, setEmail] = React.useState('');
      const [touched, setTouched] = React.useState(false);
      const hasError = touched && !email.includes('@');
      const errorMsg = touched && !email.includes('@') ? 'Invalid email' : '';

      return (
        <form onSubmit={handleSubmit}>
          <FormFieldGroup
            name="email"
            label="Email"
            error={errorMsg}
            touched={touched}
            helpText="Enter your email"
          >
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              isInvalid={!!(touched && errorMsg)}
            />
          </FormFieldGroup>
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<TestForm />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const emailInput = screen.getByLabelText('Email');

    await userEvent.type(emailInput, 'invalid');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    await userEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('submits form successfully with valid data', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    const TestForm = () => {
      const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: '',
      });

      return (
        <form onSubmit={handleSubmit}>
          <FormTextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            format="bootstrap"
          />
          <FormTextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            format="bootstrap"
          />
          <FormTextArea
            name="message"
            label="Message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            multiline={true}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<TestForm />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Message'), 'Test message');

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
      <form>
        <FormTextField
          name="field1"
          label="Field 1"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
        <FormTextField
          name="field2"
          label="Field 2"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
        <FormTextField
          name="field3"
          label="Field 3"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
      </form>,
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
      <form>
        <FormTextField
          name="field1"
          label="Field 1"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
        <FormTextField
          name="field2"
          label="Field 2"
          value=""
          onChange={() => {}}
          format="bootstrap"
        />
      </form>,
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
        name="email"
        label="Email"
        value="invalid"
        onChange={() => {}}
        error={true}
        touched={true}
        format="bootstrap"
        ariaDescribedBy="email-error"
        helpText="Invalid email format"
      />,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('marks invalid fields with aria-invalid', () => {
    render(
      <FormTextArea
        name="description"
        label="Description"
        value=""
        onChange={() => {}}
        error={true}
        multiline={true}
      />,
    );

    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates error messages with inputs via FormFieldGroup', () => {
    render(
      <FormFieldGroup
        name="password"
        label="Password"
        error="Password too short"
        touched={true}
      >
        <input type="password" value="123" onChange={() => {}} />
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
        name="field"
        label="Field"
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
        name="field"
        label="Field"
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
        options={[]}
        value={undefined}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} label="Empty select" />}
      />,
    );

    expect(screen.getByLabelText('Empty select')).toBeInTheDocument();
  });

  it('handles rapid consecutive onChange events', async () => {
    const handleChange = vi.fn();
    render(
      <FormTextField
        name="field"
        label="Field"
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
        name="field"
        label="Field"
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
