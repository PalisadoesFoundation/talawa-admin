import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import UserListCard from './UserListCard';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, describe, it, beforeEach } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      orgId: '554',
    }),
  };
});

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn().mockImplementation((msg) => {
      console.log('Toast success called with:', msg);
    }),
    error: vi.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variables: {
        userid: '456',
        orgid: '554',
      },
    },
    result: {
      data: {
        createAdmin: {
          user: {
            _id: '456',
          },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

describe('Testing User List Card', () => {
  beforeEach(() => {
    vi.spyOn(global, 'alert').mockImplementation(() => {});
    // Mock window.location.reload
    const reloadMock = vi.fn(() => {
      console.log('window.location.reload called');
    });
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('Should successfully add admin and show success toast', async () => {
    console.log('Starting test');
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    console.log('Component rendered');
    await wait();

    const button = screen.getByText(/Add Admin/i);
    console.log('Found button:', button);

    // Click the Add Admin button
    await userEvent.click(button);
    console.log('Clicked button');

    // Wait for mutation to complete
    await wait(500); // Increased wait time
    console.log('Waited after click');

    // Verify toast.success was called
    expect(toast.success).toHaveBeenCalled();

    // Wait for setTimeout
    await wait(2100);

    // Verify window.location.reload was called
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('Should handle mutation error correctly', async () => {
    const errorMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '456',
            orgid: '554',
          },
        },
        error: new Error('An error occurred'),
      },
    ];

    const errorLink = new StaticMockLink(errorMock, true);
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Add Admin/i));
    await wait();

    expect(toast.success).not.toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
