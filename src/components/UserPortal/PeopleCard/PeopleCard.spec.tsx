import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import PeopleCard, { InterfacePeopleCardProps } from './PeopleCard';

const baseProps: InterfacePeopleCardProps = {
  id: '1',
  name: 'First Last',
  image: '',
  email: 'first@last.com',
  role: 'Admin',
  sno: '1',
};

describe('PeopleCard [User Portal]', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all person details correctly when image is not provided', () => {
    render(<PeopleCard {...baseProps} />);

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
    render(<PeopleCard {...baseProps} image="http://example.com/avatar.png" />);

    const img = screen.getByTestId('people-1-image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('avatar.png');
  });
});
