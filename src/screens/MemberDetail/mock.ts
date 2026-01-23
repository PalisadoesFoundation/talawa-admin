import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import {
  UPDATE_CURRENT_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';

export const MOCKS1 = [
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

export const MOCKS2 = [
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

export const MOCK_FILE = [
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
