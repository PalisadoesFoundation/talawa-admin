import React from 'react';
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
import { act } from 'react-dom/test-utils';

const MOCKS = [
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
    },
    result: {
      data: {
        removeOrganization: [
          {
            _id: 123,
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
    window.location.assign('/orgsetting/id=123');
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
    ).toBeInTheDocument();
    expect(screen.getByText(/Other Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Language/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orgsetting/id=123');
  });
  test('should be able to Toggle Delete Organization Modal', async () => {
    window.location.assign('/orgsetting/id=123');
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
    expect(screen.getByTestId(/orgDeleteModal/i)).toBeInTheDocument();
    screen.getByTestId(/closeDelOrgModalBtn/i).click();
    await act(async () => {
      expect(screen.queryByTestId(/orgDeleteModal/i)).not.toHaveFocus();
    });
    expect(window.location).toBeAt('/orgsetting/id=123');
  });

  test('Delete organization functionality should work properly', async () => {
    window.location.assign('/orgsetting/id=123');
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
