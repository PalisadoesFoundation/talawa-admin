import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GeneralSettings from './GeneralSettings';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

/**
 * Interface for OrgUpdate component props.
 */
interface InterfaceOrgUpdateProps {
  orgId: string;
}

vi.mock('./DeleteOrg/DeleteOrg', () => ({
  default: () => <div data-testid="delete-org">DeleteOrg</div>,
}));

vi.mock('./OrgUpdate/OrgUpdate', () => ({
  default: ({ orgId }: InterfaceOrgUpdateProps) => (
    <div data-testid="org-update">OrgUpdate - {orgId}</div>
  ),
}));

vi.mock('components/ChangeLanguageDropdown/ChangeLanguageDropDown', () => ({
  default: () => (
    <div data-testid="change-language">ChangeLanguageDropDown</div>
  ),
}));

describe('GeneralSettings Component', () => {
  const ORG_ID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders organization update section', () => {
    expect(screen.getByTestId('org-update')).toHaveTextContent(
      `OrgUpdate - ${ORG_ID}`,
    );
  });

  it('renders delete organization section', () => {
    expect(screen.getByTestId('delete-org')).toBeInTheDocument();
  });

  it('renders cards with correct styling classes', () => {
    const { container } = render(
      <I18nextProvider i18n={i18nForTest}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );

    const cards = container.getElementsByClassName('card');
    expect(cards.length).toBeGreaterThan(0);

    Array.from(cards).forEach((card) => {
      expect(card).toHaveClass(
        'rounded-4',
        'shadow-sm',
        'border',
        'border-light-subtle',
      );
    });
  });

  it('renders all components in correct order', () => {
    const { getAllByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <GeneralSettings orgId={ORG_ID} />
      </I18nextProvider>,
    );

    const elements = getAllByTestId(/org-update|delete-org/);
    expect(elements).toHaveLength(4);
    expect(elements[0]).toHaveAttribute('data-testid', 'org-update');
    expect(elements[1]).toHaveAttribute('data-testid', 'delete-org');
  });

  describe('Error Handling', () => {
    const renderComponent = (
      props = { orgId: ORG_ID },
    ): ReturnType<typeof render> =>
      render(
        <I18nextProvider i18n={i18nForTest}>
          <GeneralSettings {...props} />
        </I18nextProvider>,
      );

    it('renders with empty orgId', () => {
      expect(() => renderComponent({ orgId: '' })).not.toThrow();
    });

    it('renders with undefined orgId', () => {
      expect(() =>
        renderComponent({ orgId: undefined as unknown as string }),
      ).not.toThrow();
    });
  });

  describe('i18n Integration', () => {
    it('renders with different language settings', async () => {
      await act(async () => {
        await i18nForTest.changeLanguage('es');
      });

      render(
        <I18nextProvider i18n={i18nForTest}>
          <GeneralSettings orgId={ORG_ID} />
        </I18nextProvider>,
      );

      await act(async () => {
        await i18nForTest.changeLanguage('en');
      });
    });
  });
});
