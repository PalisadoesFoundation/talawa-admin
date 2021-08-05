import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useMutation } from '@apollo/client';
import Logo from 'assets/talawa-logo-200x200.png';
import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import Modal from 'react-modal';
function LoginPage(): JSX.Element {
  localStorage.clear();
  const [modalisOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  if (error) {
    window.alert('Incorrect ID or Password');
    window.location.reload();
  }

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const login_link = async () => {
    try {
      const { data } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });
      if (data) {
        if (data.login.user.userType === 'SUPERADMIN') {
          localStorage.setItem('token', data.login.accessToken);
          localStorage.setItem('IsLoggedIn', 'TRUE');
          if (localStorage.getItem('IsLoggedIn') == 'TRUE') {
            window.location.replace('/orgdash');
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
      window.alert('some error occured');
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
          <h5>Register bg</h5>
        </div>
        <Modal
          isOpen={modalisOpen}
          style={{
            overlay: { backgroundColor: 'grey' },
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
                  Login as Admin
                </button>
                <a href="#" className={styles.forgotpwd}>
                  Forgot Password ?
                </a>
                <hr></hr>
                <button
                  type="button"
                  className={styles.greenregbtn}
                  value="Register"
                  onClick={login_link}
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
