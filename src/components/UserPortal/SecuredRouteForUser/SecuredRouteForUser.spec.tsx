import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import SecuredRouteForUser from './SecuredRouteForUser';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import { VERIFY_ROLE } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

// Correctly mock the `useLocalStorage` module
vi.mock('utils/useLocalstorage', () => ({
  __esModule: true, // Ensure this is marked as an ES module
  default: vi.fn(),
}));

describe('SecuredRouteForUser', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockQuery = (role: string, isAuthorized: boolean): MockedResponse => ({
    request: {
      query: VERIFY_ROLE,
      context: {
        headers: { Authorization: `Bearer mock_token` },
      },
    },
    result: {
      data: {
        verifyRole: {
          role,
          isAuthorized,
        },
      },
    },
  });

  it('renders the route when the user is logged in as a user', async () => {
    // Mocking useLocalStorage to return the token as 'mock_token' and 'TRUE' for IsLoggedIn
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key) => (key === 'token' ? 'mock_token' : 'TRUE')),
      setItem: vi.fn(),
    });

    render(
      <MockedProvider mocks={[mockQuery('user', true)]} addTypename={false}>
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route
                path="/user/organizations"
                element={
                  <div data-testid="organizations-content">
                    Organizations Component
                  </div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('organizations-content')).toBeInTheDocument();
    });
  });

  it('redirects to /user when the user is not logged in', async () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn(() => 'FALSE'),
      setItem: vi.fn(),
    });

    render(
      <MockedProvider mocks={[mockQuery('', false)]} addTypename={false}>
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route path="/" element={<div>User Login Page</div>} />
            <Route element={<SecuredRouteForUser />}>
              <Route
                path="/user/organizations"
                element={
                  <div data-testid="organizations-content">
                    Organizations Component
                  </div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('User Login Page')).toBeInTheDocument();
    });
  });

  it('renders PageNotFound when user is an admin', async () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key) => (key === 'token' ? 'mock_token' : 'TRUE')),
      setItem: vi.fn(),
    });

    render(
      <MockedProvider mocks={[mockQuery('admin', true)]} addTypename={false}>
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route path="/user/organizations" element={<PageNotFound />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Check for the 404 text or the notFoundMsg text
    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeInTheDocument(); // Matching the 404 text in <h1>
      expect(screen.getByText(/notFoundMsg/i)).toBeInTheDocument(); // Matching the notFoundMsg text in <p>
    });
  });

  it('shows loading state while query is in progress', async () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn(() => 'mock_token'),
      setItem: vi.fn(),
    });

    render(
      <MockedProvider mocks={[mockQuery('user', true)]} addTypename={false}>
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route
                path="/user/organizations"
                element={<div>Test Page</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Loading.....')).toBeInTheDocument();
  });

  it('shows error state if query fails', async () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn(() => 'mock_token'),
      setItem: vi.fn(),
    });

    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: VERIFY_ROLE,
              context: {
                headers: { Authorization: `Bearer mock_token` },
              },
            },
            error: new Error('GraphQL error'),
          },
        ]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route
                path="/user/organizations"
                element={<div>Test Page</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error During Routing/i)).toBeInTheDocument();
    });
  });
});
