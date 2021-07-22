import React, { useState } from 'react';
import NavBar from 'components/Navbar/Navbar';
import styles from './LoginPage.module.css';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
function LoginPage(): JSX.Element {
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
      <section className="background">
        <NavBar />
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <h3>
              <p className="black">Welcome Back</p>
            </h3>
            <h5>
              <p className="black">Login to your account</p>
            </h5>
            <form>
              <input
                type="email"
                id="email"
                className="input_box"
                placeholder="Email"
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
              <input
                type="password"
                id="password"
                className="input_box_second"
                placeholder="Password"
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
                className={styles.loginbtn}
                value="Login"
                onClick={login_link}
              >
                Login as Admin
              </button>
              <button
                type="button"
                className={styles.loginbtn}
                value="Login"
                onClick={login_link_organization}
              >
                Login as Organization
              </button>
            </form>
          </div>
        </section>
      </section>
    </>
  );
}

export default LoginPage;
