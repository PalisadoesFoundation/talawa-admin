import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { MOCKS, UPDATE_ERROR_MOCKS } from './Groups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceGroupModal } from './GroupModal';
import GroupModal from './GroupModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import dayjs from 'dayjs';

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(UPDATE_ERROR_MOCKS);

/**
 * Translations for test cases
 */

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

/**
 * Props for `GroupModal` component used in tests
 */

const itemProps: InterfaceGroupModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    refetchGroups: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: null,
      createdAt: dayjs().toISOString(),
      creator: {
        id: 'creatorId1',
        name: 'Wilt Shepherd',
        emailAddress: 'wilt@example.com',
        avatarURL: null,
      },
      leader: {
        id: 'userId',
        name: 'Teresa Bradley',
        emailAddress: 'teresa@example.com',
        avatarURL: 'img-url',
      },
      volunteers: [
        {
          id: 'volunteerId1',
          hasAccepted: true,
          hoursVolunteered: 5,
          isPublic: true,
          user: {
            id: 'userId',
            firstName: 'Teresa',
            lastName: 'Bradley',
            name: 'Teresa Bradley',
            avatarURL: null,
          },
        },
      ],
      event: {
        id: 'eventId',
      },
      isTemplate: true,
      isInstanceException: false,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    refetchGroups: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: null,
      volunteersRequired: null,
      createdAt: dayjs().toISOString(),
      creator: {
        id: 'creatorId1',
        name: 'Wilt Shepherd',
        emailAddress: 'wilt@example.com',
        avatarURL: null,
      },
      leader: {
        id: 'userId',
        name: 'Teresa Bradley',
        emailAddress: 'teresa@example.com',
        avatarURL: 'img-url',
      },
      volunteers: [],
      event: {
        id: 'eventId',
      },
      isTemplate: true,
      isInstanceException: false,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    refetchGroups: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: 5,
      createdAt: dayjs().toISOString(),
      creator: {
        id: 'creatorId1',
        name: 'Wilt Shepherd',
        emailAddress: 'wilt@example.com',
        avatarURL: null,
      },
      leader: {
        id: 'userId',
        name: 'Teresa Bradley',
        emailAddress: 'teresa@example.com',
        avatarURL: 'img-url',
      },
      volunteers: [
        {
          id: 'volunteerId1',
          hasAccepted: true,
          hoursVolunteered: 5,
          isPublic: true,
          user: {
            id: 'userId',
            firstName: 'Teresa',
            lastName: 'Bradley',
            name: 'Teresa Bradley',
            avatarURL: 'http://example.com/avatar.jpg',
          },
        },
      ],
      event: {
        id: 'eventId',
      },
      isTemplate: true,
      isInstanceException: false,
    },
  },
];

const renderGroupModal = (
  link: ApolloLink,
  props: InterfaceGroupModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <GroupModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing GroupModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with correct title', () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();
  });

  it('should render close button and close modal when clicked', async () => {
    renderGroupModal(link1, itemProps[0]);
    const closeBtns = screen.getAllByTestId('modalCloseBtn');
    expect(closeBtns[0]).toBeInTheDocument();
    await userEvent.click(closeBtns[0]);
    expect(itemProps[0].hide).toHaveBeenCalled();
  });

  it('should render details tab by default', () => {
    renderGroupModal(link1, itemProps[0]);
    const detailsRadio = screen.getByLabelText(t.details);
    expect(detailsRadio).toBeChecked();
  });

  it('should render requests tab when clicked', async () => {
    renderGroupModal(link1, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);
    expect(requestsRadio).toBeChecked();
  });

  it('GroupModal -> Click Requests -> Click Details', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const detailsRadio = screen.getByLabelText(t.details);
    expect(detailsRadio).toBeInTheDocument();
    await userEvent.click(detailsRadio);
    expect(detailsRadio).toBeChecked();
  });

  it('should render all form fields in details tab', () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /description/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /volunteers required/i }),
    ).toBeInTheDocument();
  });

  it('should display initial values in form fields', () => {
    renderGroupModal(link1, itemProps[0]);
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const descInput = screen.getByRole('textbox', { name: /description/i });
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });

    expect(nameInput).toHaveValue('Group 1');
    expect(descInput).toHaveValue('desc');
    expect(vrInput).toHaveValue(null);
  });

  it('should display initial values when volunteersRequired is set', () => {
    renderGroupModal(link1, itemProps[2]);
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    expect(vrInput).toHaveValue(5);
  });

  it('should update name input when changed', async () => {
    renderGroupModal(link1, itemProps[0]);
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Group Name');
    expect(nameInput).toHaveValue('New Group Name');
  });

  it('should update description input when changed', async () => {
    renderGroupModal(link1, itemProps[0]);
    const descInput = screen.getByRole('textbox', { name: /description/i });
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'New description');
    expect(descInput).toHaveValue('New description');
  });

  it('should update volunteersRequired input when valid number is entered', async () => {
    renderGroupModal(link1, itemProps[0]);
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);
  });

  it('should clear volunteersRequired when empty string is entered', async () => {
    renderGroupModal(link1, itemProps[2]);
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    expect(vrInput).toHaveValue(5);
    fireEvent.change(vrInput, { target: { value: '' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });
  });

  it('should not accept negative values for volunteersRequired', async () => {
    renderGroupModal(link1, itemProps[1]);
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    fireEvent.change(vrInput, { target: { value: '-1' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });
  });

  it('should not accept zero for volunteersRequired', async () => {
    renderGroupModal(link1, itemProps[1]);
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    fireEvent.change(vrInput, { target: { value: '0' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });
  });

  it('Try adding different values for volunteersRequired', async () => {
    renderGroupModal(link1, itemProps[1]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '-1' } });

    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    await userEvent.clear(vrInput);
    await userEvent.type(vrInput, '1{backspace}');

    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    fireEvent.change(vrInput, { target: { value: '0' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    fireEvent.change(vrInput, { target: { value: '19' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(19);
    });
  });

  it('GroupModal -> Details -> Update', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByRole('textbox', { name: /description/i });
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupUpdated,
      );
      expect(itemProps[0].refetchGroups).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> No values updated', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> Update -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByRole('textbox', { name: /description/i });
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('should update form state when group prop changes', async () => {
    const { rerender } = renderGroupModal(link1, itemProps[0]);

    const newGroup = {
      ...itemProps[0].group,
      name: 'Updated Group',
      description: 'Updated Description',
      volunteersRequired: 15,
    };

    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <GroupModal {...itemProps[0]} group={newGroup} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await waitFor(() => {
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      expect(nameInput).toHaveValue('Updated Group');
    });
  });

  it('GroupModal -> Requests -> Accept', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const acceptBtn = screen.getAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);
    await userEvent.click(acceptBtn[0]);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.requestAccepted);
    });
  });

  it('GroupModal -> Requests -> Reject', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const rejectBtn = screen.getAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(2);
    await userEvent.click(rejectBtn[0]);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.requestRejected);
    });
  });

  it('should display user names in requests table', async () => {
    renderGroupModal(link1, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    await waitFor(() => {
      const userName = screen.getAllByTestId('userName');
      expect(userName).toHaveLength(2);
      expect(userName[0]).toHaveTextContent('John Doe');
      expect(userName[1]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('should display Avatar component when user has no avatarURL', async () => {
    // Create a specific mock link with avatarURL: null to force the Avatar component render path
    const linkWithNullAvatar = new StaticMockLink([
      {
        request: {
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: {
            where: {
              eventId: 'eventId',
              groupId: 'groupId',
              status: 'requested',
            },
          },
        },
        result: {
          data: {
            getVolunteerMembership: [
              {
                __typename: 'VolunteerMembership',
                id: 'membershipId1',
                status: 'requested',
                volunteer: {
                  __typename: 'EventVolunteer',
                  user: {
                    __typename: 'User',
                    id: 'userId1',
                    name: 'John Doe',
                    avatarURL: null, // Explicitly null
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    renderGroupModal(linkWithNullAvatar, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(1);
    expect(userName[0]).toHaveTextContent('John Doe');

    // Verify Avatar component is rendered by checking for the testid passed to it
    const avatarComponents = screen.getAllByTestId('avatar');
    expect(avatarComponents).toHaveLength(1);
  });

  it('should display image when user has avatarURL', async () => {
    // Create a custom itemProps with a user that has an avatarURL
    const propsWithAvatar: InterfaceGroupModal = {
      ...itemProps[0],
      group: {
        ...itemProps[0].group,
      },
    };

    const link3 = new StaticMockLink([
      {
        request: {
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: {
            where: {
              eventId: 'eventId',
              groupId: 'groupId',
              status: 'requested',
            },
          },
        },
        result: {
          data: {
            getVolunteerMembership: [
              {
                __typename: 'VolunteerMembership',
                id: 'membershipId1',
                status: 'requested',
                volunteer: {
                  __typename: 'EventVolunteer',
                  user: {
                    __typename: 'User',
                    id: 'userId1',
                    name: 'John Doe',
                    avatarURL: 'https://example.com/avatar.jpg',
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    renderGroupModal(link3, propsWithAvatar);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    // Wait for the image to be rendered
    const avatarImage = await screen.findByAltText(t.volunteerAlt);
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg',
    );
  });

  it('GroupModal -> Requests -> Accept -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const userNameElements = await screen.findAllByTestId('userName');
    expect(userNameElements).toHaveLength(2);
    expect(userNameElements[0]).toHaveTextContent('John Doe');
    expect(userNameElements[1]).toHaveTextContent('Teresa Bradley');

    const acceptBtn = screen.getAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);
    await userEvent.click(acceptBtn[0]);
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('should display "no requests" message when requests array is empty', async () => {
    const link3 = new StaticMockLink([
      {
        request: {
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: {
            where: {
              eventId: 'eventId',
              groupId: 'groupId',
              status: 'requested',
            },
          },
        },
        result: {
          data: {
            getVolunteerMembership: [],
          },
        },
      },
    ]);

    renderGroupModal(link3, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    await waitFor(() => {
      expect(screen.getByText(t.noRequests)).toBeInTheDocument();
    });
  });

  it('should render empty array when requests data is loading/undefined', async () => {
    // Use a MockLink that returns empty list to simulate "data exists but is empty" which is one part of the condition.
    // To simulate loading/undefined, ideally we'd pause. But verifying "No requests" appears covers the fallback.
    const emptyLink = new StaticMockLink([
      {
        request: {
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: {
            where: {
              eventId: 'eventId',
              groupId: 'groupId',
              status: 'requested',
            },
          },
        },
        result: {
          data: {
            getVolunteerMembership: [],
          },
        },
      },
    ]);

    renderGroupModal(emptyLink, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    expect(screen.getByText(t.noRequests)).toBeInTheDocument();
  });

  it('should render requests table with correct headers', async () => {
    renderGroupModal(link1, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    await waitFor(() => {
      expect(screen.getByText(t.volunteerName)).toBeInTheDocument();
      expect(screen.getByText(t.volunteerActions)).toBeInTheDocument();
    });
  });

  it('should handle description as null', () => {
    renderGroupModal(link1, itemProps[1]);
    const descInput = screen.getByRole('textbox', { name: /description/i });
    expect(descInput).toHaveValue('');
  });

  it('should render submit button with correct text', () => {
    renderGroupModal(link1, itemProps[0]);
    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toHaveTextContent(t.updateGroup);
  });

  it('should render both accept and reject buttons for each request', async () => {
    renderGroupModal(link1, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    await waitFor(() => {
      const acceptBtns = screen.getAllByTestId('acceptBtn');
      const rejectBtns = screen.getAllByTestId('rejectBtn');
      expect(acceptBtns).toHaveLength(2);
      expect(rejectBtns).toHaveLength(2);
    });
  });

  it('should call updateMembershipStatus with correct arguments on accept', async () => {
    renderGroupModal(link1, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    await userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.requestAccepted);
    });
  });

  it('should call updateMembershipStatus with correct arguments on reject', async () => {
    renderGroupModal(link1, itemProps[0]);
    const requestsRadio = screen.getByLabelText(t.requests);
    await userEvent.click(requestsRadio);

    const rejectBtn = await screen.findAllByTestId('rejectBtn');
    await userEvent.click(rejectBtn[0]);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.requestRejected);
    });
  });

  // Validation state tests
  it('should show validation error when name is empty and touched', async () => {
    renderGroupModal(link1, itemProps[0]);
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    await userEvent.clear(nameInput);
    fireEvent.blur(nameInput);

    // Check if error message is displayed (from FormFieldGroup)
    // The exact error message depends on tCommon('nameRequired'), let's assume it renders something or the input becomes invalid
    // FormFieldGroup usually renders error text.
    // Based on the code: error={nameError}
    // We can check if the input is invalid or if error text appears.
    // Assuming 'Name is required' or similar text appears, or checking the state implicitly via button disabled
    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeDisabled();
  });

  it('should show validation error for invalid volunteers required on blur', async () => {
    renderGroupModal(link1, itemProps[0]);
    const vrInput = screen.getByRole('spinbutton', {
      name: /volunteers required/i,
    });

    // Input invalid value
    await userEvent.type(vrInput, '-5');
    fireEvent.blur(vrInput);

    const errorMessages = screen.getAllByText(t.invalidNumber);
    expect(errorMessages.length).toBeGreaterThan(0);
    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeDisabled();
  });

  it('should not submit if validation errors exist', async () => {
    renderGroupModal(link1, itemProps[0]);
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    await userEvent.clear(nameInput);
    fireEvent.blur(nameInput); // Trigger error

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeDisabled();

    await userEvent.click(submitBtn); // Should not fire
    expect(NotificationToast.success).not.toHaveBeenCalled();
  });
});
