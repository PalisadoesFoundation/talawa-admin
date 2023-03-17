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
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import { RootState } from '../../state/reducers';
import PaginationList from 'components/PaginationList/PaginationList';
import { useTranslation } from 'react-i18next';
import debounce from 'utils/debounce';

function OrganizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

  const currentUrl = window.location.href.split('=')[1];
  let data, loading, error, refetchMembers: any, refetchAdmins: any;

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const [state, setState] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (state == 0) {
    const {
      data: data_2,
      loading: loading_2,
      error: error_2,
      refetch,
    } = useQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
      variables: {
        orgId: currentUrl,
        firstName_contains: '',
        event_title_contains: '',
      },
    });
    refetchMembers = refetch;
    data = data_2;
    loading = loading_2;
    error = error_2;
  } else if (state == 1) {
    const {
      data: data_2,
      loading: loading_2,
      error: error_2,
      refetch,
    } = useQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
      variables: {
        orgId: currentUrl,
        firstName_contains: '',
        admin_for: currentUrl,
      },
    });
    refetchAdmins = refetch;
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

  const handleFirstNameSearchChange = (e: any) => {
    const { value } = e.target;
    if (state === 0) {
      const filterData = {
        orgId: currentUrl,
        firstName_contains: value,
      };
      refetchMembers(filterData);
    } else if (state === 1) {
      const filterData = {
        orgId: currentUrl,
        firstName_contains: value,
        admin_for: currentUrl,
      };
      refetchAdmins(filterData);
    }
  };

  const handleEventTitleSearchChange = (e: any) => {
    const { value } = e.target;
    if (state === 0) {
      const filterData = {
        orgId: currentUrl,
        event_title_contains: value,
      };
      refetchMembers(filterData);
    } else if (state === 1) {
      const filterData = {
        orgId: currentUrl,
        event_title_contains: value,
        admin_for: currentUrl,
      };
      refetchAdmins(filterData);
    }
  };

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

  const debouncedHandleFirstNameSearchChange = debounce(
    handleFirstNameSearchChange
  );
  const debouncedHandleEventTitleSearchChange = debounce(
    handleEventTitleSearchChange
  );

  return (
    <>
      <div>
        <AdminNavbar targets={targets} url_1={configUrl} />
      </div>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>{t('filterByName')}</h6>
              <input
                type="name"
                id="searchname"
                placeholder={t('searchName')}
                autoComplete="off"
                required
                onChange={debouncedHandleFirstNameSearchChange}
              />
              <h6 className={styles.searchtitle}>{t('filterByEvent')}</h6>
              <input
                type="name"
                id="searchevent"
                placeholder={t('searchevent')}
                autoComplete="off"
                required
                onChange={debouncedHandleEventTitleSearchChange}
              />
              <div className={styles.radio_buttons}>
                <input
                  id="memberslist"
                  value="memberslist"
                  name="displaylist"
                  type="radio"
                  defaultChecked={state == 0 ? true : false}
                  onClick={() => {
                    setState(0);
                  }}
                />
                <label htmlFor="memberslist">{t('members')}</label>
                <input
                  id="adminslist"
                  value="adminslist"
                  name="displaylist"
                  type="radio"
                  defaultChecked={state == 1 ? true : false}
                  onClick={() => {
                    setState(1);
                  }}
                />
                <label htmlFor="adminslist">{t('admins')}</label>
                <input
                  id="userslist"
                  value="userslist"
                  name="displaylist"
                  type="radio"
                  defaultChecked={state == 2 ? true : false}
                  onClick={() => {
                    setState(2);
                  }}
                />
                <label htmlFor="userslist">{t('users')}</label>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={9} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
          <Container>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.logintitle}>{t('members')}</p>
              </Row>
              <div className={styles.list_box}>
                {state == 0
                  ? data
                    ? (rowsPerPage > 0
                        ? data.organizationsMemberConnection.edges.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.organizationsMemberConnection.edges
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
                              joinDate={dayjs(datas.createdAt).format(
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
                  : state == 1
                  ? data
                    ? (rowsPerPage > 0
                        ? data.organizationsMemberConnection.edges.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data.organizationsMemberConnection.edges
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
                              joinDate={dayjs(datas.createdAt).format(
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
                  : state == 2
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
                              joinDate={dayjs(datas.createdAt).format(
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
              <table
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <tbody>
                  <tr>
                    {state == 0 ? (
                      <>
                        <PaginationList
                          count={
                            data
                              ? data.organizationsMemberConnection.edges.length
                              : 0
                          }
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : state == 1 ? (
                      <>
                        <PaginationList
                          count={
                            data
                              ? data.organizationsMemberConnection.edges.length
                              : 0
                          }
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : state == 2 ? (
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
