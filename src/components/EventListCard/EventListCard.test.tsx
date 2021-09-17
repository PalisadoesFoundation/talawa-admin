import React from 'react';
import { render, screen } from '@testing-library/react';
import EventListCard from './EventListCard';

describe('Testing the Event List Page', () => {
  test('should show the text on the website', () => {
    render(
      <EventListCard
        key="123"
        id=""
        eventLocation=""
        eventName=""
        totalAdmin=""
        totalMember=""
        eventImage=""
        regDate=""
        regDays=""
      />
    );
    expect(screen.getByText('Admin:')).toBeInTheDocument();
    expect(screen.getByText('Member:')).toBeInTheDocument();
  });
});
