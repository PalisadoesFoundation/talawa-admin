import React from 'react';
import { act, render, screen } from '@testing-library/react';
import MemberRequestCard from './MemberRequestCard';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

const MOCKS = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variable: { id: '123' },
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
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variable: { id: '234' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '2',
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

describe('Testing Member Request Card', () => {
  const props = {
    key: '123',
    id: '1',
    memberName: 'John Doe',
    memberLocation: 'India',
    joinDate: '18/03/2022',
    memberImage: '',
    email: 'johndoe@gmail.com',
  };

  global.confirm = () => true;
  global.alert = jest.fn();

  it('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <MemberRequestCard {...props} />
      </MockedProvider>
    );

    userEvent.click(screen.getByText(/Accept/i));
    userEvent.click(screen.getByText(/Reject/i));

    await wait();

    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
  });
});
