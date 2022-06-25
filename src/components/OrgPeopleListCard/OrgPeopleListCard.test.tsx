import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import OrgPeopleListCard from './OrgPeopleListCard';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';

const MOCKS = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variable: { userid: '123', orgid: '456' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Organization People List Card', () => {
  const props = {
    key: '123',
    id: '1',
    memberName: 'John Doe',
    joinDate: '20/03/2022',
    memberImage: 'https://via.placeholder.com/200x100',
    memberEmail: 'johndoe@gmail.com',
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    global.confirm = () => true;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <OrgPeopleListCard {...props} />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/removeMemberModalBtn/i));
    userEvent.click(screen.getByTestId(/removeMemberBtn/i));

    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = () => false;

    render(
      <MockedProvider>
        <OrgPeopleListCard
          key="123"
          id="1"
          memberName=""
          joinDate="20/03/2022"
          memberImage=""
          memberEmail=""
        />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/removeMemberModalBtn/i));
    userEvent.click(screen.getByTestId(/removeMemberBtn/i));

    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.queryByText(props.memberName)).not.toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });
});
