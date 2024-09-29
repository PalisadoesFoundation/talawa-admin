import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
import useLocalStorage from 'utils/useLocalstorage';
const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '101',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: 'https://placeholder.com/200x200',
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker',
    ).DesktopDateTimePicker,
  };
});

jest.mock('react-toastify');

const renderMemberDetail = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberDetail id="101" />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('MemberDetail', () => {
  global.alert = jest.fn();

  test('Should render the elements', async () => {
    await act(async () => {
      renderMemberDetail();
    });

    await waitFor(() => {
      expect(screen.getByTestId('container')).toBeInTheDocument();
    });
  });

  test('Should return formatted date', () => {
    expect(prettyDate('2024-03-14')).toBe('14 March 2024');
  });

  test('Should return Unavailable if date is invalid', () => {
    expect(prettyDate('202-03-321')).toBe('Unavailable');
  });

  test('Should return language name', () => {
    expect(getLanguageName('en')).toBe('English');
  });

  test('Title should be User Details for Super Admin', async () => {
    setItem('SuperAdmin', true);

    await act(async () => {
      renderMemberDetail();
    });

    await waitFor(() => {
      expect(screen.getByTestId('container')).toBeInTheDocument();
    });

    expect(document.title).toBe('User Details');
  });

  test('Should change tab', async () => {
    await act(async () => {
      renderMemberDetail();
    });

    await waitFor(() => {
      expect(screen.getByTestId('container')).toBeInTheDocument();
    });

    await act(async () => {
      const tab = screen.getByTestId('organizationsBtn');
      tab.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('memberorganizationTab')).toBeInTheDocument();
    });

    await act(async () => {
      const tab1 = screen.getByTestId('eventsBtn');
      tab1.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('eventsTab')).toBeInTheDocument();
    });

    await act(async () => {
      const tab2 = screen.getByTestId('tagsBtn');
      tab2.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tagsTab')).toBeInTheDocument();
    });
  });
});
