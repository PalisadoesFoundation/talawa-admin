import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgContriCards from './OrgContriCards';

describe('Testing the Organization Contributions Cards', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <OrgContriCards
        id="624135625"
        key=""
        userName="Yasharth Dubey"
        contriDate="06/07/2008"
        contriAmount="100"
        contriTransactionId="ER23DV90"
        userEmail="saumya4799@gmail.com"
      />
    );
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('Yasharth Dubey')).toBeInTheDocument();
    expect(screen.getByText('06/07/2008')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('ER23DV90')).toBeInTheDocument();
    expect(screen.getByText('saumya4799@gmail.com')).toBeInTheDocument();
  });
});
