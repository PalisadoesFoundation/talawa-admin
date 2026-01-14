import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../utils/i18nForTest';
import { OrgSelector } from './OrgSelector';
import type { InterfaceOrgOption } from '../../../types/Auth/OrgSelector/interface';
import styles from '../../../style/app-fixed.module.css';

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

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders input with default label', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const label = screen.getByLabelText(/organization/i);
      expect(label).toBeInTheDocument();

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      renderWithI18n(<OrgSelector {...defaultProps} label="Choose Org" />);

      const label = screen.getByText('Choose Org');
      expect(label).toBeInTheDocument();
    });

    test('renders placeholder text', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByPlaceholderText(/select an organization/i);
      expect(input).toBeInTheDocument();
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

      const input = screen.getByTestId('org-selector-test');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Search and Filtering', () => {
    test('shows dropdown when input is focused', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        const dropdown = screen.getByTestId('org-selector-dropdown');
        expect(dropdown).toBeInTheDocument();
      });
    });

    test('filters organizations based on search input', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'One' } });

      await waitFor(() => {
        expect(screen.getByText('Organization One')).toBeInTheDocument();
        expect(screen.queryByText('Organization Two')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Organization Three'),
        ).not.toBeInTheDocument();
      });
    });

    test('shows all organizations when search is empty', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Organization One')).toBeInTheDocument();
        expect(screen.getByText('Organization Two')).toBeInTheDocument();
        expect(screen.getByText('Organization Three')).toBeInTheDocument();
      });
    });

    test('shows no results message when no organizations match', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'NonExistent' } });

      await waitFor(() => {
        expect(
          screen.getByText(/no matching organizations found/i),
        ).toBeInTheDocument();
      });
    });

    test('search is case-insensitive', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'organization one' } });

      await waitFor(() => {
        expect(screen.getByText('Organization One')).toBeInTheDocument();
      });
    });
  });

  describe('Value and Selection Handling', () => {
    test('displays selected organization name', () => {
      renderWithI18n(<OrgSelector {...defaultProps} value="org2" />);

      const input = screen.getByRole('combobox') as HTMLInputElement;
      expect(input.value).toBe('Organization Two');
    });

    test('calls onChange with selected organization ID when option is clicked', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        const option = screen.getByText('Organization Two');
        fireEvent.click(option);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('org2');
    });

    test('defaults to empty string when no value is provided', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    test('closes dropdown when clicking outside', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      // Click outside the component
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(
          screen.queryByTestId('org-selector-dropdown'),
        ).not.toBeInTheDocument();
      });
    });

    test('updates highlighted index on mouse enter', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      // Hover over the second option
      const option2 = screen.getByTestId('org-option-org2');
      fireEvent.mouseEnter(option2);

      // Click to select (should select org2 since it's highlighted)
      fireEvent.click(option2);

      expect(onChange).toHaveBeenCalledWith('org2');
    });
  });

  describe('Keyboard Navigation', () => {
    test('opens dropdown on ArrowDown key', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });
    });

    test('selects option on Enter key when highlighted', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith('org1');
    });

    test('closes dropdown on Escape key', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(
          screen.queryByTestId('org-selector-dropdown'),
        ).not.toBeInTheDocument();
      });
    });

    test('navigates up with ArrowUp key and selects correct option', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      // Move down twice (highlight index: -1 -> 0 -> 1)
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // Move up once (highlight index: 1 -> 0)
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      // Select the highlighted option (org1)
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith('org1');
    });

    test('activates option with Enter key when option is focused', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      const option = screen.getByTestId('org-option-org2');
      fireEvent.keyDown(option, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith('org2');
    });

    test('activates option with Space key when option is focused', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      const option = screen.getByTestId('org-option-org3');
      fireEvent.keyDown(option, { key: ' ' });

      expect(onChange).toHaveBeenCalledWith('org3');
    });
  });

  describe('Disabled State', () => {
    test('renders disabled input when disabled is true', () => {
      renderWithI18n(<OrgSelector {...defaultProps} disabled />);

      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });

    test('renders enabled input when disabled is false', () => {
      renderWithI18n(<OrgSelector {...defaultProps} disabled={false} />);

      const input = screen.getByRole('combobox');
      expect(input).not.toBeDisabled();
    });

    test('does not open dropdown when disabled', () => {
      renderWithI18n(<OrgSelector {...defaultProps} disabled />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      expect(
        screen.queryByTestId('org-selector-dropdown'),
      ).not.toBeInTheDocument();
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

    test('input has aria-invalid when error is present', () => {
      renderWithI18n(
        <OrgSelector
          {...defaultProps}
          error="Invalid selection"
          testId="error-input"
        />,
      );

      const input = screen.getByTestId('error-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('input has aria-describedby pointing to error element', () => {
      renderWithI18n(
        <OrgSelector
          {...defaultProps}
          error="Invalid selection"
          testId="error-input"
        />,
      );

      const input = screen.getByTestId('error-input');
      const errorElement = screen.getByRole('status');

      const errorId = errorElement.getAttribute('id');
      expect(errorId).toBeTruthy();
      expect(input).toHaveAttribute('aria-describedby', errorId);
    });

    test('does not display error when error is undefined', () => {
      renderWithI18n(<OrgSelector {...defaultProps} error={undefined} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('does not display error when error is null', () => {
      renderWithI18n(<OrgSelector {...defaultProps} error={null} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('input has is-invalid class when error is present', () => {
      renderWithI18n(
        <OrgSelector {...defaultProps} error="Error" testId="invalid-input" />,
      );

      const input = screen.getByTestId('invalid-input');
      expect(input).toHaveClass('is-invalid');
    });
  });

  describe('Accessibility', () => {
    test('input has proper id', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('id');
      expect(input.getAttribute('id')).toBeTruthy();
    });

    test('label is associated with input element', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      const labeledInput = screen.getByLabelText(/organization/i);

      expect(labeledInput).toBe(input);
    });

    test('input has proper ARIA attributes', () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-controls');
      expect(input.getAttribute('aria-controls')).toBeTruthy();
    });

    test('dropdown has proper role and id', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        const dropdown = screen.getByRole('listbox');
        const input = screen.getByRole('combobox');
        const controlsId = input.getAttribute('aria-controls');
        expect(dropdown).toHaveAttribute('id', controlsId);
      });
    });

    test('option elements have proper tabIndex for focusability', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      const option = screen.getByTestId('org-option-org1');
      expect(option).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty options array gracefully', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} options={[]} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(
          screen.getByText(/no organizations available/i),
        ).toBeInTheDocument();
      });
    });

    test('handles single organization option', async () => {
      const singleOrg = [{ _id: 'org1', name: 'Only Organization' }];
      renderWithI18n(<OrgSelector {...defaultProps} options={singleOrg} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Only Organization')).toBeInTheDocument();
      });
    });

    test('handles organizations with special characters in names', async () => {
      const specialOrgs = [
        { _id: 'org1', name: "O'Reilly & Associates" },
        { _id: 'org2', name: 'Org <Test>' },
      ];
      renderWithI18n(<OrgSelector {...defaultProps} options={specialOrgs} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText("O'Reilly & Associates")).toBeInTheDocument();
        expect(screen.getByText('Org <Test>')).toBeInTheDocument();
      });
    });
  });

  describe('Coverage Boundary Cases', () => {
    test('does not increment index beyond list length on ArrowDown', async () => {
      renderWithI18n(
        <OrgSelector
          {...defaultProps}
          options={mockOrganizations.slice(0, 1)}
        />,
      );
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      // Press ArrowDown twice on a list of 1 item
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(defaultProps.onChange).toHaveBeenCalledWith('org1');
    });

    test('resets highlight to -1 when pressing ArrowUp at the start', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      // ArrowDown once (+1), then ArrowUp once (-1)
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onChange).not.toHaveBeenCalled();
    });

    test('does nothing when Enter is pressed with no highlighted index', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);
      const input = screen.getByRole('combobox');

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onChange).not.toHaveBeenCalled();
    });

    test('highlights the currently selected organization in the list', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} value="org2" />);
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        const selectedOption = screen.getByTestId('org-option-org2');
        expect(selectedOption).toHaveClass(styles.orgSelectorOptionSelected);
      });
    });

    test('does not call onChange when an unknown key is pressed on an option', async () => {
      const onChange = vi.fn();
      renderWithI18n(<OrgSelector {...defaultProps} onChange={onChange} />);
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      const option = screen.getByTestId('org-option-org1');
      fireEvent.keyDown(option, { key: 'Tab' }); // Tab is not Enter or Space

      expect(onChange).not.toHaveBeenCalled();
    });

    test('does not handle keydown when disabled', () => {
      const onChange = vi.fn();
      renderWithI18n(
        <OrgSelector {...defaultProps} disabled onChange={onChange} />,
      );
      const input = screen.getByRole('combobox');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      // Dropdown should not open, highlighted index should not change
      expect(
        screen.queryByTestId('org-selector-dropdown'),
      ).not.toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    test('does not close dropdown when clicking inside the component', async () => {
      renderWithI18n(<OrgSelector {...defaultProps} />);

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });

      // Click inside the component (e.g., on the input)
      fireEvent.mouseDown(input);

      await waitFor(() => {
        expect(screen.getByTestId('org-selector-dropdown')).toBeInTheDocument();
      });
    });
  });
});
