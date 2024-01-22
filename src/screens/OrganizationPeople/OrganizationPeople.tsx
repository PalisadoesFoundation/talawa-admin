import { FunctionComponent } from 'react';
import Drawer from '../../components/Drawer/Drawer';
import { useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import NotFound from 'components/NotFound/NotFound';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import PaginationList from 'components/PaginationList/PaginationList';
import UserListCard from 'components/UserListCard/UserListCard';
import { useTranslation } from 'react-i18next';
import debounce from 'utils/debounce';
import styles from './OrganizationPeople.module.css';

import { toast } from 'react-toastify';

function organizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

  const currentUrl = window.location.href.split('=')[1];

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
    toast.error(error?.message);
  }

  /* istanbul ignore next */
  const handleFirstNameSearchChange = (filterData: any): void => {
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
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const debouncedHandleFirstNameSearchChange = debounce(
    handleFirstNameSearchChange
  );
  return (
    <div className={styles.organizationPeople}>
      <Drawer />
      <header className={styles.peopleFrame}>
        <section className={styles.organizationSection}>
          <h1 className={styles.people}>People</h1>
          <div className={styles.pO}>
            <div className={styles.searchBox}>
              <div className={styles.sortBtn}>
                <div className={styles.searchBox1}>
                  <div className={styles.textinput} />
                  <div className={styles.searchPeople}>Search people</div>
                  <button className={styles.searchIconBtn}>
                    <div className={styles.searchIconBtnChild} />
                    <div className={styles.materialSymbolssearchRounde}>
                      <div className={styles.joinedon} />
                      <img
                        className={styles.rectangleIcon}
                        alt=""
                        src="/rectangle.svg"
                      />
                    </div>
                  </button>
                </div>
              </div>
              <button className={styles.sortBtn1}>
                <div className={styles.filterBtn} />
                <img
                  className={styles.ionoptionsOutlineIcon}
                  alt=""
                  src="/ionoptionsoutline.svg"
                />
                <div className={styles.searchByFirst}>Search by First name</div>
              </button>
            </div>
            <div className={styles.addadminsGroup}>
              <div className={styles.sendemails}>
                <div className={styles.removeadmins}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderChild} />
                    <div className={styles.mdiusersaddoutline}>#</div>
                    <div className={styles.mdiusersaddoutline1}>
                      <div className={styles.profile}>Profile</div>
                    </div>
                    <div className={styles.mdiusersaddoutline2}>
                      <div className={styles.name}>Name</div>
                    </div>
                    <div className={styles.mdiusersaddoutline3}>
                      <div className={styles.email}>Email</div>
                    </div>
                    <div className={styles.joinedOn}>Joined on</div>
                  </div>
                  <div className={styles.mdiuserminusoutline}>
                    <div className={styles.tableBg} />
                    <div className={styles.lists}>
                      {memberLoading || usersLoading || adminLoading ? (
                        <>
                          <div className={styles.loader}></div>
                        </>
                      ) : (
                        <div
                          className={styles.list_box}
                          data-testid="orgpeoplelist"
                        >
                          {
                            /* istanbul ignore next */
                            state == 0 ? (
                              memberData &&
                              memberData.organizationsMemberConnection.edges
                                .length > 0 ? (
                                (rowsPerPage > 0
                                  ? memberData.organizationsMemberConnection.edges.slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                    )
                                  : memberData.organizationsMemberConnection
                                      .edges
                                ).map(
                                  (
                                    datas: {
                                      _id: string;
                                      lastName: string;
                                      firstName: string;
                                      image: string;
                                      email: string;
                                      createdAt: string;
                                    },
                                    index: any
                                  ) => {
                                    return (
                                      <OrgPeopleListCard
                                        key={index.toString()}
                                        id={datas._id}
                                        memberImage={datas.image}
                                        joinDate={dayjs(datas.createdAt).format(
                                          'DD MMMM YYYY'
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
                                <NotFound
                                  title="member"
                                  keyPrefix="userNotFound"
                                />
                              )
                            ) : state == 1 ? (
                              adminData &&
                              adminData.organizationsMemberConnection.edges
                                .length > 0 ? (
                                (rowsPerPage > 0
                                  ? adminData.organizationsMemberConnection.edges.slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                    )
                                  : adminData.organizationsMemberConnection
                                      .edges
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
                                <NotFound
                                  title="admin"
                                  keyPrefix="userNotFound"
                                />
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
                                <NotFound
                                  title="user"
                                  keyPrefix="userNotFound"
                                />
                              )
                            ) : (
                              /* istanbul ignore next */
                              <NotFound title="user" keyPrefix="userNotFound" />
                            )
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>
    </div>
  );
}

export default organizationPeople;
