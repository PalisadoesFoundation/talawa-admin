import React from 'react';
import { render, screen } from '@testing-library/react';
import MemberRequestCard from './MemberRequestCard';

describe('Testing the Member Request Page', () => {
  test('should show the text on the website', () => {
    render(
      <MemberRequestCard
        key="123"
        id=""
        memberName=""
        memberLocation=""
        joinDate=""
        memberImage=""
        email=""
      />
    );
    expect(screen.getByText('Joined:')).toBeInTheDocument();
  });
});
