import React from 'react';
import { render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import i18nForTest from 'utils/i18nForTest';
import type { InterfaceOrgListCardProps } from './OrgListCard';
import OrgListCard from './OrgListCard';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MockedProvider } from '@apollo/react-testing';
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';

const { setItem, removeItem } = useLocalStorage();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const MOCKS = [
  {
    request: {
      query: IS_SAMPLE_ORGANIZATION_QUERY,
    },
    result: {
      data: {
        isSampleOrganization: true,
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

const props: InterfaceOrgListCardProps = {
  data: {
    _id: 'xyz',
    name: 'Dogs Care',
    image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
<<<<<<< HEAD
    address: {
      city: 'Sample City',
      countryCode: 'US',
      dependentLocality: 'Sample Dependent Locality',
      line1: '123 Sample Street',
      line2: 'Apartment 456',
      postalCode: '12345',
      sortingCode: 'ABC-123',
      state: 'Sample State',
    },
=======
    location: 'India',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    removeItem('id');
    setItem('id', '123'); // Means the user is an admin
=======
    localStorage.setItem('id', '123'); // Means the user is an admin
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );
    expect(screen.getByAltText(/Dogs Care image/i)).toBeInTheDocument();
    expect(screen.getByText(/Admins:/i)).toBeInTheDocument();
    expect(screen.getByText(/Members:/i)).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText(/Sample City/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Sample Street/i)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(/manageBtn/i));
    removeItem('id');
=======
      </MockedProvider>
    );
    expect(screen.getByAltText(/Dogs Care image/i)).toBeInTheDocument();
    expect(screen.getByText('Admins:')).toBeInTheDocument();
    expect(screen.getByText('Members:')).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    userEvent.click(screen.getByTestId(/manageBtn/i));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Testing if the props data is not provided', () => {
    window.location.assign('/orgdash');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    expect(window.location).toBeAt('/orgdash');
  });

  test('Testing if component is rendered properly when image is null', () => {
    const imageNullProps = {
      ...props,
      ...{ data: { ...props.data, ...{ image: null } } },
    };
    render(
      <MockedProvider addTypename={false} link={link}>
<<<<<<< HEAD
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...imageNullProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
=======
        <I18nextProvider i18n={i18nForTest}>
          <OrgListCard {...imageNullProps} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    expect(screen.getByTestId(/emptyContainerForImage/i)).toBeInTheDocument();
  });

  test('Testing if user is redirected to orgDash screen', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('manageBtn'));
=======
      </MockedProvider>
    );
    userEvent.click(screen.getByTestId('manageBtn'));
    expect(window.location).toBeAt('/orgdash/id=xyz');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
