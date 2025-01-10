import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';

import UserListCard from './UserListCard';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, beforeEach, afterEach } from 'vitest';

// Mock modules
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      orgId: '554',
    }),
  };
});

const MOCKS = [
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variables: { userid: '456', orgid: '554' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

const ERROR_MOCKS = [
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variables: { userid: '456', orgid: '554' },
    },
    error: new Error('An error occurred'),
  },
];

describe('Testing User List Card', () => {
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.spyOn(global, 'alert').mockImplementation(() => {});
    // Update the window.location mock
    Object.defineProperty(window, 'location', {
      value: {
        reload: mockReload,
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Should show success toast and reload page after successful mutation', async () => {
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);

    // Wait for the success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('User is added as admin.');
    });

    await waitFor(
      () => {
        expect(mockReload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('Should show error toast when mutation fails', async () => {
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} mocks={ERROR_MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('Should render button with correct styling', () => {
    const props = {
      id: '456',
      key: 1,
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const button = screen.getByRole('button', { name: /Add Admin/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('memberfontcreatedbtn');
  });

  test('Should handle translations and URL parameters correctly', async () => {
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const button = screen.getByText(/Add Admin/i);
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
