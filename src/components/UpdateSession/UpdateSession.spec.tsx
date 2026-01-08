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
// FIXED: Correct import from react-router-dom
import { BrowserRouter } from 'react-router-dom';
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
    // Mocking getBoundingClientRect is good practice for JSDOM components
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({
        width: 100,
        height: 10,
        top: 0,
        left: 0,
        bottom: 10,
        right: 100,
        x: 0,
        y: 0,
        toJSON: () => {},
      }),
    );
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

    // Target the hidden input directly to guarantee onChange is fired
    const sliderInput = screen.getByRole('slider');

    fireEvent.change(sliderInput, { target: { value: 15 } });

    expect(mockOnValueChange).toHaveBeenCalledWith(15);
  });

  it('Should handle maximum slider value correctly', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateTimeout onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const sliderInput = screen.getByRole('slider');

    fireEvent.change(sliderInput, { target: { value: 60 } });

    expect(mockOnValueChange).toHaveBeenCalledWith(60);
  });

  it('Should update slider value on user interaction', async () => {
    const mockOnValueChange = vi.fn();

    render(
      <MockedProvider>
        <UpdateTimeout onValueChange={mockOnValueChange} />
      </MockedProvider>,
    );

    const sliderInput = screen.getByRole('slider');

    fireEvent.change(sliderInput, { target: { value: 45 } });

    await waitFor(
      () => {
        expect(mockOnValueChange).toHaveBeenCalledWith(45);
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

    const updateTimeoutElements = screen.getAllByText(/Update Timeout/i);
    expect(updateTimeoutElements).toHaveLength(1);

    expect(screen.getByText(/Current Timeout/i)).toBeInTheDocument();
    expect(screen.getByText(/15 min/i)).toBeInTheDocument();

    const sliderLabelsContainer = screen.getByTestId('slider-labels');
    const sliderLabels = within(sliderLabelsContainer);

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

    await waitFor(
      () => {
        expect(screen.getByTestId('timeout-value')).toHaveTextContent(
          '30 minutes',
        );
      },
      { timeout: 3000 },
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    const submitButton = screen.getByTestId('update-button');
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(
      () => {
        expect(toastSpy).toHaveBeenCalledWith(
          expect.stringContaining('Successfully updated the Profile Details.'),
        );
      },
      { timeout: 3000 },
    );

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

    const updateTimeoutElements = screen.getAllByText(/Update Timeout/i);
    expect(updateTimeoutElements).toHaveLength(1);

    expect(screen.getByText(/Current Timeout/i)).toBeInTheDocument();

    const sliderLabelsContainer = screen.getByTestId('slider-labels');
    const sliderLabels = within(sliderLabelsContainer);

    expect(sliderLabels.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText(/30 min/i)).toBeInTheDocument();
    expect(screen.getByText(/45 min/i)).toBeInTheDocument();
    expect(screen.getByText(/60 min/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();

    expect(screen.getByText(/No timeout set/i)).toBeInTheDocument();
  });
});
