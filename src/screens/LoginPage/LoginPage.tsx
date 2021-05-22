import React, { Component } from 'react';
import Navbar from 'components/Navbar/Navbar';
import web from 'assets/fourth_image.png';
import { Form, Input } from 'antd';
import 'css/Login.css';
import FormItem from 'antd/lib/form/FormItem';

function LoginPage() {
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
            <Form>
              <FormItem>
                <Input
                  type="text"
                  id="email"
                  className="input_box"
                  placeholder="Username"
                  required
                />
              </FormItem>
              <FormItem>
                <Input
                  type="password"
                  id="password"
                  className="input_box"
                  placeholder="password"
                  required
                />
              </FormItem>
            </Form>
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
