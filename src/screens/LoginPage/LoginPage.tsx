import React, { useState } from 'react';
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
  localStorage.clear();
  const [modalisOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const redirect_signup = () => {
    window.location.replace('/');
  };

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
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
      </section>
    </>
  );
}

export default LoginPage;
