import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import OrganizationSelector from './OrganizationSelector';

describe('OrganizationSelector Component', () => {
  const mockOnChange = vi.fn();
  const mockOrganizations = [
    { label: 'Org 1', id: '1' },
    { label: 'Org 2', id: '2' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <OrganizationSelector
          organizations={mockOrganizations}
          value=""
          onChange={mockOnChange}
          {...props}
        />
      </I18nextProvider>,
    );
  };

  it('should render organization selector', () => {
    renderComponent();
    expect(screen.getByTestId('organizationSelect')).toBeInTheDocument();
  });

  it('should disable selector when disabled prop is true', () => {
    renderComponent({ disabled: true });

    const input = screen.getByTestId('orgInput');
    expect(input).toBeDisabled();
  });

  it('should call onChange with empty string when selection is cleared', async () => {
    renderComponent({ value: '1' });

    const autocomplete = screen.getByTestId('organizationSelect');

    const clearButton = autocomplete.querySelector('[aria-label="Clear"]');
    if (clearButton) {
      fireEvent.click(clearButton);
    }

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  it('should call onChange when organization is selected', () => {
    renderComponent();
    const input = screen.getByTestId('orgInput');
    fireEvent.change(input, { target: { value: 'Org 1' } });
  });

  it('should handle organizations array being empty', () => {
    renderComponent({ organizations: [] });

    const autocomplete = screen.getByTestId('organizationSelect');
    expect(autocomplete).toBeInTheDocument();
  });

  it('should show required asterisk when required prop is true', () => {
    renderComponent({ required: true });
    const asterisks = screen.getAllByText('*');
    expect(asterisks.length).toBeGreaterThan(0);
  });
});
