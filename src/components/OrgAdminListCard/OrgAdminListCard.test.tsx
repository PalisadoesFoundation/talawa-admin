import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminListCard from './OrgAdminListCard';

describe('Testing the Organization Admin List Page', () => {
  test('should show the text on the website', () => {
    render(
      <OrgAdminListCard
        key="123"
        id=""
        memberName=""
        memberLocation=""
        joinDate=""
        memberImage=""
      />
    );
    expect(screen.getByText('Joined:')).toBeInTheDocument();
  });
});
