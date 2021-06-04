import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from 'screens/LoginPage/LoginPage';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
  });
});

describe('Testing the Login Page', () => {
  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Login')).toBeInTheDocument();
  });
});

describe('Testing the Login Pages', () => {
  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
      'type',
      'email'
    );
  });
});
