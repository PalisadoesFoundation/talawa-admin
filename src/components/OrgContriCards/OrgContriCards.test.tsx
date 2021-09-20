import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgContriCards from './OrgContriCards';

describe('Testing the Organization Contributions Cards', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <OrgContriCards
        id="624135625"
        key=""
        userName=""
        contriDate=""
        contriAmount=""
        contriTransactionId=""
        userEmail=""
      />
    );
    expect(screen.getByText('Date:')).toBeInTheDocument();
  });
});
