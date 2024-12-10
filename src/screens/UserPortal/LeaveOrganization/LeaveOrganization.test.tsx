import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import LeaveOrganization from './LeaveOrganization';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';

// Mock the custom hook
jest.mock('utils/useLocalStorage', () => {
  return jest.fn(() => ({
    getItem: (key: string) => {
      if (key === 'Talawa-admin_email') return 'test@example.com';
      if (key === 'Talawa-admin_userId') return 'test-user-id';
      return null;
    },
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }));
});

const mocks = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: 'test-org-id' },
    },
    result: {
      data: {
        organizations: [
          {
            name: 'Test Organization',
            description: 'This is a test organization.',
          },
        ],
      },
    },
  },
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: { orgid: 'test-org-id', userid: 'test-user-id' },
    },
    result: {
      data: {
        removeMember: {
          success: true,
        },
      },
    },
  },
  // Mock for query error
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: 'test-org-id' },
    },
    error: new Error('Failed to load organization details'),
  },
  // Mock for mutation error
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: { orgid: 'test-org-id', userid: 'test-user-id' },
    },
    error: new Error('Failed to leave organization'),
  },
];

describe('LeaveOrganization Component', () => {
  test('renders organization details', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test organization.'),
      ).toBeInTheDocument();
    });
  });

  test('shows error message when query fails', async () => {
    render(
      <MockedProvider mocks={mocks.slice(2, 3)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText(/Loading/i));
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load organization details/i),
      ).toBeInTheDocument();
    });
  });

  test('opens modal on leave button click', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText('Leave Organization'));
    fireEvent.click(screen.getByText('Leave Organization'));

    expect(
      screen.getByText(/Are you sure you want to leave this organization?/i),
    ).toBeInTheDocument();
  });

  test('verifies email and submits', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText('Leave Organization'));
    fireEvent.click(screen.getByText('Leave Organization'));

    await waitFor(() => screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() =>
      expect(screen.queryByText('Leave Organization')).not.toBeInTheDocument(),
    );
  });

  test('shows error for incorrect email', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText('Leave Organization'));
    fireEvent.click(screen.getByText('Leave Organization'));

    await waitFor(() => screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() =>
      expect(screen.getByText(/Verification failed/i)).toBeInTheDocument(),
    );
  });

  test('shows error message when mutation fails', async () => {
    render(
      <MockedProvider mocks={mocks.slice(3, 4)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText('Leave Organization'));
    fireEvent.click(screen.getByText('Leave Organization'));

    await waitFor(() => screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() =>
      expect(
        screen.getByText(/Failed to leave organization/i),
      ).toBeInTheDocument(),
    );
  });
});
