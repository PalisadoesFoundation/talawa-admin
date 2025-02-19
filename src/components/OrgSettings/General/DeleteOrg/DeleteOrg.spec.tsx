import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
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
import { vi } from 'vitest';

const { setItem } = useLocalStorage();

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
      variables: { organizationId: '123' },
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
        id: '123',
      },
    },
    error: new Error('Failed to delete organization'),
  },
  {
    request: {
      query: REMOVE_SAMPLE_ORGANIZATION_MUTATION,
      variables: { organizationId: '123' },
    },
    error: new Error('Failed to delete sample organization'),
  },
];

const mockNavgatePush = vi.fn();
let mockURL = '123';
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: mockURL }),
    useNavigate: () => mockNavgatePush,
  };
});

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_WITH_ERROR, true);

afterEach(() => {
  localStorage.clear();
});

describe('Delete Organization Component', () => {
  // ... other tests

  it('Delete organization functionality should work properly for sample org', async () => {
    mockURL = '123';
    setItem('SuperAdmin', true);
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
                <ToastContainer />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });

    const deleteButton = await screen.findByTestId('deleteOrganizationBtn');
    act(() => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(mockNavgatePush).toHaveBeenCalledWith('/orglist');
    });
  });

  it('Error handling for IS_SAMPLE_ORGANIZATION_QUERY mock', async () => {
    mockURL = '123';
    setItem('SuperAdmin', true);
    vi.spyOn(toast, 'error');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
                <ToastContainer />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });

    const deleteButton = await screen.findByTestId('deleteOrganizationBtn');
    act(() => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to delete sample organization',
      );
    });
  });

  it('Error handling for DELETE_ORGANIZATION_MUTATION mock', async () => {
    mockURL = '456';
    setItem('SuperAdmin', true);
    vi.spyOn(toast, 'error');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <DeleteOrg />
                <ToastContainer />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    act(() => {
      screen.getByTestId('openDeleteModalBtn').click();
    });

    const deleteButton = await screen.findByTestId('deleteOrganizationBtn');
    act(() => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete organization');
    });
  });
});
