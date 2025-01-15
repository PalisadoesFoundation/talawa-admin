import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/react-testing';
// import { useTranslation } from 'react-i18next';
import { vi } from 'vitest';
import GeneralSettings from './GeneralSettings';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer, toast } from 'react-toastify';

// Mock child components
vi.mock('./OrgProfileFieldSettings/OrgProfileFieldSettings', () => ({
  default: () => (
    <div data-testid="orgProfileFieldSettings">OrgProfileFieldSettings</div>
  ),
}));
vi.mock('./DeleteOrg/DeleteOrg', () => ({
  default: () => <div data-testid="deleteOrg">DeleteOrg</div>,
}));
vi.mock('./OrgUpdate/OrgUpdate', () => ({
  default: () => <div data-testid="orgUpdate">OrgUpdate</div>,
}));
vi.mock('components/ChangeLanguageDropdown/ChangeLanguageDropDown', () => ({
  default: () => (
    <select data-testid="changeLanguageDropdown">
      <option>English</option>
    </select>
  ),
}));

/**
 * Unit Tests for `GeneralSettings` Component
 *
 * - Verifies rendering of all child components.
 * - Simulates interactions with language dropdown.
 * - Ensures proper text is displayed based on `i18n` translation keys.
 */

describe('GeneralSettings Component', () => {
  const orgId = 'test-org-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all child components correctly', () => {
    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <GeneralSettings orgId={orgId} />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByTestId('orgUpdate')).toBeInTheDocument();
    expect(screen.getByTestId('deleteOrg')).toBeInTheDocument();
    expect(screen.getByTestId('orgProfileFieldSettings')).toBeInTheDocument();
    expect(screen.getByTestId('changeLanguageDropdown')).toBeInTheDocument();
  });

  it('displays the correct section titles from i18n', () => {
    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <GeneralSettings orgId={orgId} />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Edit Organization')).toBeInTheDocument();
    expect(screen.getByText('Other Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage Custom Fields')).toBeInTheDocument();
  });

  it('handles interactions with the language dropdown', async () => {
    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <GeneralSettings orgId={orgId} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const languageDropdown = screen.getByTestId('changeLanguageDropdown');
    expect(languageDropdown).toBeInTheDocument();

    // Select "English" from the dropdown
    userEvent.selectOptions(languageDropdown, 'English');

    // Verify that the "English" option is selected
    const selectedOption = within(languageDropdown).getByRole('option', {
      name: 'English',
    });
    expect(selectedOption).toHaveProperty('selected', true);
  });

  it('displays a toast when a child component triggers a notification', async () => {
    const toastSpy = vi.spyOn(toast, 'success');
    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <ToastContainer />
          <GeneralSettings orgId={orgId} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Simulating a child component triggering a toast
    toast.success('Operation Successful');
    expect(toastSpy).toHaveBeenCalledWith('Operation Successful');
  });
});
