import React from 'react';
import { render, screen } from '@testing-library/react';
import MainUserPage from './MainUserPage';

describe('Testing the MainUserPage', () => {
  test('should show the text on the website', () => {
    render(<MainUserPage />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Interests')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
  });
});
