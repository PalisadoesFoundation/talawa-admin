import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { Hidden, TablePagination } from '@mui/material';
import { toast } from 'react-toastify';

import styles from './Requests.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import Pagination from 'components/Pagination/Pagination';
import { USER_LIST } from 'GraphQl/Queries/Queries';
import {
  ACCPET_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';

const Requests = () => {
  document.title = 'Talawa Requests';

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
              <p className={styles.logintitle}>Requests</p>
            </Row>
            <div className={styles.list_box}>
              <div className="table-responsive">
                <table className={`table table-hover ${styles.userListTable}`}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Accept</th>
                      <th scope="col">Reject</th>
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
                                Accept
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => rejectAdmin(user._id)}
                                data-testid={`rejectUser${user._id}`}
                              >
                                Reject
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
