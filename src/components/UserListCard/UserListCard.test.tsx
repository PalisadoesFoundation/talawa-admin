import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import UserListCard from './UserListCard';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';

const MOCKS = [
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variable: { userid: '784', orgid: '554' },
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
async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User List Card', () => {
  global.alert = jest.fn();

  test('Should render props and text elements test for the page component', async () => {
    const props = {
      key: '123',
      id: '456',
      memberName: 'John Doe',
      joinDate: '07/05/2022',
      memberImage: 'image',
      memberEmail: 'johndoe@gmail.com',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Add Admin/i));

    expect(screen.getByText('Joined:')).toBeInTheDocument();
    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    const props = {
      key: '123',
      id: '456',
      memberName: '',
      joinDate: '09/05/2022',
      memberImage: '',
      memberEmail: '',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Add Admin/i));

    expect(screen.getByText('Joined:')).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });
});
