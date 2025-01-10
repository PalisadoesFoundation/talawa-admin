import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import OrgAdminListCard from './OrgAdminListCard';
import i18nForTest from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, beforeEach, afterEach, expect, it, describe } from 'vitest';

const MOCKS = [
  {
    request: {
      query: REMOVE_ADMIN_MUTATION,
      variables: { userid: '456', orgid: '987' },
    },
    result: {
      data: {
        removeAdmin: {
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
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgpeople/987']}>
        <I18nextProvider i18n={i18nForTest}>
          <Routes>
            <Route
              path="/orgpeople/:orgId"
              element={<OrgAdminListCard {...props} />}
            />
            <Route
              path="/orgList"
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
describe('Testing Organization Admin List Card', () => {
  global.alert = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render props and text elements test for the page component', async () => {
    const props = {
      toggleRemoveModal: () => true,
      id: '456',
    };

    renderOrgAdminListCard(props);

    await wait();

    userEvent.click(screen.getByTestId(/removeAdminBtn/i));

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
});
