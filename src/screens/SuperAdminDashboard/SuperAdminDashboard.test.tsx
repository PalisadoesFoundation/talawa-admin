import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperAdminDashboard from './SuperAdminDashboard';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(<SuperAdminDashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('List Of Organization')).toBeInTheDocument();
    expect(screen.getByText('Organisation Statistics')).toBeInTheDocument();
    expect(screen.getByText('API Uptime Statistics')).toBeInTheDocument();
    expect(
      screen.getByText('Organisation Registered Statistics')
    ).toBeInTheDocument();
  });
});
