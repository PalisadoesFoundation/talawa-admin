import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import UserListCard from './UserListCard';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, describe, it, beforeEach } from 'vitest';

const MOCKS = [
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variables: { userid: '784', orgid: '554' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

describe('Testing User List Card', () => {
  beforeEach(() => {
    vi.spyOn(global, 'alert').mockImplementation(() => {});
  });

  it('Should render props and text elements test for the page component', async () => {
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByText(/Add Admin/i));
  });

  it('Should render text elements when props value is not passed', async () => {
    const props = {
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard key={123} {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByText(/Add Admin/i));
  });
});
