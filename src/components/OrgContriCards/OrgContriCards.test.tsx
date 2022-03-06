import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgContriCards from './OrgContriCards';

describe('Testing the Organization Contributions Cards', () => {
  it('should render props and text elements test for the page component', () => {
    render(
      <OrgContriCards
        id="784513962"
        key="unique"
        userName="John Doe"
        contriDate="06/03/2022"
        contriAmount="500"
        contriTransactionId="QW56DA88"
        userEmail="johndoe@gmail.com"
      />
    );
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('06/03/2022')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('QW56DA88')).toBeInTheDocument();
    expect(screen.getByText('johndoe@gmail.com')).toBeInTheDocument();
  });
});
