import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLazyQuery } from '@apollo/client';
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
import NotFound from 'components/NotFound/NotFound';

import { toast } from 'react-toastify';

function OrganizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const [state, setState] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filterData, setFilterData] = useState({
    firstName_contains: '',
    lastName_contains: '',
  });

  const {
    data: memberData,
    loading: memberLoading,
    error: memberError,
    refetch: memberRefetch,
  } = useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
      orgId: currentUrl,
    },
  })[1];

  const {
    data: adminData,
    loading: adminLoading,
    error: adminError,
    refetch: adminRefetch,
  } = useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
      orgId: currentUrl,
      admin_for: currentUrl,
    },
  })[1];

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: usersRefetch,
  } = useLazyQuery(USER_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
    },
  })[1];

  useEffect(() => {
    if (state === 0) {
      memberRefetch({
        ...filterData,
        orgId: currentUrl,
      });
    } else if (state === 1) {
      adminRefetch({
        ...filterData,
        orgId: currentUrl,
        admin_for: currentUrl,
      });
    } else {
      usersRefetch({
        ...filterData,
      });
    }
  }, [state]);

  /* istanbul ignore next */
  if (memberError || usersError || adminError) {
    const error = memberError ?? usersError ?? adminError;

    console.log(error);
    toast.error(error?.message);
  }

  /* istanbul ignore next */
  const handleFirstNameSearchChange = (filterData: any) => {
    /* istanbul ignore next */
    if (state === 0) {
      memberRefetch({
        ...filterData,
        orgId: currentUrl,
      });
    } else if (state === 1) {
      adminRefetch({
        ...filterData,
        orgId: currentUrl,
        admin_for: currentUrl,
      });
    } else {
      usersRefetch({
        ...filterData,
      });
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
                placeholder={t('searchFirstName')}
                autoComplete="off"
                required
                value={filterData.firstName_contains}
                onChange={(e) => {
                  const { value } = e.target;

                  const newFilterData = {
                    ...filterData,
                    firstName_contains: value?.trim(),
                  };

                  setFilterData(newFilterData);
                  debouncedHandleFirstNameSearchChange(newFilterData);
                }}
              />
              <input
                type="name"
                id="searchLastName"
                placeholder={t('searchLastName')}
                autoComplete="off"
                required
                value={filterData.lastName_contains}
                onChange={(e) => {
                  const { value } = e.target;

                  const newFilterData = {
                    ...filterData,
                    lastName_contains: value?.trim(),
                  };

                  setFilterData(newFilterData);
                  debouncedHandleFirstNameSearchChange(newFilterData);
                }}
              />
              <div className={styles.radio_buttons} data-testid="usertypelist">
                <input
                  id="userslist"
                  value="userslist"
                  name="displaylist"
                  type="radio"
                  data-testid="users"
                  defaultChecked={state == 2 ? true : false}
                  onClick={() => {
                    setState(2);
                  }}
                />
                <label htmlFor="userslist">{t('users')}</label>
                <input
                  id="memberslist"
                  value="memberslist"
                  name="displaylist"
                  data-testid="members"
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
                  data-testid="admins"
                  defaultChecked={state == 1 ? true : false}
                  onClick={() => {
                    setState(1);
                  }}
                />
                <label htmlFor="adminslist">{t('admins')}</label>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={9} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
          <Container>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.logintitle}>
                  {state == 0
                    ? t('members')
                    : state == 1
                    ? t('admins')
                    : t('users')}
                </p>
              </Row>
              {memberLoading || usersLoading || adminLoading ? (
                <>
                  <div className={styles.loader}></div>
                </>
              ) : (
                <div className={styles.list_box} data-testid="orgpeoplelist">
                  {
                    /* istanbul ignore next */
                    state == 0 ? (
                      memberData &&
                      memberData.organizationsMemberConnection.edges.length >
                        0 ? (
                        (rowsPerPage > 0
                          ? memberData.organizationsMemberConnection.edges.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : memberData.organizationsMemberConnection.edges
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
                      ) : (
                        <NotFound title="member" keyPrefix="userNotFound" />
                      )
                    ) : state == 1 ? (
                      adminData &&
                      adminData.organizationsMemberConnection.edges.length >
                        0 ? (
                        (rowsPerPage > 0
                          ? adminData.organizationsMemberConnection.edges.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : adminData.organizationsMemberConnection.edges
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
                      ) : (
                        <NotFound title="admin" keyPrefix="userNotFound" />
                      )
                    ) : state == 2 ? (
                      usersData && usersData.users.length > 0 ? (
                        (rowsPerPage > 0
                          ? usersData.users.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : usersData.users
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
                      ) : (
                        <NotFound title="user" keyPrefix="userNotFound" />
                      )
                    ) : (
                      /* istanbul ignore next */
                      <NotFound title="user" keyPrefix="userNotFound" />
                    )
                  }
                </div>
              )}
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
                  <tr data-testid="rowsPPSelect">
                    <>
                      <PaginationList
                        count={
                          state === 0
                            ? memberData?.organizationsMemberConnection.edges
                                .length ?? 0
                            : state === 1
                            ? adminData?.organizationsMemberConnection.edges
                                .length ?? 0
                            : usersData?.users.length ?? 0
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </>
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
