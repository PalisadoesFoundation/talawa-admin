import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import HolidayCard from './HolidayCard';

// Mock styles for testing
vi.mock('./../../style/app.module.css', () => ({
  default: {},
  holidayCard: 'holidayCard',
}));

describe('HolidayCard Component', () => {
  it('renders correctly with the given holiday name', () => {
    const holidayName = 'Christmas';

    render(<HolidayCard holidayName={holidayName} />);

    // Assert that the holiday name is displayed
    const cardElement = screen.getByText(holidayName);
    expect(cardElement).toBeInTheDocument();
  });
});
