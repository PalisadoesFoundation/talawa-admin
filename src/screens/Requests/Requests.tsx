import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import styles from './Requests.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import { USER_LIST } from 'GraphQl/Queries/Queries';
import {
  ACCPET_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import PaginationList from 'components/PaginationList/PaginationList';

const Requests = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });

  document.title = t('title');

  const [componentLoader, setComponentLoader] = useState(true);
  const [usersData, setUsersData] = useState([]);
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

  const [acceptAdminFunc] = useMutation(ACCPET_ADMIN_MUTATION);
  const [rejectAdminFunc] = useMutation(REJECT_ADMIN_MUTATION);

  useEffect(() => {
    if (data) {
      setUsersData(
        data.users.filter(
          (user: any) =>
            user.userType === 'ADMIN' && user.adminApproved === false
        )
      );
    }
  }, [data]);

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

  const accpetAdmin = async (userId: any) => {
    try {
      const { data } = await acceptAdminFunc({
        variables: {
          id: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('User Approved');
        setUsersData(usersData.filter((user: any) => user._id !== userId));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const rejectAdmin = async (userId: any) => {
    try {
      const { data } = await rejectAdminFunc({
        variables: {
          id: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('User Rejected');
        setUsersData(usersData.filter((user: any) => user._id !== userId));
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
              <p className={styles.logintitle}>{t('requests')}</p>
            </Row>
            <div className={styles.list_box}>
              <div className="table-responsive">
                <table className={`table table-hover ${styles.userListTable}`}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">{t('name')}</th>
                      <th scope="col">{t('email')}</th>
                      <th scope="col">{t('accept')}</th>
                      <th scope="col">{t('reject')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? usersData.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : usersData
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
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => accpetAdmin(user._id)}
                                data-testid={`acceptUser${user._id}`}
                              >
                                {t('accept')}
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => rejectAdmin(user._id)}
                                data-testid={`rejectUser${user._id}`}
                              >
                                {t('reject')}
                              </button>
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
                      count={usersData.length}
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

export default Requests;
