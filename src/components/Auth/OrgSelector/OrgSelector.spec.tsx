import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../utils/i18nForTest';
import { OrgSelector } from './OrgSelector';
import type { InterfaceOrgOption } from '../../../types/Auth/OrgSelector/interface';

describe('OrgSelector', () => {
  const mockOrganizations: InterfaceOrgOption[] = [
    { _id: 'org1', name: 'Organization One' },
    { _id: 'org2', name: 'Organization Two' },
    { _id: 'org3', name: 'Organization Three' },
  ];

  const defaultProps = {
    options: mockOrganizations,
    onChange: vi.fn(),
  };

  const renderWithI18n = (component: React.ReactElement) => {
    return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders select element with default label', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const label = screen.getByLabelText(/organization/i);
      expect(label).toBeInTheDocument();

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      renderWithI18n(<OrgSelector {...defaultProps} label="Choose Org" />);

      const label = screen.getByText('Choose Org');
      expect(label).toBeInTheDocument();
    });

    test('renders placeholder option', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const placeholder = screen.getByText(/select an organization/i);
      expect(placeholder).toBeInTheDocument();
    });

    test('renders required indicator when required is true', () => {
      renderWithI18n(<OrgSelector {...defaultProps} required />);

      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-danger');
    });

    test('does not render required indicator when required is false', () => {
      renderWithI18n(<OrgSelector {...defaultProps} required={false} />);

      const requiredIndicator = screen.queryByText('*');
      expect(requiredIndicator).not.toBeInTheDocument();
    });

    test('applies data-testid attribute', () => {
      renderWithI18n(
        <OrgSelector {...defaultProps} testId="org-selector-test" />,
      );

      const select = screen.getByTestId('org-selector-test');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Options Rendering', () => {
    test('renders all organization options', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      mockOrganizations.forEach((org) => {
        const option = screen.getByRole('option', { name: org.name });
        expect(option).toBeInTheDocument();
        expect(option).toHaveValue(org._id);
      });
    });

    test('renders correct number of options including placeholder', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const options = screen.getAllByRole('option');
      // +1 for placeholder option
      expect(options).toHaveLength(mockOrganizations.length + 1);
    });

    test('displays "no organizations available" when options array is empty', () => {
      renderWithI18n(<OrgSelector {...defaultProps} options={[]} />);

      const noOrgsMessage = screen.getByText(/no organizations available/i);
      expect(noOrgsMessage).toBeInTheDocument();
    });
  });

  describe('Value and Selection Handling', () => {
    test('displays selected value when provided', () => {
      renderWithI18n(<OrgSelector {...defaultProps} value="org2" />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('org2');
    });

    test('calls onChange with selected organization ID', () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'org2' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('org2');
    });

    test('defaults to empty string when no value is provided', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('');
    });
  });

  describe('Disabled State', () => {
    test('renders disabled select when disabled is true', () => {
      renderWithI18n(<OrgSelector {...defaultProps} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    test('renders enabled select when disabled is false', () => {
      renderWithI18n(<OrgSelector {...defaultProps} disabled={false} />);

      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    });

    test('select is disabled and cannot be interacted with', () => {
      renderWithI18n(
        <OrgSelector {...defaultProps} disabled testId="disabled-select" />,
      );

      const select = screen.getByTestId('disabled-select');
      expect(select).toBeDisabled();
      expect(select).toHaveAttribute('disabled');
    });
  });

  describe('Error State and Validation', () => {
    test('displays error message when error is provided', () => {
      renderWithI18n(
        <OrgSelector {...defaultProps} error="Please select an organization" />,
      );

      const errorMessage = screen.getByText('Please select an organization');
      expect(errorMessage).toBeInTheDocument();
    });

    test('error message has role="status" for accessibility', () => {
      renderWithI18n(<OrgSelector {...defaultProps} error="Error occurred" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Error occurred');
    });

    test('error message has aria-live="polite"', () => {
      renderWithI18n(<OrgSelector {...defaultProps} error="Error occurred" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    test('select has aria-invalid when error is present', () => {
      renderWithI18n(
        <OrgSelector
          {...defaultProps}
          error="Invalid selection"
          testId="error-select"
        />,
      );

      const select = screen.getByTestId('error-select');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    test('select has aria-describedby pointing to error element', () => {
      renderWithI18n(
        <OrgSelector
          {...defaultProps}
          error="Invalid selection"
          testId="error-select"
        />,
      );

      const select = screen.getByTestId('error-select');
      expect(select).toHaveAttribute('aria-describedby', 'org-selector-error');
    });

    test('does not display error when error is undefined', () => {
      renderWithI18n(<OrgSelector {...defaultProps} error={undefined} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('does not display error when error is null', () => {
      renderWithI18n(<OrgSelector {...defaultProps} error={null} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('select has isInvalid class when error is present', () => {
      renderWithI18n(
        <OrgSelector {...defaultProps} error="Error" testId="invalid-select" />,
      );

      const select = screen.getByTestId('invalid-select');
      expect(select).toHaveClass('is-invalid');
    });
  });

  describe('Accessibility', () => {
    test('select has proper controlId', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'org-selector');
    });

    test('label is associated with select element', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const select = screen.getByRole('combobox');
      const label = screen.getByLabelText(/organization/i);

      expect(label).toHaveAttribute('id', 'org-selector');
      expect(select).toHaveAttribute('id', 'org-selector');
    });

    test('placeholder option is disabled', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const placeholderOption = screen.getByRole('option', {
        name: /select an organization/i,
      });
      expect(placeholderOption).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty options array gracefully', () => {
      renderWithI18n(<OrgSelector {...defaultProps} options={[]} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      // Should have placeholder and "no organizations" option
      expect(options).toHaveLength(2);
    });

    test('handles single organization option', () => {
      const singleOrg = [{ _id: 'org1', name: 'Only Organization' }];
      renderWithI18n(<OrgSelector {...defaultProps} options={singleOrg} />);

      const options = screen.getAllByRole('option');
      // Placeholder + 1 organization
      expect(options).toHaveLength(2);

      const orgOption = screen.getByRole('option', {
        name: 'Only Organization',
      });
      expect(orgOption).toBeInTheDocument();
    });

    test('handles organizations with special characters in names', () => {
      const specialOrgs = [
        { _id: 'org1', name: "O'Reilly & Associates" },
        { _id: 'org2', name: 'Org <Test>' },
      ];
      renderWithI18n(<OrgSelector {...defaultProps} options={specialOrgs} />);

      const org1 = screen.getByRole('option', {
        name: "O'Reilly & Associates",
      });
      const org2 = screen.getByRole('option', { name: 'Org <Test>' });

      expect(org1).toBeInTheDocument();
      expect(org2).toBeInTheDocument();
    });
  });
});
