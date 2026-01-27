import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import VolunteerGroupViewModal from './VolunteerGroupViewModal';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import type { InterfaceVolunteerGroupViewModalProps } from 'types/shared-components/VolunteerGroupViewModal/interface';

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const itemProps: InterfaceVolunteerGroupViewModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: null,
      isTemplate: true,
      isInstanceException: false,
      createdAt: dayjs().toISOString(),
      creator: {
        id: 'creatorId1',
        name: 'Wilt Shepherd',
        emailAddress: 'wilt@example.com',
        avatarURL: 'img-url',
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
      event: { id: 'eventId' },
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: null,
      volunteersRequired: 10,
      isTemplate: true,
      isInstanceException: false,
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
        avatarURL: null,
      },
      volunteers: [],
      event: { id: 'eventId' },
    },
  },
];

const renderGroupViewModal = (
  props: InterfaceVolunteerGroupViewModalProps,
): RenderResult => {
  return render(
    <MockedProvider>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <VolunteerGroupViewModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing VolunteerGroupViewModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Render VolunteerGroupViewModal (variation 1)', async () => {
    renderGroupViewModal(itemProps[0]);
    expect(screen.getByText(t.groupDetails)).toBeInTheDocument();
    expect(screen.getByTestId('leader_image')).toBeInTheDocument();
    expect(screen.getByTestId('creator_image')).toBeInTheDocument();
  });

  it('Render VolunteerGroupViewModal (variation 2)', async () => {
    renderGroupViewModal(itemProps[1]);
    expect(screen.getByText(t.groupDetails)).toBeInTheDocument();
    expect(screen.getByTestId('leader_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('creator_avatar')).toBeInTheDocument();
  });

  describe('Field onChange handlers', () => {
    it('should keep group name field read-only', () => {
      renderGroupViewModal(itemProps[0]);

      const input = screen.getByTestId('groupName');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input).toHaveValue('Group 1');
    });

    it('should keep volunteersRequired field read-only', () => {
      renderGroupViewModal(itemProps[1]);

      const input = screen.getByTestId('volunteersRequired');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input).toHaveValue('10');
    });

    it('should keep description field read-only', () => {
      renderGroupViewModal(itemProps[0]);

      const input = screen.getByTestId('groupDescription');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input).toHaveValue('desc');
    });

    it('should keep leader field read-only', () => {
      renderGroupViewModal(itemProps[0]);

      const input = screen.getByTestId('groupLeader');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input).toHaveValue('Teresa Bradley');
    });

    it('should keep creator field read-only', () => {
      renderGroupViewModal(itemProps[0]);

      const input = screen.getByTestId('groupCreator');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input).toHaveValue('Wilt Shepherd');
    });

    it('should call no-op onChange handlers without errors', async () => {
      renderGroupViewModal(itemProps[0]);

      const nameInput = screen.getByTestId('groupName') as HTMLInputElement;
      const descInput = screen.getByTestId(
        'groupDescription',
      ) as HTMLInputElement;
      const leaderInput = screen.getByTestId('groupLeader') as HTMLInputElement;
      const creatorInput = screen.getByTestId(
        'groupCreator',
      ) as HTMLInputElement;

      const initialName = nameInput.value;
      const initialDesc = descInput.value;
      const initialLeader = leaderInput.value;
      const initialCreator = creatorInput.value;

      nameInput.removeAttribute('disabled');
      descInput.removeAttribute('disabled');
      leaderInput.removeAttribute('disabled');
      creatorInput.removeAttribute('disabled');

      await userEvent.type(nameInput, 'x');
      await userEvent.type(descInput, 'x');
      await userEvent.type(leaderInput, 'x');
      await userEvent.type(creatorInput, 'x');

      expect(nameInput.value).toBe(initialName);
      expect(descInput.value).toBe(initialDesc);
      expect(leaderInput.value).toBe(initialLeader);
      expect(creatorInput.value).toBe(initialCreator);
    });

    it('should call no-op onChange handler for volunteersRequired field', async () => {
      renderGroupViewModal(itemProps[1]);

      const input = screen.getByTestId(
        'volunteersRequired',
      ) as HTMLInputElement;

      const initialValue = input.value;

      input.removeAttribute('disabled');

      await userEvent.type(input, '5');

      expect(input.value).toBe(initialValue);
    });
  });

  describe('Volunteers table', () => {
    it('should render volunteers table when volunteers exist', () => {
      renderGroupViewModal(itemProps[0]);

      expect(screen.getByText(t.volunteers)).toBeInTheDocument();
      expect(screen.getByText('Teresa Bradley')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should not render volunteers table when volunteers array is empty', () => {
      renderGroupViewModal(itemProps[1]);

      expect(screen.queryByText(t.volunteers)).not.toBeInTheDocument();
    });
  });
});
