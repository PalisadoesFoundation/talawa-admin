import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Navbar from './Navbar';

describe('This is the test for Navbar component', () => {
  test('should render 5 text elements test for the Navbar component', () => {
    render(<Navbar />);
    expect(screen.getByText('Talawa')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
