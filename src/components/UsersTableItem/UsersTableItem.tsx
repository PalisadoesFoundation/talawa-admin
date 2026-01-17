/**
 * UsersTableItem Component
 *
 * Renders a table row for a user, managing organization membership and role.
 */

import { useMutation } from '@apollo/client';
import { Search } from '@mui/icons-material';
import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import Avatar from 'components/Avatar/Avatar';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';

type UserWithAppProfile = InterfaceQueryUserListItem & {
  appUserProfile?: {
    isSuperAdmin?: boolean;
    adminFor?: Array<{ _id: string }>;
  };
};

type Props = {
  user: InterfaceQueryUserListItem;
  index: number;
  loggedInUserId: string;
  resetAndRefetch: () => void;
};

const UsersTableItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');
  const { user, index, resetAndRefetch } = props;
  const [showJoinedOrganizations, setShowJoinedOrganizations] = useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [removeUserProps, setremoveUserProps] = useState<{
    orgName: string;
    orgId: string;
    setShowOnCancel: 'JOINED' | '';
  }>({ orgName: '', orgId: '', setShowOnCancel: '' });

  const memberOrgs =
    user.organizationsWhereMember?.edges?.map((e) => e.node) ?? [];
  const [joinedOrgs, setJoinedOrgs] = useState(memberOrgs);
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');

  const [removeUser] = useMutation(REMOVE_MEMBER_MUTATION);
  const [updateUserInOrgType] = useMutation(UPDATE_USER_ROLE_IN_ORG_MUTATION);
  const navigate = useNavigate();

  const confirmRemoveUser = async (): Promise<void> => {
    try {
      const { data } = await removeUser({
        variables: { userid: user.id, orgid: removeUserProps.orgId },
      });
      if (data) {
        toast.success(
          tCommon('removedSuccessfully', { item: 'User' }) as string,
        );
        resetAndRefetch();
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
        toast.success(t('roleUpdated') as string);
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
    toast.success('Profile Page Coming Soon !');
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

  const handleSearchJoinedOrgs = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
      searchJoinedOrgs(value);
    }
  };

  const handleSearchButtonClickJoinedOrgs = (): void => {
    const inputValue =
      (document.getElementById('orgname-joined-orgs') as HTMLInputElement)
        ?.value || '';
    searchJoinedOrgs(inputValue);
  };

  function onHideRemoveUserModal(): void {
    setShowRemoveUserModal(false);
    if (removeUserProps.setShowOnCancel === 'JOINED') {
      setShowJoinedOrganizations(true);
    }
  }

  // If there is a super admin notion, adapt this logic to your API.
  const isSuperAdmin =
    (user as UserWithAppProfile)?.appUserProfile?.isSuperAdmin ?? false;

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
      </tr>
      <Modal
        show={showJoinedOrganizations}
        key={`modal-joined-org-${index}`}
        size="xl"
        data-testid={`modal-joined-org-${user.id}`}
        onHide={() => setShowJoinedOrganizations(false)}
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title className="text-white">
            {t('orgJoinedBy')} {user.name} ({memberOrgs.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {memberOrgs.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                id="orgname-joined-orgs"
                className={styles.inputField}
                defaultValue={searchByNameJoinedOrgs}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameJoinedOrgs"
                autoComplete="off"
                onKeyUp={handleSearchJoinedOrgs}
              />
              <Button
                tabIndex={-1}
                className={styles.searchButton}
                onClick={handleSearchButtonClickJoinedOrgs}
                data-testid="searchBtnJoinedOrgs"
              >
                <Search />
              </Button>
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
              <Table className={styles.modalTable} responsive>
                <thead>
                  <tr>
                    <th>{tCommon('name')}</th>
                    <th>{tCommon('address')}</th>
                    <th>{tCommon('createdOn')}</th>
                    <th>{tCommon('createdBy')}</th>
                    <th>{tCommon('usersRole')}</th>
                    <th>{tCommon('changeRole')}</th>
                    <th>{tCommon('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {joinedOrgs.map((org) => {
                    // Adjust organization/admin mapping as per your data model
                    let isAdmin = false;
                    const userWithProfile = user as UserWithAppProfile;
                    if (userWithProfile?.appUserProfile?.adminFor) {
                      userWithProfile.appUserProfile.adminFor.forEach(
                        (item) => {
                          if (item._id === org.id) {
                            isAdmin = true;
                          }
                        },
                      );
                    }
                    return (
                      <tr key={`org-joined-${org.id}`}>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => goToOrg(org.id)}
                          >
                            {org.avatarURL ? (
                              <img src={org.avatarURL} alt="orgImage" />
                            ) : (
                              <Avatar name={org.name} alt="orgImage" />
                            )}
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
                            {org.creator.avatarURL ? (
                              <img src={org.creator.avatarURL} alt="creator" />
                            ) : (
                              <Avatar name={org.creator.name} alt="creator" />
                            )}
                            {org.creator.name}
                          </Button>
                        </td>
                        <td>
                          {isSuperAdmin
                            ? 'SUPERADMIN'
                            : isAdmin
                              ? 'ADMIN'
                              : 'USER'}
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            onChange={changeRoleInOrg}
                            data-testid={`changeRoleInOrg${org.id}`}
                            disabled={isSuperAdmin}
                            defaultValue={
                              isSuperAdmin
                                ? `SUPERADMIN`
                                : isAdmin
                                  ? `ADMIN?${org.id}`
                                  : `USER?${org.id}`
                            }
                          >
                            {isSuperAdmin ? (
                              <>
                                <option value={`SUPERADMIN`}>SUPERADMIN</option>
                                <option value={`ADMIN?${org.id}`}>ADMIN</option>
                                <option value={`USER?${org.id}`}>USER</option>
                              </>
                            ) : isAdmin ? (
                              <>
                                <option value={`ADMIN?${org.id}`}>ADMIN</option>
                                <option value={`USER?${org.id}`}>USER</option>
                              </>
                            ) : (
                              <>
                                <option value={`USER?${org.id}`}>USER</option>
                                <option value={`ADMIN?${org.id}`}>ADMIN</option>
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
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowJoinedOrganizations(false)}
            data-testid={`closeJoinedOrgsBtn${user.id}`}
          >
            {tCommon('close')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRemoveUserModal}
        key={`modal-remove-org-${index}`}
        data-testid={`modal-remove-user-${user.id}`}
        onHide={() => onHideRemoveUserModal()}
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title className="text-white">
            {t('removeUserFrom', { org: removeUserProps.orgName })}
          </Modal.Title>
        </Modal.Header>
        <hr style={{ margin: 0 }} />
        <Modal.Body>
          <p>
            {t('removeConfirmation', {
              name: user.name,
              org: removeUserProps.orgName,
            })}
          </p>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTableItem;
