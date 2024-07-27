type AgendaCategoryConnectionType = 'Organization';

export const props = {
  agendaCategoryConnection: 'Organization' as AgendaCategoryConnectionType,
  agendaCategoryData: [
    {
      _id: 'agendaCategory1',
      name: 'AgendaCategory 1',
      description: 'AgendaCategory 1 Description',
      createdBy: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
    {
      _id: 'agendaCategory2',
      name: 'AgendaCategory 2',
      description: 'AgendaCategory 2 Description',
      createdBy: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
  ],
  agendaCategoryRefetch: jest.fn(),
};

export const props2 = {
  agendaCategoryConnection: 'Organization' as AgendaCategoryConnectionType,
  agendaCategoryData: [],
  agendaCategoryRefetch: jest.fn(),
};
