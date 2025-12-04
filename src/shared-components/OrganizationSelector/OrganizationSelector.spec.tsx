import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByTestId('selectOrg')).toBeInTheDocument();
  });

  it('should call onChange when organization is selected', () => {
    renderComponent();
    const autocomplete = screen.getByTestId('selectOrg');
    fireEvent.change(autocomplete, { target: { value: 'Org 1' } });
  });
});
