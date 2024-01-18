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

import {
  FacebookLogo,
  LinkedInLogo,
  GithubLogo,
  InstagramLogo,
  SlackLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'assets/svgs/social-icons';

import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
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
import styles from './UserLoginPage.module.css';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

function loginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userLoginPage' });
  const history = useHistory();

  document.title = t('title');

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
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      history.push('/user/organizations/');
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await fetch('http://localhost:4000/graphql/');
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

    if (
      signfirstName.length > 1 &&
      signlastName.length > 1 &&
      signEmail.length >= 8 &&
      signPassword.length > 1
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
            toast.success(t('afterRegister'));

            setShowTab('LOGIN');

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
      toast.warn(t('fillCorrectly'));
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
        localStorage.setItem('token', loginData.login.accessToken);
        localStorage.setItem('userId', loginData.login.user._id);
        localStorage.setItem('refreshToken', loginData.login.refreshToken);
        localStorage.setItem('IsLoggedIn', 'TRUE');
        navigator.clipboard.writeText('');
        if (localStorage.getItem('IsLoggedIn') == 'TRUE') {
          history.push('/user/organizations/');
        }
      } else {
        toast.warn(t('notAuthorised'));
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
              <PalisadoesLogo className={styles.palisadoes_logo} />
              <p className="text-center">{t('fromPalisadoes')}</p>
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
                <form onSubmit={loginLink}>
                  <h1 className="fs-2 fw-bold text-dark mb-3">
                    {t('userLogin')}
                  </h1>
                  <Form.Label>{t('email')}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
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
                  <Form.Label className="mt-3">{t('password')}</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      className="input_box_second"
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
                  <div className="text-end mt-3">
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
                        className="mt-3"
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
                    className="mt-3 mb-3 w-100"
                    value="Login"
                    data-testid="loginBtn"
                  >
                    {t('login')}
                  </Button>
                  <div className="position-relative">
                    <hr />
                    <span className={styles.orText}>{t('OR')}</span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    value="Register"
                    className="mt-3 mb-3 w-100"
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
                <Form onSubmit={signupLink}>
                  <h1 className="fs-2 fw-bold text-dark mb-3">
                    {t('register')}
                  </h1>
                  <Row>
                    <Col sm={6}>
                      <div>
                        <Form.Label>{t('firstName')}</Form.Label>
                        <Form.Control
                          type="text"
                          id="signfirstname"
                          className="mb-3"
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
                        <Form.Label>{t('lastName')}</Form.Label>
                        <Form.Control
                          type="text"
                          id="signlastname"
                          className="mb-3"
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
                  <div className="position-relative">
                    <Form.Label>{t('email')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        data-testid="signInEmail"
                        className="mb-3"
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

                  <div className="position-relative mb-3">
                    <Form.Label>{t('password')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
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
                    {isInputFocused &&
                      signformState.signPassword.length < 8 && (
                        <div
                          className="form-text text-danger"
                          data-testid="passwordCheck"
                        >
                          {t('atleast_8_char_long')}
                        </div>
                      )}
                    {!isInputFocused &&
                      signformState.signPassword.length > 0 &&
                      signformState.signPassword.length < 8 && (
                        <div
                          className="form-text text-danger"
                          data-testid="passwordCheck"
                        >
                          {t('atleast_8_char_long')}
                        </div>
                      )}
                  </div>
                  <div className="position-relative">
                    <Form.Label>{t('confirmPassword')}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
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
                    className="mt-4 w-100 mb-3"
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
                    className="mt-3 mb-5 w-100"
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
