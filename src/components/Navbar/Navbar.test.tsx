import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Navbar from './Navbar';

describe('This is the test for Navbar component', () => {
  test('should render 3 item of the list', () => {
    render(<Navbar />);

    // Retrieve all the list items
    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const listItems = getAllByRole('listitem');

    //Assertions
    expect(listItems.length).toBe(3);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('should render 5 text elements test for the Navbar componet', () => {
    render(<Navbar />);
    expect(screen.getByText('Talawa')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
