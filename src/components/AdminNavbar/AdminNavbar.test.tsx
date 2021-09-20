import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminNavbar from './AdminNavbar';
test('should render following text elements', () => {
  render(<AdminNavbar url_1="" targets={[]} />);
});
