import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomePage from 'screens/WelcomePage/WelcomePage';

describe('Test for the Welcome Pages', () => {
  test('should show the text', () => {
    render(<WelcomePage />);
    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin')).toBeInTheDocument();
    expect(screen.getByText('The online portal to manage')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });
});

describe('Test for the WelcomePages', () => {
  test('should click the anchor tag', () => {
    render(<WelcomePage />);
    expect(screen.getByText('Get Started').closest('a')).toHaveAttribute(
      'href',
      '/login'
    );
  });
});
