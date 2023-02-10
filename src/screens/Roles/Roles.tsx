import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import styles from './Roles.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import { USER_LIST } from 'GraphQl/Queries/Queries';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';
import PaginationList from 'components/PaginationList/PaginationList';

const Roles = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'roles' });

  document.title = t('title');

  const [componentLoader, setComponentLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchByName, setSearchByName] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem('UserType');
    if (userType != 'SUPERADMIN') {
      window.location.assign('/orglist');
    }
    setComponentLoader(false);
  }, []);

  const { data, loading: users_loading, refetch } = useQuery(USER_LIST);

  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);

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
        toast.success('Role Updated.');
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  const handleSearchByName = (e: any) => {
    const { value } = e.target;
    setSearchByName(value);

    refetch({
      filter: searchByName,
    });
  };

  return (
    <>
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
                    {data &&
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
                          },
                          index: number
                        ) => {
                          return (
                            <tr key={user._id}>
                              <th scope="row">{page * 10 + (index + 1)}</th>
                              <td>{`${user.firstName} ${user.lastName}`}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.userType === 'ADMIN' ? (
                                  <select
                                    className="form-control"
                                    name={`role${user._id}`}
                                    onChange={changeRole}
                                  >
                                    <option
                                      value={`ADMIN?${user._id}`}
                                      selected
                                    >
                                      {t('admin')}
                                    </option>
                                    <option value={`SUPERADMIN?${user._id}`}>
                                      {t('superAdmin')}
                                    </option>
                                    <option value={`USER?${user._id}`}>
                                      {t('user')}
                                    </option>
                                  </select>
                                ) : user.userType === 'SUPERADMIN' ? (
                                  <select
                                    className="form-control"
                                    name={`role${user._id}`}
                                    data-testid={`changeRole${user._id}`}
                                    onChange={changeRole}
                                  >
                                    <option value={`ADMIN?${user._id}`}>
                                      {t('admin')}
                                    </option>
                                    <option
                                      value={`SUPERADMIN?${user._id}`}
                                      selected
                                    >
                                      {t('superAdmin')}
                                    </option>
                                    <option value={`USER?${user._id}`}>
                                      {t('user')}
                                    </option>
                                  </select>
                                ) : (
                                  <select
                                    className="form-control"
                                    name={`role${user._id}`}
                                    onChange={changeRole}
                                  >
                                    <option value={`ADMIN?${user._id}`}>
                                      {t('admin')}
                                    </option>
                                    <option value={`SUPERADMIN?${user._id}`}>
                                      {t('superAdmin')}
                                    </option>
                                    <option value={`USER?${user._id}`} selected>
                                      {t('user')}
                                    </option>
                                  </select>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <PaginationList
                      count={data ? data.users.length : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
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
    </>
  );
};

export default Roles;
