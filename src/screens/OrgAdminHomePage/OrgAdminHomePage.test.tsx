import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminHomePage from './OrgAdminHomePage';

describe('Testing the OrgAdminHomePage', () => {
  test('should show the text on the website', () => {
    render(<OrgAdminHomePage />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Interests Offered')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
  });
});
