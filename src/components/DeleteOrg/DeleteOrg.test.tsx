import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import {
  DELETE_ORGANIZATION_MUTATION,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import DeleteOrg from './DeleteOrg';
import { ToastContainer, toast } from 'react-toastify';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

async function wait(ms = 1000): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

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

const mockNavgatePush = jest.fn();
let mockURL = '123';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: mockURL }),
  useNavigate: () => mockNavgatePush,
}));

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_WITH_ERROR, true);

afterEach(() => {
  localStorage.clear();
});

describe('Delete Organization Component', () => {
  test('should be able to Toggle Delete Organization Modal', async () => {
    mockURL = '456';
    setItem('SuperAdmin', true);
    await act(async () => {
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
        </MockedProvider>,
      );
    });
    act(() => {
      screen.getByTestId(/openDeleteModalBtn/i).click();
    });
    expect(await screen.findByTestId(/orgDeleteModal/i)).toBeInTheDocument();
    act(() => {
      screen.getByTestId(/closeDelOrgModalBtn/i).click();
    });
    await waitFor(() => {
      expect(screen.queryByTestId(/orgDeleteModal/i)).not.toBeInTheDocument();
    });
  });

  test('should be able to Toggle Delete Organization Modal When Organization is Sample Organization', async () => {
    mockURL = '123';
    setItem('SuperAdmin', true);
    await act(async () => {
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
        </MockedProvider>,
      );
    });
    await wait();
    act(() => {
      screen.getByTestId(/openDeleteModalBtn/i).click();
    });
    expect(screen.getByTestId(/orgDeleteModal/i)).toBeInTheDocument();
    act(() => {
      screen.getByTestId(/closeDelOrgModalBtn/i).click();
    });
    await waitFor(() => {
      expect(screen.queryByTestId(/orgDeleteModal/i)).not.toBeInTheDocument();
    });
  });

  test('Delete organization functionality should work properly', async () => {
    mockURL = '456';
    setItem('SuperAdmin', true);
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    screen.debug();
    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });
    screen.debug();
    expect(await screen.findByTestId('orgDeleteModal')).toBeInTheDocument();
    const deleteButton = await screen.findByTestId('deleteOrganizationBtn');
    act(() => {
      deleteButton.click();
    });
  });

  test('Delete organization functionality should work properly for sample org', async () => {
    mockURL = '123';
    setItem('SuperAdmin', true);
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
    });
    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();
    });
    const deleteButton = await screen.findByTestId('deleteOrganizationBtn');
    act(() => {
      deleteButton.click();
    });
    await wait(2000);
    expect(mockNavgatePush).toHaveBeenCalledWith('/orglist');
  });

  test('Error handling for IS_SAMPLE_ORGANIZATION_QUERY mock', async () => {
    mockURL = '123';
    setItem('SuperAdmin', true);
    jest.spyOn(toast, 'error');
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
    });
    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();
    });
    act(() => {
      screen.getByTestId('deleteOrganizationBtn').click();
    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to delete sample organization',
      );
    });
  });

  test('Error handling for DELETE_ORGANIZATION_MUTATION mock', async () => {
    mockURL = '456';
    setItem('SuperAdmin', true);
    jest.spyOn(toast, 'error');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
    });
    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();
    });
    act(() => {
      screen.getByTestId('deleteOrganizationBtn').click();
    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete organization');
    });
  });
});
