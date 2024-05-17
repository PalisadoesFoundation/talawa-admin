import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  USER_ORGANIZATION_LIST,
  ORGANIZATION_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import {
  CREATE_ORGANIZATION_MUTATION,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { Provider } from 'react-redux';
import OrgList from 'screens/OrgList/OrgList';
import { store } from 'state/store';
import {
  InterfaceOrgConnectionInfoType,
  InterfaceUserType,
} from 'utils/interfaces';

const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const superAdminUser: InterfaceUserType = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@akatsuki.com',
    image: null,
  },
};

const organizations: InterfaceOrgConnectionInfoType[] = [
  {
    _id: '1',
    creator: { _id: 'xyz', firstName: 'John', lastName: 'Doe' },
    image: '',
    name: 'Palisadoes Foundation',
    createdAt: '02/02/2022',
    admins: [
      {
        _id: '123',
      },
    ],
    members: [
      {
        _id: '234',
      },
    ],
    address: {
      city: 'Kingston',
      countryCode: 'JM',
      dependentLocality: 'Sample Dependent Locality',
      line1: '123 Jamaica Street',
      line2: 'Apartment 456',
      postalCode: 'JM12345',
      sortingCode: 'ABC-123',
      state: 'Kingston Parish',
    },
    blockedUsers: [],
    description: '',
  },
];
const MOCKS = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
      variables: {
        first: 8,
        skip: 0,
        filter: '',
        orderBy: 'createdAt_ASC',
      },
      notifyOnNetworkStatusChange: true,
    },
    result: {
      data: {
        organizationsConnection: organizations,
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: '123' },
    },
    result: {
      data: superAdminUser,
    },
  },
  {
    request: {
      query: CREATE_SAMPLE_ORGANIZATION_MUTATION,
    },
    result: {
      data: {
        createSampleOrganization: {
          id: '1',
          name: 'Sample Organization',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ORGANIZATION_MUTATION,
      variables: {
        description: 'This is a dummy organization',
        address: {
          city: 'Kingston',
          countryCode: 'JM',
          dependentLocality: 'Sample Dependent Locality',
          line1: '123 Jamaica Street',
          line2: 'Apartment 456',
          postalCode: 'JM12345',
          sortingCode: 'ABC-123',
          state: 'Kingston Parish',
        },
        name: 'Dummy Organization',
        visibleInSearch: true,
        userRegistrationRequired: false,
        image: '',
      },
    },
    result: {
      data: {
        createOrganization: {
          _id: '1',
        },
      },
    },
  },
];
describe('Testing Organization People List Card', () => {
  setItem('id', '123');
  const link = new StaticMockLink(MOCKS, true);
  test('Should display organisations for superAdmin even if admin For field is empty', async () => {
    window.location.assign('/');
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', []);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(
      screen.queryByText('Organizations Not Found'),
    ).not.toBeInTheDocument();
  });

  test('Should display organisations for admin even if admin For field is not empty', async () => {
    window.location.assign('/');
    setItem('id', '123');
    setItem('SuperAdmin', false);
    setItem('AdminFor', [
      { name: 'Palisadoes Foundation', _id: '1', image: '' },
    ]);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    screen.debug();
    expect(
      screen.queryByText('Organizations Not Found'),
    ).not.toBeInTheDocument();
  });
});
