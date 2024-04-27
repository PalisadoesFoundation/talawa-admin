import React from 'react';
import { act, render, screen } from '@testing-library/react';
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
import useLocalStorage from 'utils/useLocalstorage';

const { setItem, removeItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: IS_SAMPLE_ORGANIZATION_QUERY,
      variables: {
        isSampleOrganizationId: 'xyz',
      },
    },
    result: {
      data: {
        isSampleOrganization: true,
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const props: InterfaceOrgListCardProps = {
  data: {
    _id: 'xyz',
    name: 'Dogs Care',
    image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
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
  test('should render props and text elements test for the page component', async () => {
    removeItem('id');
    setItem('id', '123'); // Means the user is an admin

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByAltText(/Dogs Care image/i)).toBeInTheDocument();
    expect(screen.getByText(/Admins:/i)).toBeInTheDocument();
    expect(screen.getByText(/Members:/i)).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText(/Sample City/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Sample Street/i)).toBeInTheDocument();
    expect(screen.getByTestId(/manageBtn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/flaskIcon/i)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(/manageBtn/i));
    removeItem('id');
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
      </MockedProvider>,
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
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...imageNullProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
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
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('manageBtn'));
  });
});
