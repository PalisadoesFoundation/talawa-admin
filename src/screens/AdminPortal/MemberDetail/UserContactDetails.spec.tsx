import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail from './UserContactDetails';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import { urlToFile } from 'utils/urlToFile';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import {
  UPDATE_CURRENT_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';

// MOCKS
const MOCK_FILE = [
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: null,
          avatarURL: null,
          birthDate: '',
          city: 'city',
          countryCode: 'in',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'employed',
          homePhoneNumber: '+9999999998',
          id: 'rishav-jha-mech',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Rishav Jha',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'administrator',
          state: 'State1',
          updatedAt: dayjs().add(1, 'year').month(1).toISOString(),
          workPhoneNumber: '+9999999998',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: '1',
        userId: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        unassignUserTag: {
          _id: '1',
        },
      },
    },
  },
];
const MOCKS1 = [
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '',
          city: 'city',
          countryCode: 'in',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'full_time',
          homePhoneNumber: '+9999999998',
          id: 'rishav-jha-mech',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Rishav Jha',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'administrator',
          state: 'State1',
          updatedAt: dayjs().add(1, 'year').month(1).toISOString(),
          workPhoneNumber: '+9999999998',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [
            {
              id: 'event1',
            },
            {
              id: 'event2',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: '1',
        userId: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        unassignUserTag: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      return (
        variables &&
        typeof variables === 'object' &&
        'input' in variables &&
        typeof variables.input === 'object'
      );
    },
    result: {
      data: {
        updateCurrentUser: {
          id: 'rishav-jha-mech',
          name: 'Rishav Jha',
          emailAddress: 'test221@gmail.com',
          role: 'administrator',
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().toISOString(),
          birthDate: '',
          gender: 'male',
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          city: 'city',
          state: 'State1',
          countryCode: 'in',
          postalCode: '111111',
          description: 'This is a description',
          mobilePhoneNumber: '+9999999999',
          homePhoneNumber: '+9999999998',
          workPhoneNumber: '+9999999998',
          educationGrade: 'grade_8',
          employmentStatus: 'employed',
          maritalStatus: 'engaged',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          isEmailAddressVerified: false,
          avatarURL: 'http://example.com/avatar.jpg',
          avatarMimeType: 'image/jpeg',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      return (
        variables &&
        typeof variables === 'object' &&
        'input' in variables &&
        typeof variables.input === 'object'
      );
    },
    result: {
      data: {
        updateUser: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '',
          city: 'city',
          countryCode: 'in',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'full_time',
          homePhoneNumber: '+9999999998',
          id: 'rishav-jha-mech',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'New Name',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'administrator',
          state: 'State1',
          updatedAt: dayjs.utc().toISOString(),
          workPhoneNumber: '+9999999998',
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '',
          city: 'city',
          countryCode: 'in',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'full_time',
          homePhoneNumber: '+9999999998',
          id: 'rishav-jha-mech',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Rishav Jha',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'administrator',
          state: 'State1',
          updatedAt: dayjs().add(1, 'year').month(1).toISOString(),
          workPhoneNumber: '+9999999998',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [
            {
              id: 'event1',
            },
            {
              id: 'event2',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
];
const MOCKS2 = [
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '2000-01-01',
          city: 'nyc',
          countryCode: 'bb',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'employed',
          homePhoneNumber: '+9999999998',
          id: '0194d80f-03cd-79cd-8135-683494b187a1',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Rishav Jha',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'regular',
          state: 'State1',
          updatedAt: dayjs().add(1, 'year').month(1).toISOString(),
          workPhoneNumber: '+9999999998',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      return (
        variables &&
        typeof variables === 'object' &&
        'input' in variables &&
        typeof variables.input === 'object'
      );
    },
    result: {
      data: {
        updateCurrentUser: {
          id: '0194d80f-03cd-79cd-8135-683494b187a1',
          name: 'Rishav Jha',
          emailAddress: 'test221@gmail.com',
          role: 'regular',
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().toISOString(),
          birthDate: '2000-01-01',
          gender: 'male',
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          city: 'nyc',
          state: 'State1',
          countryCode: 'bb',
          postalCode: '111111',
          description: 'This is a description',
          mobilePhoneNumber: '+9999999999',
          homePhoneNumber: '+9999999998',
          workPhoneNumber: '+9999999998',
          educationGrade: 'grade_8',
          employmentStatus: 'employed',
          maritalStatus: 'engaged',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          isEmailAddressVerified: false,
          avatarURL: 'http://example.com/avatar.jpg',
          avatarMimeType: 'image/jpeg',
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '2000-01-01',
          city: 'nyc',
          countryCode: 'bb',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'employed',
          homePhoneNumber: '+9999999998',
          id: '0194d80f-03cd-79cd-8135-683494b187a1',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Rishav Jha',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'regular',
          state: 'State1',
          updatedAt: dayjs().add(1, 'year').month(1).toISOString(),
          workPhoneNumber: '+9999999998',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [],
          __typename: 'User',
        },
      },
    },
  },
];
const UPDATE_USER_ERROR_MOCKS = [
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '',
          city: 'city',
          countryCode: 'in',
          createdAt: dayjs().add(1, 'year').month(1).toISOString(),
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'full_time',
          homePhoneNumber: '+9999999998',
          id: 'rishav-jha-mech',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Rishav Jha',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '111111',
          role: 'administrator',
          state: 'State1',
          updatedAt: dayjs().add(1, 'year').month(1).toISOString(),
          workPhoneNumber: '+9999999998',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [
            {
              id: 'event1',
            },
            {
              id: 'event2',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      return (
        variables &&
        typeof variables === 'object' &&
        'input' in variables &&
        typeof variables.input === 'object' &&
        (variables.input as Record<string, unknown>).name === 'Test User'
      );
    },
    error: new Error('Failed to update user'),
  },
];
const UPDATE_MOCK = [
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: '',
          addressLine2: '',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/test-avatar.jpg',
          birthDate: null,
          city: '',
          countryCode: null,
          createdAt: dayjs().subtract(1, 'year').toISOString(),
          description: '',
          educationGrade: null,
          emailAddress: 'testadmin1@example.com',
          employmentStatus: null,
          homePhoneNumber: '',
          id: '456',
          isEmailAddressVerified: true,
          maritalStatus: null,
          mobilePhoneNumber: '',
          name: 'Test User',
          natalSex: null,
          naturalLanguageCode: null,
          postalCode: '',
          role: 'administrator',
          state: '',
          updatedAt: dayjs().subtract(1, 'year').toISOString(),
          workPhoneNumber: '',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      return (
        variables &&
        typeof variables === 'object' &&
        'input' in variables &&
        typeof variables.input === 'object'
      );
    },
    result: {
      data: {
        updateUser: {
          addressLine1: '',
          addressLine2: '',
          avatarMimeType: null,
          avatarURL: null,
          birthDate: null,
          city: '',
          countryCode: null,
          createdAt: dayjs().subtract(1, 'year').toISOString(),
          description: '',
          educationGrade: null,
          emailAddress: 'testadmin1@example.com',
          employmentStatus: null,
          homePhoneNumber: '',
          id: '456',
          isEmailAddressVerified: true,
          maritalStatus: null,
          mobilePhoneNumber: '',
          name: 'AdminUpdatedName',
          natalSex: null,
          naturalLanguageCode: null,
          postalCode: '',
          role: 'administrator',
          state: '',
          updatedAt: dayjs().toISOString(),
          workPhoneNumber: '',
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_BY_ID,
      variables: {
        input: {
          id: '456',
        },
      },
    },
    result: {
      data: {
        user: {
          addressLine1: '',
          addressLine2: '',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/test-avatar.jpg',
          birthDate: null,
          city: '',
          countryCode: null,
          createdAt: dayjs().subtract(1, 'year').toISOString(),
          description: '',
          educationGrade: null,
          emailAddress: 'testadmin1@example.com',
          employmentStatus: null,
          homePhoneNumber: '',
          id: '456',
          isEmailAddressVerified: true,
          maritalStatus: null,
          mobilePhoneNumber: '',
          name: 'AdminUpdatedName',
          natalSex: null,
          naturalLanguageCode: null,
          postalCode: '',
          role: 'administrator',
          state: '',
          updatedAt: dayjs().subtract(1, 'year').toISOString(),
          workPhoneNumber: '',
          organizationsWhereMember: {
            edges: [],
          },
          createdOrganizations: [],
          eventsAttended: [],
          __typename: 'User',
        },
      },
    },
  },
];

const createLink = (mocks: ReadonlyArray<MockedResponse>) =>
  new StaticMockLink(mocks, true);

let user: ReturnType<typeof userEvent.setup>;

const { mockToast } = vi.hoisted(() => ({
  mockToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockToast,
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    maxDate,
    slotProps,
    'data-testid': dataTestId,
  }: {
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    maxDate?: dayjs.Dayjs;
    slotProps?: { textField?: { 'aria-label'?: string } };
    'data-testid'?: string;
  }) => (
    <input
      data-testid={dataTestId}
      aria-label={slotProps?.textField?.['aria-label']}
      value={value ? value.format('MM/DD/YYYY') : ''}
      onChange={(e) => {
        const val = e.target.value;
        if (!val) {
          onChange?.(null);
          return;
        }

        const parsedDate = dayjs(val, ['MM/DD/YYYY', 'YYYY-MM-DD']);
        if (!parsedDate.isValid()) {
          onChange?.(null);
          return;
        }

        if (maxDate && parsedDate.isAfter(maxDate, 'day')) {
          onChange?.(null);
          return;
        }

        onChange?.(parsedDate);
      }}
    />
  ),
}));

vi.mock('@dicebear/core', () => ({
  createAvatar: vi.fn(() => ({
    toDataUri: vi.fn(() => 'mocked-data-uri'),
  })),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: vi.fn(),
}));

vi.mock('components/UserPortal/UserSidebar/UserSidebar', () => ({
  __esModule: true,
  default: ({
    hideDrawer,
    setHideDrawer,
  }: {
    hideDrawer: boolean;
    setHideDrawer: (value: boolean) => void;
  }) => (
    <div data-testid="user-sidebar">
      <button type="button" onClick={() => setHideDrawer(!hideDrawer)}>
        Toggle Sidebar
      </button>
    </div>
  ),
}));

vi.mock('screens/UserPortal/Settings/ProfileHeader/ProfileHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="profile-header">
      <h1>{title}</h1>
    </div>
  ),
}));

const renderMemberDetailScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgtags/:orgId/member/:userId"
                element={<MemberDetail />}
              />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: (key: string) => {
      if (key === 'id') return '456';
      if (key === 'sidebar') return 'false';
      return null;
    },
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clearAllItems: vi.fn(),
  }),
}));

const renderUserProfileScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/settings/profile']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/user/settings/profile" element={<MemberDetail />} />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

// Helper function to wait for loading to complete
const waitForLoadingComplete = async () => {
  await waitFor(
    () => expect(screen.queryByText('Loading data...')).not.toBeInTheDocument(),
    { timeout: 3000 },
  );
};

describe('MemberDetail', () => {
  global.alert = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('Member Profile View (Admin viewing member)', () => {
    test('should render the elements for member profile', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      expect(screen.getAllByText(/Email/i)).toBeTruthy();
      expect(screen.getAllByText(/name/i)).toBeTruthy();
      expect(screen.getAllByText(/Birth Date/i)).toBeTruthy();
      expect(screen.getAllByText(/Gender/i)).toBeTruthy();
      expect(screen.getAllByText(/Profile Information/i)).toHaveLength(1);
      expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
    });

    test('handles member profile update success', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const nameInput = screen.getByTestId('inputName');
      await user.clear(nameInput);
      await user.type(nameInput, 'NewName');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await user.click(saveButton);

      await waitFor(
        () => {
          expect(mockToast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('User Profile View (User viewing own profile)', () => {
    test('should render the elements for user profile', async () => {
      renderUserProfileScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      expect(screen.getAllByText(/Email/i)).toBeTruthy();
      expect(screen.getAllByText(/name/i)).toBeTruthy();
      expect(screen.getAllByText(/Birth Date/i)).toBeTruthy();
      expect(screen.getAllByText(/Gender/i)).toBeTruthy();
    });

    test('handles user profile update success', async () => {
      renderUserProfileScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const nameInput = screen.getByTestId('inputName');
      await user.clear(nameInput);
      await user.type(nameInput, 'UpdatedUserName');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await user.click(saveButton);

      await waitFor(
        () => {
          expect(mockToast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Form Validation and User Interaction', () => {
    test('Should display dicebear image if image is null', async () => {
      renderMemberDetailScreen(createLink(MOCK_FILE));
      const avatarContainer = await waitFor(
        () => screen.getByTestId('profile-picture'),
        { timeout: 3000 },
      );
      expect(avatarContainer).toBeInTheDocument();
    });

    test('should handle undefined member id properly', async () => {
      renderMemberDetailScreen(createLink(MOCKS2));
      await waitForLoadingComplete();
    });

    test('handles avatar upload and preview', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      const objectUrlSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('mockURL');

      await waitFor(
        () => {
          expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = await screen.findByTestId('fileInput');
      await user.upload(input, file);

      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
      objectUrlSpy.mockRestore();
    });

    test('resets form state and avatar selection on reset', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      const objectUrlSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('mockURL');

      await waitForLoadingComplete();

      const nameInput = screen.getByTestId('inputName') as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'Temp Name');

      const input = screen.getByTestId('fileInput');
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      await user.upload(input, file);

      const previewImg = screen.getByTestId(
        'profile-picture-img',
      ) as HTMLImageElement;
      expect(previewImg.getAttribute('src')).toBe('mockURL');

      const resetButton = screen.getByTestId('resetChangesBtn');
      expect(resetButton).toBeInTheDocument();

      await user.click(resetButton);

      await waitFor(
        () => {
          expect(screen.queryByTestId('resetChangesBtn')).toBeNull();
          expect(screen.queryByTestId('saveChangesBtn')).toBeNull();
          expect(nameInput).toHaveValue('Rishav Jha');
        },
        { timeout: 3000 },
      );

      const resetImg = screen.getByTestId(
        'profile-picture-img',
      ) as HTMLImageElement;
      expect(resetImg.getAttribute('src')).toBe(
        'http://example.com/avatar.jpg',
      );
      objectUrlSpy.mockRestore();
    });

    test('handles user update success', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const nameInput = screen.getByTestId('inputName');
      await user.clear(nameInput);
      await user.type(nameInput, 'NewName');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await user.click(saveButton);

      await waitFor(
        () => {
          expect(mockToast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('handles user update error', async () => {
      renderMemberDetailScreen(createLink(UPDATE_USER_ERROR_MOCKS));
      await waitForLoadingComplete();

      const nameInput = screen.getByTestId('inputName');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test User');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await user.click(saveButton);

      await waitFor(
        () => {
          expect(mockToast.error).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('handles file upload validation', async () => {
      renderMemberDetailScreen(createLink(MOCK_FILE));
      await waitForLoadingComplete();

      const invalidFile = new File(['test'], 'test.md', {
        type: 'image/plain',
      });
      const fileInput = screen.getByTestId('fileInput');
      await user.upload(fileInput, invalidFile);

      expect(mockToast.error).toHaveBeenCalledWith(
        'Invalid file type. Please upload a JPEG, PNG, or GIF file.',
      );
    });

    test('sets formState correctly when data.user is returned', async () => {
      render(
        <MockedProvider mocks={MOCKS1} addTypename={false}>
          <BrowserRouter>
            <MemberDetail />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitForLoadingComplete();

      const birthDateInput = screen.getByTestId(
        'birthDate',
      ) as HTMLInputElement;
      expect(birthDateInput).toBeInTheDocument();

      const nameInput = screen.getByTestId('inputName') as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();
    });
  });

  describe('Field Interaction Tests', () => {
    test('prevents selection of future birthdates', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const futureDate = dayjs().add(1, 'year');
      const birthDateInput = screen.getByTestId(
        'birthDate',
      ) as HTMLInputElement;

      await user.clear(birthDateInput);
      await user.type(birthDateInput, futureDate.format('YYYY-MM-DD'));
      await user.tab();

      expect(birthDateInput.value).not.toBe(futureDate.format('YYYY-MM-DD'));
    });

    test('validates file upload size and type', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const fileInput = screen.getByTestId('fileInput');
      const largeFile = new File(['x'], 'large.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      await user.upload(fileInput, largeFile);

      await waitFor(
        () => {
          expect(mockToast.error).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('handles phone number input formatting', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const mobilePhoneInput = screen.getByTestId(
        'inputMobilePhoneNumber',
      ) as HTMLInputElement;
      await user.clear(mobilePhoneInput);
      await user.type(mobilePhoneInput, '+1234567890');
      expect(mobilePhoneInput).toHaveValue('+1234567890');

      const workPhoneInput = screen.getByTestId(
        'inputWorkPhoneNumber',
      ) as HTMLInputElement;
      await user.clear(workPhoneInput);
      await user.type(workPhoneInput, '+1987654321');
      expect(workPhoneInput).toHaveValue('+1987654321');

      const homePhoneInput = screen.getByTestId(
        'inputHomePhoneNumber',
      ) as HTMLInputElement;
      await user.clear(homePhoneInput);
      await user.type(homePhoneInput, '+1555555555');
      expect(homePhoneInput).toHaveValue('+1555555555');
    });
  });

  describe('Dropdown Component and other tests', () => {
    test('handles profile picture edit button click', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const uploadImageBtn = screen.getByTestId('uploadImageBtn');
      const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
      const fileInputClickSpy = vi.spyOn(fileInput, 'click');

      await user.click(uploadImageBtn);
      expect(fileInputClickSpy).toHaveBeenCalled();
    });

    test('shows no events message when user has no events attended', async () => {
      renderMemberDetailScreen(createLink(MOCKS2));
      await waitForLoadingComplete();

      const eventsSection = screen.queryByText(/Events Attended/i);
      expect(eventsSection).not.toBeInTheDocument();
    });

    test('handles file validation for oversized files', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();

      const fileInput = screen.getByTestId('fileInput');
      const largeFile = new File(['x'], 'large.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      await user.upload(fileInput, [largeFile]);

      await waitFor(
        () => {
          expect(mockToast.error).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('handles empty file input event', async () => {
      renderMemberDetailScreen(createLink(MOCKS1));
      await waitForLoadingComplete();
      expect(screen.getByTestId('fileInput')).toBeInTheDocument();
    });
  });

  test('displays error when password validation fails', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const passwordInput = screen.getByTestId(
      'inputPassword',
    ) as HTMLInputElement;
    await user.clear(passwordInput);
    await user.type(passwordInput, 'weak');

    const saveButton = screen.getByTestId('saveChangesBtn');
    await user.click(saveButton);

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('handles avatar URL to file conversion failure', async () => {
    vi.mocked(urlToFile).mockRejectedValueOnce(new Error('Conversion failed'));
    renderUserProfileScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const nameInput = screen.getByTestId('inputName');
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Name');

    await user.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('handles update as admin with member ID', async () => {
    const link = new StaticMockLink(UPDATE_MOCK, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitForLoadingComplete();

    const nameInput = screen.getByTestId('inputName');
    await user.clear(nameInput);
    await user.type(nameInput, 'AdminUpdatedName');

    await user.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(
      () => {
        expect(screen.getByTestId('inputName')).toHaveValue('AdminUpdatedName');
      },
      { timeout: 3000 },
    );
  });

  test('handles invalid birth date input', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const birthDateInput = screen.getByTestId('birthDate') as HTMLInputElement;
    await user.clear(birthDateInput);
    await user.type(birthDateInput, 'invalid-date');

    expect(birthDateInput.value).toBe('');
  });

  test('renders avatar from URL when available', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitFor(
      () => {
        const profilePic = screen.getByTestId('profile-picture');
        expect(profilePic).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('handles all address field inputs correctly', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const addressLine2 = screen.getByTestId(
      'inputAddressLine2',
    ) as HTMLInputElement;
    await user.clear(addressLine2);
    await user.paste('Apt123');
    expect(addressLine2).toHaveValue('Apt123');

    const postalCode = screen.getByTestId(
      'inputPostalCode',
    ) as HTMLInputElement;
    await user.clear(postalCode);
    await user.paste('12345');
    expect(postalCode).toHaveValue('12345');

    const addressLine1Input = screen.getByTestId(
      'inputAddressLine1',
    ) as HTMLInputElement;
    await user.clear(addressLine1Input);
    await user.paste('221BBakerStreet');
    expect(addressLine1Input).toHaveValue('221BBakerStreet');

    const cityInput = screen.getByTestId('inputCity') as HTMLInputElement;
    await user.clear(cityInput);
    await user.paste('Bengaluru');
    expect(cityInput).toHaveValue('Bengaluru');

    const descriptionInput = await waitFor(
      () => screen.getByTestId('inputDescription') as HTMLInputElement,
      { timeout: 3000 },
    );
    await user.clear(descriptionInput);
    await user.paste('Newdescription');
    expect(descriptionInput.value).toBe('Newdescription');

    const natalDropdownBtn = screen.getByTestId('inputNatalSex-toggle');
    await user.click(natalDropdownBtn);

    const femaleOption = await screen.findByTestId('inputNatalSex-item-female');
    await user.click(femaleOption);

    //  education grade dropdown
    const educationDropdownBtn = screen.getByTestId(
      'inputEducationGrade-toggle',
    );

    await user.click(educationDropdownBtn);

    const grade8Option = await screen.findByTestId(
      'inputEducationGrade-item-grade_8',
    );
    await user.click(grade8Option);

    // Find the dropdown button
    const employmentDropdown = screen.getByTestId(
      'employmentstatus-dropdown-btn-toggle',
    );
    await user.click(employmentDropdown);

    const fullTimeOption = await screen.findByTestId(
      'employmentstatus-dropdown-btn-item-full_time',
    );
    await user.click(fullTimeOption);

    // Marital Dropdown
    const maritalDropdown = screen.getByTestId('marital-status-btn-toggle');

    await user.click(maritalDropdown);
    await waitFor(
      () => {
        expect(
          screen.getByTestId('marital-status-btn-menu'),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    const engagedOption = await screen.findByTestId(
      'marital-status-btn-item-engaged',
    );

    await user.click(engagedOption);

    // State input
    const stateInput = await waitFor(
      () => screen.getByTestId('inputState') as HTMLInputElement,
      { timeout: 3000 },
    );
    await user.clear(stateInput);
    await user.paste('California');
    expect(stateInput.value).toBe('California');
  });

  it('shows preview image when selectedAvatar is present', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitFor(
      () => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const objectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-avatar');
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    await user.upload(fileInput, file);

    const avatarImg = await screen.findByTestId('profile-picture-img');
    expect(avatarImg).toHaveAttribute('src', 'blob:mock-avatar');

    objectUrlSpy.mockRestore();
  });

  it('revokes preview URL on unmount', async () => {
    const revokeSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const objectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-avatar');
    const { unmount } = renderMemberDetailScreen(createLink(MOCKS1));
    await waitFor(
      () => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    await user.upload(fileInput, file);

    await screen.findByTestId('profile-picture-img');
    unmount();

    expect(revokeSpy).toHaveBeenCalledWith('blob:mock-avatar');
    objectUrlSpy.mockRestore();
    revokeSpy.mockRestore();
  });

  it('uses avatarURL when no selected avatar is present', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitFor(
      () => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const avatarImg = await screen.findByTestId('profile-picture-img');
    expect(avatarImg).toHaveAttribute('src', 'http://example.com/avatar.jpg');
  });

  it("falls back when avatarURL is string 'null'", async () => {
    const nullAvatarMocks = [
      {
        ...MOCKS1[0],
        result: {
          data: {
            user: {
              ...MOCKS1[0].result.data.user,
              avatarURL: 'null',
            },
          },
        },
      },
      ...MOCKS1.slice(1),
    ];

    renderMemberDetailScreen(createLink(nullAvatarMocks));
    await waitFor(
      () => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.queryByTestId('profile-picture-img')).toBeNull();
    expect(screen.getByTestId('profile-picture-fallback')).toBeInTheDocument();
  });

  test('sets birthDate to empty string when birthDate is null', async () => {
    const MOCK_NO_BIRTHDATE = [
      {
        request: {
          query: GET_USER_BY_ID,
          variables: {
            input: {
              id: '456',
            },
          },
        },
        result: {
          data: {
            user: {
              addressLine1: '123 Main St',
              addressLine2: 'Apt 4',
              avatarMimeType: null,
              avatarURL: null,
              birthDate: null,
              city: 'City',
              countryCode: 'US',
              createdAt: dayjs().toISOString(),
              description: 'Test description',
              educationGrade: null,
              emailAddress: 'test@example.com',
              employmentStatus: 'full_time',
              homePhoneNumber: '+1111111111',
              id: '456',
              isEmailAddressVerified: true,
              maritalStatus: 'single',
              mobilePhoneNumber: '+1234567890',
              name: 'TestUser',
              natalSex: 'male',
              naturalLanguageCode: 'en',
              postalCode: '12345',
              role: 'regular',
              state: 'State',
              updatedAt: dayjs().toISOString(),
              workPhoneNumber: '+0987654321',
              organizationsWhereMember: { edges: [] },
              createdOrganizations: [],
              eventsAttended: [],
              __typename: 'User',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={MOCK_NO_BIRTHDATE} addTypename={false}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    const birthDateInput = (await screen.findByTestId(
      'birthDate',
    )) as HTMLInputElement;
    expect(birthDateInput.value).toBe('');
  });

  test('handles successful update', async () => {
    vi.mocked(urlToFile).mockResolvedValueOnce(
      new File(['avatar'], 'avatar.png', { type: 'image/png' }),
    );

    renderUserProfileScreen(createLink(UPDATE_MOCK));
    await waitForLoadingComplete();

    const nameInput = screen.getByTestId('inputName') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'UpdatedUserName');

    await user.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(
      () => {
        expect(mockToast.success).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should update state when avatar is changed', async () => {
    vi.mocked(urlToFile).mockResolvedValueOnce(
      new File(['avatar'], 'avatar.png', { type: 'image/png' }),
    );

    renderUserProfileScreen(createLink(UPDATE_MOCK));
    await waitForLoadingComplete();

    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    await user.upload(fileInput, [file]);
    expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
  });

  test('handles file size validation - rejects files larger than 5MB', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const fileInput = screen.getByTestId('fileInput');
    const largeFile = new File(['x'], 'large.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    await user.upload(fileInput, [largeFile]);

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('handles file name sanitization on upload', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const fileInput = screen.getByTestId('fileInput');
    const fileWithSpecialChars = new File(['content'], 'my@file#name$.png', {
      type: 'image/png',
    });

    await user.upload(fileInput, [fileWithSpecialChars]);

    await waitFor(
      () => {
        expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('handles empty file input gracefully', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const fileInput = screen.getByTestId('fileInput');
    expect(fileInput).toBeInTheDocument();
  });

  test('returns early when no file is selected in handleFileUpload', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
  });

  test('rejects invalid file types with appropriate error message', async () => {
    renderMemberDetailScreen(createLink(MOCKS1));
    await waitForLoadingComplete();

    const fileInput = screen.getByTestId('fileInput');
    const invalidFile = new File(['test'], 'test.bmp', {
      type: 'image/bmp',
    });

    await user.upload(fileInput, [invalidFile]);

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
});
