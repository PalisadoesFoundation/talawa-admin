import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import UserListCard from './UserListCard';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import * as errorHandlerModule from 'utils/errorHandler';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

// Mock react-router (useParams comes from here in the component)
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({
      orgId: '554',
    }),
  };
});

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn().mockImplementation((msg) => {
      console.log('NotificationToast success called with:', msg);
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should successfully add admin and show success toast', async () => {
    console.log('Starting test');
    const props = {
      id: '456',
    };

    render(
      <BrowserRouter>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
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

    // Verify NotificationToast.success was called
    expect(NotificationToast.success).toHaveBeenCalled();

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
      <BrowserRouter>
        <MockedProvider link={errorLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Add Admin/i));
    await wait();

    expect(NotificationToast.success).not.toHaveBeenCalled();
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
      <BrowserRouter>
        <MockedProvider link={errorLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={456} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
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
    expect(NotificationToast.success).not.toHaveBeenCalled();
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
      <BrowserRouter>
        <MockedProvider link={nullDataLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={789} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // When data is null, NotificationToast.success should not be called
    expect(NotificationToast.success).not.toHaveBeenCalled();

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
      <BrowserRouter>
        <MockedProvider link={undefinedDataLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={101} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // When data is undefined, NotificationToast.success should not be called
    expect(NotificationToast.success).not.toHaveBeenCalled();

    // Wait additional time to ensure reload is not called
    await wait(2100);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should render button with correct text and styling', () => {
    const props = {
      id: '123',
    };

    render(
      <BrowserRouter>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={999} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
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
      <BrowserRouter>
        <MockedProvider link={linkWithVariables}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={202} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // If the variables were correct, the mutation should succeed
    expect(NotificationToast.success).toHaveBeenCalled();
  });

  it('Should handle GraphQL error in mutation response', async () => {
    // Clear the reload mock at the start to ensure clean state
    reloadMock.mockClear();

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
          data: null,
          errors: [{ message: 'User not found' }],
        },
      },
    ];

    const graphQLErrorLink = new StaticMockLink(graphQLErrorMock, true);
    const props = {
      id: '111',
    };

    render(
      <BrowserRouter>
        <MockedProvider link={graphQLErrorLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={303} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);

    // Wait for mutation to complete
    await wait(500);

    // GraphQL errors with data: null should not trigger success flow
    expect(NotificationToast.success).not.toHaveBeenCalled();

    // The reload should not have been scheduled since data is null
    // Wait a short time to ensure no immediate reload
    await wait(100);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should handle rapid multiple clicks by clearing previous timeout', async () => {
    // This test covers lines 74-75 - clearing existing timeout when clicking again
    const multiClickMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '222',
            orgid: '554',
          },
        },
        result: {
          data: {
            createAdmin: {
              user: {
                _id: '222',
              },
            },
          },
        },
      },
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '222',
            orgid: '554',
          },
        },
        result: {
          data: {
            createAdmin: {
              user: {
                _id: '222',
              },
            },
          },
        },
      },
    ];

    const multiClickLink = new StaticMockLink(multiClickMock, true);
    const props = {
      id: '222',
    };

    render(
      <BrowserRouter>
        <MockedProvider link={multiClickLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={404} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);

    // First click - sets up the timeout
    await userEvent.click(button);
    await wait(300); // Wait less than the 2000ms setTimeout

    // Second click - should clear the previous timeout and set a new one
    await userEvent.click(button);
    await wait(500);

    // The success toast should have been called at least once
    expect(NotificationToast.success).toHaveBeenCalled();
  });

  it('Should not proceed when result has GraphQL errors with valid data structure', async () => {
    // This test covers line 101 - GraphQL errors check return
    const errorWithDataMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '333',
            orgid: '554',
          },
        },
        result: {
          data: { createAdmin: null },
          errors: [{ message: 'Permission denied' }],
        },
      },
    ];

    const errorWithDataLink = new StaticMockLink(errorWithDataMock, true);
    const props = {
      id: '333',
    };

    render(
      <BrowserRouter>
        <MockedProvider link={errorWithDataLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={505} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // With GraphQL errors present, even with data object, success should not be called
    expect(NotificationToast.success).not.toHaveBeenCalled();
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should not show success when createAdmin is falsy', async () => {
    // This test covers the case when data.createAdmin is null/undefined/false
    const falsyCreateAdminMock = [
      {
        request: {
          query: ADD_ADMIN_MUTATION,
          variables: {
            userid: '444',
            orgid: '554',
          },
        },
        result: {
          data: { createAdmin: null },
        },
      },
    ];

    const falsyCreateAdminLink = new StaticMockLink(falsyCreateAdminMock, true);
    const props = {
      id: '444',
    };

    render(
      <BrowserRouter>
        <MockedProvider link={falsyCreateAdminLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={606} {...props} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await wait();
    const button = screen.getByText(/Add Admin/i);
    await userEvent.click(button);
    await wait(500);

    // When createAdmin is null, success toast should not be shown
    expect(NotificationToast.success).not.toHaveBeenCalled();
    await wait(2100);
    expect(reloadMock).not.toHaveBeenCalled();
  });
});
