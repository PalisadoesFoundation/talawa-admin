import React, { useMemo, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from '../VolunteerManagement.module.css';
import style from '../../../../style/app.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import { TbCalendarEvent } from 'react-icons/tb';
import { FaUserGroup } from 'react-icons/fa6';
import { debounce, Stack } from '@mui/material';

import useLocalStorage from 'utils/useLocalstorage';
import { useMutation, useQuery } from '@apollo/client';
import type { InterfaceVolunteerMembership } from 'utils/interfaces';
import { FaRegClock } from 'react-icons/fa';
import Loader from 'components/Loader/Loader';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { toast } from 'react-toastify';
import SortingButton from 'subComponents/SortingButton';

enum ItemFilter {
  Group = 'group',
  Individual = 'individual',
}

/**
 * The `Invitations` component displays list of invites for the user to volunteer.
 * It allows the user to search, sort, and accept/reject invites.
 *
 * @returns The rendered component displaying the upcoming events.
 */
const Invitations = (): JSX.Element => {
  // Retrieves translation functions for various namespaces
  const { t } = useTranslation('translation', {
    keyPrefix: 'userVolunteer',
  });
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

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [filter, setFilter] = useState<ItemFilter | null>(null);
  const [sortBy, setSortBy] = useState<
    'createdAt_ASC' | 'createdAt_DESC' | null
  >(null);

  const [updateMembership] = useMutation(UPDATE_VOLUNTEER_MEMBERSHIP);

  const updateMembershipStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
  ): Promise<void> => {
    try {
      await updateMembership({
        variables: {
          id: id,
          status: status,
        },
      });
      toast.success(
        t(
          status === 'accepted' ? 'invitationAccepted' : 'invitationRejected',
        ) as string,
      );
      refetchInvitations();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const {
    data: invitationData,
    loading: invitationLoading,
    error: invitationError,
    refetch: refetchInvitations,
  }: {
    data?: {
      getVolunteerMembership: InterfaceVolunteerMembership[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_VOLUNTEER_MEMBERSHIP, {
    variables: {
      where: {
        userId: userId,
        status: 'invited',
        filter: filter,
        eventTitle: searchTerm ? searchTerm : undefined,
      },
      orderBy: sortBy ? sortBy : undefined,
    },
  });

  const invitations = useMemo(() => {
    if (!invitationData) return [];
    return invitationData.getVolunteerMembership;
  }, [invitationData]);

  // loads the invitations when the component mounts
  if (invitationLoading) return <Loader size="xl" />;
  if (invitationError) {
    // Displays an error message if there is an issue loading the invitations
    return (
      <div
        className={`${styles['container']} ${style['bg-white']} ${style['rounded-4']} ${style['my-3']}`}
      >
        <div className={styles['message']} data-testid="errorMsg">
          <WarningAmberRounded
            className={styles['errorIcon']}
            fontSize="large"
          />
          <h6
            className={`${style['fw-bold']} ${style['text-danger']} ${style['text-center']}`}
          >
            {tErrors('errorLoading', { entity: 'Volunteership Invitations' })}
          </h6>
        </div>
      </div>
    );
  }

  // Renders the invitations list and UI elements for searching, sorting, and accepting/rejecting invites
  return (
    <>
      <div
        className={`${styles['btnsContainer']} ${style['gap-4']} ${style['flex-wrap']}`}
      >
        {/* Search input field and button */}
        <div className={`${styles['input']} ${style['mb-1']}`}>
          <Form.Control
            type="name"
            placeholder={t('searchByEventName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            data-testid="searchBy"
          />
          <Button
            tabIndex={-1}
            className={`${style['position-absolute']} ${style['z-10']} ${style['bottom-0']} ${style['end-0']} ${style['d-flex']} ${style['justify-content-center']} ${style['align-items-center']}`}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div
          className={`${style['d-flex']} ${style['gap-4']} ${style['mb-1']}`}
        >
          <div
            className={`${style['d-flex']} ${style['gap-3']} ${style['justify-space-between']}`}
          >
            <SortingButton
              sortingOptions={[
                { label: t('receivedLatest'), value: 'createdAt_DESC' },
                { label: t('receivedEarliest'), value: 'createdAt_ASC' },
              ]}
              onSortChange={(value) =>
                setSortBy(value as 'createdAt_DESC' | 'createdAt_ASC')
              }
              dataTestIdPrefix="sort"
              buttonLabel={tCommon('sort')}
            />
            <SortingButton
              sortingOptions={[
                { label: tCommon('all'), value: 'all' },
                { label: t('groupInvite'), value: 'group' },
                { label: t('individualInvite'), value: 'individual' },
              ]}
              onSortChange={(value) =>
                setFilter(value === 'all' ? null : (value as ItemFilter))
              }
              dataTestIdPrefix="filter"
              buttonLabel={t('filter')}
              type="filter"
            />
          </div>
        </div>
      </div>
      {invitations.length < 1 ? (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {/* Displayed if no invitations are found */}
          {t('noInvitations')}
        </Stack>
      ) : (
        invitations.map((invite: InterfaceVolunteerMembership) => (
          <div
            className={`${style['bg-white']} ${style['p-4']} ${style['rounded']} ${style['shadow-sm']} ${style['d-flex']} ${style['justify-content-between']} ${style['mb-3']}`}
            key={invite._id}
          >
            <div
              className={`${style['d-flex']} ${style['flex-column']} ${style['gap-2']}`}
            >
              <div className={style['fw-bold']} data-testid="inviteSubject">
                {invite.group ? (
                  <>{t('groupInvitationSubject')}</>
                ) : (
                  <>{t('eventInvitationSubject')}</>
                )}
              </div>
              <div className={`${style['d-flex']} ${style['gap-3']}`}>
                {invite.group && (
                  <>
                    <div>
                      <FaUserGroup
                        className={`${style['mb-1']} ${style['me-1']}`}
                        color="grey"
                      />
                      <span className={style['text-muted']}>Group:</span>{' '}
                      <span>{invite.group.name} </span>
                    </div>
                    |
                  </>
                )}
                <div>
                  <TbCalendarEvent
                    className={`${style['mb-1']} ${style['me-1']}`}
                    color="grey"
                    size={20}
                  />
                  <span className={style['text-muted']}>Event:</span>{' '}
                  <span>{invite.event.title}</span>
                </div>
                |
                <div>
                  <FaRegClock
                    className={`${style['mb-1']} ${styles['me-1']}`}
                    color="grey"
                  />
                  <span className={style['text-muted']}>Received:</span>{' '}
                  {new Date(invite.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className={`${style['d-flex']} ${style['gap-2']}`}>
              <Button
                variant="outline-success"
                size="sm"
                data-testid="acceptBtn"
                onClick={() => updateMembershipStatus(invite._id, 'accepted')}
              >
                {t('accept')}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                data-testid="rejectBtn"
                onClick={() => updateMembershipStatus(invite._id, 'rejected')}
              >
                {t('reject')}
              </Button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Invitations;
