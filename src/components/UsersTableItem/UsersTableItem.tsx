import { useMutation } from '@apollo/client';
import { Search } from '@mui/icons-material';
import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import Avatar from 'components/Avatar/Avatar';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from './UsersTableItem.module.css';
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
  const [showBlockedOrganizations, setShowBlockedOrganizations] =
    useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [removeUserProps, setremoveUserProps] = useState<{
    orgName: string;
    orgId: string;
    setShowOnCancel: 'JOINED' | 'BLOCKED' | '';
  }>({
    orgName: '',
    orgId: '',
    setShowOnCancel: '',
  });
  const [joinedOrgs, setJoinedOrgs] = useState(user.user.joinedOrganizations);
  const [orgsBlockedBy, setOrgsBlockedBy] = useState(
    user.user.organizationsBlockedBy,
  );
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');
  const [searchByNameOrgsBlockedBy, setSearchByNameOrgsBlockedBy] =
    useState('');
  const [removeUser] = useMutation(REMOVE_MEMBER_MUTATION);
  const [updateUserInOrgType] = useMutation(UPDATE_USER_ROLE_IN_ORG_MUTATION);
  const navigate = useNavigate();
  const confirmRemoveUser = async (): Promise<void> => {
    try {
      const { data } = await removeUser({
        variables: {
          userid: user.user._id,
          orgid: removeUserProps.orgId,
        },
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
          userId: user.user._id,
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
    if (value == '') {
      setJoinedOrgs(user.user.joinedOrganizations);
    } else {
      const filteredOrgs = user.user.joinedOrganizations.filter((org) =>
        org.name.toLowerCase().includes(value.toLowerCase()),
      );
      setJoinedOrgs(filteredOrgs);
    }
  };
  const searchOrgsBlockedBy = (value: string): void => {
    setSearchByNameOrgsBlockedBy(value);
    if (value == '') {
      setOrgsBlockedBy(user.user.organizationsBlockedBy);
    } else {
      const filteredOrgs = user.user.organizationsBlockedBy.filter((org) =>
        org.name.toLowerCase().includes(value.toLowerCase()),
      );
      setOrgsBlockedBy(filteredOrgs);
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
  const handleSearchByOrgsBlockedBy = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
      searchOrgsBlockedBy(value);
    }
  };
  const handleSearchButtonClickJoinedOrgs = (): void => {
    const inputValue =
      (document.getElementById('orgname-joined-orgs') as HTMLInputElement)
        ?.value || '';
    searchJoinedOrgs(inputValue);
  };
  const handleSearchButtonClickOrgsBlockedBy = (): void => {
    const inputValue =
      (document.getElementById('orgname-blocked-by') as HTMLInputElement)
        ?.value || '';
    searchOrgsBlockedBy(inputValue);
  };
  function onHideRemoveUserModal(): void {
    setShowRemoveUserModal(false);
    if (removeUserProps.setShowOnCancel == 'JOINED') {
      setShowJoinedOrganizations(true);
    } else if (removeUserProps.setShowOnCancel == 'BLOCKED') {
      setShowBlockedOrganizations(true);
    }
  }
  const isSuperAdmin = user.appUserProfile.isSuperAdmin;
  return (
    <>
      <tr>
        <th scope="row">{index + 1}</th>
        <td>{`${user.user.firstName} ${user.user.lastName}`}</td>
        <td>{user.user.email}</td>
        <td>
          <Button
            className="btn btn-success"
            onClick={() => setShowJoinedOrganizations(true)}
            data-testid={`showJoinedOrgsBtn${user.user._id}`}
          >
            {t('view')} ({user.user.joinedOrganizations.length})
          </Button>
        </td>
        <td>
          <Button
            variant="danger"
            data-testid={`showBlockedByOrgsBtn${user.user._id}`}
            onClick={() => setShowBlockedOrganizations(true)}
          >
            {t('view')} ({user.user.organizationsBlockedBy.length})
          </Button>
        </td>
      </tr>
      <Modal
        show={showJoinedOrganizations}
        key={`modal-joined-org-${index}`}
        size="xl"
        data-testid={`modal-joined-org-${user.user._id}`}
        onHide={() => setShowJoinedOrganizations(false)}
      >
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-white">
            {t('orgJoinedBy')} {`${user.user.firstName}`}{' '}
            {`${user.user.lastName}`} ({user.user.joinedOrganizations.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.user.joinedOrganizations.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                id="orgname-joined-orgs"
                className="bg-white"
                defaultValue={searchByNameJoinedOrgs}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameJoinedOrgs"
                autoComplete="off"
                onKeyUp={handleSearchJoinedOrgs}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                onClick={handleSearchButtonClickJoinedOrgs}
                data-testid="searchBtnJoinedOrgs"
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
            {user.user.joinedOrganizations.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.user.firstName} {user.user.lastName}{' '}
                  {t('hasNotJoinedAnyOrg')}
                </h4>
              </div>
            ) : joinedOrgs.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {tCommon('noResultsFoundFor')} &quot;
                  {searchByNameJoinedOrgs}
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
                    let isAdmin = false;
                    user.appUserProfile.adminFor.map((item) => {
                      if (item._id == org._id) {
                        isAdmin = true;
                      }
                    });
                    return (
                      <tr key={`org-joined-${org._id}`}>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => goToOrg(org._id)}
                          >
                            {org.image ? (
                              <img src={org.image} alt="orgImage" />
                            ) : (
                              <Avatar name={org.name} alt="orgImage" />
                            )}
                            {org.name}
                          </Button>
                        </td>
                        {org.address && <td>{org.address.city}</td>}
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
                            data-testid={`creator${org._id}`}
                          >
                            {org.creator.image ? (
                              <img src={org.creator.image} alt="creator" />
                            ) : (
                              <Avatar
                                name={`${org.creator.firstName} ${org.creator.lastName}`}
                                alt="creator"
                              />
                            )}
                            {org.creator.firstName} {org.creator.lastName}
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
                            data-testid={`changeRoleInOrg${org._id}`}
                            disabled={isSuperAdmin}
                            defaultValue={
                              isSuperAdmin
                                ? `SUPERADMIN`
                                : isAdmin
                                  ? `ADMIN?${org._id}`
                                  : `USER?${org._id}`
                            }
                          >
                            {isSuperAdmin ? (
                              <>
                                <option value={`SUPERADMIN`}>SUPERADMIN</option>
                                <option value={`ADMIN?${org._id}`}>
                                  ADMIN
                                </option>
                                <option value={`USER?${org._id}`}>USER</option>
                              </>
                            ) : isAdmin ? (
                              <>
                                <option value={`ADMIN?${org._id}`}>
                                  ADMIN
                                </option>
                                <option value={`USER?${org._id}`}>USER</option>
                              </>
                            ) : (
                              <>
                                <option value={`USER?${org._id}`}>USER</option>
                                <option value={`ADMIN?${org._id}`}>
                                  ADMIN
                                </option>
                              </>
                            )}
                          </Form.Select>
                        </td>
                        <td colSpan={1.5}>
                          <Button
                            className={styles.button}
                            variant="danger"
                            size="sm"
                            data-testid={`removeUserFromOrgBtn${org._id}`}
                            onClick={() => {
                              setremoveUserProps({
                                orgId: org._id,
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
            data-testid={`closeJoinedOrgsBtn${user.user._id}`}
          >
            {tCommon('close')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showBlockedOrganizations}
        key={`modal-blocked-org-${index}`}
        size="xl"
        onHide={() => setShowBlockedOrganizations(false)}
        data-testid={`modal-blocked-org-${user.user._id}`}
      >
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-white">
            {t('orgThatBlocked')} {`${user.user.firstName}`}{' '}
            {`${user.user.lastName}`} ({user.user.organizationsBlockedBy.length}
            )
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.user.organizationsBlockedBy.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                id="orgname-blocked-by"
                className="bg-white"
                defaultValue={searchByNameOrgsBlockedBy}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameOrgsBlockedBy"
                autoComplete="off"
                onKeyUp={handleSearchByOrgsBlockedBy}
              />
              <Button
                tabIndex={-1}
                variant="danger"
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                onClick={handleSearchButtonClickOrgsBlockedBy}
                data-testid="searchBtnOrgsBlockedBy"
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
            {user.user.organizationsBlockedBy.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.user.firstName} {user.user.lastName}{' '}
                  {t('isNotBlockedByAnyOrg')}
                </h4>
              </div>
            ) : orgsBlockedBy.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>{`${tCommon('noResultsFoundFor')} "${searchByNameOrgsBlockedBy}"`}</h4>
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
                  {orgsBlockedBy.map((org) => {
                    let isAdmin = false;
                    user.appUserProfile.adminFor.map((item) => {
                      if (item._id == org._id) {
                        isAdmin = true;
                      }
                    });
                    return (
                      <tr key={`org-blocked-${org._id}`}>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => goToOrg(org._id)}
                          >
                            {org.image ? (
                              <img src={org.image} alt="orgImage" />
                            ) : (
                              <Avatar name={org.name} alt="orgImage" />
                            )}
                            {org.name}
                          </Button>
                        </td>
                        {org.address && <td>{org.address.city}</td>}
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
                            data-testid={`creator${org._id}`}
                          >
                            {org.creator.image ? (
                              <img src={org.creator.image} alt="creator" />
                            ) : (
                              <Avatar
                                name={`${org.creator.firstName} ${org.creator.lastName}`}
                                alt="creator"
                              />
                            )}
                            {org.creator.firstName} {org.creator.lastName}
                          </Button>
                        </td>
                        <td>{isAdmin ? 'ADMIN' : 'USER'}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            onChange={changeRoleInOrg}
                            data-testid={`changeRoleInOrg${org._id}`}
                            disabled={isSuperAdmin}
                            defaultValue={
                              isSuperAdmin
                                ? `SUPERADMIN`
                                : isAdmin
                                  ? `ADMIN?${org._id}`
                                  : `USER?${org._id}`
                            }
                          >
                            {isSuperAdmin ? (
                              <>
                                <option value={`SUPERADMIN`}>SUPERADMIN</option>
                                <option value={`ADMIN?${org._id}`}>
                                  ADMIN
                                </option>
                                <option value={`USER?${org._id}`}>USER</option>
                              </>
                            ) : isAdmin ? (
                              <>
                                <option value={`ADMIN?${org._id}`}>
                                  ADMIN
                                </option>
                                <option value={`USER?${org._id}`}>USER</option>
                              </>
                            ) : (
                              <>
                                <option value={`USER?${org._id}`}>USER</option>
                                <option value={`ADMIN?${org._id}`}>
                                  ADMIN
                                </option>
                              </>
                            )}
                          </Form.Select>
                        </td>
                        <td colSpan={1.5}>
                          <Button
                            className={styles.button}
                            variant="danger"
                            size="sm"
                            data-testid={`removeUserFromOrgBtn${org._id}`}
                            onClick={() => {
                              setremoveUserProps({
                                orgId: org._id,
                                orgName: org.name,
                                setShowOnCancel: 'JOINED',
                              });
                              setShowBlockedOrganizations(false);
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
            onClick={() => setShowBlockedOrganizations(false)}
            data-testid={`closeBlockedByOrgsBtn${user.user._id}`}
          >
            {tCommon('close')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRemoveUserModal}
        key={`modal-remove-org-${index}`}
        data-testid={`modal-remove-user-${user.user._id}`}
        onHide={() => onHideRemoveUserModal()}
      >
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-white">
            {t('removeUserFrom', { org: removeUserProps.orgName })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t('removeConfirmation', {
              name: `${user.user.firstName} ${user.user.lastName}`,
              org: removeUserProps.orgName,
            })}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => onHideRemoveUserModal()}
            data-testid={`closeRemoveUserModal${user.user._id}`}
          >
            {tCommon('close')}
          </Button>
          <Button
            variant="danger"
            onClick={() => confirmRemoveUser()}
            data-testid={`confirmRemoveUser${user.user._id}`}
          >
            {tCommon('remove')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UsersTableItem;
