import { useMutation } from '@apollo/client';
import type { ChangeEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, Clear } from '@mui/icons-material';

import {
  FacebookLogo,
  LinkedInLogo,
  GithubLogo,
  InstagramLogo,
  SlackLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'assets/svgs/social-icons';

import {
  REACT_APP_USE_RECAPTCHA,
  RECAPTCHA_SITE_KEY,
  BACKEND_URL,
} from 'Constant/constant';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import { ReactComponent as PalisadoesLogo } from 'assets/svgs/palisadoes.svg';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import LoginPortalToggle from 'components/LoginPortalToggle/LoginPortalToggle';
import Loader from 'components/Loader/Loader';
import { errorHandler } from 'utils/errorHandler';
import styles from './LoginPage.module.css';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import useLocalStorage from 'utils/useLocalstorage';

function loginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const history = useHistory();

  const { getItem, setItem } = useLocalStorage();

  document.title = t('title');

  type PasswordValidation = {
    lowercaseChar: boolean;
    uppercaseChar: boolean;
    numericValue: boolean;
    specialChar: boolean;
  };
  const [showTab, setShowTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [componentLoader, setComponentLoader] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [signformState, setSignFormState] = useState({
    signfirstName: '',
    signlastName: '',
    signEmail: '',
    signPassword: '',
    cPassword: '',
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

  const passwordValidationRegExp = {
    lowercaseCharRegExp: new RegExp('[a-z]'),
    uppercaseCharRegExp: new RegExp('[A-Z]'),
    numericalValueRegExp: new RegExp('\\d'),
    specialCharRegExp: new RegExp('[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-]'),
  };
  const handleLowercasePassCheck = (pass: string): void => {
    setShowAlert((prevAlert) => ({
      ...prevAlert,
      lowercaseChar: !passwordValidationRegExp.lowercaseCharRegExp.test(pass),
    }));
  };

  const handleUppercasePassCheck = (pass: string): void => {
    setShowAlert((prevAlert) => ({
      ...prevAlert,
      uppercaseChar: !passwordValidationRegExp.uppercaseCharRegExp.test(pass),
    }));
  };
  const handleNumericalValuePassCheck = (pass: string): void => {
    setShowAlert((prevAlert) => ({
      ...prevAlert,
      numericValue: !passwordValidationRegExp.numericalValueRegExp.test(pass),
    }));
  };
  const handleSpecialCharPassCheck = (pass: string): void => {
    setShowAlert((prevAlert) => ({
      ...prevAlert,
      specialChar: !passwordValidationRegExp.specialCharRegExp.test(pass),
    }));
  };

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      history.push('/orglist');
    }
    setComponentLoader(false);
  }, []);

  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recaptcha, { loading: recaptchaLoading }] =
    useMutation(RECAPTCHA_MUTATION);

  useEffect(() => {
    async function loadResource(): Promise<void> {
      try {
        await fetch(BACKEND_URL as string);
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    }

    loadResource();
  }, []);

  const verifyRecaptcha = async (
    recaptchaToken: any
  ): Promise<boolean | void> => {
    try {
      /* istanbul ignore next */
      if (REACT_APP_USE_RECAPTCHA !== 'yes') {
        return true;
      }
      const { data } = await recaptcha({
        variables: {
          recaptchaToken,
        },
      });

      return data.recaptcha;
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(t('captchaError'));
    }
  };

  const signupLink = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const { signfirstName, signlastName, signEmail, signPassword, cPassword } =
      signformState;

    const recaptchaToken = recaptchaRef.current?.getValue();
    recaptchaRef.current?.reset();

    const isVerified = await verifyRecaptcha(recaptchaToken);
    /* istanbul ignore next */
    if (!isVerified) {
      toast.error(t('Please_check_the_captcha'));
      return;
    }
    const isValidatedString = (value: string): boolean =>
      /^[a-zA-Z]+$/.test(value);

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
      isValidatedString(signfirstName) &&
      isValidatedString(signlastName) &&
      signfirstName.length > 1 &&
      signlastName.length > 1 &&
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
            },
          });

          /* istanbul ignore next */
          if (signUpData) {
            console.log(signUpData);
            toast.success(
              'Successfully Registered. Please wait until you will be approved.'
            );

            setSignFormState({
              signfirstName: '',
              signlastName: '',
              signEmail: '',
              signPassword: '',
              cPassword: '',
            });
          }
        } catch (error: any) {
          /* istanbul ignore next */
          errorHandler(t, error);
        }
      } else {
        toast.warn(t('passwordMismatches'));
      }
    } else {
      if (!isValidatedString(signfirstName)) {
        toast.warn(t('firstName_invalid'));
      }
      if (!isValidatedString(signlastName)) {
        toast.warn(t('lastName_invalid'));
      }
      if (!validatePassword(signPassword)) {
        toast.warn(t('password_invalid'));
      }
      if (signEmail.length < 8) {
        toast.warn(t('email_invalid'));
      }
    }
  };

  const loginLink = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const recaptchaToken = recaptchaRef.current?.getValue();
    recaptchaRef.current?.reset();

    const isVerified = await verifyRecaptcha(recaptchaToken);
    /* istanbul ignore next */
    if (!isVerified) {
      toast.error(t('Please_check_the_captcha'));
      return;
    }

    try {
      const { data: loginData } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });

      /* istanbul ignore next */
      if (loginData) {
        if (
          loginData.login.appUserProfile.isSuperAdmin ||
          (loginData.login.appUserProfile.adminFor.length !== 0 &&
            loginData.login.user.adminApproved === true)
        ) {
          setItem('token', loginData.login.accessToken);
          setItem('refreshToken', loginData.login.refreshToken);
          setItem('id', loginData.login.user._id);
          setItem('IsLoggedIn', 'TRUE');
          setItem('SuperAdmin', loginData.login.appUserProfile.isSuperAdmin);
          setItem('AdminFor', loginData.login.appUserProfile.adminFor);
          if (getItem('IsLoggedIn') == 'TRUE') {
            history.push('/orglist');
          }
        } else {
          toast.warn(t('notAuthorised'));
        }
      } else {
        toast.warn(t('notFound'));
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (componentLoader || loginLoading || signinLoading || recaptchaLoading) {
    return <Loader />;
  }

  return (
    <>
      <section className={styles.login_background}>
        <Row className={styles.row}>
          <Col sm={0} md={6} lg={7} className={styles.left_portion}>
            <div className={styles.inner}>
              <a
                href="https://www.palisadoes.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PalisadoesLogo className={styles.palisadoes_logo} />
                <p className="text-center">{t('fromPalisadoes')}</p>
              </a>
            </div>

            <div className={styles.socialIcons}>
              <a
                href="https://www.facebook.com/palisadoesproject"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={FacebookLogo} />
              </a>
              <a
                href="https://twitter.com/palisadoesorg?lang=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={TwitterLogo} className={styles.socialIcon} />
              </a>
              <a
                href="https://www.linkedin.com/company/palisadoes/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={LinkedInLogo} />
              </a>
              <a
                href="https://github.com/PalisadoesFoundation"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={GithubLogo} />
              </a>
              <a
                href="https://www.youtube.com/@PalisadoesOrganization"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={YoutubeLogo} />
              </a>
              <a
                href="https://www.palisadoes.org/slack"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={SlackLogo} />
              </a>
              <a
                href="https://www.instagram.com/palisadoes/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={InstagramLogo} />
              </a>
            </div>
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

              <LoginPortalToggle />

              {/* LOGIN FORM */}
              <div
                className={`${
                  showTab === 'LOGIN' ? styles.active_tab : 'd-none'
                }`}
              >
                <form onSubmit={loginLink} className="gap-0">
                  <h1 className="fs-2 fw-bold text-dark mb-3">{t('login')}</h1>
                  <Form.Label className="mb-1">{t('email')}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      className="lh-1"
                      placeholder={t('enterEmail')}
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
                    <Button
                      tabIndex={-1}
                      className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                    >
                      <EmailOutlinedIcon />
                    </Button>
                  </div>
                  <Form.Label className="mt-2 mb-1">{t('password')}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      className="input_box_second lh-1"
                      placeholder={t('enterPassword')}
                      required
                      value={formState.password}
                      data-testid="password"
                      onChange={(e): void => {
                        setFormState({
                          ...formState,
                          password: e.target.value,
                        });
                      }}
                      autoComplete="current-password"
                    />
                    <Button
                      onClick={togglePassword}
                      data-testid="showLoginPassword"
                      className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </Button>
                  </div>
                  <div className="text-end mt-2 mb-3">
                    <Link
                      to="/forgotPassword"
                      className="text-secondary"
                      tabIndex={-1}
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  {REACT_APP_USE_RECAPTCHA === 'yes' ? (
                    <div className="googleRecaptcha">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        className="mt-2"
                        sitekey={
                          /* istanbul ignore next */
                          RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'
                        }
                      />
                    </div>
                  ) : (
                    /* istanbul ignore next */
                    <></>
                  )}
                  <Button
                    type="submit"
                    className="mb-0 w-100 lh-1"
                    value="Login"
                    data-testid="loginBtn"
                  >
                    {t('login')}
                  </Button>
                  <div className="position-relative my-2">
                    <hr />
                    <span className={styles.orText}>{t('OR')}</span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    value="Register"
                    className="w-100 lh-1"
                    data-testid="goToRegisterPortion"
                    onClick={(): void => {
                      setShowTab('REGISTER');
                      setShowPassword(false);
                    }}
                  >
                    {t('register')}
                  </Button>
                </form>
              </div>
              {/* REGISTER FORM */}
              <div
                className={`${
                  showTab === 'REGISTER' ? styles.active_tab : 'd-none'
                }`}
              >
                <Form onSubmit={signupLink} className="gap-0">
                  <h1 className="fs-2 fw-bold text-dark mb-3">
                    {t('register')}
                  </h1>
                  <Row>
                    <Col sm={6}>
                      <div>
                        <Form.Label className="mb-1">
                          {t('firstName')}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="signfirstname"
                          className="lh-1"
                          placeholder={t('firstName')}
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
                        <Form.Label className="mb-1">
                          {t('lastName')}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="signlastname"
                          className="lh-1"
                          placeholder={t('lastName')}
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
                  <div className="position-relative mt-2">
                    <Form.Label className="mb-1">{t('email')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        data-testid="signInEmail"
                        className="lh-1"
                        placeholder={t('email')}
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

                  <div className="position-relative my-2">
                    <Form.Label className="mb-1">{t('password')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        className="lh-1"
                        data-testid="passwordField"
                        placeholder={t('password')}
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
                          handleLowercasePassCheck(e.target.value);
                          handleUppercasePassCheck(e.target.value);
                          handleNumericalValuePassCheck(e.target.value);
                          handleSpecialCharPassCheck(e.target.value);
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
                  <div className="position-relative  my-2">
                    <Form.Label>{t('confirmPassword')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="lh-1"
                        placeholder={t('confirmPassword')}
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
                  {REACT_APP_USE_RECAPTCHA === 'yes' ? (
                    <div className="mt-3">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={
                          /* istanbul ignore next */
                          RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'
                        }
                      />
                    </div>
                  ) : (
                    /* istanbul ignore next */
                    <></>
                  )}
                  <Button
                    type="submit"
                    className="mt-4 w-100 mb-2"
                    value="Register"
                    data-testid="registrationBtn"
                  >
                    {t('register')}
                  </Button>
                  <div className="position-relative">
                    <hr />
                    <span className={styles.orText}>{t('OR')}</span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    value="Register"
                    className="mt-2 mb-1 w-100 lh-1"
                    data-testid="goToLoginPortion"
                    onClick={(): void => {
                      setShowTab('LOGIN');
                      setShowPassword(false);
                    }}
                  >
                    {t('login')}
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default loginPage;
