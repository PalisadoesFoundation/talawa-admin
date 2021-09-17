import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCard from './OrganizationCard';

describe('Testing the Organization Card', () => {
  test('should show the text on the website', () => {
    render(
      <OrganizationCard
        id="624135624625"
        key="5"
        image=""
        firstName=""
        lastName=""
        name="organization"
      />
    );
    expect(screen.getByText('organization')).toBeInTheDocument();
    expect(screen.getByText('Owner:')).toBeInTheDocument();
  });
});
