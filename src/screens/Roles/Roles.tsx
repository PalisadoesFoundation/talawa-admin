import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import styles from './Roles.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import {
  UPDATE_USERTYPE_MUTATION,
  ADD_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import PaginationList from 'components/PaginationList/PaginationList';
import NotFound from 'components/NotFound/NotFound';
import { errorHandler } from 'utils/errorHandler';

interface User {
  __typename: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Organization {
  __typename: string;
  _id: string;
  name: string;
  admins: User[];
  members: User[];
}

interface Data {
  adminApproved: boolean;
  createdAt: string;
  email: string;
  firstName: string;
  image: string;
  joinedOrganizations: Organization[];
  lastName: string;
  organizationsBlockedBy: any[];
  userType: string;
  __typename: string;
  _id: string;
}

const Roles = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'roles' });

  document.title = t('title');

  const [componentLoader, setComponentLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchByName, setSearchByName] = useState('');
  const [count, setCount] = useState(0);
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');

  const userType = localStorage.getItem('UserType');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (userType != 'SUPERADMIN') {
      window.location.assign('/orglist');
    }
    setComponentLoader(false);
  }, []);

  useEffect(() => {
    if (searchByName !== '') {
      refetch({
        firstName_contains: searchByName,
      });
    } else {
      if (count !== 0) {
        refetch({
          firstName_contains: searchByName,
        });
      }
    }
  }, [count, searchByName]);

  const { loading: users_loading, error, data, refetch } = useQuery(USER_LIST);

  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const [createAdmin] = useMutation(ADD_ADMIN_MUTATION);

  const { data: dataOrgs } = useQuery(ORGANIZATION_CONNECTION_LIST);

  useEffect(() => {
    if (!dataOrgs) {
      return;
    }

    console.log(data);
    if (dataOrgs.organizationsConnection.length === 0) {
      toast.warning(t('noOrgError'));
    }
  }, [dataOrgs]);

  if (componentLoader || users_loading) {
    return <div className="loader"></div>;
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    /* istanbul ignore next */
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const changeRole = async (e: any) => {
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
        refetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleRole = async () => {
    console.log(role, role.split('?'), organization);
    try {
      const { data } = await createAdmin({
        variables: {
          orgid: organization,
          userid: role.split('?')[1],
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('roleUpdated'));
        refetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleSearchByName = (e: any) => {
    const { value } = e.target;
    setSearchByName(value);
    setCount((prev) => prev + 1);
  };

  return (
    <div data-testid="roles-header">
      <ListNavbar />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>{t('searchByName')}</h6>
              <input
                type="name"
                id="orgname"
                placeholder={t('enterName')}
                data-testid="searchByName"
                autoComplete="off"
                required
                onChange={handleSearchByName}
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('usersList')}</p>
            </Row>

            <div className={styles.list_box}>
              <div className="table-responsive">
                <table className={`table table-hover ${styles.userListTable}`}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">{t('name')}</th>
                      <th scope="col">{t('email')}</th>
                      <th scope="col">{t('roles_userType')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && !error?.graphQLErrors ? (
                      (rowsPerPage > 0
                        ? data.users.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.users
                      ).map(
                        (
                          user: {
                            _id: string;
                            firstName: string;
                            lastName: string;
                            email: string;
                            userType: string;
                            joinedOrganizations: {
                              admins: {
                                __typename: string;
                                _id: string;
                                firstName: string;
                                lastName: string;
                                email: string;
                              }[];
                              members: {
                                __typename: string;
                                _id: string;
                                firstName: string;
                                lastName: string;
                                email: string;
                              }[];
                              name: string;
                              __typename: string;
                              _id: string;
                            }[];
                          },
                          index: number
                        ) => {
                          console.log(user);
                          return (
                            <tr key={user._id}>
                              <th scope="row">{page * 10 + (index + 1)}</th>
                              <td>{`${user.firstName} ${user.lastName}`}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.userType === 'SUPERADMIN' && (
                                  <p className={styles.userRole_container}>
                                    SUPERADMIN
                                  </p>
                                )}
                                {user?.joinedOrganizations?.length > 0 &&
                                user.userType !== 'SUPERADMIN'
                                  ? user.joinedOrganizations
                                      .filter((org) =>
                                        org.admins.some(
                                          (admin) => admin._id === user._id
                                        )
                                      )
                                      .map((org: Organization) => {
                                        console.log('org', org);
                                        return (
                                          <p
                                            key={org._id}
                                            className={
                                              styles.userRole_container
                                            }
                                          >
                                            {org.admins.length > 0 ? (
                                              <p>{org.name} - ADMIN</p>
                                            ) : (
                                              user.joinedOrganizations
                                                .filter((org) =>
                                                  org.members.some(
                                                    (member) =>
                                                      member._id === user._id
                                                  )
                                                )
                                                .map((org: Organization) => {
                                                  console.log('org', org);
                                                  return (
                                                    <p
                                                      key={org._id}
                                                      className={
                                                        styles.userRole_container
                                                      }
                                                    >
                                                      {org.name} - MEMBER
                                                    </p>
                                                  );
                                                })
                                            )}
                                          </p>
                                        );
                                      })
                                  : null}
                                {user.userType !== 'SUPERADMIN' &&
                                  user.joinedOrganizations.length === 0 && (
                                    <p className="noOrgJoin_text">
                                      No organization join
                                    </p>
                                  )}
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-success"
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <div
                                  className="modal fade"
                                  id="exampleModalCenter"
                                  role="dialog"
                                  aria-labelledby="exampleModalCenterTitle"
                                  aria-hidden="true"
                                >
                                  <div
                                    className="modal-dialog modal-dialog-centered"
                                    role="document"
                                  >
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="exampleModalLongTitle"
                                        >
                                          Role
                                        </h5>
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <span aria-hidden="true">
                                            &times;
                                          </span>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <div>
                                          <label htmlFor="userRole">
                                            User Role
                                          </label>
                                          <select
                                            className="form-control"
                                            name={`role${user._id}`}
                                            data-testid={`changeRole${user._id}`}
                                            onChange={(e) =>
                                              setRole(e.target.value)
                                            }
                                            //disabled={user._id === userId}
                                            //defaultValue={`${user.userType}?${user._id}`}
                                          >
                                            <option selected disabled>
                                              select
                                            </option>
                                            <option value={`ADMIN?${user._id}`}>
                                              {t('admin')}
                                            </option>
                                            <option
                                              value={`SUPERADMIN?${user._id}`}
                                            >
                                              {t('superAdmin')}
                                            </option>
                                            <option value={`USER?${user._id}`}>
                                              {t('user')}
                                            </option>
                                          </select>

                                          <label htmlFor="userRole">
                                            Organization
                                          </label>
                                          <select
                                            className="form-control"
                                            name={`role${user._id}`}
                                            data-testid={`changeRole${user._id}`}
                                            onChange={(e) =>
                                              setOrganization(e.target.value)
                                            }
                                            //disabled={user._id === userId}
                                            //defaultValue={`${user.userType}?${user._id}`}
                                          >
                                            <option selected disabled>
                                              select
                                            </option>
                                            {dataOrgs?.organizationsConnection?.map(
                                              (org: {
                                                _id: string;
                                                image: string;
                                                name: string;
                                                admins: any;
                                                members: any;
                                                createdAt: string;
                                                location: string | null;
                                              }) => {
                                                return (
                                                  <option
                                                    key={org._id}
                                                    value={org._id}
                                                  >
                                                    {org.name}
                                                  </option>
                                                );
                                              }
                                            )}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={handleRole}
                                        >
                                          Save changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td>
                          <NotFound title="user" keyPrefix="userNotFound" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <table
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <tbody>
                  <tr>
                    <PaginationList
                      count={data ? data.users.length : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      data-testid="something"
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Roles;
