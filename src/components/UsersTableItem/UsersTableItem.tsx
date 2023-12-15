import { useMutation } from '@apollo/client';
import { Search } from '@mui/icons-material';
import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USERTYPE_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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
  const { user, index, loggedInUserId, resetAndRefetch } = props;

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
  const [joinedOrgs, setJoinedOrgs] = useState(user.joinedOrganizations);
  const [orgsBlockedBy, setOrgsBlockedBy] = useState(
    user.organizationsBlockedBy
  );
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');
  const [searchByNameOrgsBlockedBy, setSearchByNameOrgsBlockedBy] =
    useState('');
  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const [removeUser] = useMutation(REMOVE_MEMBER_MUTATION);
  const [updateUserInOrgType] = useMutation(UPDATE_USER_ROLE_IN_ORG_MUTATION);
  const history = useHistory();

  /* istanbul ignore next */
  const changeRole = async (e: any): Promise<void> => {
    const { value } = e.target;

    const inputData = value.split('?');

    try {
      const { data } = await updateUserType({
        variables: {
          id: inputData[1],
          userType: inputData[0],
        },
      });
      if (data) {
        toast.success(t('roleUpdated'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const confirmRemoveUser = async (): Promise<void> => {
    try {
      const { data } = await removeUser({
        variables: {
          userid: user._id,
          orgid: removeUserProps.orgId,
        },
      });

      if (data) {
        toast.success('Removed User from Organization successfully');
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const changeRoleInOrg = async (e: any): Promise<void> => {
    const { value } = e.target;

    const inputData = value.split('?');

    try {
      const { data } = await updateUserInOrgType({
        variables: {
          userId: user._id,
          role: inputData[0],
          organizationId: inputData[1],
        },
      });
      if (data) {
        toast.success(t('roleUpdated'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  function goToOrg(_id: string): void {
    const url = '/orgdash/id=' + _id;

    // Dont change the below two lines
    window.location.replace(url);
    history.push(url);
  }
  function handleCreator(): void {
    toast.success('Profile Page Coming Soon !');
  }
  function handleSearchJoinedOrgs(e: any): void {
    if (e.key === 'Enter') {
      const { value } = e.target;
      setSearchByNameJoinedOrgs(value);
      if (value == '') {
        setJoinedOrgs(user.joinedOrganizations);
      } else {
        const filteredOrgs = user.joinedOrganizations.filter((org) =>
          org.name.toLowerCase().includes(value.toLowerCase())
        );
        setJoinedOrgs(filteredOrgs);
      }
    }
  }
  function handleSearcgByOrgsBlockedBy(e: any): void {
    if (e.key === 'Enter') {
      const { value } = e.target;
      setSearchByNameOrgsBlockedBy(value);
      if (value == '') {
        setOrgsBlockedBy(user.organizationsBlockedBy);
      } else {
        const filteredOrgs = user.organizationsBlockedBy.filter((org) =>
          org.name.toLowerCase().includes(value.toLowerCase())
        );
        setOrgsBlockedBy(filteredOrgs);
      }
    }
  }

  /* istanbul ignore next */
  function onHideRemoveUserModal(): void {
    setShowRemoveUserModal(false);
    if (removeUserProps.setShowOnCancel == 'JOINED') {
      setShowJoinedOrganizations(true);
    } else if (removeUserProps.setShowOnCancel == 'BLOCKED') {
      setShowBlockedOrganizations(true);
    }
  }
  return (
    <>
      {/* Table Item */}
      <tr>
        <th scope="row">{index + 1}</th>
        <td>{`${user.firstName} ${user.lastName}`}</td>
        <td>{user.email}</td>
        <td>
          <Form.Select
            name={`role${user._id}`}
            data-testid={`changeRole${user._id}`}
            onChange={changeRole}
            disabled={user._id === loggedInUserId}
            defaultValue={`${user.userType}?${user._id}`}
          >
            <option value={`ADMIN?${user._id}`}>{t('admin')}</option>
            <option value={`SUPERADMIN?${user._id}`}>{t('superAdmin')}</option>
            <option value={`USER?${user._id}`}>{t('user')}</option>
          </Form.Select>
        </td>
        <td>
          <Button
            onClick={() => setShowJoinedOrganizations(true)}
            data-testid={`showJoinedOrgsBtn${user._id}`}
          >
            {t('view')} ({user.joinedOrganizations.length})
          </Button>
        </td>

        <td>
          <Button
            variant="danger"
            data-testid={`showBlockedByOrgsBtn${user._id}`}
            onClick={() => setShowBlockedOrganizations(true)}
          >
            {t('view')} ({user.organizationsBlockedBy.length})
          </Button>
        </td>
      </tr>
      {/* Organizations joined modal */}
      <Modal
        show={showJoinedOrganizations}
        key={`modal-joined-org-${index}`}
        size="xl"
        data-testid={`modal-joined-org-${user._id}`}
        onHide={() => setShowJoinedOrganizations(false)}
      >
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-white">
            {t('orgJoinedBy')} {`${user.firstName}`} {`${user.lastName}`} (
            {user.joinedOrganizations.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.joinedOrganizations.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                type="name"
                id="orgname"
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
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
            {user.joinedOrganizations.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.firstName} {user.lastName} {t('hasNotJoinedAnyOrg')}
                </h4>
              </div>
            ) : joinedOrgs.length == 0 ? (
              <>
                <div className={styles.notJoined}>
                  <h4>
                    {t('noResultsFoundFor')} &quot;{searchByNameJoinedOrgs}
                    &quot;
                  </h4>
                </div>
              </>
            ) : (
              <Table className={styles.modalTable} responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Created on</th>
                    <th>Created By</th>
                    <th>Users Role</th>
                    <th>Change Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {joinedOrgs.map((org) => {
                    // Check user is admin for this organization or not
                    let isAdmin = false;
                    user.adminFor.map((item) => {
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
                            <img
                              src={
                                org.image
                                  ? org.image
                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${org.name}`
                              }
                              alt="orgImage"
                            />
                            {org.name}
                          </Button>
                        </td>
                        <td>{org.location}</td>
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
                            data-testid={`creator${org._id}`}
                          >
                            <img
                              src={
                                org.creator.image
                                  ? org.creator.image
                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${org.creator.firstName} ${org.creator.lastName}`
                              }
                              alt="creator"
                            />
                            {org.creator.firstName} {org.creator.lastName}
                          </Button>
                        </td>
                        <td>{isAdmin ? 'ADMIN' : 'USER'}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            onChange={changeRoleInOrg}
                            data-testid={`changeRoleInOrg${org._id}`}
                          >
                            {isAdmin ? (
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
                            Remove User
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
            data-testid={`closeJoinedOrgsBtn${user._id}`}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Organizations blocked by modal */}
      <Modal
        show={showBlockedOrganizations}
        key={`modal-blocked-org-${index}`}
        size="xl"
        onHide={() => setShowBlockedOrganizations(false)}
        data-testid={`modal-blocked-org-${user._id}`}
      >
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-white">
            {t('orgThatBlocked')} {`${user.firstName}`} {`${user.lastName}`} (
            {user.organizationsBlockedBy.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.organizationsBlockedBy.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                type="name"
                id="orgname"
                className="bg-white"
                defaultValue={searchByNameOrgsBlockedBy}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameOrgsBlockedBy"
                autoComplete="off"
                onKeyUp={handleSearcgByOrgsBlockedBy}
              />
              <Button
                tabIndex={-1}
                variant="danger"
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
            {user.organizationsBlockedBy.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.firstName} {user.lastName} {t('isNotBlockedByAnyOrg')}
                </h4>
              </div>
            ) : orgsBlockedBy.length == 0 ? (
              <>
                <div className={styles.notJoined}>
                  <h4>
                    {t('noResultsFoundFor')} &quot;{searchByNameOrgsBlockedBy}
                    &quot;
                  </h4>
                </div>
              </>
            ) : (
              <Table className={styles.modalTable} responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Created on</th>
                    <th>Created By</th>
                    <th>Users Role</th>
                    <th>Change Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orgsBlockedBy.map((org) => {
                    // Check user is admin for this organization or not
                    let isAdmin = false;
                    user.adminFor.map((item) => {
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
                            <img
                              src={
                                org.image
                                  ? org.image
                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${org.name}`
                              }
                              alt="orgImage"
                            />
                            {org.name}
                          </Button>
                        </td>
                        <td>{org.location}</td>
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
                            data-testid={`creator${org._id}`}
                          >
                            <img
                              src={
                                org.creator.image
                                  ? org.creator.image
                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${org.creator.firstName} ${org.creator.lastName}`
                              }
                              alt="creator"
                            />
                            {org.creator.firstName} {org.creator.lastName}
                          </Button>
                        </td>
                        <td>{isAdmin ? 'ADMIN' : 'USER'}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            onChange={changeRoleInOrg}
                            data-testid={`changeRoleInOrg${org._id}`}
                          >
                            {isAdmin ? (
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
                            Remove User
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
            data-testid={`closeBlockedByOrgsBtn${user._id}`}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Remove user from Organization modal */}
      <Modal
        show={showRemoveUserModal}
        key={`modal-remove-org-${index}`}
        data-testid={`modal-remove-user-${user._id}`}
        onHide={() => onHideRemoveUserModal()}
      >
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-white">
            Remove User from {removeUserProps.orgName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to remove{' '}
            <strong>
              &ldquo;{user.firstName} {user.lastName}&rdquo;
            </strong>{' '}
            from organization{' '}
            <strong>
              &ldquo;
              {removeUserProps.orgName}&rdquo;
            </strong>{' '}
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => onHideRemoveUserModal()}
            data-testid={`closeRemoveUserModal${user._id}`}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => confirmRemoveUser()}
            data-testid={`confirmRemoveUser${user._id}`}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTableItem;
