import { useMutation } from '@apollo/client';
import type { ChangeEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Nav, Navbar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
import Logo from 'assets/images/talawa-logo-200x200.png';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import LandingPage from 'components/LandingPage/LandingPage';
import Loader from 'components/Loader/Loader';
import { errorHandler } from 'utils/errorHandler';
import styles from './LoginPage.module.css';
import Palisadoes from 'assets/images/palisadoes_logo.png';
import Talawa from 'assets/images/talawa-logo-200x200.png';

function loginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  document.title = t('title');

  const [showModal, setShowModal] = React.useState(false);
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
      window.location.assign('/orglist');
    }
    setComponentLoader(false);
  }, []);

  const toggleLoginModal = (): void => setShowModal(!showModal);
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
        const response = await fetch(
          BACKEND_URL ?? 'http://localhost:4000/graphql/'
        );
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
        if (
          loginData.login.user.userType === 'SUPERADMIN' ||
          (loginData.login.user.userType === 'ADMIN' &&
            loginData.login.user.adminApproved === true)
        ) {
          localStorage.setItem('token', loginData.login.accessToken);
          localStorage.setItem('id', loginData.login.user._id);
          localStorage.setItem('IsLoggedIn', 'TRUE');
          localStorage.setItem('UserType', loginData.login.user.userType);
          if (localStorage.getItem('IsLoggedIn') == 'TRUE') {
            window.location.replace('/orglist');
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
        <Row>
          <Col sm={7} className={styles.left_portion}>
            <div>
              <img
                className={styles.palisadoes_logo}
                src={Palisadoes}
                alt="Palisadoes logo"
              />
              <p className="text-center">{t('fromPalisadoes')}</p>
            </div>
          </Col>
          <Col sm={5}>
            <div className={styles.right_portion}>
              <ChangeLanguageDropDown parentContainerStyle="mx-0" />
              <img
                className={styles.talawa_logo}
                src={Talawa}
                alt="Talawa Logo"
              />
              <h1 className="fs-2 fw-bold text-dark mb-3">{t('register')}</h1>
              <form onSubmit={signupLink}>
                <Row className="mb-3">
                  <Col sm={6}>
                    <div>
                      <Form.Label>{t('firstName')}</Form.Label>
                      <Form.Control
                        type="text"
                        id="signfirstname"
                        placeholder={t('firstName')}
                        autoComplete="on"
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
                        placeholder={t('lastName')}
                        autoComplete="on"
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
                <Form.Label>{t('email')}</Form.Label>
                <Form.Control
                  type="email"
                  id="signemail"
                  className="mb-3"
                  placeholder={t('email')}
                  autoComplete="on"
                  required
                  value={signformState.signEmail}
                  onChange={(e): void => {
                    setSignFormState({
                      ...signformState,
                      signEmail: e.target.value.toLowerCase(),
                    });
                  }}
                />
                <div className={styles.passwordalert}>
                  <Form.Label>{t('password')}</Form.Label>
                  <div className="postion-relative d-block">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      id="signpassword"
                      className="mb-3"
                      data-testid="passwordField"
                      placeholder={t('password')}
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
                    <div className={'position-absolute top-0 end-0'}>
                      <button
                        id="showPasswordr"
                        onClick={togglePassword}
                        data-testid="showPasswordr"
                      >
                        {showPassword ? (
                          <i className="fas fa-eye"></i>
                        ) : (
                          <i className="fas fa-eye-slash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  {isInputFocused && signformState.signPassword.length < 8 && (
                    <div className="form-text" data-testid="passwordCheck">
                      {t('atleast_8_char_long')}
                    </div>
                  )}
                  {!isInputFocused &&
                    signformState.signPassword.length > 0 &&
                    signformState.signPassword.length < 8 && (
                      <div className="form-text" data-testid="passwordCheck">
                        {t('atleast_8_char_long')}
                      </div>
                    )}
                </div>
                <div className={styles.passwordalert}>
                  <Form.Label>{t('confirmPassword')}</Form.Label>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="signpassword"
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
                  />
                  <label
                    id="showPasswordr"
                    className={styles.showregister}
                    onClick={toggleConfirmPassword}
                    data-testid="showPasswordrCon"
                  >
                    {showConfirmPassword ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </label>
                  {signformState.cPassword.length > 0 &&
                    signformState.signPassword !== signformState.cPassword && (
                      <div className="form-text" data-testid="passwordCheck">
                        {t('Password_and_Confirm_password_mismatches.')}
                      </div>
                    )}
                </div>
                {REACT_APP_USE_RECAPTCHA === 'yes' ? (
                  <div className="googleRecaptcha">
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
                  className={styles.greenregbtn}
                  value="Register"
                  data-testid="registrationBtn"
                >
                  {t('register')}
                </Button>
              </form>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default loginPage;
