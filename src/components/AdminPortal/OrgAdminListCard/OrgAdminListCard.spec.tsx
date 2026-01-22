import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import OrgAdminListCard from './OrgAdminListCard';
import i18nForTest from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, beforeEach, afterEach, expect, it, describe } from 'vitest';
import { errorHandler } from 'utils/errorHandler'; // Make sure this import is available

const MOCKS = [
  {
    request: {
      query: REMOVE_ADMIN_MUTATION,
      variables: { userid: '456', orgid: '987' },
    },
    result: {
      data: {
        removeAdmin: {
          __typename: 'User',
          _id: '456',
        },
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

const renderOrgAdminListCard = (props: {
  toggleRemoveModal: () => boolean;
  id: string | undefined;
}): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgpeople/987']}>
        <I18nextProvider i18n={i18nForTest}>
          <Routes>
            <Route
              path="/admin/orgpeople/:orgId"
              element={<OrgAdminListCard {...props} />}
            />
            <Route
              path="/admin/orglist"
              element={<div data-testid="orgListScreen">orgListScreen</div>}
            />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

vi.mock('i18next-browser-languagedetector', async () => ({
  ...(await vi.importActual('i18next-browser-languagedetector')),
  init: vi.fn(),
  type: 'languageDetector',
  detect: vi.fn(() => 'en'),
  cacheUserLanguage: vi.fn(),
}));

// Add the mock for errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

describe('Testing Organization Admin List Card', () => {
  global.alert = vi.fn();
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: {
        href: originalLocation.href,
        pathname: originalLocation.pathname || '/',
        search: originalLocation.search,
        hash: originalLocation.hash,
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it('should render props and text elements test for the page component', async () => {
    const props = {
      toggleRemoveModal: () => true,
      id: '456',
    };

    renderOrgAdminListCard(props);

    await wait();

    await userEvent.click(screen.getByTestId(/removeAdminBtn/i));

    await wait(2000);
  });

  it('Should not render text elements when props value is not passed', async () => {
    const props = {
      toggleRemoveModal: () => true,
      id: undefined,
    };

    renderOrgAdminListCard(props);

    await waitFor(() => {
      const orgListScreen = screen.getByTestId('orgListScreen');
      expect(orgListScreen).toBeInTheDocument();
    });
  });

  it('should not call toast or reload if no data is returned from mutation', async () => {
    // Simulate a failure or empty response from the mutation
    const noDataMocks = [
      {
        request: {
          query: REMOVE_ADMIN_MUTATION,
          variables: { userid: '456', orgid: '987' },
        },
        result: {
          data: null, // Simulating no data returned
        },
      },
    ];

    const noDataLink = new StaticMockLink(noDataMocks, true);

    const props = {
      toggleRemoveModal: vi.fn(),
      id: '456',
    };

    render(
      <MockedProvider link={noDataLink}>
        <MemoryRouter initialEntries={['/admin/orgpeople/987']}>
          <Routes>
            <Route
              path="/admin/orgpeople/:orgId"
              element={<OrgAdminListCard {...props} />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Simulate user click on "Yes"
    await userEvent.click(screen.getByTestId('removeAdminBtn'));

    await waitFor(() => {
      // Verify that neither toast.success nor window.location.reload are called
      expect(global.alert).not.toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });

  it('should call errorHandler when mutation fails', async () => {
    // Override the mock to simulate a failure
    const failingMocks = [
      {
        request: {
          query: REMOVE_ADMIN_MUTATION,
          variables: { userid: '456', orgid: '987' },
        },
        error: new Error('Failed to remove admin'),
      },
    ];

    const failingLink = new StaticMockLink(failingMocks, true);

    const props = {
      toggleRemoveModal: vi.fn(),
      id: '456',
    };

    render(
      <MockedProvider link={failingLink}>
        <MemoryRouter initialEntries={['/admin/orgpeople/987']}>
          <Routes>
            <Route
              path="/admin/orgpeople/:orgId"
              element={<OrgAdminListCard {...props} />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Simulate user click on "Yes"
    await userEvent.click(screen.getByTestId('removeAdminBtn'));

    // Wait for the errorHandler to be called
    await waitFor(() => {
      // Verify that errorHandler was called with the expected arguments
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Error),
      );
    });
  });
});
