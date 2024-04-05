import type { SetStateAction } from 'react';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Login from './Login';
import { toast } from 'react-toastify';

const MOCKS = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: 'johndoe@gmail.com',
        password: 'johndoe',
      },
    },
    result: {
      data: {
        login: {
          user: {
            _id: '1',
<<<<<<< HEAD
            firstName: 'firstname',
            lastName: 'secondname',
            email: 'tempemail@example.com',
            image: 'image',
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          appUserProfile: {
            adminFor: [
              {
                _id: 'id',
              },
            ],
            isSuperAdmin: true,
          },
=======
            userType: 'ADMIN',
            adminApproved: true,
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      },
    },
  },
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: 'johndoe@gmail.com',
        password: 'jdoe',
      },
    },
    result: {
      data: {
        login: {
          user: {
            _id: '1',
<<<<<<< HEAD
            firstName: 'firstname',
            lastName: 'secondname',
            email: 'tempemail@example.com',
            image: 'image',
          },
          appUserProfile: {
            adminFor: {},
            isSuperAdmin: false,
=======
            userType: 'ADMIN',
            adminApproved: false,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: 'invalid@gmail.com',
        password: 'anything',
      },
    },
    result: {},
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
<<<<<<< HEAD
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const setCurrentMode: React.Dispatch<SetStateAction<string>> = jest.fn();

const props = {
  setCurrentMode,
};

describe('Testing Login Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();
  });

  test('Expect the mode to be changed to Register', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.click(screen.getByTestId('setRegisterBtn'));

    expect(setCurrentMode).toBeCalledWith('register');
  });

  test('toast.error is triggered if the email input is empty.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.click(screen.getByTestId('loginBtn'));

    expect(toast.error).toBeCalledWith(
<<<<<<< HEAD
      'Please enter a valid email and password.',
=======
      'Please enter a valid email and password.'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });

  test('toast.error is triggered if the password input is empty.', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      password: 'joe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Enter your email address/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    userEvent.click(screen.getByTestId('loginBtn'));

    expect(toast.error).toBeCalledWith(
<<<<<<< HEAD
      'Please enter a valid email and password.',
=======
      'Please enter a valid email and password.'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });

  test('Incorrect password is entered.', async () => {
    const formData = {
      email: 'invalid@gmail.com',
      password: 'anything',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Enter your email address/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter your password/i),
<<<<<<< HEAD
      formData.password,
=======
      formData.password
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByTestId('loginBtn'));

    expect(toast.error).toBeCalled();

    await wait();
  });

  test('Login details are entered correctly.', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      password: 'johndoe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Enter your email address/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter your password/i),
<<<<<<< HEAD
      formData.password,
=======
      formData.password
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByTestId('loginBtn'));

    await wait();
<<<<<<< HEAD
    expect(mockNavigate).toHaveBeenCalledWith('/user/organizations');
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Current user has not been approved by admin.', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      password: 'jdoe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Login {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Enter your email address/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter your password/i),
<<<<<<< HEAD
      formData.password,
=======
      formData.password
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByTestId('loginBtn'));

    expect(toast.error).toBeCalled();

    await wait();
  });
});
