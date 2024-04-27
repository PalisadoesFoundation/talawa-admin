import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { StaticMockLink } from 'utils/StaticMockLink';
import LoginPage from './LoginPage';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_COMMUNITY,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';
import useLocalStorage from 'utils/useLocalstorage';
import { GET_COMMUNITY_DATA } from 'GraphQl/Queries/Queries';

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
          },
          appUserProfile: {
            isSuperAdmin: false,
            adminFor: ['123', '456'],
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe',
      },
    },
    result: {
      data: {
        register: {
          user: {
            _id: '1',
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: RECAPTCHA_MUTATION,
      variables: {
        recaptchaToken: null,
      },
    },
    result: {
      data: {
        recaptcha: true,
      },
    },
  },
  {
    request: {
      query: GET_COMMUNITY_DATA,
    },
    result: {
      data: {
        getCommunityData: null,
      },
    },
  },
];
const MOCKS2 = [
  {
    request: {
      query: GET_COMMUNITY_DATA,
    },
    result: {
      data: {
        getCommunityData: {
          _id: 'communitId',
          websiteLink: 'http://link.com',
          name: 'testName',
          logoUrl: 'image.png',
          __typename: 'Community',
          socialMediaUrls: {
            facebook: 'http://url.com',
            gitHub: 'http://url.com',
            youTube: 'http://url.com',
            instagram: 'http://url.com',
            linkedIn: 'http://url.com',
            reddit: 'http://url.com',
            slack: 'http://url.com',
            twitter: null,
            __typename: 'SocialMediaUrls',
          },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);

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

jest.mock('Constant/constant.ts', () => ({
  ...jest.requireActual('Constant/constant.ts'),
  REACT_APP_USE_RECAPTCHA: 'yes',
  RECAPTCHA_SITE_KEY: 'xxx',
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-google-recaptcha', () => {
  const react = jest.requireActual('react');
  const recaptcha = react.forwardRef(
    (
      props: {
        onChange: (value: string) => void;
      } & React.InputHTMLAttributes<HTMLInputElement>,
      ref: React.LegacyRef<HTMLInputElement> | undefined,
    ): JSX.Element => {
      const { onChange, ...otherProps } = props;

      const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ): void => {
        if (onChange) {
          onChange(event.target.value);
        }
      };

      return (
        <>
          <input
            type="text"
            data-testid="mock-recaptcha"
            {...otherProps}
            onChange={handleChange}
            ref={ref}
          />
        </>
      );
    },
  );
  return recaptcha;
});

describe('Testing Login Page Screen', () => {
  test('Component Should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const adminLink = screen.getByText(/Admin/i);
    userEvent.click(adminLink);
    await wait();
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('There should be default values of pre-login data when queried result is null', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByTestId('PalisadoesLogo')).toBeInTheDocument();
    expect(
      screen.getAllByTestId('PalisadoesSocialMedia')[0],
    ).toBeInTheDocument();

    await wait();
    expect(screen.queryByTestId('preLoginLogo')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('preLoginSocialMedia')[0]).toBeUndefined();
  });

  test('There should be a different values of pre-login data if the queried result is not null', async () => {
    render(
      <MockedProvider addTypename={true} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByTestId('preLoginLogo')).toBeInTheDocument();
    expect(screen.getAllByTestId('preLoginSocialMedia')[0]).toBeInTheDocument();

    await wait();
    expect(screen.queryByTestId('PalisadoesLogo')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('PalisadoesSocialMedia')[0]).toBeUndefined();
  });

  test('Testing registration functionality', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'John@123',
      confirmPassword: 'John@123',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword,
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing registration functionality when all inputs are invalid', async () => {
    const formData = {
      firstName: '1234',
      lastName: '8890',
      email: 'j@l.co',
      password: 'john@123',
      confirmPassword: 'john@123',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword,
    );
    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing registration functionality, when password and confirm password is not same', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'johnDoe@1',
      confirmPassword: 'doeJohn@2',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword,
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing registration functionality, when input is not filled correctly', async () => {
    const formData = {
      firstName: 'J',
      lastName: 'D',
      email: 'johndoe@gmail.com',
      password: 'joe',
      confirmPassword: 'joe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword,
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('switches to login tab on successful registration', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'johndoe',
      confirmPassword: 'johndoe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));
    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword,
    );

    userEvent.click(screen.getByTestId('registrationBtn'));

    await wait();

    // Check if the login tab is now active by checking for elements that only appear in the login tab
    expect(screen.getByTestId('loginBtn')).toBeInTheDocument();
    expect(screen.getByTestId('goToRegisterPortion')).toBeInTheDocument();
  });

  test('Testing toggle login register portion', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    userEvent.click(screen.getByTestId('goToLoginPortion'));

    await wait();
  });

  test('Testing login functionality', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      password: 'johndoe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password,
    );

    userEvent.click(screen.getByTestId('loginBtn'));

    await wait();
  });

  test('Testing password preview feature for login', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('password') as HTMLInputElement;
    const toggleText = screen.getByTestId('showLoginPassword');
    // password should be hidden
    expect(input.type).toBe('password');
    // click the toggle button to show password
    userEvent.click(toggleText);
    expect(input.type).toBe('text');
    // click the toggle button to hide password
    userEvent.click(toggleText);
    expect(input.type).toBe('password');

    await wait();
  });

  test('Testing password preview feature for register', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    const input = screen.getByTestId('passwordField') as HTMLInputElement;
    const toggleText = screen.getByTestId('showPassword');
    // password should be hidden
    expect(input.type).toBe('password');
    // click the toggle button to show password
    userEvent.click(toggleText);
    expect(input.type).toBe('text');
    // click the toggle button to hide password
    userEvent.click(toggleText);
    expect(input.type).toBe('password');

    await wait();
  });

  test('Testing confirm password preview feature', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    const input = screen.getByTestId('cpassword') as HTMLInputElement;
    const toggleText = screen.getByTestId('showPasswordCon');
    // password should be hidden
    expect(input.type).toBe('password');
    // click the toggle button to show password
    userEvent.click(toggleText);
    expect(input.type).toBe('text');
    // click the toggle button to hide password
    userEvent.click(toggleText);
    expect(input.type).toBe('password');

    await wait();
  });

  test('Testing for the password error warning when user firsts lands on a page', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });

  test('Testing for the password error warning when user clicks on password field and password is less than 8 character', async () => {
    const password = {
      password: '7',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(screen.getByTestId('passwordField')).toHaveFocus();

    expect(password.password.length).toBeLessThan(8);

    expect(screen.queryByTestId('passwordCheck')).toBeInTheDocument();
  });

  test('Testing for the password error warning when user clicks on password field and password is greater than or equal to 8 character', async () => {
    const password = {
      password: '12345678',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(screen.getByTestId('passwordField')).toHaveFocus();

    expect(password.password.length).toBeGreaterThanOrEqual(8);

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });

  test('Testing for the password error warning when user clicks on fields except password field and password is less than 8 character', async () => {
    const password = {
      password: '7',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    expect(screen.getByPlaceholderText('Password')).not.toHaveFocus();

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(password.password.length).toBeLessThan(8);

    expect(screen.queryByTestId('passwordCheck')).toBeInTheDocument();
  });

  test('Testing for the password error warning when user clicks on fields except password field and password is greater than or equal to 8 character', async () => {
    const password = {
      password: '12345678',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    await wait();

    expect(screen.getByPlaceholderText('Password')).not.toHaveFocus();

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(password.password.length).toBeGreaterThanOrEqual(8);

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });

  test('Component Should be rendered properly for user login', async () => {
    window.location.assign('/user/organizations');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const userLink = screen.getByText(/User/i);
    userEvent.click(userLink);
    await wait();
    expect(screen.getByText(/User Login/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/user/organizations');
  });

  test('on value change of ReCAPTCHA onChange event should be triggered in both the captcha', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const recaptchaElements = screen.getAllByTestId('mock-recaptcha');

    for (const recaptchaElement of recaptchaElements) {
      const inputElement = recaptchaElement as HTMLInputElement;

      fireEvent.input(inputElement, {
        target: { value: 'test-token' },
      });

      fireEvent.change(inputElement, {
        target: { value: 'test-token2' },
      });

      expect(recaptchaElement).toHaveValue('test-token2');
    }
  });
});

describe('Testing redirect if already logged in', () => {
  test('Logged in as USER', async () => {
    const { setItem } = useLocalStorage();
    setItem('IsLoggedIn', 'TRUE');
    setItem('userId', 'id');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(mockNavigate).toHaveBeenCalledWith('/user/organizations');
  });
  test('Logged in as Admin or SuperAdmin', async () => {
    const { setItem } = useLocalStorage();
    setItem('IsLoggedIn', 'TRUE');
    setItem('userId', null);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(mockNavigate).toHaveBeenCalledWith('/orglist');
  });
});

describe('Talawa-API server fetch check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Checks if Talawa-API resource is loaded successfully', async () => {
    global.fetch = jest.fn(() => Promise.resolve({} as unknown as Response));

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    expect(fetch).toHaveBeenCalledWith(BACKEND_URL);
  });

  test('displays warning message when resource loading fails', async () => {
    const mockError = new Error('Network error');
    global.fetch = jest.fn(() => Promise.reject(mockError));

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    expect(fetch).toHaveBeenCalledWith(BACKEND_URL);
  });
});
