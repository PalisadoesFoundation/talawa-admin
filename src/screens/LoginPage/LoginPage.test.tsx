import React from 'react';
import {
  getByLabelText,
  getByPlaceholderText,
  render,
  screen,
} from '@testing-library/react';
import LoginPage from 'screens/LoginPage/LoginPage';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
  });

  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Login')).toBeInTheDocument();
  });

  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
      'type',
      'email'
    );
  });
});
