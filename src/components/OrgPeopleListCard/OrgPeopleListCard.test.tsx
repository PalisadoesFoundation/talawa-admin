import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgPeopleListCard from './OrgPeopleListCard';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(
      <OrgPeopleListCard
        key={124}
        memberImage=""
        joinDate=""
        memberName=""
        memberLocation=""
      />
    );
    expect(screen.getByText('Members:')).toBeInTheDocument();
  });
});
