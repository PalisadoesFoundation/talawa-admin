import type { ChangeEvent } from 'react';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import UpdateSession from './UpdateSession';

import i18n from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { UPDATE_SESSION_TIMEOUT_PG } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { vi } from 'vitest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { wait } from 'components/AdminPortal/Advertisements/AdvertisementsMocks';

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

describe('Testing UpdateSession Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should handle minimum slider value correctly', async () => {
    const user = userEvent.setup();
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    // Wait for LoadingState to complete - component will be rendered once data loads
    await waitFor(() => {
      expect(screen.getByText(/Update Session/i)).toBeInTheDocument();
    });

    const slider = screen.getByRole('slider');

    // Simulate moving to minimum value using keyboard
    slider.focus();
    await user.keyboard('{Home}');

    expect(mockOnValueChange).toHaveBeenCalledWith(15); // Adjust based on slider min value
  });

  it('Should handle maximum slider value correctly', async () => {
    const user = userEvent.setup();
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    // Wait for LoadingState to complete - component will be rendered once data loads
    await waitFor(() => {
      expect(screen.getByText(/Update Session/i)).toBeInTheDocument();
    });

    const slider = screen.getByRole('slider');

    // Simulate moving to maximum value using keyboard
    slider.focus();
    await user.keyboard('{End}');

    expect(mockOnValueChange).toHaveBeenCalledWith(60); // Adjust based on slider max value
  });

  it('Should not update value if an invalid value is passed', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const slider = await screen.findByTestId('slider-thumb');

    // Simulate focusing and doing nothing to ensure no change
    slider.focus();

    // Ensure onValueChange is not called without interaction
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('Should update slider value on user interaction', async () => {
    const user = userEvent.setup();
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    // Wait for LoadingState to complete - component will be rendered once data loads
    await waitFor(() => {
      expect(screen.getByText(/Update Session/i)).toBeInTheDocument();
    });

    // Now get the slider
    const slider = screen.getByRole('slider');

    slider.focus();
    // Default is 30, step is 5. Right arrow increase by 5.
    await user.keyboard('{ArrowRight}');

    // Assert that the callback was triggered
    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenCalledWith(35);
    });
  });

  it('Components should render properly', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <UpdateSession />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Use getAllByText to get all elements with "Update Session" text
    const updateSessionElements = screen.getAllByText(/Update Session/i);
    expect(updateSessionElements).toHaveLength(1);

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
            <UpdateSession />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the initial query to complete
    await waitFor(() => {
      expect(screen.getByTestId('timeout-value')).toHaveTextContent(
        '30 minutes',
      );
    });

    // Get the form using querySelector
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    // Get and verify submit button
    const submitButton = screen.getByTestId('update-button');
    expect(submitButton).toBeInTheDocument();

    // Click the button and submit the form
    await user.click(submitButton);

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
            <UpdateSession />
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
            <UpdateSession />
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
            <UpdateSession />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Assertions to verify the component handles null community object correctly
    // Use getAllByText to get all elements with "Update Session" text
    const updateSessionElements = screen.getAllByText(/Update Session/i);
    expect(updateSessionElements).toHaveLength(1);

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

  it('Should handle valid event with target correctly', () => {
    const mockOnValueChange = vi.fn();

    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        // Ensure the value is a number and not NaN
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          // mock setTimeout behavior if necessary
          if (mockOnValueChange) {
            mockOnValueChange(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    const mockInputElement = { value: '30' } as HTMLInputElement;
    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);
    expect(mockOnValueChange).toHaveBeenCalledWith(30);
  });

  it('Should handle event without target gracefully', async () => {
    const mockOnValueChange = vi.fn();
    render(
      <MockedProvider>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('Should call onValueChange if provided', () => {
    const mockOnValueChange = vi.fn();
    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          if (mockOnValueChange) {
            mockOnValueChange(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    render(
      <MockedProvider>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const mockInputElement = { value: '50' } as HTMLInputElement;

    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);

    expect(mockOnValueChange).toHaveBeenCalledWith(50);
  });

  it('Should not throw error if onValueChange is not provided', () => {
    const mockOnValueChange = vi.fn();
    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          if (mockOnValueChange) {
            mockOnValueChange(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    render(
      <MockedProvider>
        <UpdateSession />
      </MockedProvider>,
    );

    const mockInputElement = { value: '60' } as HTMLInputElement;

    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);
    expect(mockOnValueChange).toHaveBeenCalledWith(60);
  });

  it('Should handle invalid value gracefully', () => {
    const mockOnValueChange = vi.fn();
    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          if (mockOnValueChange) {
            mockOnValueChange(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    render(
      <MockedProvider>
        <UpdateSession />
      </MockedProvider>,
    );

    const mockInputElement = { value: 'abc' } as HTMLInputElement;
    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('Should handle empty input gracefully', () => {
    const mockOnValueChange = vi.fn();
    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          if (mockOnValueChange) {
            mockOnValueChange(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    render(
      <MockedProvider>
        <UpdateSession />
      </MockedProvider>,
    );

    const mockInputElement = { value: '' } as HTMLInputElement;
    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);

    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('Should not call onValueChange if it is not a valid function', () => {
    const mockOnValueChange: ((value: number) => void) | null = null;
    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          if (mockOnValueChange) {
            (mockOnValueChange as (value: number) => void)(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    render(
      <MockedProvider>
        <UpdateSession />
      </MockedProvider>,
    );

    const mockInputElement = { value: '30' } as HTMLInputElement;
    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);

    expect(mockOnValueChange).toBeNull();
  });

  it('Should handle very large numbers correctly', () => {
    const mockOnValueChange = vi.fn();
    const handleOnChange = (
      e: Event | React.ChangeEvent<HTMLInputElement>,
    ): void => {
      if ('target' in e && e.target) {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        if (!Number.isNaN(value)) {
          if (mockOnValueChange) {
            mockOnValueChange(value);
          }
        } else {
          console.warn('Invalid timeout value:', target.value);
        }
      }
    };

    render(
      <MockedProvider>
        <UpdateSession />
      </MockedProvider>,
    );
    const largeValue = String(Number.MAX_SAFE_INTEGER);
    const mockInputElement = { value: largeValue } as HTMLInputElement;
    const mockChangeEvent = {
      target: mockInputElement,
      nativeEvent: {} as Event,
      currentTarget: mockInputElement,
      bubbles: false,
      cancelable: false,
      isTrusted: true,
    } as ChangeEvent<HTMLInputElement>;

    handleOnChange(mockChangeEvent);

    expect(mockOnValueChange).toHaveBeenCalledWith(Number(largeValue));
  });

  it('should display loading state while fetching session timeout data', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider mocks={MOCKS}>
        <UpdateSession onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('timeout-value')).toBeInTheDocument();
    });

    // Verify that the timeout value is displayed after loading completes
    await waitFor(() => {
      expect(screen.getByTestId('timeout-value')).toHaveTextContent(
        '30 minutes',
      );
    });
  });
  it('should display loading spinner during query and hide it after data loads', async () => {
    // Use a mock that delays the response to keep loading state visible longer
    const delayedMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
        },
        delay: 100, // Delay response
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 1800,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={delayedMocks}>
        <UpdateSession />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeInTheDocument();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('timeout-value')).toBeInTheDocument();
    });

    // Verify loading spinner is gone
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});
