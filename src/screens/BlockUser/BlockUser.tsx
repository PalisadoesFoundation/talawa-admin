import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { Hidden, TablePagination } from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import styles from './BlockUser.module.css';
import Pagination from 'components/Pagination/Pagination';
import { USER_LIST } from 'GraphQl/Queries/Queries';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { RootState } from 'state/reducers';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';

const Requests = () => {
  document.title = 'Talawa Block/Unblock User';

  const [usersData, setUsersData] = useState([]);
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
  const [blockUser] = useMutation(BLOCK_USER_MUTATION);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION);

  useEffect(() => {
    if (data) {
      setUsersData(
        data.users.filter((user: any) =>
          user.spamInOrganizations.some((spam: any) => spam._id === currentUrl)
        )
      );
    }
  }, [data]);

  if (spammers_loading) {
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
        toast.success('User blocked successfully');
        refetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
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
        toast.success('User Un-Blocked successfully');
        refetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
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
              <h6 className={styles.searchtitle}>Search By Name</h6>
              <input
                type="name"
                id="orgname"
                placeholder="Enter Name"
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
              <p className={styles.logintitle}>List of Users who spammed</p>
            </Row>
            <div className={styles.list_box}>
              <div className="table-responsive">
                <table className={`table table-hover ${styles.userListTable}`}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col" className="text-center">
                        Block/Unblock
                      </th>
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
                                  UnBlock
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleBlockUser(user._id)}
                                  data-testid={`blockUser${user._id}`}
                                >
                                  Block
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
              <table>
                <tbody>
                  <tr>
                    <Hidden smUp>
                      <TablePagination
                        rowsPerPageOptions={[]}
                        colSpan={4}
                        count={usersData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={Pagination}
                      />
                    </Hidden>
                    <Hidden smDown>
                      <TablePagination
                        rowsPerPageOptions={[
                          10,
                          20,
                          50,
                          { label: 'All', value: -1 },
                        ]}
                        colSpan={4}
                        count={usersData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={Pagination}
                      />
                    </Hidden>
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
