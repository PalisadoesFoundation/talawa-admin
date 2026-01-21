/**
 * Invitations.tsx
 * This component renders the Invitations screen for the user portal,
 * allowing users to view, search, sort, and manage their volunteer invitations.
 * It integrates with GraphQL queries and mutations to fetch and update invitation data.
 *
 * module Invitations
 *
 * enum ItemFilter
 * description Enum for filtering invitations by type.
 * property Group - Represents group invitations.
 * property Individual - Represents individual invitations.
 *
 * function Invitations
 * description Renders the Invitations screen, displaying a list of volunteer invitations
 * with options to search, sort, filter, and accept/reject invitations.
 *
 * @returns The Invitations component.
 *
 * remarks
 * - Redirects to the homepage if `orgId` or `userId` is missing.
 * - Displays a loader while fetching data and handles errors gracefully.
 * - Uses `useQuery` to fetch invitations and `useMutation` to update invitation status.
 * - Provides search and sorting functionality using `SearchBar` and `SortingButton` components.
 *
 * dependencies
 * - `react`, `react-router-dom`, `react-bootstrap`, `react-toastify`
 * - `@apollo/client` for GraphQL queries and mutations
 * - `@mui/icons-material`, `react-icons` for icons
 * - Custom hooks: `useLocalStorage`
 * - Custom components: `Loader`, `SearchBar`, `SortingButton`
 *
 * @example
 * ```tsx
 * <Invitations />
 * ```
 */
import { useMemo, useState } from 'react';
import styles from './Invitations.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { WarningAmberRounded } from '@mui/icons-material';
import { TbCalendarEvent } from 'react-icons/tb';
import { FaUserGroup } from 'react-icons/fa6';
import { Stack } from '@mui/material';

import useLocalStorage from 'utils/useLocalstorage';
import { useMutation, useQuery } from '@apollo/client';
import type { InterfaceVolunteerMembership } from 'utils/interfaces';
import { FaRegClock } from 'react-icons/fa';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import Button from 'shared-components/Button/Button';
import { mapVolunteerStatusToVariant } from 'utils/volunteerStatusMapper';

enum ItemFilter {
  Group = 'group',
  Individual = 'individual',
}

const Invitations = (): JSX.Element => {
  // Retrieves translation functions for various namespaces
  const { t } = useTranslation('translation', { keyPrefix: 'userVolunteer' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Retrieves stored user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  // Extracts organization ID from the URL parameters
  const { orgId } = useParams();
  if (!orgId || !userId) {
    // Redirects to the homepage if orgId or userId is missing
    return <Navigate to={'/'} replace />;
  }

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [filter, setFilter] = useState<ItemFilter | 'all'>('all');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );

  const [updateMembership] = useMutation(UPDATE_VOLUNTEER_MEMBERSHIP);

  const updateMembershipStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
  ): Promise<void> => {
    try {
      await updateMembership({ variables: { id: id, status: status } });
      NotificationToast.success(
        t(
          status === 'accepted' ? 'invitationAccepted' : 'invitationRejected',
        ) as string,
      );
      refetchInvitations();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  const {
    data: invitationData,
    loading: invitationLoading,
    error: invitationError,
    refetch: refetchInvitations,
  }: {
    data?: { getVolunteerMembership: InterfaceVolunteerMembership[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_VOLUNTEER_MEMBERSHIP, {
    variables: {
      where: {
        userId: userId,
        status: 'invited',
        eventTitle: appliedSearch || undefined,
      },
      orderBy: sortBy,
    },
  });

  const invitations = useMemo(() => {
    if (!invitationData) return [];

    let data = invitationData.getVolunteerMembership;

    if (filter === 'group') {
      data = data.filter((i) => i.group && i.group.id);
    }

    if (filter === 'individual') {
      data = data.filter((i) => !i.group || !i.group.id);
    }

    return data;
  }, [invitationData, filter]);

  if (invitationError) {
    // Displays an error message if there is an issue loading the invitations
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Volunteership Invitations' })}
          </h6>
        </div>
      </div>
    );
  }

  // Renders the invitations list and UI elements for searching, sorting, and accepting/rejecting invites
  const sortDropdown = {
    id: 'sort',
    label: tCommon('sort'),
    type: 'sort' as const,
    options: [
      { label: t('receivedLatest'), value: 'createdAt_DESC' },
      { label: t('receivedEarliest'), value: 'createdAt_ASC' },
    ],
    selectedOption: sortBy,
    onOptionChange: (value: string | number) =>
      setSortBy(value as 'createdAt_DESC' | 'createdAt_ASC'),
    dataTestIdPrefix: 'sort',
  };

  const filterDropdown = {
    id: 'filter',
    label: t('filter'),
    type: 'filter' as const,
    options: [
      { label: tCommon('all'), value: 'all' },
      { label: t('groupInvite'), value: 'group' },
      { label: t('individualInvite'), value: 'individual' },
    ],
    selectedOption: filter,
    onOptionChange: (value: string | number) =>
      setFilter(value === 'all' ? 'all' : (value as ItemFilter)),
    dataTestIdPrefix: 'filter',
  };

  return (
    <LoadingState isLoading={invitationLoading} variant="spinner">
      <SearchFilterBar
        searchPlaceholder={t('searchByEventName')}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={() => {
          setAppliedSearch(searchTerm);
        }}
        searchInputTestId="searchByInput"
        searchButtonTestId="searchBtn"
        hasDropdowns={true}
        dropdowns={[sortDropdown, filterDropdown]}
      />

      {invitations.length < 1 ? (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {/* Displayed if no invitations are found */}
          {t('noInvitations')}
        </Stack>
      ) : (
        invitations.map((invite: InterfaceVolunteerMembership) => (
          <div
            className="bg-white p-4  rounded shadow-sm d-flex justify-content-between mb-3"
            key={invite.id}
          >
            <div className="d-flex flex-column gap-2">
              <div className="fw-bold" data-testid="inviteSubject">
                {invite.group && invite.group.id ? (
                  // Group invitation
                  <>
                    {invite.event.recurrenceRule ? (
                      <>{t('groupInvitationRecurringSubject')}</>
                    ) : (
                      <>{t('groupInvitationSubject')}</>
                    )}
                  </>
                ) : (
                  // Individual invitation
                  <>
                    {invite.event.recurrenceRule ? (
                      <>{t('eventInvitationRecurringSubject')}</>
                    ) : (
                      <>{t('eventInvitationSubject')}</>
                    )}
                  </>
                )}
              </div>
              <div className="d-flex gap-3">
                {invite.group && invite.group.id && (
                  <>
                    <div>
                      <FaUserGroup className="mb-1 me-1 text-secondary" />
                      <span className="text-muted">{t('group')}:</span>{' '}
                      <span>{invite.group.name} </span>
                    </div>
                    |
                  </>
                )}
                <div>
                  <TbCalendarEvent
                    className="mb-1 me-1 text-secondary"
                    size={20}
                  />
                  <span className="text-muted">{t('event')}:</span>{' '}
                  <span>{invite.event.name}</span>
                </div>
                |
                <div>
                  <FaRegClock className="mb-1 me-1 text-secondary" />
                  <span className="text-muted">{t('received')}:</span>{' '}
                  {new Date(invite.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <StatusBadge
                {...mapVolunteerStatusToVariant(invite.status)}
                size="sm"
                dataTestId={`invitation-status-${invite.id}`} // i18n-ignore-line
              />
              <Button
                variant="outline-success"
                size="sm"
                data-testid="acceptBtn"
                onClick={() => updateMembershipStatus(invite.id, 'accepted')}
              >
                {t('accept')}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                data-testid="rejectBtn"
                onClick={() => updateMembershipStatus(invite.id, 'rejected')}
              >
                {t('reject')}
              </Button>
            </div>
          </div>
        ))
      )}
    </LoadingState>
  );
};

export default Invitations;
