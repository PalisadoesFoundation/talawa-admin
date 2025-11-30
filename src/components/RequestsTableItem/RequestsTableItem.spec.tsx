import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceRequestsListItem } from 'types/Member/interface';
import { MOCKS, ERROR_MOCKS } from './RequestsTableItemMocks';
import RequestsTableItem from './RequestsTableItem';
import { BrowserRouter } from 'react-router-dom';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
const link = new StaticMockLink(MOCKS, true);
import useLocalStorage from 'utils/useLocalstorage';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
beforeEach(() => {
  setItem('id', '123');
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Testing User Table Item', () => {
  const resetAndRefetchMock = vi.fn();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation((message) => {
      if (
        typeof message === 'string' &&
        message.includes('validateDOMNesting')
      ) {
        return;
      }
      console.warn(message);
    });
  });
  it('Should render props and text elements it for the page component', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText(/2./i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });

  it('Accept MembershipRequest Button works properly', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('acceptMembershipRequestBtn123'));

    // Wait for the mutation to complete and verify success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Request accepted successfully',
      );
    });

    expect(resetAndRefetchMock).toHaveBeenCalled();
  });

  it('Accept MembershipRequest handles error', async () => {
    const errorLink = new StaticMockLink(ERROR_MOCKS, true);
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('acceptMembershipRequestBtn123'));
    await waitFor(() => expect(errorHandler).toHaveBeenCalled());
  });

  it('Reject MembershipRequest Button works properly', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('rejectMembershipRequestBtn123'));

    // Wait for the mutation to complete and verify success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Request rejected successfully',
      );
    });

    expect(resetAndRefetchMock).toHaveBeenCalled();
  });
  it('Reject MembershipRequest handles error', async () => {
    const errorLink = new StaticMockLink(ERROR_MOCKS, true);
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('rejectMembershipRequestBtn123'));
    await wait();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('handles accept mutation with no data returned', async () => {
    const noDataMocks = [
      {
        request: {
          query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: {
              membershipRequestId: '123',
            },
          },
        },
        result: {
          data: null,
        },
      },
    ];
    const noDataLink = new StaticMockLink(noDataMocks, true);
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 0,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={noDataLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('acceptMembershipRequestBtn123'));
    await wait();
    // Should not call toast.success or resetAndRefetch when data is null
    expect(toast.success).not.toHaveBeenCalled();
    expect(resetAndRefetchMock).not.toHaveBeenCalled();
  });

  it('handles reject mutation with no data returned', async () => {
    const noDataMocks = [
      {
        request: {
          query: REJECT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: {
              membershipRequestId: '123',
            },
          },
        },
        result: {
          data: null,
        },
      },
    ];
    const noDataLink = new StaticMockLink(noDataMocks, true);
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 0,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={noDataLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('rejectMembershipRequestBtn123'));
    await wait();
    // Should not call toast.success or resetAndRefetch when data is null
    expect(toast.success).not.toHaveBeenCalled();
    expect(resetAndRefetchMock).not.toHaveBeenCalled();
  });

  it('renders correctly with index 0', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '456',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '456',
          name: 'Jane Smith',
          emailAddress: 'jane@example.com',
        },
      },
      index: 0,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText(/1\./i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
  });

  it('renders correctly with different membership request ID', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '789',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '789',
          name: 'Bob Wilson',
          emailAddress: 'bob@example.com',
        },
      },
      index: 2,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText(/3\./i)).toBeInTheDocument();
    expect(screen.getByText(/Bob Wilson/i)).toBeInTheDocument();
    expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByTestId('acceptMembershipRequestBtn789'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('rejectMembershipRequestBtn789'),
    ).toBeInTheDocument();
  });

  it('applies correct CSS classes to elements', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Check that the table row exists
    const tableRow = screen.getByRole('row');
    expect(tableRow).toBeInTheDocument();

    // Check that the index cell exists and has a class containing 'requestsTableItemIndex'
    const indexCell = screen.getByText('2.');
    expect(indexCell).toBeInTheDocument();
    expect(indexCell.className).toContain('requestsTableItemIndex');

    // Check that name cell exists and has a class containing 'requestsTableItemName'
    const nameCell = screen.getByText('John Doe');
    expect(nameCell).toBeInTheDocument();
    expect(nameCell.className).toContain('requestsTableItemName');

    // Check that email cell exists and has a class containing 'requestsTableItemEmail'
    const emailCell = screen.getByText('john@example.com');
    expect(emailCell).toBeInTheDocument();
    expect(emailCell.className).toContain('requestsTableItemEmail');
  });

  it('displays avatar image when avatarURL is provided', async () => {
    const props = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
          avatarURL: 'https://example.com/avatar.jpg',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const image = screen.getByAltText('profile picture');
    expect(image).toBeVisible();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('handles image load error', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        membershipRequestId: '123',
        createdAt: '2021-09-01T00:00:00.000Z',
        status: 'pending',
        user: {
          id: '123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
          avatarURL: 'https://example.com/avatar.jpg',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const image = screen.getByAltText('profile picture');
    act(() => {
      image.dispatchEvent(new Event('error'));
    });

    await waitFor(() => {
      expect(image).not.toBeVisible();
    });
  });
});
