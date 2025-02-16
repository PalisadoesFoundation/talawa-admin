import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { store } from 'state/store';
import { CHECK_AUTH, VERIFY_ROLE } from 'GraphQl/Queries/Queries';
import i18nForTest from './utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

// Mock external dependencies
vi.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: vi.fn(),
  PieChart: vi.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: vi.fn(),
}));

vi.mock('components/SecuredRoute/SecuredRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('/src/assets/svgs/palisadoes.svg?react', () => ({
  default: () => <svg>Mocked SVG</svg>,
}));
vi.mock('/src/assets/svgs/talawa.svg?react', () => ({
  default: () => <svg>Mocked SVG</svg>,
}));

const MOCKS = [
  {
    request: {
      query: CHECK_AUTH,
    },
    result: {
      data: {
        checkAuth: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: '2023-04-13T04:53:17.742+00:00',
          image: 'john.jpg',
          email: 'johndoe@gmail.com',
          birthDate: '1990-01-01',
          educationGrade: 'NO_GRADE',
          employmentStatus: 'EMPLOYED',
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          address: {
            line1: 'line1',
            state: 'state',
            countryCode: 'IND',
          },
          phone: {
            mobile: '+8912313112',
          },
        },
      },
    },
  },
  {
    request: {
      query: VERIFY_ROLE,
    },
    result: {
      data: {
        verifyRole: {
          isAuthorized: true,
          role: 'user',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(
  [
    {
      request: { query: CHECK_AUTH },
      result: { data: { checkAuth: null } }, // Simulating logged-out state
    },
    {
      request: { query: VERIFY_ROLE },
      result: { data: { verifyRole: { isAuthorized: false, role: '' } } },
    }, // Ensure verifyRole exists, even if null
  ],
  true,
);

const wait = (ms = 100): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe('App Component Tests', { timeout: 20000 }, () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('should render properly when user is logged in', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <App />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    window.history.pushState({}, '', '/orglist');
    await wait();

    expect(window.location.pathname).toBe('/orglist');
    expect(
      screen.getByText(
        'An open source application by Palisadoes Foundation volunteers',
      ),
    ).toBeInTheDocument();
  });

  it('should render properly when user is logged out', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <App />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });
});
