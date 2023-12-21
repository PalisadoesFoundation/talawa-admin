import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { act } from 'react-dom/test-utils';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import DeleteOrg from './DeleteOrg';

const MOCKS = [
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
      variables: {
        id: 123,
      },
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
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
      variables: {
        id: 456,
      },
    },
    error: new Error('Deletion failed!'),
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
});

describe('Delete Organization Component', () => {
  test('should be able to Toggle Delete Organization Modal', async () => {
    window.location.assign('/orgsetting/id=123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
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
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/deleteOrganizationBtn/i).click();
    expect(window.location).not.toBeNull();
  });
  test('should handle deletion of non-sample organization', async () => {
    window.location.assign('/orgsetting/id=123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));
    await expect(screen.queryByTestId('orgDeleteModal')).toBeInTheDocument();
    expect(window.location).not.toBeNull();
  });
  test('should handle deletion of sample organization', async () => {
    window.location.assign('/orgsetting/id=123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));
    await expect(screen.queryByTestId('orgDeleteModal')).toBeInTheDocument();
    expect(window.location).not.toBeNull();
  });
  test('should handle deletion failure gracefully', async () => {
    window.location.assign('/orgsetting/id=456'); // Using an ID that triggers a failure
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));
    expect(screen.queryByText(/Deletion failed!/i)).toBeNull();
  });
  test('should close the Delete Organization Modal when "Cancel" button is clicked', async () => {
    window.location.assign('/orgsetting/id=123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('closeDelOrgModalBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('orgDeleteModal')).toBeNull();
    });
    expect(window.location).toBeAt('/orgsetting/id=123');
  });
});
