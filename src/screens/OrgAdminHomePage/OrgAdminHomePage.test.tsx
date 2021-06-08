import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminHomePage from './OrgAdminHomePage';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(<OrgAdminHomePage />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Mobile:')).toBeInTheDocument();
    expect(screen.getByText('Interest:')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Singer')).toBeInTheDocument();
  });
});
