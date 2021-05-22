import React from 'react';
import { render, screen, within } from '@testing-library/react';
import LoginPage from 'screens/LoginPage/LoginPage';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
  });
});
