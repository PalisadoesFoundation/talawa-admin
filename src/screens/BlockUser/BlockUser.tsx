import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import styles from './BlockUser.module.css';
import { MEMBERS_LIST, USER_LIST } from 'GraphQl/Queries/Queries';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { RootState } from 'state/reducers';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import PaginationList from 'components/PaginationList/PaginationList';

const Requests = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'blockUnblockUser',
  });

  document.title = t('title');

  const [membersArray, setMembersArray] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchByName, setSearchByName] = useState('');

  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const {
    data,
    loading: spammers_loading,
    error,
    refetch,
  } = useQuery(USER_LIST);

  const { data: data_2 } = useQuery(MEMBERS_LIST, {
    variables: {
      id: currentUrl,
    },
  });

  const [blockUser] = useMutation(BLOCK_USER_MUTATION);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION);

  useEffect(() => {
    if (data_2) {
      setMembersArray(data_2.organizations[0].members);
    }
  }, [data, data_2]);

  if (spammers_loading) {
    return <div className="loader"></div>;
  }

  const memberIds = membersArray.map((user: { _id: string }) => user._id);

  const memberUsersData = data.users.filter((user: { _id: string }) =>
    memberIds.includes(user._id)
  );

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

  const handleSearchByName = (e: any) => {
    const { value } = e.target;
    setSearchByName(value);

    refetch({
      filter: searchByName,
    });
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const { data } = await blockUser({
        variables: {
          userId,
          orgId: currentUrl,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('blockedSuccessfully'));
        refetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'Failed to fetch') {
        toast.error(t('talawaApiUnavailable'));
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleUnBlockUser = async (userId: string) => {
    try {
      const { data } = await unBlockUser({
        variables: {
          userId,
          orgId: currentUrl,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('Un-BlockedSuccessfully'));
        refetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'Failed to fetch') {
        toast.error(t('talawaApiUnavailable'));
      } else {
        toast.error(error.message);
      }
    }
  };

  /* istanbul ignore next */
  if (error) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>{t('searchByName')}</h6>
              <input
                type="name"
                id="orgname"
                placeholder={t('orgName')}
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
              <p className={styles.logintitle}>{t('listOfUsers')}</p>
            </Row>
            <div className={styles.list_box}>
              <div className="table-responsive">
                <table className={`table table-hover ${styles.userListTable}`}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">{t('name')}</th>
                      <th scope="col">{t('email')}</th>
                      <th scope="col" className="text-center">
                        {t('block_unblock')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? memberUsersData.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : memberUsersData
                    ).map(
                      (
                        user: {
                          _id: string;
                          firstName: string;
                          lastName: string;
                          email: string;
                          organizationsBlockedBy: [];
                        },
                        index: number
                      ) => {
                        return (
                          <tr key={user._id}>
                            <th scope="row">{page * 10 + (index + 1)}</th>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td className="text-center">
                              {user.organizationsBlockedBy.some(
                                (spam: any) => spam._id === currentUrl
                              ) ? (
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleUnBlockUser(user._id)}
                                  data-testid={`unBlockUser${user._id}`}
                                >
                                  {t('unblock')}
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleBlockUser(user._id)}
                                  data-testid={`blockUser${user._id}`}
                                >
                                  {t('block')}
                                </button>
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
                      count={memberUsersData.length}
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
