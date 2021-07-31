import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useMutation } from '@apollo/client';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-200x200.png';
import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import Modal from 'react-modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
function LoginPage(): JSX.Element {
  const [modalisOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const [login_organization] = useMutation(LOGIN_MUTATION);

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
    const { data } = await login({
      variables: {
        email: formState.email,
        password: formState.password,
      },
    });
    if (data.login.user.userType === 'SUPERADMIN') {
      localStorage.setItem('token', data.login.accessToken);
      localStorage.setItem('isloggedinas', 'SUPERADMIN');
      if (localStorage.getItem('isloggedinas') == 'SUPERADMIN') {
        window.location.replace('/superdash');
      }
    } else {
      window.alert('Sorry! you are not Authorised');
      window.location.reload();
    }
  };

  const login_link_organization = async () => {
    const { data } = await login_organization({
      variables: {
        email: formState.email,
        password: formState.password,
      },
    });
    if (data) {
      localStorage.setItem('token', data.login.accessToken);
      localStorage.setItem('isloggedinas', 'ORGADMIN');
      const uri = '/selectorg/i=' + data.login.user._id;
      window.location.replace(uri);
    }
  };

  return (
    <>
      <section className={styles.login_background}>
        <Navbar className={styles.navbarbg}>
          <Navbar.Brand>
            <a className={styles.logo} href="/">
              <img src={Logo} />
              <strong>Talawa Portal</strong>
            </a>
          </Navbar.Brand>
          <Navbar.Collapse>
            <button
              type="button"
              className={styles.navloginbtn}
              value="Login"
              onClick={showModal}
            >
              Login
            </button>
          </Navbar.Collapse>
        </Navbar>
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
              <ModalHeader className={styles.flexdir}>
                <ModalTitle className={styles.logintitle}>Login</ModalTitle>
                <a onClick={hideModal} className={styles.cancel}>
                  <i className="fa fa-times"></i>
                </a>
              </ModalHeader>
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
                <button
                  type="button"
                  className={styles.whiteloginbtn}
                  value="Login"
                  onClick={login_link_organization}
                >
                  Login as Organization
                </button>
                <a href="#" className={styles.forgotpwd}>
                  Forgot Password ?
                </a>
                <hr></hr>
                <button
                  type="button"
                  className={styles.greenregbtn}
                  value="Register"
                  onClick={login_link_organization}
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
