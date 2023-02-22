import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import UserUpdate from './UserUpdate';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variable: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
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

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User Update', () => {
  const props = {
    key: '123',
    id: '456',
  };

  const formData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password: 'qwerty',
    applangcode: '2',
    selectedOption: 'selectadmin',
    displayImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <UserUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName
    );
    userEvent.type(screen.getByPlaceholderText(/Email/i), formData.email);
    userEvent.type(screen.getByPlaceholderText(/Password/i), formData.password);
    userEvent.type(
      screen.getByPlaceholderText(/App Language Code/i),
      formData.applangcode
    );
    userEvent.click(screen.getByLabelText('Admin'));
    userEvent.click(screen.getByRole('radio', { name: /superadmin/i }));
    userEvent.upload(
      screen.getByLabelText(/display image:/i),
      formData.displayImage
    );

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/First Name/i)).toHaveValue(
      formData.firstName
    );
    expect(screen.getByPlaceholderText(/Last Name/i)).toHaveValue(
      formData.lastName
    );
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue(formData.email);
    expect(screen.getByPlaceholderText(/Password/i)).toHaveValue(
      formData.password
    );
    expect(screen.getByPlaceholderText(/App Language Code/i)).toHaveValue(
      formData.applangcode
    );
    expect(screen.getByLabelText('Admin')).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /superadmin/i })).toBeChecked();
    expect(screen.getByLabelText(/display image:/i)).toBeTruthy();

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/App Language Code/i)
    ).toBeInTheDocument();
    expect(screen.getByText('User Type')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Superadmin')).toBeInTheDocument();
  });
});
