import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import OrgPeopleListCard from './OrgPeopleListCard';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '456' }),
    Navigate: ({ to }: { to: string }) => {
      window.location.pathname = to;
      return null;
    },
  };
});

const MOCKS = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: {
        userid: '1',
        orgid: '456',
      },
    },
    result: {
      data: {
        removeMember: {
          _id: '1',
        },
      },
    },
    delay: 0,
  },
];

const ERROR_MOCKS = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: {
        userid: '1',
        orgid: '456',
      },
    },
    error: new Error('Failed to remove member'),
  },
];

describe('Testing Organization People List Card', () => {
  const props = {
    toggleRemoveModal: vi.fn(),
    id: '1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '',
        reload: vi.fn(),
      },
      writable: true,
    });
  });

  const NULL_DATA_MOCKS = [
    {
      request: {
        query: REMOVE_MEMBER_MUTATION,
        variables: {
          userid: '1',
          orgid: '456',
        },
      },
      result: {
        data: null,
      },
    },
  ];

  test('should handle null data response from mutation', async () => {
    const link = new StaticMockLink(NULL_DATA_MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Click remove button
    const removeButton = screen.getByTestId('removeMemberBtn');
    await userEvent.click(removeButton);

    // Verify that success toast and toggleRemoveModal were not called
    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled();
      expect(props.toggleRemoveModal).not.toHaveBeenCalled();
    });
  });

  test('should render modal and handle successful member removal', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider
        addTypename={false}
        link={link}
        defaultOptions={{
          mutate: { errorPolicy: 'all' },
        }}
      >
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Check if modal is rendered
    expect(screen.getByText(/Remove Member/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Do you want to remove this member?/i),
    ).toBeInTheDocument();

    // Check buttons
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();

    // Click remove button
    const removeButton = screen.getByTestId('removeMemberBtn');
    await userEvent.click(removeButton);

    // Wait for mutation to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Wait for mutation and toast
    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalled();
        expect(props.toggleRemoveModal).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should handle failed member removal', async () => {
    const link = new StaticMockLink(ERROR_MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Click remove button
    const removeButton = screen.getByTestId('removeMemberBtn');
    await userEvent.click(removeButton);

    // Check error handling
    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should handle modal close', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Close via No button
    const noButton = screen.getByRole('button', { name: /no/i });
    await userEvent.click(noButton);
    expect(props.toggleRemoveModal).toHaveBeenCalled();

    // Close via close button
    const closeButton = screen.getByRole('button', { name: '' }); // Close icon button
    await userEvent.click(closeButton);
    expect(props.toggleRemoveModal).toHaveBeenCalled();
  });

  test('should redirect when id is undefined', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard id={undefined} toggleRemoveModal={vi.fn()} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/orglist');
    });
  });
});
