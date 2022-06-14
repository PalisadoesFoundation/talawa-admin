import React, { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import LandingPage from 'components/LandingPage/LandingPage';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

function LoginPage(): JSX.Element {
  document.title = 'Talawa Admin';

  const [modalisOpen, setIsOpen] = React.useState(false);
  const [componentLoader, setComponentLoader] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      window.location.href = '/orglist';
    }
    setComponentLoader(false);
  }, []);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const redirect_signup = () => {
    window.location.replace('/');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signup, { loading: signloading, error: signerror }] =
    useMutation(SIGNUP_MUTATION);

  if (loading || signloading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }
  if (signerror) {
    window.alert('xyz');
    window.location.reload();
  }

  if (error) {
    window.alert('Incorrect ID or Password');
    window.location.reload();
  }

  const [signformState, setSignFormState] = useState({
    signfirstName: '',
    signlastName: '',
    signEmail: '',
    signPassword: '',
    cPassword: '',
    signuserType: '',
  });

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const signup_link = async () => {
    if (
      signformState.signfirstName.length > 1 &&
      signformState.signlastName.length > 1 &&
      signformState.signEmail.length >= 8 &&
      signformState.signPassword.length > 1
    ) {
      if (
        signformState.cPassword == signformState.signPassword &&
        (signformState.signuserType == 'ADMIN' ||
          signformState.signuserType == 'SUPERADMIN')
      ) {
        const { data } = await signup({
          variables: {
            firstName: signformState.signfirstName,
            lastName: signformState.signlastName,
            email: signformState.signEmail,
            password: signformState.signPassword,
            userType: signformState.signuserType,
          },
        });
        console.log(data);
        window.alert('Successfully Registered. Please Login In to Continue...');
        window.location.reload();
      } else {
        alert('Write USERTYPE correctly OR Check Password');
        window.location.reload();
      }
    } else {
      alert('Fill all the Details Correctly.');
    }
  };

  const login_link = async () => {
    try {
      const { data } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });
      if (data) {
        if (
          data.login.user.userType === 'SUPERADMIN' ||
          data.login.user.userType === 'ADMIN'
        ) {
          localStorage.setItem('token', data.login.accessToken);
          localStorage.setItem('id', data.login.user._id);
          localStorage.setItem('IsLoggedIn', 'TRUE');
          localStorage.setItem('UserType', data.login.user.userType);
          if (localStorage.getItem('IsLoggedIn') == 'TRUE') {
            window.location.replace('/orglist');
          }
        } else {
          window.alert('Sorry! you are not Authorised');
          window.location.reload();
        }
      } else {
        window.alert('Sorry! User Not Found');
        window.location.reload();
      }
    } catch (error) {
      window.alert(error);
      window.location.reload();
    }
  };

  if (componentLoader) {
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
                <form>
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
                  <label>User Type</label>
                  <input
                    type="type"
                    id="signusertype"
                    placeholder="SUPERADMIN"
                    autoComplete="off"
                    required
                    value={signformState.signuserType}
                    onChange={(e) => {
                      setSignFormState({
                        ...signformState,
                        signuserType: e.target.value.toUpperCase(),
                      });
                    }}
                  />
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
                  <button
                    type="button"
                    className={styles.greenregbtn}
                    value="Register"
                    onClick={signup_link}
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
        >
          <section id={styles.grid_wrapper}>
            <div className={styles.form_wrapper}>
              <div className={styles.flexdir}>
                <p className={styles.logintitle}>Login</p>
                <a onClick={hideModal} className={styles.cancel}>
                  <i className="fa fa-times"></i>
                </a>
              </div>
              <form>
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
                <button
                  type="button"
                  className={styles.whiteloginbtn}
                  value="Login"
                  onClick={login_link}
                >
                  Login As Super Admin
                </button>
                <a href="#" className={styles.forgotpwd}>
                  Forgot Password ?
                </a>
                <hr></hr>
                <button
                  type="button"
                  className={styles.greenregbtn}
                  value="Register"
                  onClick={redirect_signup}
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
