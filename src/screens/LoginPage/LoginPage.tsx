import React, { useState } from 'react';
import Navbar from 'components/Navbar/Navbar';
import web from 'assets/fourth_image.png';
import 'css/Login.css';

function LoginPage() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  return (
    <>
      <section className="background">
        <Navbar />
        <div className="display">
          <div className="margin_s">
            <h3 className="h_size">
              <strong className="Color_Yellow">Welcome Back</strong>
            </h3>
            <h5>
              <strong className="Color_Green">Login to your account</strong>
            </h5>
            <form className="display_block">
              <input
                type="text"
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
            </form>
            <input type="submit" className="btn" value="Login" />
          </div>
          <div className="animated">
            <img src={web} className="image" />
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
