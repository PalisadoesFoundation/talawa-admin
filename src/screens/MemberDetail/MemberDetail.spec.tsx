import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail from './MemberDetail';
import { MOCKS1, MOCKS2 } from './MemberDetailMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);

async function wait(ms = 500): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const props = {
  id: 'rishav-jha-mech',
};

const renderMemberDetailScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<MemberDetail {...props} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('MemberDetail', () => {
  global.alert = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('should render the UserProfile component', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('component renders with data', async () => {
    renderMemberDetailScreen(link2);
    await wait();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('component renders with different user data', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail id="123" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
