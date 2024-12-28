import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import LoginPage from './LoginPage';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';
import useLocalStorage from 'utils/useLocalstorage';
import { GET_COMMUNITY_DATA, ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import { vi, beforeEach, expect, it, describe } from 'vitest';

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
        firstName: 'John Patrick ',
        lastName: 'Doe ',
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
            X: null,
            __typename: 'SocialMediaUrls',
          },
        },
      },
    },
  },
];
const MOCKS3 = [
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: '6437904485008f171cf29924',
            image: null,
            creator: {
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            name: 'Unity Foundation',
            members: [
              {
                _id: '64378abd85008f171cf2990d',
              },
            ],
            admins: [
              {
                _id: '64378abd85008f171cf2990d',
              },
            ],
            createdAt: '2023-04-13T05:16:52.827Z',
            address: {
              city: 'Bronx',
              countryCode: 'US',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '10451',
              sortingCode: 'ABC-123',
              state: 'NYC',
            },
          },
          {
            _id: 'db1d5caad2ade57ab811e681',
            image: null,
            creator: {
              firstName: 'Sonya',
              lastName: 'Jones',
            },
            name: 'Mills Group',
            members: [
              {
                _id: '661b8410bd25a325da05e67c',
              },
            ],
            admins: [
              {
                _id: '661b8410bd25a325da05e67c',
              },
            ],
            createdAt: '2024-04-14T07:21:52.940Z',
            address: {
              city: 'Lake Martineside',
              countryCode: 'SL',
              dependentLocality: 'Apt. 544',
              line1: '5112 Dare Centers',
              line2: 'Suite 163',
              postalCode: '10452',
              sortingCode: '46565-3458',
              state: 'New Hampshire',
            },
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('Constant/constant.ts', async () => ({
  ...(await vi.importActual('Constant/constant.ts')),
  REACT_APP_USE_RECAPTCHA: 'yes',
  RECAPTCHA_SITE_KEY: 'xxx',
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

const resetReCAPTCHA = vi.fn();
vi.mock('react-google-recaptcha', async () => {
  const react = await vi.importActual<typeof React>('react');
  const recaptcha = react.forwardRef(
    (
      props: {
        onChange: (value: string) => void;
      } & React.InputHTMLAttributes<HTMLInputElement>,
      ref: React.LegacyRef<HTMLInputElement> | undefined,
    ): JSX.Element => {
      const { onChange, ...otherProps } = props;

      Object.defineProperty(ref, 'current', {
        value: {
          reset: resetReCAPTCHA,
        },
      });

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
  return {
    __esModule: true,
    default: recaptcha,
  };
});

describe('Testing Login Page Screen', () => {
  it('Component Should be rendered properly', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'https://localhost:4321/orglist',
        origin: 'https://localhost:4321',
        pathname: '/orglist',
      },
    });

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
    expect(window.location.pathname).toBe('/orglist');
  });

  it('There should be default values of pre-login data when queried result is null', async () => {
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

  it('There should be a different values of pre-login data if the queried result is not null', async () => {
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

  it('Testing registration functionality', async () => {
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

  it('Testing registration functionality when all inputs are invalid', async () => {
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

  it('Testing registration functionality, when password and confirm password is not same', async () => {
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

  it('Testing registration functionality, when input is not filled correctly', async () => {
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

  it('switches to login tab on successful registration', async () => {
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

  it('Testing toggle login register portion', async () => {
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

  it('Testing login functionality', async () => {
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

  it('Testing ReCaptcha functionality, it should refresh on unsuccessful SignUp, using duplicate email', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'johnDoe@1',
      confirmPassword: 'johnDoe@1',
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

    await waitFor(() => {
      expect(resetReCAPTCHA).toBeCalled();
    });
  });

  it('Testing ReCaptcha functionality, it should refresh on unsuccessful login', async () => {
    const formData = {
      email: 'wrong_email@gmail.com',
      password: 'wrong_password',
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

    await waitFor(() => {
      expect(resetReCAPTCHA).toBeCalled();
    });
  });

  it('Testing password preview feature for login', async () => {
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

  it('Testing password preview feature for register', async () => {
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

  it('Testing confirm password preview feature', async () => {
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

  it('Testing for the password error warning when user firsts lands on a page', async () => {
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

  it('Testing for the password error warning when user clicks on password field and password is less than 8 character', async () => {
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

  it('Testing for the password error warning when user clicks on password field and password is greater than or equal to 8 character', async () => {
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

  it('Testing for the password error warning when user clicks on fields except password field and password is less than 8 character', async () => {
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

  it('Testing for the password error warning when user clicks on fields except password field and password is greater than or equal to 8 character', async () => {
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

  it('Component Should be rendered properly for user login', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'https://localhost:4321/user/organizations',
        origin: 'https://localhost:4321',
        pathname: '/user/organizations',
      },
    });

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
    expect(window.location.pathname).toBe('/user/organizations');
  });

  it('on value change of ReCAPTCHA onChange event should be triggered in both the captcha', async () => {
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
  it('Logged in as USER', async () => {
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
  it('Logged in as Admin or SuperAdmin', async () => {
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
it('Render the Select Organization list and change the option', async () => {
  render(
    <MockedProvider addTypename={false} link={link3}>
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
  const autocomplete = screen.getByTestId('selectOrg');
  const input = within(autocomplete).getByRole('combobox');
  autocomplete.focus();
  // the value here can be any string you want, so you may also consider to
  // wrapper it as a function and pass in inputValue as parameter
  fireEvent.change(input, { target: { value: 'a' } });
  fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
  fireEvent.keyDown(autocomplete, { key: 'Enter' });
});

describe('Talawa-API server fetch check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Checks if Talawa-API resource is loaded successfully', async () => {
    global.fetch = vi.fn(() => Promise.resolve({} as unknown as Response));

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

  it('displays warning message when resource loading fails', async () => {
    const mockError = new Error('Network error');
    global.fetch = vi.fn(() => Promise.reject(mockError));

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
