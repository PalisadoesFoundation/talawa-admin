import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import { useMutation } from '@apollo/client';

import styles from './LoginPage.module.css';
import Logo from 'assets/talawa-logo-200x200.png';
import LandingPage from 'components/LandingPage/LandingPage';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';

function LoginPage(): JSX.Element {
  document.title = 'Talawa Admin';

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
        <div className={styles.navbarbg}>
          <div>
            <a className={styles.logo}>
              <img src={Logo} />
              <strong>Talawa Portal</strong>
            </a>
          </div>
          <div>
            <button
              type="button"
              className={styles.navloginbtn}
              value="Login"
              onClick={showModal}
              data-testid="loginModalBtn"
            >
              Login
            </button>
          </div>
        </div>
        <div className={styles.reg_bg}>
          <Row>
            <Col sm={7} className={styles.leftmainbg}>
              <div className={styles.homeleft}>
                <LandingPage />
              </div>
            </Col>
            <Col sm={5} className={styles.rightmainbg}>
              <div className={styles.homeright}>
                <h1>Register</h1>
                {/* <h2>to seamlessly manage your Organization.</h2> */}
                <form onSubmit={signup_link}>
                  <div className={styles.dispflex}>
                    <div>
                      <label>First Name</label>
                      <input
                        type="text"
                        id="signfirstname"
                        placeholder="eg. John"
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
                      <label>Last Name</label>
                      <input
                        type="text"
                        id="signlastname"
                        placeholder="eg. Doe"
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
                  <label>Email</label>
                  <input
                    type="email"
                    id="signemail"
                    placeholder="Your Email"
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
                    <label>Password</label>
                    <input
                      type="password"
                      id="signpassword"
                      placeholder="Password"
                      required
                      value={signformState.signPassword}
                      onChange={(e) => {
                        setSignFormState({
                          ...signformState,
                          signPassword: e.target.value,
                        });
                      }}
                    />
                    <span>Atleast 8 Character long</span>
                  </div>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    id="cpassword"
                    placeholder="Confirm Password"
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
                      sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ''}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.greenregbtn}
                    value="Register"
                    data-testid="registrationBtn"
                  >
                    Register
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
                <p className={styles.logintitle}>Login</p>
                <a
                  onClick={hideModal}
                  className={styles.cancel}
                  data-testid="hideModalBtn"
                >
                  <i className="fa fa-times"></i>
                </a>
              </div>
              <form onSubmit={login_link}>
                <label>Email</label>
                <input
                  type="email"
                  id="email"
                  className="input_box"
                  placeholder="Enter Email"
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
                <label>Password</label>
                <input
                  type="password"
                  id="password"
                  className="input_box_second"
                  placeholder="Enter Password"
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
                    sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ''}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.whiteloginbtn}
                  value="Login"
                  data-testid="loginBtn"
                >
                  Login
                </button>
                <Link to="/forgotPassword" className={styles.forgotpwd}>
                  Forgot Password ?
                </Link>
                <hr></hr>
                <button
                  type="button"
                  className={styles.greenregbtn}
                  value="Register"
                  onClick={hideModal}
                >
                  Register
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
