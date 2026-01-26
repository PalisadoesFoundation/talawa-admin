import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

import PeopleCard, { InterfacePeopleCardProps } from './PeopleCard';

const baseProps: InterfacePeopleCardProps = {
  id: '1',
  name: 'First Last',
  image: '',
  email: 'first@last.com',
  role: 'Admin',
  sno: '1',
};

const renderComponent = (props: InterfacePeopleCardProps) =>
  render(
    <I18nextProvider i18n={i18nForTest}>
      <PeopleCard {...props} />
    </I18nextProvider>,
  );

describe('PeopleCard [User Portal]', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all person details correctly when image is not provided', () => {
    renderComponent(baseProps);

    expect(screen.getByTestId('people-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('people-sno-1')).toHaveTextContent('1');
    expect(screen.getByTestId('people-name-1')).toHaveTextContent('First Last');
    expect(screen.getByTestId('people-email-1')).toHaveTextContent(
      'first@last.com',
    );
    expect(screen.getByTestId('people-role-1')).toHaveTextContent('Admin');

    // Avatar fallback should be used
    expect(screen.queryByTestId('people-1-image')).not.toBeInTheDocument();
  });

  it('renders provided image with correct src when image is passed', () => {
    renderComponent({
      ...baseProps,
      image: 'http://example.com/avatar.png',
    });

    const img = screen.getByTestId('people-1-image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('avatar.png');
  });
});
