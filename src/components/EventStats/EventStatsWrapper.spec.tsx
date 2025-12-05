import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStatsWrapper } from './EventStatsWrapper';
import { BrowserRouter } from 'react-router';
import { mockData } from './EventStatsMocks';
import { vi, describe, expect, it, afterEach } from 'vitest';

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

    // Verify initial state - modal should not be visible
    expect(queryByText('Event Statistics')).not.toBeInTheDocument();

    // Open the modal
    const button = queryByText('View Event Statistics') as Element;
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );

    // Close the modal using close button
    const closeButton = queryByRole('button', { name: /close/i }) as Element;
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);

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
    const buttonText = getByText('View Event Statistics');
    expect(buttonText).toBeInTheDocument();

    const button = getByLabelText('checkInRegistrants');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-light', 'text-secondary');
    expect(button.tagName).toBe('BUTTON');

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
    const openButton = getByText('View Event Statistics');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(queryByText('Event Statistics')).toBeInTheDocument();
    });

    // Verify the modal is actually open
    const modalContent = queryByText('Event Statistics');
    expect(modalContent).toBeVisible();

    // Close the modal before rerendering
    const closeButton =
      queryByText('×') || document.querySelector('[aria-label*="close"]');
    if (closeButton) {
      fireEvent.click(closeButton as Element);
      await waitFor(() => {
        expect(queryByText('Event Statistics')).not.toBeInTheDocument();
      });
    }

    // Test with empty _id to verify fallback key works - only check rendering, don't open modal
    rerender(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper _id="" />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Button should still render with empty _id
    const buttonAfterRerender = getByText('View Event Statistics');
    expect(buttonAfterRerender).toBeInTheDocument();
    expect(buttonAfterRerender).toBeEnabled();
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
    const button = getByText('View Event Statistics');
    fireEvent.click(button);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );

    let closeButton = queryByRole('button', { name: /close/i }) as Element;
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );

    // Cycle 2: Open and close again
    fireEvent.click(button);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );

    closeButton = queryByRole('button', { name: /close/i }) as Element;
    fireEvent.click(closeButton);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );

    // Cycle 3: One more cycle to ensure consistency
    fireEvent.click(button);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );

    // Verify button still works after multiple cycles
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('Should handle modal state changes correctly', async () => {
    const { getByText, queryByText, queryByRole } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open modal
    const button = getByText('View Event Statistics');
    fireEvent.click(button);

    // Verify modal opened with correct content
    await waitFor(() => {
      const modal = queryByText('Event Statistics');
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();
    });

    // Verify close button is present and functional
    const closeButton = queryByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    // Close and verify state change
    fireEvent.click(closeButton as Element);

    await waitFor(() => {
      expect(queryByText('Event Statistics')).not.toBeInTheDocument();
    });
  });

  it('Should render with correct component structure', () => {
    const { container, getByLabelText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify button exists
    const button = getByLabelText('checkInRegistrants');
    expect(button).toBeInTheDocument();

    // Verify button parent structure
    expect(button.parentElement).toBeInTheDocument();

    const iconWrapper = container.querySelector('[class*="iconWrapper"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('Should handle prop changes correctly', () => {
    const { rerender, getByText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify initial render
    expect(getByText('View Event Statistics')).toBeInTheDocument();

    // Rerender with different _id - only verify button renders, don't open modal
    rerender(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper _id="differentId" />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify component still renders correctly
    expect(getByText('View Event Statistics')).toBeInTheDocument();

    // Rerender back to original _id
    rerender(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Component should still render
    expect(getByText('View Event Statistics')).toBeInTheDocument();
  });
});
