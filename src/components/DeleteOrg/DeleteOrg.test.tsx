import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import {
  DELETE_ORGANIZATION_MUTATION,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { act } from 'react-dom/test-utils';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import DeleteOrg from './DeleteOrg';
import { ToastContainer, toast } from 'react-toastify';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';

const MOCKS = [
  {
    request: {
      query: IS_SAMPLE_ORGANIZATION_QUERY,
      variables: {
        isSampleOrganizationId: '123',
      },
    },
    result: {
      data: {
        isSampleOrganization: true,
      },
    },
  },
  {
    request: {
      query: REMOVE_SAMPLE_ORGANIZATION_MUTATION,
    },
    result: {
      data: {
        removeSampleOrganization: true,
      },
    },
  },
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
      variables: {
        id: '456',
      },
    },
    result: {
      data: {
        removeOrganization: {
          _id: '456',
        },
      },
    },
  },
];

const MOCKS_WITH_ERROR = [
  {
    request: {
      query: IS_SAMPLE_ORGANIZATION_QUERY,
      variables: {
        isSampleOrganizationId: '123',
      },
    },
    result: {
      data: {
        isSampleOrganization: true,
      },
    },
  },
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
      variables: {
        id: '456',
      },
    },
    error: new Error('Failed to delete organization'),
  },
  {
    request: {
      query: REMOVE_SAMPLE_ORGANIZATION_MUTATION,
    },
    error: new Error('Failed to delete sample organization'),
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_WITH_ERROR, true);

afterEach(() => {
  localStorage.clear();
});

describe('Delete Organization Component', () => {
  test('should be able to Toggle Delete Organization Modal', async () => {
    window.location.assign('/orgsetting/id=456');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    screen.getByTestId(/openDeleteModalBtn/i).click();
    expect(screen.getByTestId(/orgDeleteModal/i)).toBeInTheDocument();
    screen.getByTestId(/closeDelOrgModalBtn/i).click();
    await act(async () => {
      expect(screen.queryByTestId(/orgDeleteModal/i)).not.toHaveFocus();
    });
    expect(window.location).toBeAt('/orgsetting/id=456');
  });

  test('should be able to Toggle Delete Organization Modal When Organization is Sample Organization', async () => {
    window.location.assign('/orgsetting/id=123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    screen.getByTestId(/openDeleteModalBtn/i).click();
    expect(screen.getByTestId(/orgDeleteModal/i)).toBeInTheDocument();
    screen.getByTestId(/closeDelOrgModalBtn/i).click();
    await act(async () => {
      expect(screen.queryByTestId(/orgDeleteModal/i)).not.toHaveFocus();
    });
    expect(window.location).toBeAt('/orgsetting/id=123');
  });

  test('Delete organization functionality should work properly', async () => {
    window.location.assign('/orgsetting/id=456');
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
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/deleteOrganizationBtn/i).click();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    expect(window.location.replace).toHaveBeenCalledWith('/orglist');
  });

  test('Delete organization functionality should work properly for sample org', async () => {
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
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/deleteOrganizationBtn/i).click();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    expect(window.location.replace).toHaveBeenCalledWith('/orglist');
  });

  test('Error handling for IS_SAMPLE_ORGANIZATION_QUERY mock', async () => {
    window.location.assign('/orgsetting/id=123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    jest.spyOn(toast, 'error');
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/deleteOrganizationBtn/i).click();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to delete sample organization'
    );
  });

  test('Error handling for DELETE_ORGANIZATION_MUTATION mock', async () => {
    window.location.assign('/orgsetting/id=456');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteOrg />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    screen.getByTestId(/openDeleteModalBtn/i).click();
    screen.getByTestId(/deleteOrganizationBtn/i).click();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  });
});
