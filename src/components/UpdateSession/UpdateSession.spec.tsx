import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  act,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import UpdateTimeout from './UpdateSession';

import i18n from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { UPDATE_SESSION_TIMEOUT_PG } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

const MOCKS = [
  {
    request: {
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
    },
    result: {
      data: {
        community: {
          inactivityTimeoutDuration: 1800,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_SESSION_TIMEOUT_PG,
      variables: {
        inactivityTimeoutDuration: 1800,
      },
    },
    result: {
      data: {
        updateCommunity: {
          community: {
            inactivityTimeoutDuration: 1800,
          },
        },
      },
    },
  },
];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

describe('Testing UpdateTimeout Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should handle minimum slider value correctly', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateTimeout onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const slider = await screen.findByTestId('slider-thumb');

    // Simulate dragging to minimum value
    fireEvent.mouseDown(slider, { clientX: -999 }); // Adjust the clientX to simulate different slider positions
    fireEvent.mouseUp(slider);

    expect(mockOnValueChange).toHaveBeenCalledWith(15); // Adjust based on slider min value
  });

  it('Should handle maximum slider value correctly', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateTimeout onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const slider = await screen.findByTestId('slider-thumb');

    // Simulate dragging to maximum value
    fireEvent.mouseDown(slider, { clientX: 999 }); // Adjust the clientX to simulate different slider positions
    fireEvent.mouseUp(slider);

    expect(mockOnValueChange).toHaveBeenCalledWith(60); // Adjust based on slider max value
  });

  it('Should not update value if an invalid value is passed', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateTimeout onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const slider = await screen.findByTestId('slider-thumb');

    // Simulate invalid value handling
    fireEvent.mouseDown(slider, { clientX: 0 }); // Adjust the clientX to simulate different slider positions
    fireEvent.mouseUp(slider);

    // Ensure onValueChange is not called with invalid values
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('Should update slider value on user interaction', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateTimeout onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    // Wait for the slider to be present
    const slider = await screen.findByTestId('slider-thumb');

    fireEvent.mouseDown(slider, { clientX: 45 }); // Adjust the clientX to simulate different slider positions
    fireEvent.mouseUp(slider);

    // Assert that the callback was triggered
    await waitFor(
      () => {
        expect(mockOnValueChange).toHaveBeenCalledWith(expect.any(Number));
      },
      { timeout: 1000 },
    );
  });

  it('Components should render properly', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Use getAllByText to get all elements with "Update Timeout" text
    const updateTimeoutElements = screen.getAllByText(/Update Timeout/i);
    expect(updateTimeoutElements).toHaveLength(1); // Check if there are exactly 2 elements with this text

    expect(screen.getByText(/Current Timeout/i)).toBeInTheDocument();
    expect(screen.getByText(/15 min/i)).toBeInTheDocument();

    // Locate the parent element first
    const sliderLabelsContainer = screen.getByTestId('slider-labels');

    // Use within to query inside the parent element
    const sliderLabels = within(sliderLabelsContainer);

    // Check for the specific text within the parent element
    expect(sliderLabels.getByText('30 min')).toBeInTheDocument();

    expect(screen.getByText(/45 min/i)).toBeInTheDocument();
    expect(screen.getByText(/60 min/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();
  });

  it('Should update session timeout', async () => {
    const user = userEvent.setup();

    const toastSpy = vi.spyOn(NotificationToast, 'success');

    const { container } = render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the initial query to complete
    await waitFor(
      () => {
        expect(screen.getByTestId('timeout-value')).toHaveTextContent(
          '30 minutes',
        );
      },
      { timeout: 3000 },
    );

    // Get the form using querySelector
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    // Get and verify submit button
    const submitButton = screen.getByTestId('update-button');
    expect(submitButton).toBeInTheDocument();

    // Click the button and submit the form
    await user.click(submitButton);
    if (form) {
      // Perform actions on the form
      fireEvent.submit(form);
    }

    // Wait for the mutation and toast
    await waitFor(
      () => {
        expect(toastSpy).toHaveBeenCalledWith(
          expect.stringContaining('Successfully updated the Profile Details.'),
        );
      },
      { timeout: 3000 },
    );

    // Verify toast was called once
    expect(toastSpy).toHaveBeenCalledTimes(1);
  });

  it('Should handle query errors', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(errorHandler).toHaveBeenCalled();
  });

  it('Should handle update errors', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 1800,
            },
          },
        },
      },
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
        },
        result: {
          data: {
            community: null,
          },
        },
      },
      {
        request: {
          query: UPDATE_SESSION_TIMEOUT_PG,
          variables: { timeout: 30 },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const submitButton = screen.getByTestId('update-button');
    await userEvent.click(submitButton);

    await wait();

    expect(errorHandler).toHaveBeenCalled();
  });

  it('Should handle null community object gracefully', async () => {
    render(
      <MockedProvider mocks={[MOCKS[1]]}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Assertions to verify the component handles null community object correctly
    // Use getAllByText to get all elements with "Update Timeout" text
    const updateTimeoutElements = screen.getAllByText(/Update Timeout/i);
    expect(updateTimeoutElements).toHaveLength(1); // Check if there are exactly 2 elements with this text

    expect(screen.getByText(/Current Timeout/i)).toBeInTheDocument();

    // Locate the parent element first
    const sliderLabelsContainer = screen.getByTestId('slider-labels');

    // Use within to query inside the parent element
    const sliderLabels = within(sliderLabelsContainer);

    // Check for the specific text within the parent element
    expect(sliderLabels.getByText('15 min')).toBeInTheDocument();

    expect(screen.getByText(/30 min/i)).toBeInTheDocument();
    expect(screen.getByText(/45 min/i)).toBeInTheDocument();
    expect(screen.getByText(/60 min/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();

    // Check if the component displays a default value or handles the null state appropriately
    expect(screen.getByText(/No timeout set/i)).toBeInTheDocument();
  });
});
