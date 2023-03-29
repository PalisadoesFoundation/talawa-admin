import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';
import i18next from 'i18next';

import styles from './LoginPage.module.css';
import Logo from 'assets/talawa-logo-200x200.png';
import LandingPage from 'components/LandingPage/LandingPage';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import { languages } from 'utils/languages';
import { RECAPTCHA_SITE_KEY, REACT_APP_USE_RECAPTCHA } from 'Constant/constant';

function LoginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  document.title = t('title');

  const [modalisOpen, setIsOpen] = React.useState(false);
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
  const [show, setShow] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const currentLanguageCode = cookies.get('i18next') || 'en';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      window.location.assign('/orglist');
    }
    setComponentLoader(false);
  }, []);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recaptcha, { loading: recaptchaLoading }] =
    useMutation(RECAPTCHA_MUTATION);

  useEffect(() => {
    async function loadResource() {
      const resourceUrl = 'http://localhost:4000/graphql/';
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await fetch(resourceUrl);
      } catch (error: any) {
        /* istanbul ignore next */
        if (error.message === 'Failed to fetch') {
          toast.error(
            'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
          );
        } else {
          toast.error(error.message);
        }
      }
    }

    loadResource();
  }, []);

  const verifyRecaptcha = async (recaptchaToken: any) => {
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
      toast.error('Captcha Error!');
    }
  };

  const signup_link = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { signfirstName, signlastName, signEmail, signPassword, cPassword } =
      signformState;

    const recaptchaToken = recaptchaRef.current?.getValue();
    recaptchaRef.current?.reset();

    const isVerified = await verifyRecaptcha(recaptchaToken);
    /* istanbul ignore next */
    if (!isVerified) {
      toast.error('Please, check the captcha.');
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
          const { data } = await signup({
            variables: {
              firstName: signfirstName,
              lastName: signlastName,
              email: signEmail,
              password: signPassword,
            },
          });

          /* istanbul ignore next */
          if (data) {
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
          if (error.message === 'Failed to fetch') {
            toast.error(
              'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
            );
          } else if (error.message) {
            toast.warn(error.message);
          } else {
            toast.error('Something went wrong, Please try after sometime.');
          }
        }
      } else {
        toast.warn('Password and Confirm password mismatches.');
      }
    } else {
      toast.warn('Fill all the Details Correctly.');
    }
  };

  const login_link = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const recaptchaToken = recaptchaRef.current?.getValue();
    recaptchaRef.current?.reset();

    const isVerified = await verifyRecaptcha(recaptchaToken);
    /* istanbul ignore next */
    if (!isVerified) {
      toast.error('Please, check the captcha.');
      return;
    }

    try {
      const { data } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });

      /* istanbul ignore next */
      if (data) {
        if (
          data.login.user.userType === 'SUPERADMIN' ||
          (data.login.user.userType === 'ADMIN' &&
            data.login.user.adminApproved === true)
        ) {
          localStorage.setItem('token', data.login.accessToken);
          localStorage.setItem('id', data.login.user._id);
          localStorage.setItem('IsLoggedIn', 'TRUE');
          localStorage.setItem('UserType', data.login.user.userType);
          if (localStorage.getItem('IsLoggedIn') == 'TRUE') {
            window.location.replace('/orglist');
          }
        } else {
          toast.warn('Sorry! you are not Authorised!');
        }
      } else {
        toast.warn('User not found!');
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message == 'Failed to fetch') {
        toast.error(
          'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
        );
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong, Please try after sometime.');
      }
    }
  };

  if (componentLoader || loginLoading || signinLoading || recaptchaLoading) {
    return <div className={styles.loader}></div>;
  }

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <section className={styles.login_background}>
        <Navbar className={styles.navbarbg} expand="xl">
          <Navbar.Brand className={styles.navbarBrand}>
            <a className={styles.logo}>
              <img src={Logo} />
              <strong>{t('talawa_portal')}</strong>
            </a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ml-auto">
              <div className="dropdown mr-4">
                <button
                  className={`btn dropdown-toggle ${styles.languageBtn}`}
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  title="Change Langauge"
                >
                  <i className="fas fa-globe"></i>
                </button>
                <div className="dropdown-menu">
                  {languages.map((language, index: number) => (
                    <button
                      key={index}
                      className="dropdown-item"
                      onClick={() => i18next.changeLanguage(language.code)}
                      disabled={currentLanguageCode === language.code}
                      data-testid={`changeLanguageBtn${index}`}
                    >
                      <span
                        className={`flag-icon flag-icon-${language.country_code} mr-2`}
                      ></span>
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={styles.navloginbtn}
                value="Login"
                onClick={showModal}
                data-testid="loginModalBtn"
              >
                {t('login')}
              </button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className={styles.reg_bg}>
          <Row>
            <Col sm={7} className={styles.leftmainbg}>
              <div className={styles.homeleft}>
                <LandingPage />
              </div>
            </Col>
            <Col sm={5} className={styles.rightmainbg}>
              <div className={styles.homeright}>
                <h1>{t('register')}</h1>
                {/* <h2>to seamlessly manage your Organization.</h2> */}
                <form onSubmit={signup_link}>
                  <div className={styles.dispflex}>
                    <div>
                      <label>{t('firstName')}</label>
                      <input
                        type="text"
                        id="signfirstname"
                        placeholder={t('firstName')}
                        autoComplete="on"
                        required
                        value={signformState.signfirstName}
                        onChange={(e) => {
                          setSignFormState({
                            ...signformState,
                            signfirstName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label>{t('lastName')}</label>
                      <input
                        type="text"
                        id="signlastname"
                        placeholder={t('lastName')}
                        autoComplete="on"
                        required
                        value={signformState.signlastName}
                        onChange={(e) => {
                          setSignFormState({
                            ...signformState,
                            signlastName: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <label>{t('email')}</label>
                  <input
                    type="email"
                    id="signemail"
                    placeholder={t('email')}
                    autoComplete="on"
                    required
                    value={signformState.signEmail}
                    onChange={(e) => {
                      setSignFormState({
                        ...signformState,
                        signEmail: e.target.value.toLowerCase(),
                      });
                    }}
                  />
                  <div className={styles.passwordalert}>
                    <label>{t('password')}</label>
                    <input
                      type={show ? 'text' : 'password'}
                      id="signpassword"
                      data-testid="passwordField"
                      placeholder={t('password')}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      required
                      value={signformState.signPassword}
                      onChange={(e) => {
                        setSignFormState({
                          ...signformState,
                          signPassword: e.target.value,
                        });
                      }}
                    />
                    <label
                      id="showPasswordr"
                      className={styles.showregister}
                      onClick={handleShow}
                      data-testid="showPasswordr"
                    >
                      {show ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </label>
                    {isInputFocused &&
                      signformState.signPassword.length < 8 && (
                        <span data-testid="passwordCheck">
                          {t('atleast_8_char_long')}
                        </span>
                      )}
                    {!isInputFocused &&
                      signformState.signPassword.length > 0 &&
                      signformState.signPassword.length < 8 && (
                        <span data-testid="passwordCheck">
                          {t('atleast_8_char_long')}
                        </span>
                      )}
                  </div>
                  <label>{t('confirmPassword')}</label>
                  <input
                    type={show ? 'text' : 'password'}
                    id="cpassword"
                    placeholder={t('confirmPassword')}
                    required
                    value={signformState.cPassword}
                    onChange={(e) => {
                      setSignFormState({
                        ...signformState,
                        cPassword: e.target.value,
                      });
                    }}
                  />
                  <label
                    id="showPasswordr"
                    className={styles.showregister}
                    onClick={handleShow}
                    data-testid="showPasswordr"
                  ></label>
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
                  <button
                    type="submit"
                    className={styles.greenregbtn}
                    value="Register"
                    data-testid="registrationBtn"
                  >
                    {t('register')}
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={modalisOpen}
          style={{
            overlay: { backgroundColor: 'grey', zIndex: 20 },
          }}
          className={styles.modalbody}
          ariaHideApp={false}
        >
          <section id={styles.grid_wrapper}>
            <div className={styles.form_wrapper}>
              <div className={styles.flexdir}>
                <p className={styles.logintitle}>{t('login')}</p>
                <a
                  onClick={hideModal}
                  className={styles.cancel}
                  data-testid="hideModalBtn"
                >
                  <i className="fa fa-times"></i>
                </a>
              </div>
              <form onSubmit={login_link}>
                <label>{t('email')}</label>
                <input
                  type="email"
                  id="email"
                  className="input_box"
                  placeholder={t('enterEmail')}
                  autoComplete="off"
                  required
                  value={formState.email}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      email: e.target.value,
                    });
                  }}
                />

                <label>{t('password')}</label>
                <div>
                  <input
                    type={show ? 'text' : 'password'}
                    className="input_box_second"
                    placeholder={t('enterPassword')}
                    required
                    value={formState.password}
                    data-testid="password"
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        password: e.target.value,
                      });
                    }}
                  />
                  <label
                    id="showPassword"
                    className={styles.show}
                    onClick={handleShow}
                    data-testid="showPassword"
                  >
                    {show ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </label>
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
                <button
                  type="submit"
                  className={styles.greenregbtn}
                  value="Login"
                  data-testid="loginBtn"
                >
                  {t('login')}
                </button>
                <Link to="/forgotPassword" className={styles.forgotpwd}>
                  {t('forgotPassword')}
                </Link>
                <hr></hr>
                <span className={styles.noaccount}>
                  {t('doNotOwnAnAccount')}
                </span>
                <button
                  type="button"
                  className={styles.whiteloginbtn}
                  value="Register"
                  onClick={hideModal}
                >
                  {t('register')}
                </button>
              </form>
            </div>
          </section>
        </Modal>
      </section>
    </>
  );
}

export default LoginPage;
