import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateTimeout from './UpdateSession';
import i18n from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_SESSION_TIMEOUT } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { vi } from 'vitest';
/**
 * This file contains unit tests for the `UpdateSession` component.
 *
 * The tests cover:
 * - Proper rendering of the component with different scenarios, including mock data, null values, and error states.
 * - Handling user interactions with the slider, such as setting minimum, maximum, and intermediate values.
 * - Ensuring callbacks (e.g., `onValueChange`) are triggered correctly based on user input.
 * - Simulating GraphQL query and mutation operations using mocked data to verify correct behavior in successful and error cases.
 * - Testing edge cases, including null community data, invalid input values, and API errors, ensuring the component handles them gracefully.
 * - Verifying proper integration of internationalization, routing, and toast notifications for success or error messages.
 */

const MOCKS = [
  {
    request: {
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
    },
    result: {
      data: {
        getCommunityData: {
          timeout: 30,
        },
      },
    },
  },
  {
    request: {
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
    },
    result: {
      data: {
        getCommunityData: null,
      },
    },
  },
  {
    request: {
      query: UPDATE_SESSION_TIMEOUT,
      variables: {
        timeout: 30,
      },
    },
    result: {
      data: {
        updateSessionTimeout: true,
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
    userEvent.click(slider, {
      // Simulate clicking on the slider to focus
      clientX: -999, // Adjust the clientX to simulate different slider positions
    });

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
    userEvent.click(slider, {
      // Simulate clicking on the slider to focus
      clientX: 999, // Adjust the clientX to simulate different slider positions
    });

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
    userEvent.click(slider, {
      // Simulate clicking on the slider to focus
      clientX: 0, // Adjust the clientX to simulate different slider positions
    });

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

    // Simulate slider interaction
    userEvent.type(slider, '45'); // Simulate typing value

    // Assert that the callback was called with the expected value
    expect(mockOnValueChange).toHaveBeenCalledWith(expect.any(Number)); // Adjust as needed
  });

  it('Components should render properly', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
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
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const submitButton = screen.getByTestId('update-button');
    userEvent.click(submitButton);

    // Wait for the toast success call

    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Successfully updated the Profile Details.'),
    );
  });

  it('Should handle query errors', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
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
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
        },
        result: {
          data: {
            getCommunityData: {
              timeout: 30,
            },
          },
        },
      },
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
        },
        result: {
          data: {
            getCommunityData: null,
          },
        },
      },
      {
        request: {
          query: UPDATE_SESSION_TIMEOUT,
          variables: { timeout: 30 },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateTimeout />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const submitButton = screen.getByTestId('update-button');
    userEvent.click(submitButton);

    await wait();

    expect(errorHandler).toHaveBeenCalled();
  });

  it('Should handle null community object gracefully', async () => {
    render(
      <MockedProvider mocks={[MOCKS[1]]} addTypename={false}>
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
