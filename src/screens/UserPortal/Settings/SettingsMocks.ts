import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
      variables: {
        name: 'Noble Mittal',
        addressLine1: 'random address 1',
        addressLine2: 'random address 2',
        birthDate: '2004-10-14',
        city: 'random city',
        countryCode: 'in',
        createdAt: '2021-03-01T00:00:00.000Z',
        description: 'This is a random description by Bandhan',
        educationGrade: 'grade_1',
        emailAddress: 'random@gmail.com',
        employmentStatus: 'employed',
        homePhoneNumber: '1234567890',
        id: '65ba1621b7b00c20e5f1d8d2',
        isEmailAddressVerified: true,
        maritalStatus: 'single',
        mobilePhoneNumber: '1234567890',
        natalSex: 'male',
        naturalLanguageCode: 'en',
        postalCode: '111111',
        role: 'regular',
        state: 'random state',
        updatedAt: '2021-03-01T00:00:00.000Z',
        workPhoneNumber: '1234567890',
      },
      result: {
        data: {
          updateCurrentUser: {
            id: '65ba1621b7b00c20e5f1d8d2',
          },
        },
      },
    },
  },
];

export const MOCKS1 = [
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        currentUser: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '2000-01-01',
          city: 'nyc',
          countryCode: 'in',
          createdAt: '2025-02-06T03:10:50.254',
          description: 'This is a description',
          educationGrade: 'grade_8',
          emailAddress: 'test221@gmail.com',
          employmentStatus: 'employed',
          homePhoneNumber: '+9999999998',
          id: '0194d80f-03cd-79cd-8135-683494b187a1',
          isEmailAddressVerified: false,
          maritalStatus: 'engaged',
          mobilePhoneNumber: '+9999999999',
          name: 'Bandhan Majumder',
          natalSex: 'male',
          naturalLanguageCode: 'en',
          postalCode: '11111111f',
          role: 'regular',
          state: 'State1',
          updatedAt: '2025-02-06T03:22:17.808',
          workPhoneNumber: '+9999999998',
          __typename: 'User',
        },
      },
    },
  },
];

export const MOCKS2 = [
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        currentUser: {
          addressLine1: '',
          addressLine2: '',
          avatarMimeType: '',
          avatarURL: '',
          birthDate: '',
          city: '',
          countryCode: '',
          createdAt: '',
          description: '',
          educationGrade: '',
          emailAddress: '',
          employmentStatus: '',
          homePhoneNumber: '',
          id: '0194d80f-03cd-79cd-8135-683494b187a1',
          isEmailAddressVerified: false,
          maritalStatus: '',
          mobilePhoneNumber: '',
          name: '',
          natalSex: '',
          naturalLanguageCode: '',
          postalCode: '',
          role: '',
          state: '',
          updatedAt: '',
          workPhoneNumber: '',
          __typename: 'User',
        },
      },
    },
  },
];

export const UPDATE_MOCK = [
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
      variables: {
        input: {
          name: 'Bandhan Majumder',
        },
      },
    },
    result: {
      data: {
        updateCurrentUser: {
          addressLine1: '',
          addressLine2: '',
          avatarMimeType: null,
          avatarURL: null,
          birthDate: null,
          city: '',
          countryCode: null,
          createdAt: '2023-04-13T04:53:17.742Z',
          description: '',
          educationGrade: null,
          emailAddress: 'testadmin1@example.com',
          employmentStatus: null,
          homePhoneNumber: '',
          id: '65378abd-8500-8f17-1cf2-990d00000002',
          isEmailAddressVerified: true,
          maritalStatus: null,
          mobilePhoneNumber: '',
          name: 'Bandhan Majumder',
          natalSex: null,
          naturalLanguageCode: null,
          postalCode: '',
          role: 'regular',
          state: '',
          updatedAt: '2025-02-09T06:26:51.209Z',
          workPhoneNumber: '',
        },
      },
    },
  },
];

export const errorMock = [
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
      variables: {
        input: {
          name: 'Bandhan',
          mobilePhoneNumber: '1200',
        },
      },
    },
    error: new Error('Please enter a valid phone number'),
  },
  ...MOCKS1,
];
