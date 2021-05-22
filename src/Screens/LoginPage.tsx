import React, { Component } from 'react';
import Navbar from '../SharedComponents/Navbar';
import web from '../assets/fourth_image.png';
import { Form, Input } from 'antd';
import '../css/Login.css';
import FormItem from 'antd/lib/form/FormItem';

class LoginPage extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.updateInput = this.updateInput.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateInput(event: any) {
    this.setState({ email: event.target.value });
  }

  updatePassword(event: any) {
    this.setState({ password: event.target.value });
  }

  render() {
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
                    onChange={this.updateInput}
                    placeholder="Username"
                    required
                  />
                </FormItem>
                <FormItem>
                  <Input
                    type="password"
                    id="password"
                    className="input_box"
                    onChange={this.updatePassword}
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
}

export default LoginPage;
