import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgSettings from './OrgSettings';

const MOCKS = [
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
    },
    result: {
      data: {
        removeOrganization: [
          {
            _id: 1,
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
});

describe('Organisation Settings Page', () => {
  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.removeOrganization;
    expect(dataQuery1).toEqual([
      {
        _id: 123,
      },
    ]);
  });

  test('should render props and text elements test for the screen', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgSettings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(screen.getAllByText(/Delete Organization/i)).toHaveLength(3);
    expect(
      screen.getByText(
        /By clicking on Delete organization button you will the organization will be permanently deleted along with its events, tags and all related data/i
      )
    );
    expect(screen.getByText(/Other Settings/i));
    expect(screen.getByText(/Change Language/i));
  });

  test('should be able to Toggle Delete Organization Modal', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgSettings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/closeDelOrgModalBtn/i).click();
  });
  test('Delete organization functionality should work properly', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgSettings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/deleteOrganizationBtn/i).click();
  });
});
