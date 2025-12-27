import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';

const rank1 = {
  __typename: 'VolunteerRank',
  rank: 1,
  hoursVolunteered: 5,
  user: {
    __typename: 'User',
    _id: 'userId1',
    lastName: 'Bradley',
    firstName: 'Teresa',
    image: 'image-url',
    email: 'testuser4@example.com',
  },
};

const rank2 = {
  __typename: 'VolunteerRank',
  rank: 2,
  hoursVolunteered: 4,
  user: {
    __typename: 'User',
    _id: 'userId2',
    lastName: 'Garza',
    firstName: 'Bruce',
    image: null,
    email: 'testuser5@example.com',
  },
};

const rank3 = {
  __typename: 'VolunteerRank',
  rank: 3,
  hoursVolunteered: 3,
  user: {
    __typename: 'User',
    _id: 'userId3',
    lastName: 'Doe',
    firstName: 'John',
    image: null,
    email: 'testuser6@example.com',
  },
};

const rank4 = {
  __typename: 'VolunteerRank',
  rank: 4,
  hoursVolunteered: 2,
  user: {
    __typename: 'User',
    _id: 'userId4',
    lastName: 'Doe',
    firstName: 'Jane',
    image: null,
    email: 'testuser7@example.com',
  },
};

export const MOCKS = [
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank1, rank2, rank3, rank4],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_ASC',
          timeFrame: 'allTime',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank4, rank3, rank2, rank1],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'weekly',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank1],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'monthly',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank1, rank2],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'yearly',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank1, rank2, rank3],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          nameContains: 'T',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank1],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          nameContains: '',
        },
      },
    },
    error: new Error('Mock Graphql VOLUNTEER_RANKING Error'),
  },
];

export const SEARCH_EMPTY_MOCKS = [
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          nameContains: '',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [rank1, rank2, rank3, rank4],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          nameContains: 'ZZZDoesNotExist',
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [],
      },
    },
  },
];
