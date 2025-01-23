import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import MemberRequestCard from './MemberRequestCard';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { describe, vi, expect } from 'vitest';

const MOCKS = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        acceptMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: { userid: '234' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '2',
          },
        ],
        rejectMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
];
const MOCKS2 = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: { id: '1' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        acceptMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: { userid: '1' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        rejectMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
];
const MOCKS3 = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: { id: '5' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        acceptMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: { userid: '5' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        rejectMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
];
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Member Request Card', () => {
  const props = {
    id: '1',
    memberName: 'John Doe',
    memberLocation: 'India',
    joinDate: '18/03/2022',
    memberImage: 'image',
    email: 'johndoe@gmail.com',
  };

  global.alert = vi.fn();

  it('should render props and text elements test for the page component', async () => {
    global.confirm = (): boolean => true;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByText(/Accept/i));
    userEvent.click(screen.getByText(/Reject/i));

    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
  });

  it('should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard
            id="1"
            memberName=""
            memberLocation="India"
            joinDate="18/03/2022"
            memberImage=""
            email="johndoe@gmail.com"
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByText(/Accept/i));
    userEvent.click(screen.getByText(/Reject/i));

    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.queryByText(props.memberName)).not.toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
  });

  it('should reload window after 2 seconds if addMember is clicked', async () => {
    const props = {
      id: '1',
      memberName: 'John Doe',
      memberLocation: 'India',
      joinDate: '18/03/2022',
      memberImage: 'image',
      email: 'johndoe@gmail.com',
    };
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    try {
      window.location = {
        ...originalLocation,
        reload: vi.fn(),
      };
      render(
        <MockedProvider addTypename={false} link={link2}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await wait();
      userEvent.click(screen.getByText(/Accept/i));
      await wait(2100);
      expect(window.location.reload).toHaveBeenCalled();
    } finally {
      window.location = originalLocation;
    }
  });

  it('should not reload window if acceptMutation fails', async () => {
    const props = {
      id: '1',
      memberName: 'John Doe',
      memberLocation: 'India',
      joinDate: '18/03/2022',
      memberImage: 'image',
      email: '',
    };
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    try {
      window.location = {
        ...originalLocation,
        reload: vi.fn(),
      };
      render(
        <MockedProvider addTypename={false} link={link3}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      userEvent.click(screen.getByText(/Accept/i));
      await wait(2100);
      expect(window.location.reload).not.toHaveBeenCalled();
    } finally {
      window.location = originalLocation;
    }
  });

  it('should reload window if rejectMember is clicked', async () => {
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    try {
      window.location = {
        ...originalLocation,
        reload: vi.fn(),
      };
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MockedProvider addTypename={false} link={link2}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await wait();
      userEvent.click(screen.getByText(/Reject/i));
      await wait();
      expect(window.confirm).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    } finally {
      window.location = originalLocation;
    }
  });

  it('should not reload window if rejectMutation fails', async () => {
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    try {
      window.location = {
        ...originalLocation,
        reload: vi.fn(),
      };
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MockedProvider addTypename={false} link={link3}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await wait();
      userEvent.click(screen.getByText(/Reject/i));
      await wait();
      expect(window.confirm).toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled();
    } finally {
      window.location = originalLocation;
    }
  });
});
