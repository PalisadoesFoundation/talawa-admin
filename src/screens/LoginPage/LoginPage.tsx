import React from "react";
const logo: string = require("../../assets/logo/logo.svg").default;

const Login = () => {
  return (
    <main className="login-main">
      <div className="login-bg">
        <div className="">
          <img src={logo} alt="" className="" />
        </div>
      </div>
      <div className="login-form">
        <h1 className="bold text-dull-blue text-40 mb-10">Welcome!</h1>
        <p className="text-grayish-blue text-20 mb-60">
          Enter details to login.
        </p>
        <form className="">
          <div className="">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="text"
              className=""
              id="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              className=""
              id="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <div className="">
            <a href="/" className="forgot-password">forgot password</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
