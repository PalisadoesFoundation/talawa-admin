import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCard from './OrganizationCard';

describe('Testing the Organization Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <OrganizationCard
        id="624135624625"
        key="5"
        image=""
        firstName="John"
        lastName="Doe"
        name="organization"
      />
    );
    expect(screen.getByText('organization')).toBeInTheDocument();
    expect(screen.getByText('Owner:')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
  });
});
