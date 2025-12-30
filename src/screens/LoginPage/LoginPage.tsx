/**
 * LoginPage component.
 *
 * Provides login and registration flows with validation, reCAPTCHA, and
 * organization selection. Supports admin and user roles with localization.
 *
 * @remarks
 * Includes password strength checks, social links, and community branding.
 *
 * @example
 * ```tsx
 * <LoginPage />
 * ```
 */
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import type { ChangeEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  REACT_APP_USE_RECAPTCHA,
  RECAPTCHA_SITE_KEY,
  BACKEND_URL,
} from 'Constant/constant';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_LIST_PUBLIC,
  InterfaceOrganizationListPublicQueryData,
  InterfaceOrganizationPublic,
  SIGNIN_QUERY,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { socialMediaLinks } from '../../constants';
import styles from './LoginPage.module.css';
import type { InterfaceQueryOrganizationListObject } from 'utils/interfaces';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useSession from 'utils/useSession';
import i18n from 'utils/i18n';

const loginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const navigate = useNavigate();

  const { getItem, setItem, removeItem } = useLocalStorage();

  document.title = t('title');

  type PasswordValidation = {
    lowercaseChar: boolean;
    uppercaseChar: boolean;
    numericValue: boolean;
    specialChar: boolean;
  };

  const loginRecaptchaRef = useRef<ReCAPTCHA>(null);
  const SignupRecaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [showTab, setShowTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [signformState, setSignFormState] = useState({
    signName: '',
    signEmail: '',
    signPassword: '',
    cPassword: '',
    signOrg: '',
  });
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<PasswordValidation>({
    lowercaseChar: true,
    uppercaseChar: true,
    numericValue: true,
    specialChar: true,
  });
  const [organizations, setOrganizations] = useState<
    { label: string; id: string }[]
  >([]);
  const [pendingInvitationToken] = useState(() =>
    getItem('pendingInvitationToken'),
  );
  const location = useLocation();
  const passwordValidationRegExp = {
    lowercaseCharRegExp: new RegExp('[a-z]'),
    uppercaseCharRegExp: new RegExp('[A-Z]'),
    numericalValueRegExp: new RegExp('\\d'),
    specialCharRegExp: new RegExp('[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-]'),
  };

  const handlePasswordCheck = (pass: string): void => {
    setShowAlert({
      lowercaseChar: !passwordValidationRegExp.lowercaseCharRegExp.test(pass),
      uppercaseChar: !passwordValidationRegExp.uppercaseCharRegExp.test(pass),
      numericValue: !passwordValidationRegExp.numericalValueRegExp.test(pass),
      specialChar: !passwordValidationRegExp.specialCharRegExp.test(pass),
    });
  };

  useEffect(() => {
    const isRegister = location.pathname === '/register';
    if (isRegister) {
      setShowTab('REGISTER');
    }
    const isAdmin = location.pathname === '/admin';
    if (isAdmin) {
      setRole('admin');
    } else {
      setRole('user');
    }
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      navigate(getItem('userId') !== null ? '/user/organizations' : '/orglist');
      extendSession();
    }
  }, []);

  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  const { data, refetch } = useQuery(GET_COMMUNITY_DATA_PG);
  useEffect(() => {
    refetch();
  }, [data]);
  const [signin, { loading: loginLoading }] = useLazyQuery(SIGNIN_QUERY);
  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);
  const { data: orgData } = useQuery(ORGANIZATION_LIST_NO_MEMBERS);
  const { startSession, extendSession } = useSession();
  useEffect(() => {
    if (orgData) {
      const options = orgData.organizations.map(
        (org: InterfaceOrganizationPublic) => {
          const tempObj: { label: string; id: string } | null = {} as {
            label: string;
            id: string;
          };
          tempObj['label'] = `${org.name}(${org.addressLine1})`;
          tempObj['id'] = org.id;
          return tempObj;
        },
      );
      setOrganizations(options);
    }
  }, [orgData, orgLoading, orgError]);

  useEffect(() => {
    async function loadResource(): Promise<void> {
      try {
        // Use a proper GraphQL introspection query instead of plain fetch
        await fetch(BACKEND_URL as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '{ __typename }',
          }),
        });
      } catch (error) {
        errorHandler(t, error);
      }
    }

    loadResource();
  }, []);

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const signupLink = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const { signName, signEmail, signPassword, cPassword } = signformState;

    const isValidName = (value: string): boolean => {
      // Allow letters, spaces, and hyphens, but not consecutive spaces or hyphens
      return /^[a-zA-Z]+(?:[-\s][a-zA-Z]+)*$/.test(value.trim());
    };

    const validatePassword = (password: string): boolean => {
      const lengthCheck = new RegExp('^.{6,}$');
      return (
        lengthCheck.test(password) &&
        passwordValidationRegExp.lowercaseCharRegExp.test(password) &&
        passwordValidationRegExp.uppercaseCharRegExp.test(password) &&
        passwordValidationRegExp.numericalValueRegExp.test(password) &&
        passwordValidationRegExp.specialCharRegExp.test(password)
      );
    };

    if (
      isValidName(signName) &&
      signName.trim().length > 1 &&
      signEmail.length >= 8 &&
      signPassword.length > 1 &&
      validatePassword(signPassword)
    ) {
      if (cPassword == signPassword) {
        try {
          const { data: signUpData } = await signup({
            variables: {
              ID: signformState.signOrg,
              name: signName,
              email: signEmail,
              password: signPassword,
              ...(recaptchaToken && { recaptchaToken }),
            },
          });

          if (signUpData) {
            NotificationToast.success(
              t(
                role === 'admin' ? 'successfullyRegistered' : 'afterRegister',
              ) as string,
            );
            setShowTab('LOGIN');
            setSignFormState({
              signName: '',
              signEmail: '',
              signPassword: '',
              cPassword: '',
              signOrg: '',
            });
            SignupRecaptchaRef.current?.reset();
            // If signup was successful, set session state and resume pending invite
            // Note: Tokens are now set via HTTP-Only cookies by the server (XSS protection)
            if (signUpData.signUp && signUpData.signUp.authenticationToken) {
              setItem('IsLoggedIn', 'TRUE');
              // Use form data for name/email since SIGNUP_MUTATION only returns user.id
              setItem('name', signName);
              setItem('email', signEmail);
              // Persist userId from API response
              if (signUpData.signUp.user?.id) {
                setItem('userId', signUpData.signUp.user.id);
              }
              // Set default role as 'user' for signup (parity with login flow)
              setItem('role', 'user');
              if (pendingInvitationToken) {
                removeItem('pendingInvitationToken');
                startSession();
                window.location.href = `/event/invitation/${pendingInvitationToken}`;
                return;
              }
            }
          }
        } catch (error) {
          errorHandler(t, error);
          SignupRecaptchaRef.current?.reset();
        }
      } else {
        NotificationToast.warning(t('passwordMismatches') as string);
      }
    } else {
      if (!isValidName(signName)) {
        NotificationToast.warning(t('nameInvalid') as string);
      }
      if (!validatePassword(signPassword)) {
        NotificationToast.warning(t('passwordInvalid') as string);
      }
      if (signEmail.length < 8) {
        NotificationToast.warning(t('emailInvalid') as string);
      }
    }
  };

  const loginLink = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const { data: signInData, error: signInError } = await signin({
        variables: {
          email: formState.email,
          password: formState.password,
          ...(recaptchaToken && { recaptchaToken }),
        },
        fetchPolicy: 'network-only', // Always make network request to receive Set-Cookie headers
      });

      // Check for GraphQL errors (like account_locked) first
      if (signInError) {
        // Check if this is an account_locked error with retryAfter timestamp
        const graphQLError = signInError.graphQLErrors?.[0];
        const extensions = graphQLError?.extensions as
          | { code?: string; retryAfter?: string }
          | undefined;

        if (extensions?.code === 'account_locked' && extensions?.retryAfter) {
          // Calculate remaining minutes until unlock
          const retryAfterDate = new Date(extensions.retryAfter);
          const now = new Date();
          const diffMs = retryAfterDate.getTime() - now.getTime();
          const diffMinutes = Math.max(1, Math.ceil(diffMs / 60000));

          NotificationToast.error(
            tErrors('accountLockedWithTimer', { minutes: diffMinutes }),
          );
        } else {
          errorHandler(t, signInError);
        }
        loginRecaptchaRef.current?.reset();
        return;
      }

      if (signInData) {
        if (signInData.signIn.user.countryCode !== null) {
          i18n.changeLanguage(signInData.signIn.user.countryCode);
        }

        const { signIn } = signInData;
        const { user } = signIn;
        // Note: authenticationToken and refreshToken are now set via HTTP-Only cookies by the server (XSS protection)
        const isAdmin: boolean = user.role === 'administrator';
        if (role === 'admin' && !isAdmin) {
          NotificationToast.warning(tErrors('notAuthorised') as string);
          return;
        }
        const loggedInUserId = user.id;

        // Store UI state in localStorage (tokens are in HTTP-Only cookies)
        setItem('IsLoggedIn', 'TRUE');
        setItem('name', user.name);
        setItem('email', user.emailAddress);
        setItem('role', user.role);
        setItem('UserImage', user.avatarURL || '');
        if (role === 'admin') {
          setItem('id', loggedInUserId);
        } else {
          setItem('userId', loggedInUserId);
        }

        // If there is a pending invitation token from the public invite flow, resume it
        // We check the component state (captured on mount) rather than localStorage
        // because localStorage may have been cleared by session management code.
        if (pendingInvitationToken) {
          removeItem('pendingInvitationToken');
          startSession();
          // Use a full-page redirect to avoid client-side routing races
          window.location.href = `/event/invitation/${pendingInvitationToken}`;
          return;
        }
        startSession();
        navigate(role === 'admin' ? '/orglist' : '/user/organizations');
      } else {
        NotificationToast.warning(tErrors('notFound') as string);
      }
    } catch (error) {
      errorHandler(t, error);
      loginRecaptchaRef.current?.reset();
    }
  };

  const socialIconsList = socialMediaLinks.map(({ href, logo, tag }, index) =>
    data?.community ? (
      data.community?.[tag] && (
        <a
          key={index}
          href={data.community?.[tag]}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="preLoginSocialMedia"
        >
          <img src={logo} />
        </a>
      )
    ) : (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="PalisadoesSocialMedia"
      >
        <img src={logo} />
      </a>
    ),
  );

  return (
    <>
      <section className={styles.login_background}>
        <Row className={styles.row}>
          <Col sm={0} md={6} lg={7} className={styles.left_portion}>
            <div className={styles.inner}>
              {data?.community ? (
                <a
                  href={data.community.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.communityLogo}`}
                >
                  <img
                    src={data.community.logoURL}
                    alt={t('communityLogo')}
                    data-testid="preLoginLogo"
                  />
                  <p className="text-center">{data.community.name}</p>
                </a>
              ) : (
                <a
                  href="https://www.palisadoes.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PalisadoesLogo
                    className={styles.palisadoes_logo}
                    data-testid="PalisadoesLogo"
                  />
                  <p className="text-center">{t('fromPalisadoes')}</p>
                </a>
              )}
            </div>
            <div className={styles.socialIcons}>{socialIconsList}</div>
          </Col>
          <Col sm={12} md={6} lg={5}>
            <div className={styles.right_portion}>
              <ChangeLanguageDropDown
                parentContainerStyle={styles.langChangeBtn}
                btnStyle={styles.langChangeBtnStyle}
              />
              <TalawaLogo
                className={`${styles.talawa_logo}  ${
                  showTab === 'REGISTER' && styles.marginTopForReg
                }`}
              />
              {/* LOGIN FORM */}
              <div
                className={`${
                  showTab === 'LOGIN' ? styles.active_tab : 'd-none'
                }`}
              >
                <form onSubmit={loginLink}>
                  <h1 className="fs-2 fw-bold text-dark mb-3">
                    {/* {role === 'admin' ? tCommon('login') : t('userLogin')} */}
                    {role === 'admin' ? t('adminLogin') : t('userLogin')}
                  </h1>
                  <Form.Label>{tCommon('email')}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      disabled={loginLoading}
                      placeholder={tCommon('enterEmail')}
                      required
                      value={formState.email}
                      onChange={(e): void => {
                        setFormState({
                          ...formState,
                          email: e.target.value,
                        });
                      }}
                      autoComplete="username"
                      data-testid="loginEmail"
                      data-cy="loginEmail"
                    />
                    <Button tabIndex={-1} className={styles.email_button}>
                      <EmailOutlinedIcon />
                    </Button>
                  </div>
                  <Form.Label className="mt-3">
                    {tCommon('password')}
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      className="input_box_second lh-1"
                      placeholder={tCommon('enterPassword')}
                      required
                      value={formState.password}
                      data-testid="password"
                      onChange={(e): void => {
                        setFormState({
                          ...formState,
                          password: e.target.value,
                        });
                      }}
                      disabled={loginLoading}
                      autoComplete="current-password"
                      data-cy="loginPassword"
                    />
                    <Button
                      onClick={togglePassword}
                      data-testid="showLoginPassword"
                      className={styles.email_button}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </Button>
                  </div>
                  <div className="text-end mt-3">
                    <Link
                      to="/forgotPassword"
                      className="text-secondary"
                      tabIndex={-1}
                    >
                      {tCommon('forgotPassword')}
                    </Link>
                  </div>
                  {REACT_APP_USE_RECAPTCHA === 'YES' ? (
                    <div className="googleRecaptcha">
                      <ReCAPTCHA
                        ref={loginRecaptchaRef}
                        className="mt-2"
                        sitekey={
                          RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'
                        }
                        onChange={handleCaptcha}
                        data-cy="loginRecaptcha"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Button
                    disabled={loginLoading}
                    type="submit"
                    className={styles.login_btn}
                    value="Login"
                    data-testid="loginBtn"
                    data-cy="loginBtn"
                  >
                    {tCommon('login')}
                  </Button>
                  {location.pathname === '/admin' || (
                    <div>
                      <div className="position-relative my-2">
                        <hr />
                        <span className={styles.orText}>{tCommon('OR')}</span>
                      </div>
                      <Button
                        variant="outline-secondary"
                        value="Register"
                        className={styles.reg_btn}
                        data-testid="goToRegisterPortion"
                        onClick={(): void => {
                          setShowTab('REGISTER');
                          setShowPassword(false);
                        }}
                      >
                        <Link to={'/register'} className="text-decoration-none">
                          {tCommon('register')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </form>
              </div>
              {/* REGISTER FORM */}
              <div
                className={`${
                  showTab === 'REGISTER' ? styles.active_tab : 'd-none'
                }`}
              >
                <Form onSubmit={signupLink}>
                  <h1
                    className="fs-2 fw-bold text-dark mb-3"
                    data-testid="register-text"
                  >
                    {tCommon('register')}
                  </h1>
                  <Row>
                    {/* <Col sm={6}> */}
                    <div>
                      <Form.Label>{tCommon('Name')}</Form.Label>
                      <Form.Control
                        disabled={signinLoading}
                        type="text"
                        id="signname"
                        className="mb-3"
                        placeholder={tCommon('Name')}
                        required
                        value={signformState.signName}
                        onChange={(e): void => {
                          setSignFormState({
                            ...signformState,
                            signName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    {/* </Col> */}
                    {/* <Col sm={6}>
                      <div>
                        <Form.Label>{tCommon('lastName')}</Form.Label>
                        <Form.Control
                          disabled={signinLoading}
                          type="text"
                          id="signlastname"
                          className="mb-3"
                          placeholder={tCommon('lastName')}
                          required
                          value={signformState.signlastName}
                          onChange={(e): void => {
                            setSignFormState({
                              ...signformState,
                              signlastName: e.target.value,
                            });
                          }}
                        />dwdwdw
                      </div>
                    </Col> */}
                  </Row>
                  <div className="position-relative">
                    <Form.Label>{tCommon('email')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        disabled={signinLoading}
                        type="email"
                        data-testid="signInEmail"
                        className="mb-3"
                        placeholder={tCommon('email')}
                        autoComplete="username"
                        required
                        value={signformState.signEmail}
                        onChange={(e): void => {
                          setSignFormState({
                            ...signformState,
                            signEmail: e.target.value.toLowerCase(),
                          });
                        }}
                      />
                      <Button
                        tabIndex={-1}
                        className={`${styles.email_button}`}
                      >
                        <EmailOutlinedIcon />
                      </Button>
                    </div>
                  </div>

                  <div className="position-relative mb-3">
                    <Form.Label>{tCommon('password')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        disabled={signinLoading}
                        type={showPassword ? 'text' : 'password'}
                        data-testid="passwordField"
                        placeholder={tCommon('password')}
                        autoComplete="new-password"
                        onFocus={(): void => setIsInputFocused(true)}
                        onBlur={(): void => setIsInputFocused(false)}
                        required
                        value={signformState.signPassword}
                        onChange={(e): void => {
                          setSignFormState({
                            ...signformState,
                            signPassword: e.target.value,
                          });
                          handlePasswordCheck(e.target.value);
                        }}
                      />
                      <Button
                        onClick={togglePassword}
                        data-testid="showPassword"
                        className={`${styles.email_button}`}
                      >
                        {showPassword ? (
                          <i className="fas fa-eye"></i>
                        ) : (
                          <i className="fas fa-eye-slash"></i>
                        )}
                      </Button>
                    </div>
                    <div className={styles.password_checks}>
                      {isInputFocused ? (
                        signformState.signPassword.length < 6 ? (
                          <div data-testid="passwordCheck">
                            <p
                              className={`form-text text-danger ${styles.password_check_element_top}`}
                            >
                              <span>
                                <Clear className="" />
                              </span>
                              {t('atleastSixCharLong')}
                            </p>
                          </div>
                        ) : (
                          <p
                            className={`form-text text-success ${styles.password_check_element_top}`}
                          >
                            <span>
                              <Check />
                            </span>
                            {t('atleastSixCharLong')}
                          </p>
                        )
                      ) : null}

                      {!isInputFocused &&
                        signformState.signPassword.length > 0 &&
                        signformState.signPassword.length < 6 && (
                          <div
                            className={`form-text text-danger ${styles.password_check_element}`}
                            data-testid="passwordCheck"
                          >
                            <span>
                              <Check className="size-sm" />
                            </span>
                            {t('atleastSixCharLong')}
                          </div>
                        )}
                      {isInputFocused && (
                        <p
                          className={`form-text ${
                            showAlert.lowercaseChar
                              ? 'text-danger'
                              : 'text-success'
                          } ${styles.password_check_element}`}
                        >
                          {showAlert.lowercaseChar ? (
                            <span>
                              <Clear />
                            </span>
                          ) : (
                            <span>
                              <Check />
                            </span>
                          )}
                          {t('lowercaseCheck')}
                        </p>
                      )}
                      {isInputFocused && (
                        <p
                          className={`form-text ${
                            showAlert.uppercaseChar
                              ? 'text-danger'
                              : 'text-success'
                          } ${styles.password_check_element}`}
                        >
                          {showAlert.uppercaseChar ? (
                            <span>
                              <Clear />
                            </span>
                          ) : (
                            <span>
                              <Check />
                            </span>
                          )}
                          {t('uppercaseCheck')}
                        </p>
                      )}
                      {isInputFocused && (
                        <p
                          className={`form-text ${
                            showAlert.numericValue
                              ? 'text-danger'
                              : 'text-success'
                          } ${styles.password_check_element}`}
                        >
                          {showAlert.numericValue ? (
                            <span>
                              <Clear />
                            </span>
                          ) : (
                            <span>
                              <Check />
                            </span>
                          )}
                          {t('numericValueCheck')}
                        </p>
                      )}
                      {isInputFocused && (
                        <p
                          className={`form-text ${
                            showAlert.specialChar
                              ? 'text-danger'
                              : 'text-success'
                          } ${styles.password_check_element} ${
                            styles.password_check_element_bottom
                          }`}
                        >
                          {showAlert.specialChar ? (
                            <span>
                              <Clear />
                            </span>
                          ) : (
                            <span>
                              <Check />
                            </span>
                          )}
                          {t('specialCharCheck')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="position-relative">
                    <Form.Label>{tCommon('confirmPassword')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        disabled={signinLoading}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={tCommon('confirmPassword')}
                        required
                        value={signformState.cPassword}
                        onChange={(e): void => {
                          setSignFormState({
                            ...signformState,
                            cPassword: e.target.value,
                          });
                        }}
                        data-testid="cpassword"
                        autoComplete="new-password"
                      />
                      <Button
                        data-testid="showPasswordCon"
                        onClick={toggleConfirmPassword}
                        className={`${styles.email_button}`}
                      >
                        {showConfirmPassword ? (
                          <i className="fas fa-eye"></i>
                        ) : (
                          <i className="fas fa-eye-slash"></i>
                        )}
                      </Button>
                    </div>
                    {signformState.cPassword.length > 0 &&
                      signformState.signPassword !==
                        signformState.cPassword && (
                        <div
                          className="form-text text-danger"
                          data-testid="passwordCheck"
                        >
                          {t('passwordMismatches')}
                        </div>
                      )}
                  </div>
                  <div className="position-relative  my-2">
                    <Form.Label>{t('selectOrg')}</Form.Label>
                    <div className="position-relative">
                      <Autocomplete
                        disablePortal
                        disabled={orgLoading || !!orgError}
                        data-testid="selectOrg"
                        onChange={(
                          event,
                          value: { label: string; id: string } | null,
                        ) => {
                          setSignFormState({
                            ...signformState,
                            signOrg: value?.id ?? '',
                          });
                        }}
                        options={organizations}
                        getOptionLabel={(option: {
                          label: string;
                          id: string;
                        }) => option.label || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('organizations')}
                            className={styles.selectOrgText}
                            helperText={
                              orgLoading
                                ? t('loadingOrganizations')
                                : orgError
                                  ? t('errorLoadingOrganizations')
                                  : undefined
                            }
                            error={!!orgError}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {REACT_APP_USE_RECAPTCHA === 'YES' ? (
                    <div className="mt-3">
                      <ReCAPTCHA
                        ref={SignupRecaptchaRef}
                        sitekey={
                          RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'
                        }
                        onChange={handleCaptcha}
                        data-cy="registrationRecaptcha"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Button
                    type="submit"
                    className={`mt-4 fw-bold w-100 mb-3 ${styles.login_btn}`}
                    value="Register"
                    data-testid="registrationBtn"
                    disabled={signinLoading}
                  >
                    {tCommon('register')}
                  </Button>
                  <div className="position-relative my-2">
                    <hr />
                    <span className={styles.orText}>{tCommon('OR')}</span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    className={styles.reg_btn}
                    data-testid="goToLoginPortion"
                    onClick={(): void => {
                      setShowTab('LOGIN');
                    }}
                  >
                    <Link to={'/'} className="text-decoration-none">
                      {t('backToLogin')}
                    </Link>
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default loginPage;
