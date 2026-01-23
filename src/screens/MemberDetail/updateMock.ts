import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
export const UPDATE_MOCK = [
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
          name: 'UpdatedUserName',
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
          name: 'UpdatedUserName',
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
export const UPDATE_USER_ERROR_MOCKS = [
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
