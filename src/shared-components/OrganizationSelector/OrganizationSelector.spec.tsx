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
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Clear'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  it('should call onChange when organization is selected', () => {
    renderComponent();
    const input = screen.getByTestId('orgInput');
    fireEvent.change(input, { target: { value: 'Org 1' } });
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should handle organizations array being empty', () => {
    renderComponent({ organizations: [] });

    const autocomplete = screen.getByTestId('organizationSelect');
    expect(autocomplete).toBeInTheDocument();

    const input = screen.getByTestId('orgInput');
    fireEvent.click(input);
    const noOptionsText = screen.queryByText(/no options/i);
    expect(noOptionsText).toBeInTheDocument();
  });

  it('should mark the organization selector as required when required prop is true', () => {
    renderComponent({ required: true });
    const input = screen.getByTestId('orgInput');
    expect(input).toBeRequired();
  });

  it('should display the selected organization when value prop is provided', () => {
    renderComponent({ value: '1' });
    const input = screen.getByTestId('orgInput') as HTMLInputElement;
    expect(input.value).toBe('Org 1');
  });

  it('should render all organizations as options', () => {
    renderComponent();

    const input = screen.getByTestId('orgInput');
    fireEvent.click(input);

    expect(screen.getByText('Org 1')).toBeInTheDocument();
    expect(screen.getByText('Org 2')).toBeInTheDocument();
  });

  it('should handle invalid value gracefully', () => {
    renderComponent({ value: '999' });

    const input = screen.getByTestId('orgInput') as HTMLInputElement;

    expect(input.value).toBe('');
  });
});
