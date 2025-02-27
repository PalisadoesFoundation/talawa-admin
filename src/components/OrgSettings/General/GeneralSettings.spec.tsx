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

  test('renders cards with correct styling classes', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );

    const cards = container.getElementsByClassName('card');
    Array.from(cards).forEach((card) => {
      expect(card).toHaveClass(
        'rounded-4',
        'mb-4',
        'shadow-sm',
        'border',
        'border-light-subtle',
      );
    });
  });

  test('renders all components in correct order', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );

    const elements = screen.getAllByTestId(
      /org-update|delete-org|change-language|org-profile-settings/,
    );
    expect(elements[0]).toHaveAttribute('data-testid', 'org-update');
    expect(elements[1]).toHaveAttribute('data-testid', 'delete-org');
    expect(elements[2]).toHaveAttribute('data-testid', 'change-language');
  });
});

describe('Error Handling', () => {
  const ORG_ID = '123e4567-e89b-12d3-a456-426614174000';

  const renderComponent = (
    props = { orgId: ORG_ID },
  ): ReturnType<typeof render> =>
    render(
      <I18nextProvider i18n={i18n}>
        <GeneralSettings {...props} />
      </I18nextProvider>,
    );

  test('renders with empty orgId', () => {
    expect(() => renderComponent({ orgId: '' })).not.toThrow();
  });

  test('renders with undefined orgId', () => {
    expect(() =>
      renderComponent({ orgId: undefined as unknown as string }),
    ).not.toThrow();
  });
});

describe('Props Handling', () => {
  test('passes correct props to child components', () => {
    const customOrgId = '123e4567-e89b-12d3-a456-426614174001';
    render(
      <I18nextProvider i18n={i18n}>
        <GeneralSettings orgId={customOrgId} />
      </I18nextProvider>,
    );
    expect(screen.getByTestId('org-update')).toHaveTextContent(
      `OrgUpdate - ${customOrgId}`,
    );
  });
});

describe('i18n Integration', () => {
  const ORG_ID = '123e4567-e89b-12d3-a456-426614174000';
  test('renders with different language settings', () => {
    i18n.changeLanguage('es');
    render(
      <I18nextProvider i18n={i18n}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );
    i18n.changeLanguage('en');
  });
});
