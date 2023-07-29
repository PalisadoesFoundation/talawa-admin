import React from 'react';
import { getByText, render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import i18nForTest from 'utils/i18nForTest';
import type { InterfaceAdminDashListCardProps } from './AdminDashListCard';
import AdminDashListCard from './AdminDashListCard';
import userEvent from '@testing-library/user-event';

const props: InterfaceAdminDashListCardProps = {
  data: {
    _id: 'xyz',
    name: 'Dogs Care',
    image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
    location: 'India',
    admins: [
      {
        _id: '123',
      },
      {
        _id: '456',
      },
    ],
    members: [],
    createdAt: '04/07/2019',
    creator: {
      _id: 'abc',
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

describe('Testing the Super Dash List', () => {
  test('should render props and text elements test for the page component', () => {
    localStorage.setItem('id', '123'); // Means the user is an admin

    render(
      <I18nextProvider i18n={i18nForTest}>
        <AdminDashListCard {...props} />
      </I18nextProvider>
    );
    expect(screen.getByAltText(/Dogs Care image/i)).toBeInTheDocument();
    expect(screen.getByText('Admins:')).toBeInTheDocument();
    expect(screen.getByText('Members:')).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('04/07/2019')).toBeInTheDocument();
    userEvent.click(screen.getByTestId(/viewBtn/i));
  });

  test('Testing if the props data is not provided', () => {
    window.location.assign('/orgdash');

    render(
      <I18nextProvider i18n={i18nForTest}>
        <AdminDashListCard {...props} />
      </I18nextProvider>
    );

    expect(window.location).toBeAt('/orgdash');
  });

  test('Testing if component is rendered properly when image is null', () => {
    localStorage.setItem('id', '123'); // User is admin
    const imageNullProps = {
      ...props,
      ...{ data: { ...props.data, ...{ image: null } } },
    };
    render(
      <I18nextProvider i18n={i18nForTest}>
        <AdminDashListCard {...imageNullProps} />
      </I18nextProvider>
    );
    expect(screen.getByAltText(/default image/i)).toBeInTheDocument();
  });

  test('Testing if user is redirected to orgDash screen', () => {
    localStorage.setItem('id', '123'); // User is admin

    render(
      <I18nextProvider i18n={i18nForTest}>
        <AdminDashListCard {...props} />
      </I18nextProvider>
    );
    userEvent.click(screen.getByTestId('viewBtn'));
    expect(window.location).toBeAt('/orgdash/id=xyz');
  });

  test('Testing the view is disabled, if a user is not an admin for an org', () => {
    localStorage.setItem('id', 'mno'); // User is not an admin for the current org

    render(
      <I18nextProvider i18n={i18nForTest}>
        <AdminDashListCard {...props} />
      </I18nextProvider>
    );
    expect(getByText(screen.getByTestId('viewBtn'), 'View')).toBeDisabled();
  });
});
