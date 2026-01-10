/**
 * UsersTableItem Component
 *
 * Renders a table row for a user, managing organization membership and role.
 */

import { useMutation } from '@apollo/client';
import {
  REMOVE_MEMBER_MUTATION,
  UNBLOCK_USER_MUTATION_PG,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import DataTable from 'shared-components/DataTable/DataTable';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryUserListItemForAdmin } from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';
import usertableStyles from './UsersTableItem.module.css';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

type Props = {
  user: InterfaceQueryUserListItemForAdmin;
  index: number;
  loggedInUserId: string;
  resetAndRefetch: () => void;
};

const UsersTableItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');
  const { user, index, resetAndRefetch } = props;
  const [showJoinedOrganizations, setShowJoinedOrganizations] = useState(false);
  const [showBlockedOrganizations, setShowBlockedOrganizations] =
    useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showBlockedUserModal, setShowBlockedUserModal] = useState(false);
  const [removeUserProps, setremoveUserProps] = useState<{
    orgName: string;
    orgId: string;
    setShowOnCancel: 'JOINED' | 'Blocked' | '';
  }>({ orgName: '', orgId: '', setShowOnCancel: '' });

  const memberOrgs =
    user.organizationsWhereMember?.edges?.map((e) => e.node) ?? [];
  const blockedOrgs =
    user.orgsWhereUserIsBlocked?.edges?.map((e) => e.node) ?? [];
  const [joinedOrgs, setJoinedOrgs] = useState(memberOrgs);
  const [blockedUsers, setBlockedUsers] = useState(blockedOrgs);
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');
  const [searchByNameBlockedOrgs, setSearchByNameBlockedOrgs] = useState('');
  const [removeUser] = useMutation(REMOVE_MEMBER_MUTATION);
  const [unblockUser] = useMutation(UNBLOCK_USER_MUTATION_PG);
  const [updateUserInOrgType] = useMutation(UPDATE_USER_ROLE_IN_ORG_MUTATION);
  const navigate = useNavigate();

  useEffect(() => {
    setJoinedOrgs(memberOrgs);
    setBlockedUsers(blockedOrgs);
  }, [user]);

  const confirmRemoveUser = async (): Promise<void> => {
    try {
      const { data } = await removeUser({
        variables: { userid: user.id, orgid: removeUserProps.orgId },
      });
      if (data) {
        NotificationToast.success(
          tCommon('removedSuccessfully', { item: 'User' }) as string,
        );
        resetAndRefetch();
        setShowRemoveUserModal(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const confirmUnblockUser = async (): Promise<void> => {
    try {
      const { data } = await unblockUser({
        variables: { organizationId: removeUserProps.orgId, userId: user.id },
      });
      if (data?.unblockUser) {
        NotificationToast.success(
          tCommon('unblockedSuccessfully', { item: 'User' }) as string,
        );
        resetAndRefetch();
        setShowBlockedUserModal(false);
        setShowBlockedOrganizations(true);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const changeRoleInOrg = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const { value } = e.target;
    const inputData = value.split('?');
    try {
      const { data } = await updateUserInOrgType({
        variables: {
          userId: user.id,
          role: inputData[0],
          organizationId: inputData[1],
        },
      });
      if (data) {
        NotificationToast.success(t('roleUpdated') as string);
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  function goToOrg(_id: string): void {
    const url = '/orgdash/' + _id;
    window.location.replace(url);
    navigate(url);
  }

  function handleCreator(): void {
    NotificationToast.success(t('profilePageComingSoon') as string);
  }

  const searchJoinedOrgs = (value: string): void => {
    setSearchByNameJoinedOrgs(value);
    if (value.trim() === '') {
      setJoinedOrgs(memberOrgs);
    } else {
      const filteredOrgs = memberOrgs.filter((org) =>
        org.name.toLowerCase().includes(value.toLowerCase()),
      );
      setJoinedOrgs(filteredOrgs);
    }
  };

  const searchBlockedOrgs = (value: string): void => {
    setSearchByNameBlockedOrgs(value);
    if (value.trim() === '') {
      setBlockedUsers(blockedOrgs);
    } else {
      const filteredOrgs = blockedOrgs.filter((org) =>
        org.organization.name.toLowerCase().includes(value.toLowerCase()),
      );
      setBlockedUsers(filteredOrgs);
    }
  };

  function onHideRemoveUserModal(): void {
    setShowRemoveUserModal(false);
    if (removeUserProps.setShowOnCancel === 'JOINED') {
      setShowJoinedOrganizations(true);
    }
  }

  function onHideBlockUserModal(): void {
    setShowBlockedUserModal(false);
    if (removeUserProps.setShowOnCancel === 'Blocked') {
      setShowBlockedOrganizations(true);
    }
  }

  // If there is a super admin notion, adapt this logic to your API.
  const isAdmin = user.role === 'administrator';

  return (
    <>
      <tr>
        <th scope="row">{index + 1}</th>
        <td>{user.name}</td>
        <td>{user.emailAddress}</td>
        <td>
          <Button
            className={`btn ${styles.editButton}`}
            onClick={() => setShowJoinedOrganizations(true)}
            data-testid={`showJoinedOrgsBtn${user.id}`}
          >
            {t('view')} ({memberOrgs.length})
          </Button>
        </td>
        <td>
          <Button
            className={`btn ${styles.removeButton}`}
            onClick={() => setShowBlockedOrganizations(true)}
            data-testid={`showBlockedOrgsBtn${user.id}`}
          >
            {t('view')} ({blockedUsers.length})
          </Button>
        </td>
      </tr>
      <BaseModal
        show={showJoinedOrganizations}
        size="xl"
        dataTestId={`modal-joined-org-${user.id}`}
        onHide={() => setShowJoinedOrganizations(false)}
        title={
          <>
            {t('orgJoinedBy')} {user.name} ({memberOrgs.length})
          </>
        }
        headerClassName={styles.modalHeader}
        footer={
          <Button
            variant="secondary"
            onClick={() => setShowJoinedOrganizations(false)}
            data-testid={`closeJoinedOrgsBtn${user.id}`}
          >
            {tCommon('close')}
          </Button>
        }
      >
        {memberOrgs.length !== 0 && (
          <div className="mb-4">
            <SearchBar
              placeholder={t('searchByOrgName')}
              value={searchByNameJoinedOrgs}
              onChange={searchJoinedOrgs}
              onSearch={searchJoinedOrgs}
              onClear={() => searchJoinedOrgs('')}
              inputTestId="searchByNameJoinedOrgs"
              buttonTestId="searchBtnJoinedOrgs"
            />
          </div>
        )}
        <Row>
          {memberOrgs.length === 0 ? (
            <div className={styles.notJoined}>
              <h4>
                {user.name} {t('hasNotJoinedAnyOrg')}
              </h4>
            </div>
          ) : joinedOrgs.length === 0 ? (
            <div className={styles.notJoined}>
              <h4>
                {tCommon('noResultsFoundFor')} &quot;{searchByNameJoinedOrgs}
                &quot;
              </h4>
            </div>
          ) : (
            <DataTable
              data={joinedOrgs}
              columns={[
                { id: 'name', header: tCommon('name'), accessor: 'name' },
                { id: 'address', header: tCommon('address'), accessor: 'city' },
                {
                  id: 'createdOn',
                  header: tCommon('createdOn'),
                  accessor: 'createdAt',
                },
                {
                  id: 'createdBy',
                  header: tCommon('createdBy'),
                  accessor: (row) => row.creator.name,
                },
                {
                  id: 'usersRole',
                  header: tCommon('usersRole'),
                  accessor: () => '',
                },
                {
                  id: 'changeRole',
                  header: tCommon('changeRole'),
                  accessor: () => '',
                },
                { id: 'action', header: tCommon('action'), accessor: () => '' },
              ]}
              rowKey="id"
              tableClassName={styles.modalTable}
              renderRow={(org) => (
                <tr key={`org-joined-${org.id}`}>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => goToOrg(org.id)}
                    >
                      <ProfileAvatarDisplay
                        fallbackName={org.name}
                        imageUrl={org.avatarURL}
                      />
                      {org.name}
                    </Button>
                  </td>
                  <td>{org.city ?? ''}</td>
                  <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => handleCreator()}
                      data-testid={`creator${org.id}`}
                    >
                      <ProfileAvatarDisplay
                        fallbackName={org.creator.name}
                        imageUrl={org.creator.avatarURL}
                      />
                      {org.creator.name}
                    </Button>
                  </td>
                  <td> {isAdmin ? tCommon('admin') : tCommon('user')} </td>
                  <td>
                    <Form.Select
                      size="sm"
                      onChange={changeRoleInOrg}
                      data-testid={`changeRoleInOrg${org.id}`}
                      disabled={isAdmin}
                      defaultValue={
                        isAdmin ? `ADMIN?${org.id}` : `USER?${org.id}`
                      }
                    >
                      {isAdmin ? (
                        <>
                          <option value={`ADMIN?${org.id}`}>
                            {tCommon('admin')}
                          </option>
                          <option value={`USER?${org.id}`}>
                            {tCommon('user')}
                          </option>
                        </>
                      ) : (
                        <>
                          <option value={`USER?${org.id}`}>
                            {tCommon('user')}
                          </option>
                          <option value={`ADMIN?${org.id}`}>
                            {tCommon('admin')}
                          </option>
                        </>
                      )}
                    </Form.Select>
                  </td>
                  <td>
                    <Button
                      className={`btn btn-danger ${styles.removeButton}`}
                      size="sm"
                      data-testid={`removeUserFromOrgBtn${org.id}`}
                      onClick={() => {
                        setremoveUserProps({
                          orgId: org.id,
                          orgName: org.name,
                          setShowOnCancel: 'JOINED',
                        });
                        setShowJoinedOrganizations(false);
                        setShowRemoveUserModal(true);
                      }}
                    >
                      {tCommon('removeUser')}
                    </Button>
                  </td>
                </tr>
              )}
            />
          )}
        </Row>
      </BaseModal>
      <BaseModal
        show={showRemoveUserModal}
        dataTestId={`modal-remove-user-${user.id}`}
        onHide={() => onHideRemoveUserModal()}
        title={t('removeUserFrom', { org: removeUserProps.orgName })}
        headerClassName={styles.modalHeader}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={onHideRemoveUserModal}
              data-testid={`closeRemoveUserModal${user.id}`}
            >
              {tCommon('close')}
            </Button>
            <Button
              className={`btn btn-danger ${styles.removeButton}`}
              onClick={confirmRemoveUser}
              data-testid={`confirmRemoveUser${user.id}`}
            >
              {tCommon('remove')}
            </Button>
          </>
        }
      >
        <hr className={usertableStyles.divider} />
        <p>
          {t('removeConfirmation', {
            name: user.name,
            org: removeUserProps.orgName,
          })}
        </p>
      </BaseModal>
      <BaseModal
        show={showBlockedOrganizations}
        size="xl"
        dataTestId={`modal-blocked-org-${user.id}`}
        onHide={() => setShowBlockedOrganizations(false)}
        title={
          <>
            {t('orgThatBlocked')} {user.name} ({blockedUsers.length})
          </>
        }
        headerClassName={styles.modalHeader}
        footer={
          <Button
            variant="secondary"
            onClick={() => setShowBlockedOrganizations(false)}
            data-testid={`closeUnblockOrgsBtn${user.id}`}
          >
            {tCommon('close')}
          </Button>
        }
      >
        {blockedOrgs.length !== 0 && (
          <div className="search-bar-container">
            <SearchBar
              placeholder={t('searchByOrgName')}
              onSearch={searchBlockedOrgs}
              inputTestId="searchByNameBlockedOrgs"
              buttonTestId="searchBtnBlockedOrgs"
            />
          </div>
        )}
        <Row>
          {blockedOrgs.length === 0 ? (
            <div className={styles.notJoined}>
              <h4>
                {user.name} {t('isNotBlockedByAnyOrg')}
              </h4>
            </div>
          ) : blockedUsers.length === 0 ? (
            <div className={styles.notJoined}>
              <h4>
                {tCommon('noResultsFoundFor')} &quot;{searchByNameBlockedOrgs}
                &quot;
              </h4>
            </div>
          ) : (
            <DataTable
              data={blockedUsers}
              columns={[
                {
                  id: 'name',
                  header: tCommon('name'),
                  accessor: (row) => row.organization.name,
                },
                {
                  id: 'address',
                  header: tCommon('address'),
                  accessor: (row) => row.organization.city,
                },
                {
                  id: 'createdOn',
                  header: tCommon('createdOn'),
                  accessor: 'createdAt',
                },
                {
                  id: 'createdBy',
                  header: tCommon('createdBy'),
                  accessor: (row) => row.organization.creator.name,
                },
                {
                  id: 'usersRole',
                  header: tCommon('usersRole'),
                  accessor: () => '',
                },
                { id: 'action', header: tCommon('action'), accessor: () => '' },
              ]}
              rowKey="id"
              tableClassName={styles.modalTable}
              renderRow={(org) => (
                <tr key={`org-blocked-${org.id}`}>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => goToOrg(org.id)}
                    >
                      <ProfileAvatarDisplay
                        fallbackName={org.organization.name}
                        imageUrl={org.organization.avatarURL}
                      />
                      {org.organization.name}
                    </Button>
                  </td>
                  <td>{org.organization.city ?? ''}</td>
                  <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => handleCreator()}
                      data-testid={`creator${org.id}`}
                    >
                      <ProfileAvatarDisplay
                        fallbackName={org.organization.creator.name}
                      />
                      {org.organization.creator.name}
                    </Button>
                  </td>
                  <td> {isAdmin ? tCommon('admin') : tCommon('user')} </td>
                  <td>
                    <Button
                      className={`btn btn-danger ${styles.removeButton}`}
                      size="sm"
                      data-testid={`unblockUserFromOrgBtn${org.id}`}
                      onClick={() => {
                        setremoveUserProps({
                          orgId: org.id,
                          orgName: org.organization.name,
                          setShowOnCancel: 'Blocked',
                        });
                        setShowBlockedOrganizations(false);
                        setShowBlockedUserModal(true);
                      }}
                    >
                      {tCommon('unblock')}
                    </Button>
                  </td>
                </tr>
              )}
            />
          )}
        </Row>
      </BaseModal>
      <BaseModal
        show={showBlockedUserModal}
        dataTestId={`modal-unblock-user-${user.id}`}
        onHide={() => onHideBlockUserModal()}
        title={t('unblockUserFrom', { org: removeUserProps.orgName })}
        headerClassName={styles.modalHeader}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={onHideBlockUserModal}
              data-testid={`closeUnblockUserModal${user.id}`}
            >
              {tCommon('close')}
            </Button>
            <Button
              className={`btn btn-danger ${styles.removeButton}`}
              onClick={confirmUnblockUser}
              data-testid={`confirmUnblockUser${user.id}`}
            >
              {tCommon('unblock')}
            </Button>
          </>
        }
      >
        <hr className={usertableStyles.divider} />
        <p>
          {t('unblockConfirmation', {
            name: user.name,
            org: removeUserProps.orgName,
          })}
        </p>
      </BaseModal>
    </>
  );
};

export default UsersTableItem;
