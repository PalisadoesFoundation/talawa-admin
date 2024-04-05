import { useMutation } from '@apollo/client';
import { Search } from '@mui/icons-material';
import {
  REMOVE_MEMBER_MUTATION,
<<<<<<< HEAD
=======
  UPDATE_USERTYPE_MUTATION,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { useHistory } from 'react-router-dom';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from './UsersTableItem.module.css';
<<<<<<< HEAD
import Avatar from 'components/Avatar/Avatar';
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

type Props = {
  user: InterfaceQueryUserListItem;
  index: number;
  loggedInUserId: string;
  resetAndRefetch: () => void;
};

const UsersTableItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
<<<<<<< HEAD
  const { user, index, resetAndRefetch } = props;
=======
  const { user, index, loggedInUserId, resetAndRefetch } = props;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
<<<<<<< HEAD
  const [joinedOrgs, setJoinedOrgs] = useState(user.user.joinedOrganizations);
  const [orgsBlockedBy, setOrgsBlockedBy] = useState(
    user.user.organizationsBlockedBy,
=======
  const [joinedOrgs, setJoinedOrgs] = useState(user.joinedOrganizations);
  const [orgsBlockedBy, setOrgsBlockedBy] = useState(
    user.organizationsBlockedBy
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');
  const [searchByNameOrgsBlockedBy, setSearchByNameOrgsBlockedBy] =
    useState('');
<<<<<<< HEAD
  const [removeUser] = useMutation(REMOVE_MEMBER_MUTATION);
  const [updateUserInOrgType] = useMutation(UPDATE_USER_ROLE_IN_ORG_MUTATION);
  const navigate = useNavigate();
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const confirmRemoveUser = async (): Promise<void> => {
    try {
      const { data } = await removeUser({
        variables: {
<<<<<<< HEAD
          userid: user.user._id,
=======
          userid: user._id,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
          userId: user.user._id,
=======
          userId: user._id,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    const url = '/orgdash/' + _id;

    // Dont change the below two lines
    window.location.replace(url);
    navigate(url);
=======
    const url = '/orgdash/id=' + _id;

    // Dont change the below two lines
    window.location.replace(url);
    history.push(url);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  }
  function handleCreator(): void {
    toast.success('Profile Page Coming Soon !');
  }
<<<<<<< HEAD
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
  const handleSearchJoinedOrgs = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      searchJoinedOrgs(value);
    }
  };
  const handleSearcgByOrgsBlockedBy = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
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
=======
  function handleSearchJoinedOrgs(e: any): void {
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
  function handleSearcgByOrgsBlockedBy(e: any): void {
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  /* istanbul ignore next */
  function onHideRemoveUserModal(): void {
    setShowRemoveUserModal(false);
    if (removeUserProps.setShowOnCancel == 'JOINED') {
      setShowJoinedOrganizations(true);
    } else if (removeUserProps.setShowOnCancel == 'BLOCKED') {
      setShowBlockedOrganizations(true);
    }
  }
<<<<<<< HEAD

  const isSuperAdmin = user.appUserProfile.isSuperAdmin;

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  return (
    <>
      {/* Table Item */}
      <tr>
        <th scope="row">{index + 1}</th>
<<<<<<< HEAD
        <td>{`${user.user.firstName} ${user.user.lastName}`}</td>
        <td>{user.user.email}</td>
        <td>
          <Button
            onClick={() => setShowJoinedOrganizations(true)}
            data-testid={`showJoinedOrgsBtn${user.user._id}`}
          >
            {t('view')} ({user.user.joinedOrganizations.length})
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          </Button>
        </td>

        <td>
          <Button
            variant="danger"
<<<<<<< HEAD
            data-testid={`showBlockedByOrgsBtn${user.user._id}`}
            onClick={() => setShowBlockedOrganizations(true)}
          >
            {t('view')} ({user.user.organizationsBlockedBy.length})
=======
            data-testid={`showBlockedByOrgsBtn${user._id}`}
            onClick={() => setShowBlockedOrganizations(true)}
          >
            {t('view')} ({user.organizationsBlockedBy.length})
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          </Button>
        </td>
      </tr>
      {/* Organizations joined modal */}
      <Modal
        show={showJoinedOrganizations}
        key={`modal-joined-org-${index}`}
        size="xl"
<<<<<<< HEAD
        data-testid={`modal-joined-org-${user.user._id}`}
=======
        data-testid={`modal-joined-org-${user._id}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        onHide={() => setShowJoinedOrganizations(false)}
      >
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-white">
<<<<<<< HEAD
            {t('orgJoinedBy')} {`${user.user.firstName}`}{' '}
            {`${user.user.lastName}`} ({user.user.joinedOrganizations.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.user.joinedOrganizations.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                type="name"
                id="orgname-joined-orgs"
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                className="bg-white"
                defaultValue={searchByNameJoinedOrgs}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameJoinedOrgs"
                autoComplete="off"
<<<<<<< HEAD
                onKeyUp={handleSearchJoinedOrgs}
=======
                onChange={handleSearchJoinedOrgs}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
<<<<<<< HEAD
                onClick={handleSearchButtonClickJoinedOrgs}
                data-testid="searchBtnJoinedOrgs"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
<<<<<<< HEAD
            {user.user.joinedOrganizations.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.user.firstName} {user.user.lastName}{' '}
                  {t('hasNotJoinedAnyOrg')}
=======
            {user.joinedOrganizations.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.firstName} {user.lastName} {t('hasNotJoinedAnyOrg')}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                    <th>Address</th>
=======
                    <th>Location</th>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                    user.appUserProfile.adminFor.map((item) => {
=======
                    user.adminFor.map((item) => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                            {org.image ? (
                              <img src={org.image} alt="orgImage" />
                            ) : (
                              <Avatar name={org.name} alt="orgImage" />
                            )}
                            {org.name}
                          </Button>
                        </td>
                        {org.address && <td>{org.address.city}</td>}
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
                            data-testid={`creator${org._id}`}
                          >
<<<<<<< HEAD
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
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                        <td>
                          <Form.Select
                            size="sm"
                            onChange={changeRoleInOrg}
                            data-testid={`changeRoleInOrg${org._id}`}
<<<<<<< HEAD
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
=======
                          >
                            {isAdmin ? (
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            data-testid={`closeJoinedOrgsBtn${user.user._id}`}
=======
            data-testid={`closeJoinedOrgsBtn${user._id}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
                type="name"
                id="orgname-blocked-by"
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                className="bg-white"
                defaultValue={searchByNameOrgsBlockedBy}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameOrgsBlockedBy"
                autoComplete="off"
<<<<<<< HEAD
                onKeyUp={handleSearcgByOrgsBlockedBy}
=======
                onChange={handleSearcgByOrgsBlockedBy}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              />
              <Button
                tabIndex={-1}
                variant="danger"
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
<<<<<<< HEAD
                onClick={handleSearchButtonClickOrgsBlockedBy}
                data-testid="searchBtnOrgsBlockedBy"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
<<<<<<< HEAD
            {user.user.organizationsBlockedBy.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.user.firstName} {user.user.lastName}{' '}
                  {t('isNotBlockedByAnyOrg')}
=======
            {user.organizationsBlockedBy.length == 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.firstName} {user.lastName} {t('isNotBlockedByAnyOrg')}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                    <th>Address</th>
=======
                    <th>Location</th>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                    user.appUserProfile.adminFor.map((item) => {
=======
                    user.adminFor.map((item) => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                            {org.image ? (
                              <img src={org.image} alt="orgImage" />
                            ) : (
                              <Avatar name={org.name} alt="orgImage" />
                            )}
                            {org.name}
                          </Button>
                        </td>
                        {org.address && <td>{org.address.city}</td>}
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
                            data-testid={`creator${org._id}`}
                          >
<<<<<<< HEAD
                            {org.creator.image ? (
                              <img src={org.creator.image} alt="creator" />
                            ) : (
                              <Avatar
                                name={`${org.creator.firstName} ${org.creator.lastName}`}
                                alt="creator"
                              />
                            )}
=======
                            <img
                              src={
                                org.creator.image
                                  ? org.creator.image
                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${org.creator.firstName} ${org.creator.lastName}`
                              }
                              alt="creator"
                            />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                            {org.creator.firstName} {org.creator.lastName}
                          </Button>
                        </td>
                        <td>{isAdmin ? 'ADMIN' : 'USER'}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            onChange={changeRoleInOrg}
                            data-testid={`changeRoleInOrg${org._id}`}
<<<<<<< HEAD
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
=======
                          >
                            {isAdmin ? (
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            data-testid={`closeBlockedByOrgsBtn${user.user._id}`}
=======
            data-testid={`closeBlockedByOrgsBtn${user._id}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Remove user from Organization modal */}
      <Modal
        show={showRemoveUserModal}
        key={`modal-remove-org-${index}`}
<<<<<<< HEAD
        data-testid={`modal-remove-user-${user.user._id}`}
=======
        data-testid={`modal-remove-user-${user._id}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
              &ldquo;{user.user.firstName} {user.user.lastName}&rdquo;
=======
              &ldquo;{user.firstName} {user.lastName}&rdquo;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            data-testid={`closeRemoveUserModal${user.user._id}`}
=======
            data-testid={`closeRemoveUserModal${user._id}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => confirmRemoveUser()}
<<<<<<< HEAD
            data-testid={`confirmRemoveUser${user.user._id}`}
=======
            data-testid={`confirmRemoveUser${user._id}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTableItem;
