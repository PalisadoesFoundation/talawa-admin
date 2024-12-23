import { useQuery, useMutation } from '@apollo/client';
import { Check, Clear } from '@mui/icons-material';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  BACKEND_URL,
  REACT_APP_USE_RECAPTCHA,
  RECAPTCHA_SITE_KEY,
} from 'Constant/constant';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { GET_COMMUNITY_DATA, ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import LoginPortalToggle from 'components/LoginPortalToggle/LoginPortalToggle';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { socialMediaLinks } from '../../constants';
import styles from './LoginPage.module.css';
import type { InterfaceQueryOrganizationListObject } from 'utils/interfaces';
import { Autocomplete, TextField } from '@mui/material';
import useSession from 'utils/useSession';
import i18n from 'utils/i18n';

/**
 * LoginPage component is used to render the login page of the application where user can login or register
 * to the application using email and password. The component also provides the functionality to switch between login and
 * register form.
 *
 */

const loginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const navigate = useNavigate();

  const { getItem, setItem } = useLocalStorage();

  document.title = t('title');

  type PasswordValidation = {
    lowercaseChar: boolean;
    uppercaseChar: boolean;
    numericValue: boolean;
    specialChar: boolean;
  };

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [showTab, setShowTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [signformState, setSignFormState] = useState({
    signfirstName: '',
    signlastName: '',
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
  const [organizations, setOrganizations] = useState([]);

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

  const handleRoleToggle = (role: 'admin' | 'user'): void => {
    setRole(role);
  };

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

  const { data, refetch } = useQuery(GET_COMMUNITY_DATA);
  useEffect(() => {
    // refetching the data if the pre-login data updates
    refetch();
  }, [data]);
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);
  const { data: orgData } = useQuery(ORGANIZATION_LIST);
  const { startSession, extendSession } = useSession();
  useEffect(() => {
    if (orgData) {
      const options = orgData.organizations.map(
        (org: InterfaceQueryOrganizationListObject) => {
          const tempObj: { label: string; id: string } | null = {} as {
            label: string;
            id: string;
          };
          tempObj['label'] =
            `${org.name}(${org.address?.city},${org.address?.state},${org.address?.countryCode})`;
          tempObj['id'] = org._id;
          return tempObj;
        },
      );
      setOrganizations(options);
    }
  }, [orgData]);

  useEffect(() => {
    async function loadResource(): Promise<void> {
      try {
        await fetch(BACKEND_URL as string);
      } catch (error) {
        errorHandler(t, error);
      }
    }

    loadResource();
  }, []);

  const verifyRecaptcha = async (
    recaptchaToken: string | null,
  ): Promise<boolean | void> => {
    try {
      if (REACT_APP_USE_RECAPTCHA !== 'yes') {
        return true;
      }
      const { data } = await recaptcha({
        variables: {
          recaptchaToken,
        },
      });

      return data.recaptcha;
    } catch {
      toast.error(t('captchaError') as string);
    }
  };

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const signupLink = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const {
      signfirstName,
      signlastName,
      signEmail,
      signPassword,
      cPassword,
      signOrg,
    } = signformState;

    const isVerified = await verifyRecaptcha(recaptchaToken);

    if (!isVerified) {
      toast.error(t('Please_check_the_captcha') as string);
      return;
    }

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
      isValidName(signfirstName) &&
      isValidName(signlastName) &&
      signfirstName.trim().length > 1 &&
      signlastName.trim().length > 1 &&
      signEmail.length >= 8 &&
      signPassword.length > 1 &&
      validatePassword(signPassword)
    ) {
      if (cPassword == signPassword) {
        try {
          const { data: signUpData } = await signup({
            variables: {
              firstName: signfirstName,
              lastName: signlastName,
              email: signEmail,
              password: signPassword,
              orgId: signOrg,
            },
          });

          if (signUpData) {
            toast.success(
              t(
                role === 'admin' ? 'successfullyRegistered' : 'afterRegister',
              ) as string,
            );
            setShowTab('LOGIN');
            setSignFormState({
              signfirstName: '',
              signlastName: '',
              signEmail: '',
              signPassword: '',
              cPassword: '',
              signOrg: '',
            });
          }
        } catch (error) {
          errorHandler(t, error);
        }
      } else {
        toast.warn(t('passwordMismatches') as string);
      }
    } else {
      if (!isValidName(signfirstName)) {
        toast.warn(t('firstName_invalid') as string);
      }
      if (!isValidName(signlastName)) {
        toast.warn(t('lastName_invalid') as string);
      }
      if (!validatePassword(signPassword)) {
        toast.warn(t('password_invalid') as string);
      }
      if (signEmail.length < 8) {
        toast.warn(t('email_invalid') as string);
      }
    }
  };

  const loginLink = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const isVerified = await verifyRecaptcha(recaptchaToken);

    if (!isVerified) {
      toast.error(t('Please_check_the_captcha') as string);
      return;
    }

    try {
      const { data: loginData } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });

      if (loginData) {
        i18n.changeLanguage(loginData.login.appUserProfile.appLanguageCode);
        const { login } = loginData;
        const { user, appUserProfile } = login;
        const isAdmin: boolean =
          appUserProfile.isSuperAdmin || appUserProfile.adminFor.length !== 0;

        if (role === 'admin' && !isAdmin) {
          toast.warn(tErrors('notAuthorised') as string);
          return;
        }
        const loggedInUserId = user._id;

        setItem('token', login.accessToken);
        setItem('refreshToken', login.refreshToken);
        setItem('IsLoggedIn', 'TRUE');
        setItem('name', `${user.firstName} ${user.lastName}`);
        setItem('email', user.email);
        setItem('FirstName', user.firstName);
        setItem('LastName', user.lastName);
        setItem('UserImage', user.image);

        if (role === 'admin') {
          setItem('id', loggedInUserId);
          setItem('SuperAdmin', appUserProfile.isSuperAdmin);
          setItem('AdminFor', appUserProfile.adminFor);
        } else {
          setItem('userId', loggedInUserId);
        }

        navigate(role === 'admin' ? '/orglist' : '/user/organizations');
        startSession();
      } else {
        toast.warn(tErrors('notFound') as string);
      }
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const socialIconsList = socialMediaLinks.map(({ href, logo, tag }, index) =>
    data?.getCommunityData ? (
      data.getCommunityData?.socialMediaUrls?.[tag] && (
        <a
          key={index}
          href={data.getCommunityData?.socialMediaUrls?.[tag]}
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
              {data?.getCommunityData ? (
                <a
                  href={data.getCommunityData.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.communityLogo}`}
                >
                  <img
                    src={data.getCommunityData.logoUrl}
                    alt="Community Logo"
                    data-testid="preLoginLogo"
                  />
                  <p className="text-center">{data.getCommunityData.name}</p>
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

              <LoginPortalToggle onToggle={handleRoleToggle} />

              {/* LOGIN FORM */}
              <div
                className={`${
                  showTab === 'LOGIN' ? styles.active_tab : 'd-none'
                }`}
              >
                <form onSubmit={loginLink}>
                  <h1 className="fs-2 fw-bold text-dark mb-3">
                    {role === 'admin' ? tCommon('login') : t('userLogin')}
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
                  {REACT_APP_USE_RECAPTCHA === 'yes' ? (
                    <div className="googleRecaptcha">
                      <ReCAPTCHA
                        className="mt-2"
                        sitekey={
                          RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'
                        }
                        onChange={handleCaptcha}
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
                  >
                    {tCommon('login')}
                  </Button>
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
                    {tCommon('register')}
                  </Button>
                </form>
              </div>
              {/* REGISTER FORM */}
              <div
                className={`${
                  showTab === 'REGISTER' ? styles.active_tab : 'd-none'
                }`}
              >
                <Form onSubmit={signupLink}>
                  <h1 className="fs-2 fw-bold text-dark mb-3">
                    {tCommon('register')}
                  </h1>
                  <Row>
                    <Col sm={6}>
                      <div>
                        <Form.Label>{tCommon('firstName')}</Form.Label>
                        <Form.Control
                          disabled={signinLoading}
                          type="text"
                          id="signfirstname"
                          className="mb-3"
                          placeholder={tCommon('firstName')}
                          required
                          value={signformState.signfirstName}
                          onChange={(e): void => {
                            setSignFormState({
                              ...signformState,
                              signfirstName: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
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
                        />
                      </div>
                    </Col>
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
                        className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
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
                        className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
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
                              {t('atleast_6_char_long')}
                            </p>
                          </div>
                        ) : (
                          <p
                            className={`form-text text-success ${styles.password_check_element_top}`}
                          >
                            <span>
                              <Check />
                            </span>
                            {t('atleast_6_char_long')}
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
                            {t('atleast_6_char_long')}
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
                          {t('lowercase_check')}
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
                          {t('uppercase_check')}
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
                          {t('numeric_value_check')}
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
                          {t('special_char_check')}
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
                        className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
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
                          {t('Password_and_Confirm_password_mismatches.')}
                        </div>
                      )}
                  </div>
                  <div className="position-relative  my-2">
                    <Form.Label>{t('selectOrg')}</Form.Label>
                    <div className="position-relative">
                      <Autocomplete
                        disablePortal
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Organizations"
                            className={styles.selectOrgText}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {REACT_APP_USE_RECAPTCHA === 'yes' ? (
                    <div className="mt-3">
                      <ReCAPTCHA
                        sitekey={
                          RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'
                        }
                        onChange={handleCaptcha}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Button
                    type="submit"
                    className="mt-4 w-100 mb-3"
                    value="Register"
                    data-testid="registrationBtn"
                    disabled={signinLoading}
                  >
                    {tCommon('register')}
                  </Button>
                  <div className="position-relative">
                    <hr />
                    <span className={styles.orText}>{tCommon('OR')}</span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    value="Register"
                    className="mt-3 mb-5 w-100"
                    data-testid="goToLoginPortion"
                    onClick={(): void => {
                      setShowTab('LOGIN');
                      setShowPassword(false);
                    }}
                  >
                    {tCommon('login')}
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
