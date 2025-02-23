import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeneralSettings from './GeneralSettings';
import { vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';

vi.mock('./OrgProfileFieldSettings/OrgProfileFieldSettings', () => ({
  default: () => (
    <div data-testid="org-profile-settings">OrgProfileFieldSettings</div>
  ),
}));

vi.mock('./DeleteOrg/DeleteOrg', () => ({
  default: () => <div data-testid="delete-org">DeleteOrg</div>,
}));

vi.mock('./OrgUpdate/OrgUpdate', () => ({
  default: ({ orgId }: InterfaceOrgUpdateProps) => (
    <div data-testid="org-update">OrgUpdate - {orgId}</div>
  ),
}));

interface InterfaceOrgUpdateProps {
  orgId: string;
}

vi.mock('components/ChangeLanguageDropdown/ChangeLanguageDropDown', () => ({
  default: () => (
    <div data-testid="change-language">ChangeLanguageDropDown</div>
  ),
}));

describe('GeneralSettings Component', () => {
  const ORG_ID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );
  });

  test('renders organization update section', () => {
    expect(screen.getByTestId('org-update')).toHaveTextContent(
      `OrgUpdate - ${ORG_ID}`,
    );
  });

  test('renders delete organization section', () => {
    expect(screen.getByTestId('delete-org')).toBeInTheDocument();
  });

  test('renders language change dropdown', () => {
    expect(screen.getByTestId('change-language')).toBeInTheDocument();
  });

  test('renders organization profile field settings', () => {
    expect(screen.getByTestId('org-profile-settings')).toBeInTheDocument();
  });
});
