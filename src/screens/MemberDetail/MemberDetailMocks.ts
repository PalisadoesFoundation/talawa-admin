import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';

export const MOCKS1 = [
  {
    request: {
      query: CURRENT_USER,
      variables: {
        id: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        currentUser: {
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'http://example.com/avatar.jpg',
          birthDate: '',
          city: 'city',
          countryCode: 'in',
          createdAt: '2025-02-06T03:10:50.254Z',
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
          updatedAt: '2025-02-06T03:22:17.808Z',
          workPhoneNumber: '+9999999998',
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

export const MOCKS2 = [
  {
    request: {
      query: CURRENT_USER,
      variables: {
        id: 'rishav-jha-mech',
      },
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
          countryCode: 'bb',
          createdAt: '2025-02-06T03:10:50.254Z',
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
          updatedAt: '2025-02-06T03:22:17.808Z',
          workPhoneNumber: '+9999999998',
          __typename: 'User',
        },
      },
    },
  },
];

// Simplified mocks - unused exports removed
