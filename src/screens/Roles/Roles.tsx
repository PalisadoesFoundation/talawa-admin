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
  REMOVE_ADMIN_MUTATION,
  ADD_MEMBER_MUTATION,
  REMOVE_MEMBER_MUTATION,
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
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  joinedOrganizations: Organization[];
  adminFor: {
    _id: string;
    __typename: string;
    name: string;
  }[];
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

  const { loading: users_loading, data, refetch } = useQuery(USER_LIST);

  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const [createAdmin] = useMutation(ADD_ADMIN_MUTATION);
  const [removeAdmin] = useMutation(REMOVE_ADMIN_MUTATION);
  const [createMember] = useMutation(ADD_MEMBER_MUTATION);
  const [removeMember] = useMutation(REMOVE_MEMBER_MUTATION);

  const { data: dataOrgs } = useQuery(ORGANIZATION_CONNECTION_LIST);

  useEffect(() => {
    if (!dataOrgs) {
      return;
    }

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

  /* istanbul ignore next */
  const handleRole = async () => {
    if (role === '') {
      /* istanbul ignore next */
      return toast.error(t('selectRoleAndOrg'));
    }

    /* istanbul ignore next */
    if (role.split('?')[0] === 'SUPERADMIN') {
      try {
        /* istanbul ignore next */
        const { data } = await updateUserType({
          variables: {
            id: role.split('?')[1],
            userType: role.split('?')[0],
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
    } else if (role.split('?')[0] === 'ADMIN') {
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
    } else {
      try {
        const { data } = await createMember({
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
    }
  };

  /* istanbul ignore next */
  const handleRemoveSuperadmin = async (userId: any) => {
    try {
      /* istanbul ignore next */
      const { data } = await updateUserType({
        variables: {
          id: userId,
          userType: 'USER',
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

  /* istanbul ignore next */
  const handleRemoveAdmin = async (orgId: any, userId: any) => {
    try {
      /* istanbul ignore next */
      const { data } = await removeAdmin({
        variables: {
          orgid: orgId,
          userid: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('adminRemoved'));
        refetch();
      }
    } catch (error) {
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const handleRemoveMember = async (orgId: any, userId: any) => {
    try {
      /* istanbul ignore next */
      const { data } = await removeMember({
        variables: {
          orgid: orgId,
          userid: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('memberRemoved'));
        refetch();
      }
    } catch (error) {
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
        <Col sm={2}>
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
        <Col sm={10}>
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
                      <th scope="col">{t('role')}</th>
                      <th scope="col">{t('organization')}</th>
                      <th scope="col">{t('add')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.users.length > 0 ? (
                      (rowsPerPage > 0
                        ? data.users.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.users
                      ).map((user: Data, index: number) => {
                        return (
                          <tr key={user._id}>
                            <th scope="row">{page * 10 + (index + 1)}</th>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.userType === 'SUPERADMIN' && (
                                <p className={styles.userRole_container}>
                                  {t('superAdmin')}{' '}
                                  {user._id !== userId && (
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={() =>
                                        handleRemoveSuperadmin(user._id)
                                      }
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  )}
                                </p>
                              )}

                              {user?.adminFor?.length > 0 &&
                                user.userType !== 'SUPERADMIN' &&
                                user?.adminFor.map((org) => {
                                  return (
                                    <p
                                      key={org._id}
                                      className={styles.userRole_container}
                                    >
                                      {org.name} - {t('admin')}{' '}
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() =>
                                          handleRemoveAdmin(org._id, user._id)
                                        }
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    </p>
                                  );
                                })}

                              {user?.joinedOrganizations?.length > 0 &&
                                user.userType !== 'SUPERADMIN' &&
                                user.joinedOrganizations
                                  .filter(
                                    (org) =>
                                      !user.adminFor.some(
                                        (adminOrg) => adminOrg._id === org._id
                                      ) &&
                                      org.members.some(
                                        (member) => member._id === user._id
                                      )
                                  )
                                  .map((org: Organization) => {
                                    return (
                                      <p
                                        key={org._id}
                                        className={styles.userRole_container}
                                      >
                                        {org.name} - {t('user')}{' '}
                                        <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={() =>
                                            handleRemoveMember(
                                              org._id,
                                              user._id
                                            )
                                          }
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </p>
                                    );
                                  })}

                              {user.userType !== 'SUPERADMIN' &&
                                user.adminFor.length === 0 &&
                                /* istanbul ignore next */
                                user.joinedOrganizations.filter(
                                  /* istanbul ignore next */
                                  (org) =>
                                    !user.adminFor.some(
                                      /* istanbul ignore next */
                                      (adminOrg) => adminOrg._id === org._id
                                    ) &&
                                    org.members.some(
                                      /* istanbul ignore next */
                                      (member) => member._id === user._id
                                    )
                                ).length === 0 && (
                                  <p className="noOrgJoin_text">
                                    {t('noOrganizationJoin')}
                                  </p>
                                )}
                            </td>
                            <td>
                              <select
                                className="form-control"
                                name={`role${user._id}`}
                                data-testid={`changeRole${user._id}`}
                                onChange={(e) => {
                                  setRole(e.target.value);
                                }}
                                disabled={user._id === userId}
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  {t('select')}
                                </option>
                                <option value={`ADMIN?${user._id}`}>
                                  {t('admin')}
                                </option>
                                <option value={`SUPERADMIN?${user._id}`}>
                                  {t('superAdmin')}
                                </option>
                                <option value={`USER?${user._id}`}>
                                  {t('user')}
                                </option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                name={`role${user._id}`}
                                data-testid={`changeOrganization${user._id}`}
                                onChange={(e) => {
                                  setOrganization(e.target.value);
                                }}
                                disabled={
                                  user._id === userId ||
                                  role === `SUPERADMIN?${user._id}`
                                }
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  {t('select')}
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
                                      <option key={org._id} value={org._id}>
                                        {org.name}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleRole}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
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
