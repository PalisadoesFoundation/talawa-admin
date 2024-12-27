import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import OrgPeopleListCard from './OrgPeopleListCard';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    orgId: '12345',
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string): string => key,
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock('utils/errorHandler', () => ({
  errorHandler: jest.fn(),
}));

describe('orgPeopleListCard Component', () => {
  const toggleRemoveModalMock = jest.fn();

  const mocks = [
    {
      request: {
        query: REMOVE_MEMBER_MUTATION,
        variables: {
          userid: '1',
          orgid: '12345',
        },
      },
      result: {
        data: {
          removeMember: {
            _id: 12,
          },
        },
      },
    },
  ];

  const props = {
    id: '1',
    toggleRemoveModal: toggleRemoveModalMock,
  };

  it('should render the modal and successfully remove the member', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/org/12345']}>
          <Routes>
            <Route
              path="/org/:orgId"
              element={<OrgPeopleListCard {...props} />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(getByText('removeMember')).toBeInTheDocument();
    expect(getByText('removeMemberMsg')).toBeInTheDocument();

    fireEvent.click(getByTestId('removeMemberBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('memberRemoved');
      expect(toggleRemoveModalMock).toHaveBeenCalled();
    });
  });

  it('should handle errors correctly when mutation fails', async () => {
    const errorMocks = [
      {
        request: {
          query: REMOVE_MEMBER_MUTATION,
          variables: {
            userid: '1',
            orgid: '12345',
          },
        },
        error: new Error('An error occurred'),
      },
    ];

    const { getByTestId } = render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter initialEntries={['/org/12345']}>
          <Routes>
            <Route
              path="/org/:orgId"
              element={<OrgPeopleListCard {...props} />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    fireEvent.click(getByTestId('removeMemberBtn'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  it('should not render modal when id is undefined', () => {
    const propsWithUndefinedId = {
      id: undefined,
      toggleRemoveModal: toggleRemoveModalMock,
    };

    const { queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/orglist']}>
          {' '}
          {/* Change this to '/orglist' */}
          <Routes>
            <Route
              path="/orglist"
              element={<OrgPeopleListCard {...propsWithUndefinedId} />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(queryByText('removeMember')).not.toBeInTheDocument();
    expect(queryByText('removeMemberMsg')).not.toBeInTheDocument();
  });
});
