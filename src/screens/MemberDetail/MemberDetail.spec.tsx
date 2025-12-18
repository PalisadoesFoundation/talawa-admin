import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

import MemberDetail, { prettyDate, getLanguageName } from './MemberDetail';

/* ------------------------------------------------------------------ */
/* MOCK CHILD COMPONENTS (important for isolation)                     */
/* ------------------------------------------------------------------ */

vi.mock('./UserContactDetails', () => ({
  default: ({ id }: { id?: string }) => (
    <div data-testid="user-contact-details">Contact Details ID: {id}</div>
  ),
}));

vi.mock('components/UserDetails/UserOrganizations', () => ({
  default: () => (
    <div data-testid="user-organizations">Organizations Content</div>
  ),
}));

vi.mock('components/UserDetails/UserEvents', () => ({
  default: () => <div data-testid="user-events">Events Content</div>,
}));

vi.mock('components/UserDetails/UserTags', () => ({
  default: () => <div data-testid="user-tags">Tags Content</div>,
}));

vi.mock('shared-components/PeopleTab/PeopleTabNavbarButton', () => ({
  default: ({
    title,
    isActive,
    action,
  }: {
    title: string;
    isActive: boolean;
    action: () => void;
  }) => (
    <button
      data-testid={`tab-btn-${title}`}
      aria-selected={isActive}
      onClick={action}
    >
      {title}
    </button>
  ),
}));

/* ------------------------------------------------------------------ */
/* TEST WRAPPER                                                       */
/* ------------------------------------------------------------------ */

const renderComponent = (id?: string) =>
  render(
    <BrowserRouter>
      <I18nextProvider i18n={i18nForTest}>
        <MemberDetail id={id} />
      </I18nextProvider>
    </BrowserRouter>,
  );

/* ------------------------------------------------------------------ */
/* TESTS                                                              */
/* ------------------------------------------------------------------ */

describe('MemberDetail Component', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders tab navigation buttons', () => {
    renderComponent('123');

    expect(screen.getByTestId('tab-btn-Overview')).toBeInTheDocument();
    expect(screen.getByTestId('tab-btn-Organizations')).toBeInTheDocument();
    expect(screen.getByTestId('tab-btn-Events')).toBeInTheDocument();
    expect(screen.getByTestId('tab-btn-Tags')).toBeInTheDocument();
  });

  it('renders Overview tab by default', () => {
    renderComponent('abc');

    expect(screen.getByTestId('user-contact-details')).toBeInTheDocument();
    expect(screen.getByText(/Contact Details ID: abc/i)).toBeInTheDocument();
  });

  it('switches to Organizations tab on click', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('tab-btn-Organizations'));

    expect(screen.getByTestId('user-organizations')).toBeInTheDocument();
  });

  it('switches to Events tab on click', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('tab-btn-Events'));

    expect(screen.getByTestId('user-events')).toBeInTheDocument();
  });

  it('switches to Tags tab on click', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('tab-btn-Tags'));

    expect(screen.getByTestId('user-tags')).toBeInTheDocument();
  });

  it('passes id prop correctly to UserContactDetails', () => {
    renderComponent('member-42');

    expect(
      screen.getByText('Contact Details ID: member-42'),
    ).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* UTILITY FUNCTION TESTS                                             */
/* ------------------------------------------------------------------ */

describe('prettyDate', () => {
  it('formats a valid date correctly', () => {
    const result = prettyDate('2023-02-18T09:22:27.969Z');
    expect(result).toBe('18 February 2023');
  });

  it('returns "Unavailable" for invalid date', () => {
    expect(prettyDate('')).toBe('Unavailable');
    expect(prettyDate('invalid-date')).toBe('Unavailable');
  });
});

describe('getLanguageName', () => {
  it('returns correct language name for valid code', () => {
    expect(getLanguageName('en')).toBe('English');
  });

  it('returns "Unavailable" for unknown code', () => {
    expect(getLanguageName('xx')).toBe('Unavailable');
    expect(getLanguageName('')).toBe('Unavailable');
  });
});
