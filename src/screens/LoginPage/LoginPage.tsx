import React, { useState } from 'react';
import Navbar from 'components/Navbar/Navbar';
import web from 'assets/fourth_image.png';

import styles from './LoginPage.module.css';

function LoginPage() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  return (
    <>
      <section className="background">
        <Navbar />
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <h3>
              <strong className="yellow">Welcome Back</strong>
            </h3>
            <h5>
              <strong className="green">Login to your account</strong>
            </h5>
            <form>
              <input
                type="email"
                id="email"
                className="input_box"
                placeholder="Email"
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
              <input type="submit" className="btn" value="Login" />
            </form>
          </div>
          <div className={styles.animated_content}>
            <img src={web} className="image" />
          </div>
        </section>
      </section>
    </>
  );
}

export default LoginPage;
