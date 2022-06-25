import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import dayjs from 'dayjs';

import styles from './OrganizationPeople.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import UserListCard from 'components/UserListCard/UserListCard';
import { ADMIN_LIST, MEMBERS_LIST, USER_LIST } from 'GraphQl/Queries/Queries';
import { RootState } from '../../state/reducers';
import PaginationList from 'components/PaginationList/PaginationList';

function OrganizationPeople(): JSX.Element {
  document.title = 'Talawa Members';

  const currentUrl = window.location.href.split('=')[1];
  let data, loading, error;

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const [t, setT] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (t == 0) {
    const {
      data: data_2,
      loading: loading_2,
      error: error_2,
    } = useQuery(MEMBERS_LIST, {
      variables: { id: currentUrl },
    });
    data = data_2;
    loading = loading_2;
    error = error_2;
  } else if (t == 1) {
    const {
      data: data_2,
      loading: loading_2,
      error: error_2,
    } = useQuery(ADMIN_LIST, {
      variables: { id: currentUrl },
    });
    data = data_2;
    loading = loading_2;
    error = error_2;
  } else {
    const {
      data: data_2,
      loading: loading_2,
      error: error_2,
    } = useQuery(USER_LIST);
    data = data_2;
    loading = loading_2;
    error = error_2;
  }

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign('/orglist');
  }

  /* istanbul ignore next */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div>
        <AdminNavbar targets={targets} url_1={configUrl} />
      </div>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Filter by Name</h6>
              <input
                type="name"
                id="searchname"
                placeholder="Enter Name"
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>Filter by Location</h6>
              <input
                type="name"
                id="searchlocation"
                placeholder="Enter Location"
                autoComplete="off"
                required
              />
              <h6 className={styles.searchtitle}>Filter by Event</h6>
              <input
                type="name"
                id="searchevent"
                placeholder="Enter Event"
                autoComplete="off"
                required
              />
              <div className={styles.radio_buttons}>
                <input
                  id="memberslist"
                  value="memberslist"
                  name="displaylist"
                  type="radio"
                  defaultChecked={t == 0 ? true : false}
                  onClick={() => {
                    setT(0);
                  }}
                />
                <label htmlFor="memberslist">Members</label>
                <input
                  id="adminslist"
                  value="adminslist"
                  name="displaylist"
                  type="radio"
                  defaultChecked={t == 1 ? true : false}
                  onClick={() => {
                    setT(1);
                  }}
                />
                <label htmlFor="adminslist">Admins</label>
                <input
                  id="userslist"
                  value="userslist"
                  name="displaylist"
                  type="radio"
                  defaultChecked={t == 2 ? true : false}
                  onClick={() => {
                    setT(2);
                  }}
                />
                <label htmlFor="userslist">Users</label>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={9} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
          <Container>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.logintitle}>Members</p>
              </Row>
              <div className={styles.list_box}>
                {t == 0
                  ? data
                    ? (rowsPerPage > 0
                        ? data.organizations[0].members.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.organizations[0].members
                      ).map(
                        (datas: {
                          _id: string;
                          lastName: string;
                          firstName: string;
                          image: string;
                          email: string;
                          createdAt: string;
                        }) => {
                          return (
                            <OrgPeopleListCard
                              key={datas._id}
                              id={datas._id}
                              memberImage={datas.image}
                              joinDate={dayjs(parseInt(datas.createdAt)).format(
                                'DD/MM/YYYY'
                              )}
                              memberName={
                                datas.firstName + ' ' + datas.lastName
                              }
                              memberEmail={datas.email}
                            />
                          );
                        }
                      )
                    : null
                  : t == 1
                  ? data
                    ? (rowsPerPage > 0
                        ? data.organizations[0].admins.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.organizations[0].admins
                      ).map(
                        (datas: {
                          _id: string;
                          lastName: string;
                          firstName: string;
                          image: string;
                          email: string;
                          createdAt: string;
                        }) => {
                          return (
                            <OrgAdminListCard
                              key={datas._id}
                              id={datas._id}
                              memberImage={datas.image}
                              joinDate={dayjs(parseInt(datas.createdAt)).format(
                                'DD/MM/YYYY'
                              )}
                              memberName={
                                datas.firstName + ' ' + datas.lastName
                              }
                              memberEmail={datas.email}
                            />
                          );
                        }
                      )
                    : null
                  : t == 2
                  ? data
                    ? (rowsPerPage > 0
                        ? data.users.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.users
                      ).map(
                        (datas: {
                          _id: string;
                          lastName: string;
                          firstName: string;
                          image: string;
                          email: string;
                          createdAt: string;
                        }) => {
                          return (
                            <UserListCard
                              key={datas._id}
                              id={datas._id}
                              memberImage={datas.image}
                              joinDate={dayjs(parseInt(datas.createdAt)).format(
                                'DD/MM/YYYY'
                              )}
                              memberName={
                                datas.firstName + ' ' + datas.lastName
                              }
                              memberEmail={datas.email}
                            />
                          );
                        }
                      )
                    : null
                  : /* istanbul ignore next */
                    null}
              </div>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    {t == 0 ? (
                      <>
                        <PaginationList
                          count={
                            data ? data.organizations[0].members.length : 0
                          }
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : t == 1 ? (
                      <>
                        <PaginationList
                          count={data ? data.organizations[0].admins.length : 0}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : t == 2 ? (
                      <>
                        <PaginationList
                          count={data ? data.users.length : 0}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : /* istanbul ignore next */
                    null}
                  </tr>
                </tbody>
              </table>
            </div>
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationPeople;
