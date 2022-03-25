import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import UserUpdate from './UserUpdate';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';

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
        <UserUpdate {...props} />
      </MockedProvider>
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Last Name/i),
      formData.lastName
    );
    userEvent.type(screen.getByPlaceholderText(/Enter Email/i), formData.email);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter App Language Code/i),
      formData.applangcode
    );
    userEvent.click(screen.getByLabelText('Admin'));
    userEvent.click(screen.getByRole('radio', { name: /superadmins/i }));
    userEvent.upload(
      screen.getByLabelText(/display image:/i),
      formData.displayImage
    );

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/Enter First Name/i)).toHaveValue(
      formData.firstName
    );
    expect(screen.getByPlaceholderText(/Enter Last Name/i)).toHaveValue(
      formData.lastName
    );
    expect(screen.getByPlaceholderText(/Enter Email/i)).toHaveValue(
      formData.email
    );
    expect(screen.getByPlaceholderText(/Enter Password/i)).toHaveValue(
      formData.password
    );
    expect(screen.getByPlaceholderText(/Enter App Language Code/i)).toHaveValue(
      formData.applangcode
    );
    expect(screen.getByLabelText('Admin')).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /superadmins/i })).toBeChecked();
    expect(screen.getByLabelText(/display image:/i)).toBeTruthy();

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('App Language Code')).toBeInTheDocument();
    expect(screen.getByText('User Type')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Superadmins')).toBeInTheDocument();
  });
});
