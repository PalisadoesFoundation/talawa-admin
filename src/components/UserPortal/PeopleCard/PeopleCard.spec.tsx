import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

import type { InterfacePeopleCardProps } from 'types/UserPortal/PeopleCard/interface';
import PeopleCard from './PeopleCard';

import {
  TEST_ID_PEOPLE_CARD,
  TEST_ID_PEOPLE_SNO,
  TEST_ID_PEOPLE_NAME,
  TEST_ID_PEOPLE_EMAIL,
  TEST_ID_PEOPLE_ROLE,
  TEST_ID_PEOPLE_IMAGE,
} from 'Constant/common';

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

    expect(screen.getByTestId(TEST_ID_PEOPLE_CARD('1'))).toBeInTheDocument();
    expect(screen.getByTestId(TEST_ID_PEOPLE_SNO('1'))).toHaveTextContent('1');
    expect(screen.getByTestId(TEST_ID_PEOPLE_NAME('1'))).toHaveTextContent(
      'First Last',
    );
    expect(screen.getByTestId(TEST_ID_PEOPLE_EMAIL('1'))).toHaveTextContent(
      'first@last.com',
    );
    expect(screen.getByTestId(TEST_ID_PEOPLE_ROLE('1'))).toHaveTextContent(
      'Admin',
    );

    // Avatar fallback should be used
    expect(
      screen.queryByTestId(TEST_ID_PEOPLE_IMAGE('1')),
    ).not.toBeInTheDocument();
  });

  it('renders provided image with correct src when image is passed', () => {
    renderComponent({
      ...baseProps,
      image: 'http://example.com/avatar.png',
    });

    const img = screen.getByTestId(
      TEST_ID_PEOPLE_IMAGE('1'),
    ) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('avatar.png');
  });
});
