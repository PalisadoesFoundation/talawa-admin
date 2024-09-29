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

const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const resetAndRefetchMock = jest.fn();

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

beforeEach(() => {
  setItem('id', '123');
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Testing User Table Item', () => {
  console.error = jest.fn((message) => {
    if (message.includes('validateDOMNesting')) {
      return;
    }
    console.warn(message);
  });
  test('Should render props and text elements test for the page component', async () => {
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

  test('Accept MembershipRequest Button works properly', async () => {
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

  test('Reject MembershipRequest Button works properly', async () => {
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
});
