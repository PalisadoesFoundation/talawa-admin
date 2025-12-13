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
import { vi, describe, it, beforeEach, expect } from 'vitest';
import * as errorHandlerModule from 'utils/errorHandler';

// Mock react-router-dom
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
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
  afterEach(() => {
    vi.restoreAllMocks();
  });
  let reloadMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.spyOn(global, 'alert').mockImplementation(() => {});
    // Mock window.location.reload
    reloadMock = vi.fn(() => {
      console.log('window.location.reload called');
    });
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: reloadMock,
        pathname: '/',
      },
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
      <MockedProvider link={link}>
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
      <MockedProvider link={errorLink}>
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

  it('Should call errorHandler when mutation fails', async () => {
    const errorHandlerSpy = vi.spyOn(errorHandlerModule, 'errorHandler');
    const testError = new Error('Network error');

    const errorMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '789',
            orgid: '554',
          },
        },
        error: testError,
      },
    ];

    const errorLink = new StaticMockLink(errorMock, true);
    const props = {
      id: '789',
    };

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={456} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // Verify errorHandler was called with correct arguments (t function and ApolloError)
    // Apollo Client wraps network errors in ApolloError
    expect(errorHandlerSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        message: expect.stringContaining('Network error'),
      }),
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(reloadMock).not.toHaveBeenCalled();

    errorHandlerSpy.mockRestore();
  });

  it('Should not reload when mutation returns no data', async () => {
    const nullDataMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '999',
            orgid: '554',
          },
        },
        result: {
          data: null,
        },
      },
    ];

    const nullDataLink = new StaticMockLink(nullDataMock, true);
    const props = {
      id: '999',
    };

    render(
      <MockedProvider link={nullDataLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={789} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // When data is null, toast.success should not be called
    expect(toast.success).not.toHaveBeenCalled();

    // Wait additional time to ensure reload is not called
    await wait(2100);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should not reload when mutation returns undefined data', async () => {
    const undefinedDataMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '888',
            orgid: '554',
          },
        },
        result: {
          data: undefined,
        },
      },
    ];

    const undefinedDataLink = new StaticMockLink(undefinedDataMock, true);
    const props = {
      id: '888',
    };

    render(
      <MockedProvider link={undefinedDataLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={101} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // When data is undefined, toast.success should not be called
    expect(toast.success).not.toHaveBeenCalled();

    // Wait additional time to ensure reload is not called
    await wait(2100);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should render button with correct text and styling', () => {
    const props = {
      id: '123',
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={999} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const button = screen.getByText(/Add Admin/i);
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    // CSS modules add a hash to the class name, so we check if the class contains the base name
    expect(button.className).toContain('memberfontcreatedbtnUserListCard');
  });

  it('Should pass correct variables to the mutation', async () => {
    const userId = '321';
    const orgId = '554';

    const mockWithVariables = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: userId,
            orgid: orgId,
          },
        },
        result: {
          data: {
            createAdmin: {
              user: {
                _id: userId,
              },
            },
          },
        },
      },
    ];

    const linkWithVariables = new StaticMockLink(mockWithVariables, true);
    const props = {
      id: userId,
    };

    render(
      <MockedProvider link={linkWithVariables}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={202} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // If the variables were correct, the mutation should succeed
    expect(toast.success).toHaveBeenCalled();
  });

  it('Should handle GraphQL error in mutation response', async () => {
    const graphQLErrorMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '111',
            orgid: '554',
          },
        },
        result: {
          errors: [{ message: 'User not found' }],
        },
      },
    ];

    const graphQLErrorLink = new StaticMockLink(graphQLErrorMock, true);
    const props = {
      id: '111',
    };

    render(
      <MockedProvider link={graphQLErrorLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={303} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // GraphQL errors in the result don't trigger the catch block
    expect(toast.success).not.toHaveBeenCalled();
    expect(reloadMock).not.toHaveBeenCalled();
  });
});
