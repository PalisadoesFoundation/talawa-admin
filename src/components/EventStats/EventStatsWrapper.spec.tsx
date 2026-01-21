import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      tCommon: (key: string) => key,
      tErrors: (key: string) => key,
    }),
  };
});

describe('Testing Event Stats Wrapper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const props = {
    _id: 'eventStats123',
  };

  it('The button to open and close the modal should work properly', async () => {
    const user = userEvent.setup();
    const { getAllByText, queryByText, queryByRole } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify initial state - modal should not be visible
    expect(document.querySelector('.modal-title')).toBeNull();

    // Open the modal
    const button = queryByText('viewEventStatistics') as Element;
    expect(button).toBeInTheDocument();
    await user.click(button);

    // After opening, multiple elements with "title" exist (modal title and review section)
    await waitFor(() => {
      const titleElements = getAllByText('title');
      expect(titleElements.length).toBeGreaterThan(0);
    });

    // Close the modal using close button
    const closeButton = queryByRole('button', { name: /close/i }) as Element;
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);

    // After closing, modal title should not be in the document
    await waitFor(() =>
      expect(document.querySelector('.modal-title')).not.toBeInTheDocument(),
    );
  });

  it('Should render button with correct attributes, classes and icon wrapper', () => {
    const { getByText, getByLabelText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Check button text and aria-label
    const buttonText = getByText('viewEventStatistics');
    expect(buttonText).toBeInTheDocument();

    const button = getByLabelText('viewEventStatistics');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-light', 'text-secondary');
    expect(button.tagName).toBe('BUTTON');

    const iconWrapper = document.querySelector('[class*="iconWrapper"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('Should pass correct props to EventStats and handle empty _id', async () => {
    const user = userEvent.setup();
    const { getByText, getAllByText, rerender, queryByRole } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Initially EventStats should not be visible (show=false)
    expect(document.querySelector('.modal-title')).toBeNull();

    // Open modal to verify eventId prop is passed
    const openButton = getByText('viewEventStatistics');
    await user.click(openButton);

    await waitFor(() => {
      const titleElements = getAllByText('title');
      expect(titleElements.length).toBeGreaterThan(0);
      const modalTitle = document.querySelector('.modal-title');
      expect(modalTitle).not.toBeNull();
      expect(modalTitle).toBeVisible();
    });

    // Close the modal before rerendering
    const closeButton = queryByRole('button', { name: /close/i });
    if (closeButton) {
      await user.click(closeButton as Element);
      await waitFor(() => {
        expect(document.querySelector('.modal-title')).toBeNull();
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
    const buttonAfterRerender = getByText('viewEventStatistics');
    expect(buttonAfterRerender).toBeInTheDocument();
    expect(buttonAfterRerender).toBeEnabled();
  });

  it('Should maintain state consistency through multiple open/close cycles', async () => {
    const user = userEvent.setup();
    const { getAllByText, queryByRole, getByText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Cycle 1: Open and close
    const button = getByText('viewEventStatistics');
    await user.click(button);

    await waitFor(() => {
      const titleElements = getAllByText('title');
      expect(titleElements.length).toBeGreaterThan(0);
    });

    let closeButton = queryByRole('button', { name: /close/i }) as Element;
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);

    await waitFor(() =>
      expect(document.querySelector('.modal-title')).not.toBeInTheDocument(),
    );

    // Cycle 2: Open and close again
    await user.click(button);

    await waitFor(() => {
      const titleElements = getAllByText('title');
      expect(titleElements.length).toBeGreaterThan(0);
    });

    closeButton = queryByRole('button', { name: /close/i }) as Element;
    await user.click(closeButton);

    await waitFor(() =>
      expect(document.querySelector('.modal-title')).not.toBeInTheDocument(),
    );

    // Cycle 3: One more cycle to ensure consistency
    await user.click(button);

    await waitFor(() => {
      const titleElements = getAllByText('title');
      expect(titleElements.length).toBeGreaterThan(0);
    });

    // Verify button still works after multiple cycles
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('Should handle modal state changes correctly', async () => {
    const user = userEvent.setup();
    const { getByText, queryByRole } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open modal
    const button = getByText('viewEventStatistics');
    await user.click(button);

    // Verify modal opened with correct content
    await waitFor(() => {
      const modalTitle = document.querySelector('.modal-title');
      expect(modalTitle).not.toBeNull();
      expect(modalTitle).toHaveTextContent('title');
      expect(modalTitle).toBeVisible();
    });

    // Verify close button is present and functional
    const closeButton = queryByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    // Close and verify state change
    await user.click(closeButton as Element);

    await waitFor(() => {
      // After closing, the modal title should not be in the document
      const modalTitle = document.querySelector('.modal-title');
      expect(modalTitle).toBeNull();
    });
  });

  it('Should render with correct component structure', () => {
    const { getByLabelText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify button exists
    const button = getByLabelText('viewEventStatistics');
    expect(button).toBeInTheDocument();

    // Verify button parent structure
    expect(button.parentElement).toBeInTheDocument();

    const iconWrapper = document.querySelector('[class*="iconWrapper"]');
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
    expect(getByText('viewEventStatistics')).toBeInTheDocument();

    // Rerender with different _id - only verify button renders, don't open modal
    rerender(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper _id="differentId" />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify component still renders correctly
    expect(getByText('viewEventStatistics')).toBeInTheDocument();

    // Rerender back to original _id
    rerender(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Component should still render
    expect(getByText('viewEventStatistics')).toBeInTheDocument();
  });
});
