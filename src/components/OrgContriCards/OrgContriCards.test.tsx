import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgContriCards from './OrgContriCards';

describe('Testing the OrgContriCards', () => {
  test('should show the text on the website', () => {
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
