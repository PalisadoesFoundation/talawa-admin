import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import UserPasswordUpdate from './UserPasswordUpdate';
import { StaticMockLink } from 'utils/StaticMockLink';

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variable: {
        previousPassword: 'anshgoyal',
        newPassword: 'anshgoyalansh',
        confirmNewPassword: 'anshgoyalansh',
      },
    },
    result: {
      data: {
        users: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 5) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User Password Update', () => {
  const props = {
    key: '123',
    id: '1',
  };

  const formData = {
    previousPassword: 'anshgoyal',
    newPassword: 'anshgoyalansh',
    confirmNewPassword: 'anshgoyalansh',
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.previousPassword
    );
    userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.newPassword
    );
    userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword
    );

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Previous Password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm New Password/i)
    ).toBeInTheDocument();
  });
});
