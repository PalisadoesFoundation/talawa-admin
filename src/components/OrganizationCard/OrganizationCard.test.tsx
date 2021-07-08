import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCard from './OrganizationCard';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(
      <OrganizationCard
        key="5"
        image=""
        firstName="yasharth"
        lastName="dubey"
        name="organization"
      />
    );
    expect(screen.getByText('Owner:yasharth dubey')).toBeInTheDocument();
    expect(screen.getByText('organization')).toBeInTheDocument();
  });
});
