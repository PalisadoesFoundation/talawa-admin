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
import { StaticMockLink } from 'utils/StaticMockLink';
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

const link = new StaticMockLink(MOCKS, true);
const errorLink = new StaticMockLink(ERROR_MOCKS, true);

describe('Testing User List Card', () => {
  beforeEach(() => {
    vi.spyOn(global, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload: vi.fn(),
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        reload: vi.fn(), // Mock the reload function
      },
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
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(toast.success).toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 2100));
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('Should show error toast when mutation fails', async () => {
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

    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(toast.error).toHaveBeenCalled();
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
      <MockedProvider addTypename={false} link={link}>
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
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(toast.success).toHaveBeenCalled();
  });

  test('Should display success toast and reload page after successful mutation', async () => {
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

    // Wait for the toast success to be called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('User is added as admin.');
    });

    // Wait for the page reload to be triggered
    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });
});
