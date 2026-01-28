import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import OrgPeopleListCard from './OrgPeopleListCard';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
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
      query: REMOVE_MEMBER_MUTATION_PG,
      variables: {
        memberId: '1',
        organizationId: '456',
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
      query: REMOVE_MEMBER_MUTATION_PG,
      variables: {
        memberId: '1',
        organizationId: '456',
      },
    },
    error: new Error('Failed to remove member'),
  },
];

describe('Testing Organization People List Card', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  const props = {
    toggleRemoveModal: vi.fn(),
    id: '1',
  };

  let user: ReturnType<typeof userEvent.setup>;
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
    user = userEvent.setup();
  });

  const NULL_DATA_MOCKS = [
    {
      request: {
        query: REMOVE_MEMBER_MUTATION_PG,
        variables: {
          memberId: '1',
          organizationId: '456',
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Click remove button
    const removeButton = screen.getByTestId('removeMemberBtn');
    await user.click(removeButton);

    // Verify that success toast and toggleRemoveModal were not called
    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(props.toggleRemoveModal).not.toHaveBeenCalled();
    });
  });

  test('should render modal and handle successful member removal', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider
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
    await user.click(removeButton);

    // Wait for mutation to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Wait for mutation and toast
    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalled();
        expect(props.toggleRemoveModal).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should handle failed member removal', async () => {
    const link = new StaticMockLink(ERROR_MOCKS, true);

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Click remove button
    const removeButton = screen.getByTestId('removeMemberBtn');
    await user.click(removeButton);

    // Check error handling
    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should handle modal close', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Close via No button
    const noButton = screen.getByRole('button', { name: /no/i });
    await user.click(noButton);
    expect(props.toggleRemoveModal).toHaveBeenCalled();

    // Close via close button
    const closeButton = screen.getByTestId('modalCloseBtn');
    await user.click(closeButton);
    expect(props.toggleRemoveModal).toHaveBeenCalled();
  });

  test('should redirect when id is undefined', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard id={undefined} toggleRemoveModal={vi.fn()} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin/orglist');
    });
  });
});
