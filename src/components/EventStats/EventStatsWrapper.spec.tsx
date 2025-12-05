import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStatsWrapper } from './EventStatsWrapper';
import { BrowserRouter } from 'react-router';
import { mockData } from './EventStatsMocks';
import { vi, describe, expect, it } from 'vitest';

vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: () => <div data-testid="mocked-pie-chart">Test</div>,
  pieArcClasses: { faded: 'faded-class' },
  pieArcLabelClasses: { root: 'label-root-class', faded: 'label-faded-class' },
}));

describe('Testing Event Stats Wrapper', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const props = {
    _id: 'eventStats123',
  };

  it('The button to open and close the modal should work properly', async () => {
    const { queryByText, queryByRole } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open the modal
    fireEvent.click(queryByText('View Event Statistics') as Element);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );

    // Close the modal
    fireEvent.click(queryByRole('button', { name: /close/i }) as Element);
    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );
  });

  it('Should render button with correct attributes, classes and icon wrapper', () => {
    const { getByText, getByLabelText, container } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Check button text and aria-label
    expect(getByText('View Event Statistics')).toBeInTheDocument();
    const button = getByLabelText('checkInRegistrants');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-light', 'text-secondary');

    // Verify icon wrapper exists
    const iconWrapper = container.querySelector('[class*="iconWrapper"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('Should pass correct props to EventStats and handle empty _id', async () => {
    const { getByText, queryByText, rerender } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Initially EventStats should not be visible (show=false)
    expect(queryByText('Event Statistics')).not.toBeInTheDocument();

    // Open modal to verify eventId prop is passed
    fireEvent.click(getByText('View Event Statistics'));
    await waitFor(() => {
      expect(queryByText('Event Statistics')).toBeInTheDocument();
    });

    // Test with empty _id to verify fallback key works
    rerender(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper _id="" />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Button should still be clickable with empty _id
    expect(getByText('View Event Statistics')).toBeInTheDocument();
  });

  it('Should maintain state consistency through multiple open/close cycles', async () => {
    const { queryByText, queryByRole, getByText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Cycle 1: Open and close
    fireEvent.click(getByText('View Event Statistics'));
    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );
    fireEvent.click(queryByRole('button', { name: /close/i }) as Element);
    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );

    // Cycle 2: Open and close again
    fireEvent.click(getByText('View Event Statistics'));
    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );
    fireEvent.click(queryByRole('button', { name: /close/i }) as Element);
    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );

    // Verify button still works after multiple cycles
    expect(getByText('View Event Statistics')).toBeInTheDocument();
  });
});
