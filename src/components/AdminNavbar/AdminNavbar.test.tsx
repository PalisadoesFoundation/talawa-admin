import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen, fireEvent } from '@testing-library/react';
import AdminNavbar from './AdminNavbar';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Testing Admin Navbar', () => {
  // eslint-disable-next-line jest/expect-expect

  const targets = [
    {
      name: 'Dashboard',
      comp_id: 'orgdash',
      component: 'OrganizationDashboard',
    },
    { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
    { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
    { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
    {
      name: 'Contributions',
      comp_id: 'orgcontribution',
      component: 'OrgContribution',
    },
    {
      name: 'Plugins',
      comp_id: 'plugin',
      component: 'AddOnStore',
      subTargets: [
        {
          name: 'Plugin Store',
          comp_id: 'orgstore',
          url: '/plugin',
          component: 'AddOnStore',
          icon: 'fa-store',
        },
      ],
    },
  ];

  const props = {
    targets,
    url_1: 'string',
  };

  test('should render following text elements', () => {
    render(
      <BrowserRouter>
        <AdminNavbar {...props} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Plugins'));
    fireEvent.click(screen.getByTestId('logoutDropdown'));

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Contributions')).toBeInTheDocument();
    expect(screen.getByText('Plugins')).toBeInTheDocument();
    expect(screen.getByTestId('dropdownIcon')).toBeTruthy();
    expect(screen.getByText('Plugin Store')).toBeInTheDocument();
    expect(screen.getByTestId('logoutDropdown')).toBeTruthy();
    expect(screen.getByText('Notify')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    userEvent.click(screen.getByText('Logout'));
  });
});
