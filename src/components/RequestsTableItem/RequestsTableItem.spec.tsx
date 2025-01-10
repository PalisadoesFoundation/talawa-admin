import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceRequestsListItem } from './RequestsTableItem';
import { MOCKS } from './RequestsTableItemMocks';
import RequestsTableItem from './RequestsTableItem';
import { BrowserRouter } from 'react-router-dom';
const link = new StaticMockLink(MOCKS, true);
import useLocalStorage from 'utils/useLocalstorage';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const resetAndRefetchMock = vi.fn();
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

beforeEach(() => {
  setItem('id', '123');
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('Testing User Table Item', () => {
  console.error = vi.fn((message) => {
    if (message.includes('validateDOMNesting')) {
      return;
    }
    console.warn(message);
  });
  it('Should render props and text elements it for the page component', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        _id: '123',
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
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
  });

  it('Accept MembershipRequest Button works properly', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        _id: '123',
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('acceptMembershipRequestBtn123'));
  });

  it('Accept MembershipRequest handles error', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        _id: '1',
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('acceptMembershipRequestBtn1'));
  });

  it('Reject MembershipRequest Button works properly', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        _id: '123',
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('rejectMembershipRequestBtn123'));
  });

  it('Reject MembershipRequest handles error', async () => {
    const props: {
      request: InterfaceRequestsListItem;
      index: number;
      resetAndRefetch: () => void;
    } = {
      request: {
        _id: '1',
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      },
      index: 1,
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RequestsTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('rejectMembershipRequestBtn1'));
  });
});
