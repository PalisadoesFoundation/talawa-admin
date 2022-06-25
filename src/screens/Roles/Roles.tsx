import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';

import styles from './Roles.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import Pagination from 'components/Pagination/Pagination';
import { USER_LIST } from 'GraphQl/Queries/Queries';
import { Hidden, TablePagination } from '@mui/material';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';

const Roles = () => {
  document.title = 'Talawa Roles';

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
              <p className={styles.logintitle}>Users List</p>
            </Row>
            <div className={styles.list_box}>
              <div className="table-responsive">
                <table className={`table table-hover ${styles.userListTable}`}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role/User-Type</th>
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
                                      ADMIN
                                    </option>
                                    <option value={`SUPERADMIN?${user._id}`}>
                                      SUPERADMIN
                                    </option>
                                    <option value={`USER?${user._id}`}>
                                      USER
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
                                      ADMIN
                                    </option>
                                    <option
                                      value={`SUPERADMIN?${user._id}`}
                                      selected
                                    >
                                      SUPERADMIN
                                    </option>
                                    <option value={`USER?${user._id}`}>
                                      USER
                                    </option>
                                  </select>
                                ) : (
                                  <select
                                    className="form-control"
                                    name={`role${user._id}`}
                                    onChange={changeRole}
                                  >
                                    <option value={`ADMIN?${user._id}`}>
                                      ADMIN
                                    </option>
                                    <option value={`SUPERADMIN?${user._id}`}>
                                      SUPERADMIN
                                    </option>
                                    <option value={`USER?${user._id}`} selected>
                                      USER
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
                    <Hidden smUp>
                      <TablePagination
                        rowsPerPageOptions={[]}
                        colSpan={4}
                        count={data ? data.users.length : 0}
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
                        count={data ? data.users.length : 0}
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

export default Roles;
