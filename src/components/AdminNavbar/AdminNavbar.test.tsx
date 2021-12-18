import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen } from '@testing-library/react';
import AdminNavbar from './AdminNavbar';

describe('Testing Admin Navbar', () => {
  // eslint-disable-next-line jest/expect-expect
  test('should render following text elements', () => {
    render(<AdminNavbar url_1="palisadoes" targets={[]} />);
  });
});
