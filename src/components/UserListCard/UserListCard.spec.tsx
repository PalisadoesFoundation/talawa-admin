import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import UserListCard from './UserListCard';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import * as errorHandlerModule from 'utils/errorHandler';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

// Mock react-router
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
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
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
    reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: reloadMock,
        pathname: '/',
      },
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should successfully add admin and show success toast', async () => {
    render(
      <BrowserRouter>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} id="456" />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await userEvent.click(screen.getByText(/Add Admin/i));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'addedAsAdmin' }),
      );
    });

    await wait(2100);
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('Should handle mutation error correctly', async () => {
    const errorLink = new StaticMockLink(
      [
        {
          request: {
            query: ADD_ADMIN_MUTATION,
            variables: { userid: '456', orgid: '554' },
          },
          error: new Error('An error occurred'),
        },
      ],
      true,
    );

    render(
      <BrowserRouter>
        <MockedProvider link={errorLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} id="456" />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await userEvent.click(screen.getByText(/Add Admin/i));

    expect(NotificationToast.success).not.toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('Should call errorHandler when mutation fails', async () => {
    const errorHandlerSpy = vi.spyOn(errorHandlerModule, 'errorHandler');

    const errorLink = new StaticMockLink(
      [
        {
          request: {
            query: ADD_ADMIN_MUTATION,
            variables: { userid: '789', orgid: '554' },
          },
          error: new Error('Network error'),
        },
      ],
      true,
    );

    render(
      <BrowserRouter>
        <MockedProvider link={errorLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={456} id="789" />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await userEvent.click(screen.getByText(/Add Admin/i));

    await waitFor(() => {
      expect(errorHandlerSpy).toHaveBeenCalled();
    });

    expect(NotificationToast.success).not.toHaveBeenCalled();
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should not reload when mutation returns no data', async () => {
    const nullDataLink = new StaticMockLink(
      [
        {
          request: {
            query: ADD_ADMIN_MUTATION,
            variables: { userid: '999', orgid: '554' },
          },
          result: { data: null },
        },
      ],
      true,
    );

    render(
      <BrowserRouter>
        <MockedProvider link={nullDataLink}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={789} id="999" />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    await userEvent.click(screen.getByText(/Add Admin/i));

    expect(NotificationToast.success).not.toHaveBeenCalled();
    await wait(2100);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('Should render button with correct text and styling', () => {
    render(
      <BrowserRouter>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={999} id="123" />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );

    const button = screen.getByText(/Add Admin/i);
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toContain('memberfontcreatedbtnUserListCard');
  });
});
