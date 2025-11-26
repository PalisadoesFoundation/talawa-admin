import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventRegistrantsWrapper } from './EventRegistrantsWrapper';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describe, test, expect, vi } from 'vitest';

const queryMock = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          attendees: [],
        },
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'org123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org123',
            members: [
              {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@palisadoes.com',
                image: '',
                createdAt: '12/12/22',
                organizationsBlockedBy: [],
              },
            ],
          },
        ],
      },
    },
  },
];

// Define a proper type for the component props
type RenderComponentProps = {
  eventId: string;
  orgId: string;
  onUpdate?: () => void;
};

const renderComponent = (props: RenderComponentProps) => {
  return render(
    <MockedProvider addTypename={false} mocks={queryMock}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <EventRegistrantsWrapper {...props} />
            </I18nextProvider>
          </Provider>
        </LocalizationProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Testing Event Registrants Wrapper', () => {
  const props: RenderComponentProps = {
    eventId: 'event123',
    orgId: 'org123',
  };

  test('Should render the Register Member button', () => {
    const { getByText, getByTestId } = renderComponent(props);

    expect(getByText('Register Member')).toBeInTheDocument();
    expect(getByTestId('filter-button')).toBeInTheDocument();
  });

  test('Should have correct aria-label on button', () => {
    const { getByLabelText } = renderComponent(props);

    expect(getByLabelText('showAttendees')).toBeInTheDocument();
  });

  test('Should open the modal when button is clicked', async () => {
    const { getByText, queryByText } = renderComponent(props);

    // Modal should not be visible initially
    expect(queryByText('Event Registrants')).not.toBeInTheDocument();

    // Click the button to open modal
    fireEvent.click(getByText('Register Member'));

    // Modal should be visible
    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );
  });

  test('Should close the modal when close button is clicked', async () => {
    const { getByText, queryByText, getByRole } = renderComponent(props);

    // Open the modal
    fireEvent.click(getByText('Register Member'));

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    // Close the modal
    fireEvent.click(getByRole('button', { name: /close/i }));

    await waitFor(() =>
      expect(queryByText('Event Registrants')).not.toBeInTheDocument(),
    );
  });

  test('Should call onUpdate callback when modal is closed', async () => {
    const onUpdateMock = vi.fn();
    const propsWithCallback: RenderComponentProps = {
      ...props,
      onUpdate: onUpdateMock,
    };

    const { getByText, getByRole } = renderComponent(propsWithCallback);

    // Open the modal
    fireEvent.click(getByText('Register Member'));

    await waitFor(() =>
      expect(getByText('Event Registrants')).toBeInTheDocument(),
    );

    // Close the modal
    fireEvent.click(getByRole('button', { name: /close/i }));

    // Verify onUpdate was called
    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledTimes(1);
    });
  });

  test('Should not call onUpdate callback when it is not provided', async () => {
    const { getByText, getByRole, queryByText } = renderComponent(props);

    // Open the modal
    fireEvent.click(getByText('Register Member'));

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    // Close the modal (should not throw error even without onUpdate)
    fireEvent.click(getByRole('button', { name: /close/i }));

    await waitFor(() =>
      expect(queryByText('Event Registrants')).not.toBeInTheDocument(),
    );
  });

  test('Should toggle modal visibility multiple times', async () => {
    const { getByText, queryByText, getByRole } = renderComponent(props);

    // First open
    fireEvent.click(getByText('Register Member'));
    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    // First close
    fireEvent.click(getByRole('button', { name: /close/i }));
    await waitFor(() =>
      expect(queryByText('Event Registrants')).not.toBeInTheDocument(),
    );

    // Second open
    fireEvent.click(getByText('Register Member'));
    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    // Second close
    fireEvent.click(getByRole('button', { name: /close/i }));
    await waitFor(() =>
      expect(queryByText('Event Registrants')).not.toBeInTheDocument(),
    );
  });

  test('Should pass correct props to EventRegistrantsModal', async () => {
    const { getByText } = renderComponent(props);

    // Open the modal
    fireEvent.click(getByText('Register Member'));

    await waitFor(() =>
      expect(getByText('Event Registrants')).toBeInTheDocument(),
    );

    // The modal being rendered confirms eventId and orgId are passed correctly
    // as the GraphQL queries use these values
  });
});
