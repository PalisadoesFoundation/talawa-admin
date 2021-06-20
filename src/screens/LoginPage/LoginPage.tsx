import React, { useState } from 'react';
import NavBar from 'components/Navbar/Navbar';
import styles from './LoginPage.module.css';

function LoginPage(): JSX.Element {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  function login_link() {
    window.location.replace('/orghome');
  }

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
            <form action="/orghome">
              <input
                type="email"
                id="email"
                className="input_box"
                placeholder="Email"
                autoComplete="off"
                value={formState.email}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  });
                }}
                required
              />
              <input
                type="password"
                id="password"
                className="input_box_second"
                placeholder="Password"
                value={formState.password}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    password: e.target.value,
                  });
                }}
                required
              />
              <button
                type="button"
                className={styles.loginbtn}
                value="Login"
                onClick={login_link}
              >
                Login
              </button>
            </form>
          </div>
        </section>
      </section>
    </>
  );
}

export default LoginPage;
