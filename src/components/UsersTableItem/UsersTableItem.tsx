import { useMutation } from '@apollo/client';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import styles from './UsersTableItem.module.css';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { Search } from '@mui/icons-material';

type Props = {
  user: InterfaceQueryUserListItem;
  index: number;
  userId: string;
  resetAndRefetch: () => void;
};

const UsersTableItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { user, index, userId, resetAndRefetch } = props;

  const [showJoinedOrganizations, setShowJoinedOrganizations] = useState(false);
  const [showBlockedOrganizations, setShowBlockedOrganizations] =
    useState(false);
  const [joinedOrgs, setJoinedOrgs] = useState(user.joinedOrganizations);
  const [orgsBlockedBy, setOrgsBlockedBy] = useState(
    user.organizationsBlockedBy
  );
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');
  const [searchByNameOrgsBlockedBy, setSearchByNameOrgsBlockedBy] =
    useState('');
  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const history = useHistory();

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

      /* istanbul ignore next */
      if (data) {
        toast.success(t('roleUpdated'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  function handleClick(_id: string): void {
    const url = '/orgdash/id=' + _id;

    // Dont change the below two lines
    window.location.replace(url);
    history.push(url);
  }
  function handleCreator(): void {
    toast.success('Profile Page Coming Soon !');
  }
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
  return (
    <>
      <tr key={user._id}>
        <th scope="row">{index + 1}</th>
        <td>{`${user.firstName} ${user.lastName}`}</td>
        <td>{user.email}</td>
        <td>
          <Form.Select
            name={`role${user._id}`}
            data-testid={`changeRole${user._id}`}
            onChange={changeRole}
            disabled={user._id === userId}
            defaultValue={`${user.userType}?${user._id}`}
          >
            <option value={`ADMIN?${user._id}`}>{t('admin')}</option>
            <option value={`SUPERADMIN?${user._id}`}>{t('superAdmin')}</option>
            <option value={`USER?${user._id}`}>{t('user')}</option>
          </Form.Select>
        </td>
        <td>
          <Button onClick={() => setShowJoinedOrganizations(true)}>
            {t('view')} ({user.joinedOrganizations.length})
          </Button>
        </td>

        <td>
          <Button
            variant="danger"
            onClick={() => setShowBlockedOrganizations(true)}
          >
            {t('view')} ({user.organizationsBlockedBy.length})
          </Button>
        </td>
      </tr>
      {/* Organizations joined modal */}
      <Modal
        show={showJoinedOrganizations}
        key={`modal-org-${index}`}
        size="xl"
        onHide={() => setShowJoinedOrganizations(false)}
      >
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-white">
            Organizations Joined by {`${user.firstName}`} {`${user.lastName}`} (
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
                placeholder={t('searchByNameJoinedOrgs')}
                data-testid="searchByNameJoinedOrgs"
                autoComplete="off"
                onChange={handleSearchJoinedOrgs}
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
                  {user.firstName} {user.lastName} has not joined any
                  organization yet
                </h4>
              </div>
            ) : joinedOrgs.length == 0 ? (
              <>
                <div className={styles.notJoined}>
                  <h4>
                    No results found for &quot;{searchByNameJoinedOrgs}&quot;
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
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {joinedOrgs.map((org) => (
                    <>
                      <tr>
                        <td>
                          <img
                            src={
                              org.image
                                ? org.image
                                : `https://api.dicebear.com/5.x/initials/svg?seed=${org.name}`
                            }
                            alt="orgImage"
                          />
                          {org.name}
                        </td>
                        <td>{org.location}</td>
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
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
                        <td>
                          {user.adminFor.length === 0
                            ? 'USER'
                            : user.adminFor.map((item) => {
                                if (item._id == org._id) {
                                  return 'ADMIN';
                                }
                              })}
                        </td>
                        <td>
                          <Form.Select size="sm">
                            {user.adminFor.length === 0 ? (
                              <>
                                <option value="1">USER</option>
                                <option value="2">ADMIN</option>
                              </>
                            ) : (
                              user.adminFor.map((item) => {
                                if (item._id == org._id) {
                                  return (
                                    <>
                                      <option value="2">ADMIN</option>
                                      <option value="1">USER</option>
                                    </>
                                  );
                                }
                              })
                            )}
                          </Form.Select>
                        </td>
                        <td colSpan={1.5}>
                          <Button
                            className={styles.button}
                            variant="danger"
                            size="sm"
                            onClick={() => handleClick(org._id)}
                          >
                            Remove User
                          </Button>
                        </td>
                        <td>
                          <Button
                            className={styles.button}
                            size="sm"
                            onClick={() => handleClick(org._id)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowJoinedOrganizations(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Organizations blocked by modal */}
      <Modal
        show={showBlockedOrganizations}
        key={`modal-org-${index}`}
        size="xl"
        onHide={() => setShowBlockedOrganizations(false)}
      >
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-white">
            Organizations that Blocked {`${user.firstName}`}{' '}
            {`${user.lastName}`} ({user.organizationsBlockedBy.length})
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
                placeholder={t('searchByNameOrgsBlockedBy')}
                data-testid="searchByNameOrgsBlockedBy"
                autoComplete="off"
                onChange={handleSearcgByOrgsBlockedBy}
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
                  {user.firstName} {user.lastName} is not blocked by any
                  organization
                </h4>
              </div>
            ) : orgsBlockedBy.length == 0 ? (
              <>
                <div className={styles.notJoined}>
                  <h4>
                    No results found for &quot;{searchByNameOrgsBlockedBy}&quot;
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
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {orgsBlockedBy.map((org) => (
                    <>
                      <tr>
                        <td>
                          <img
                            src={
                              org.image
                                ? org.image
                                : `https://api.dicebear.com/5.x/initials/svg?seed=${org.name}`
                            }
                            alt="orgImage"
                          />
                          {org.name}
                        </td>
                        <td>{org.location}</td>
                        <td>{dayjs(org.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleCreator()}
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
                        <td>
                          {user.adminFor.length === 0
                            ? 'USER'
                            : user.adminFor.map((item) => {
                                if (item._id == org._id) {
                                  return 'ADMIN';
                                }
                              })}
                        </td>
                        <td>
                          <Form.Select size="sm">
                            {user.adminFor.length === 0 ? (
                              <>
                                <option value="1">USER</option>
                                <option value="2">ADMIN</option>
                              </>
                            ) : (
                              user.adminFor.map((item) => {
                                if (item._id == org._id) {
                                  return (
                                    <>
                                      <option value="2">ADMIN</option>
                                      <option value="1">USER</option>
                                    </>
                                  );
                                }
                              })
                            )}
                          </Form.Select>
                        </td>
                        <td colSpan={1.5}>
                          <Button
                            className={styles.button}
                            variant="danger"
                            size="sm"
                            onClick={() => handleClick(org._id)}
                          >
                            Remove User
                          </Button>
                        </td>
                        <td>
                          <Button
                            className={styles.button}
                            size="sm"
                            onClick={() => handleClick(org._id)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBlockedOrganizations(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTableItem;
