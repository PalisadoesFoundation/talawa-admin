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
import { RECAPTCHA_SITE_KEY } from 'Constant/constant';

function LoginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  document.title = t('title');

  const [modalisOpen, setIsOpen] = React.useState(false);
  const [componentLoader, setComponentLoader] = useState(true);
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

  const verifyRecaptcha = async (recaptchaToken: any) => {
    try {
      const { data } = await recaptcha({
        variables: {
          recaptchaToken,
        },
      });

      return data.recaptcha;
    } catch (error) {
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
              userType: 'ADMIN',
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
          if (error.message) {
            toast.warn(error.message);
          } else {
            toast.error('Something went wrong, Please try after sometime.');
          }
        }
      } else {
        toast.error('Password and Confirm password mismatches.');
      }
    } else {
      toast.error('Fill all the Details Correctly.');
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
      if (error.message) {
        toast.warn(error.message);
      } else {
        toast.error('Something went wrong, Please try after sometime.');
      }
    }
  };

  if (componentLoader || loginLoading || signinLoading || recaptchaLoading) {
    return <div className={styles.loader}></div>;
  }

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
                      type="password"
                      id="signpassword"
                      placeholder={t('password')}
                      required
                      value={signformState.signPassword}
                      onChange={(e) => {
                        setSignFormState({
                          ...signformState,
                          signPassword: e.target.value,
                        });
                      }}
                    />
                    <span>{t('atleast_8_char_long')}</span>
                  </div>
                  <label>{t('confirmPassword')}</label>
                  <input
                    type="password"
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
                  <div className="googleRecaptcha">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY ?? ''}
                    />
                  </div>
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
                <input
                  type="password"
                  id="password"
                  className="input_box_second"
                  placeholder={t('enterPassword')}
                  required
                  value={formState.password}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      password: e.target.value,
                    });
                  }}
                />
                <div className="googleRecaptcha">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY ?? ''}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.whiteloginbtn}
                  value="Login"
                  data-testid="loginBtn"
                >
                  {t('login')}
                </button>
                <Link to="/forgotPassword" className={styles.forgotpwd}>
                  {t('forgotPassword')}
                </Link>
                <hr></hr>
                <button
                  type="button"
                  className={styles.greenregbtn}
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
