import { useLazyQuery } from '@apollo/client';
<<<<<<< HEAD
import { Search, Sort } from '@mui/icons-material';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddMember from './AddMember';
import styles from './OrganizationPeople.module.css';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

function organizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

<<<<<<< HEAD
  const location = useLocation();
  const role = location?.state;

  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(role?.role || 0);
=======
  const currentUrl = window.location.href.split('=')[1];

  const [state, setState] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const [filterData, setFilterData] = useState({
    firstName_contains: '',
    lastName_contains: '',
  });

<<<<<<< HEAD
  const [userName, setUserName] = useState('');
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);
  const [selectedAdminId, setSelectedAdminId] = React.useState<
    string | undefined
  >();
  const [selectedMemId, setSelectedMemId] = React.useState<
    string | undefined
  >();
  const toggleRemoveModal = (): void => {
    setShowRemoveModal((prev) => !prev);
  };
  const toggleRemoveMemberModal = (id: string): void => {
    setSelectedMemId(id);
    setSelectedAdminId(undefined);
    toggleRemoveModal();
  };
  const toggleRemoveAdminModal = (id: string): void => {
    setSelectedAdminId(id);
    setSelectedMemId(undefined);
    toggleRemoveModal();
  };

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
  } = useLazyQuery(USER_LIST_FOR_TABLE, {
=======
  } = useLazyQuery(USER_LIST, {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
  if (memberLoading || usersLoading || adminLoading) {
    return (
      <div className={styles.mainpageright}>
        <Loader />
      </div>
    );
  }

  const handleFullNameSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    /* istanbul ignore next */
    const [firstName, lastName] = userName.split(' ');
    const newFilterData = {
      firstName_contains: firstName || '',
      lastName_contains: lastName || '',
    };

    setFilterData(newFilterData);

    if (state === 0) {
      memberRefetch({
        ...newFilterData,
=======

  /* istanbul ignore next */
  const handleFirstNameSearchChange = (filterData: any): void => {
    /* istanbul ignore next */
    if (state === 0) {
      memberRefetch({
        ...filterData,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        orgId: currentUrl,
      });
    } else if (state === 1) {
      adminRefetch({
<<<<<<< HEAD
        ...newFilterData,
=======
        ...filterData,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        orgId: currentUrl,
        admin_for: currentUrl,
      });
    } else {
      usersRefetch({
<<<<<<< HEAD
        ...newFilterData,
=======
        ...filterData,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      });
    }
  };

<<<<<<< HEAD
  const columns: GridColDef[] = [
    {
      field: 'profile',
      headerName: 'Profile',
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row?.image ? (
          <img
            src={params.row?.image}
            alt="avatar"
            className={styles.TableImage}
          />
        ) : (
          <Avatar
            avatarStyle={styles.TableImage}
            name={`${params.row.firstName} ${params.row.lastName}`}
          />
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            to={`/member/${currentUrl}`}
            state={{ id: params.row._id }}
            className={styles.membername}
          >
            {params.row?.firstName + ' ' + params.row?.lastName}
          </Link>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
    },
    {
      field: 'joined',
      headerName: 'Joined',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return dayjs(params.row.createdAt).format('DD/MM/YYYY');
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return state === 1 ? (
          <Button
            onClick={() => toggleRemoveAdminModal(params.row._id)}
            data-testid="removeAdminModalBtn"
          >
            Remove
          </Button>
        ) : (
          <Button
            onClick={() => toggleRemoveMemberModal(params.row._id)}
            data-testid="removeMemberModalBtn"
          >
            Remove
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <Form onSubmit={handleFullNameSearchChange}>
                <Form.Control
                  type="name"
                  id="searchLastName"
                  placeholder={t('searchFullName')}
                  autoComplete="off"
                  className={styles.inputField}
                  onChange={(e): void => {
                    const { value } = e.target;
                    setUserName(value);
                  }}
                />
                <Button
                  type="submit"
                  className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
                  style={{ marginBottom: '10px' }}
                  data-testid={'searchbtn'}
                >
                  <Search />
                </Button>
              </Form>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className={styles.dropdown}
                  data-testid="role"
                >
                  <Sort />
                  {t('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
=======
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
    <>
      <OrganizationScreen screenName="People" title={t('title')}>
        <Row>
          <Col sm={3}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarsticky}>
                <h6 className={styles.searchtitle}>{t('filterByName')}</h6>
                <Form.Control
                  type="name"
                  id="searchname"
                  placeholder={t('searchFirstName')}
                  autoComplete="off"
                  required
                  value={filterData.firstName_contains}
                  onChange={(e): void => {
                    const { value } = e.target;

                    const newFilterData = {
                      ...filterData,
                      firstName_contains: value?.trim(),
                    };

                    setFilterData(newFilterData);
                    debouncedHandleFirstNameSearchChange(newFilterData);
                  }}
                />
                <Form.Control
                  type="name"
                  id="searchLastName"
                  placeholder={t('searchLastName')}
                  autoComplete="off"
                  required
                  value={filterData.lastName_contains}
                  onChange={(e): void => {
                    const { value } = e.target;

                    const newFilterData = {
                      ...filterData,
                      lastName_contains: value?.trim(),
                    };

                    setFilterData(newFilterData);
                    debouncedHandleFirstNameSearchChange(newFilterData);
                  }}
                />
                <div
                  className={styles.radio_buttons}
                  data-testid="usertypelist"
                >
                  <Form.Check
                    type="radio"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                    inline
                    id="userslist"
                    value="userslist"
                    name="displaylist"
                    data-testid="users"
                    defaultChecked={state == 2 ? true : false}
                    onClick={(): void => {
                      setState(2);
                    }}
<<<<<<< HEAD
                  >
                    <Form.Label htmlFor="userslist">{t('users')}</Form.Label>
                  </Dropdown.Item>
                  <Dropdown.Item
=======
                  />
                  <label htmlFor="userslist">{t('users')}</label>
                  <Form.Check
                    type="radio"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                    inline
                    id="memberslist"
                    value="memberslist"
                    name="displaylist"
                    data-testid="members"
                    defaultChecked={state == 0 ? true : false}
                    onClick={(): void => {
                      setState(0);
                    }}
<<<<<<< HEAD
                  >
                    <label htmlFor="memberslist">{t('members')}</label>
                  </Dropdown.Item>
                  <Dropdown.Item
=======
                  />
                  <label htmlFor="memberslist">{t('members')}</label>
                  <Form.Check
                    type="radio"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                    inline
                    id="adminslist"
                    value="adminslist"
                    name="displaylist"
                    data-testid="admins"
                    defaultChecked={state == 1 ? true : false}
                    onClick={(): void => {
                      setState(1);
                    }}
<<<<<<< HEAD
                  >
                    <label htmlFor="adminslist">{t('admins')}</label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className={styles.btnsBlock}>
              <AddMember></AddMember>
            </div>
          </div>
        </div>
      </Row>
      {((state == 0 && memberData) ||
        (state == 1 && adminData) ||
        (state == 2 && usersData)) && (
        <div className="datatable">
          <DataGrid
            disableColumnMenu
            columnBuffer={5}
            hideFooter={true}
            className={`${styles.datagrid}`}
            getRowId={(row) => row._id}
            components={{
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  Nothing Found !!
                </Stack>
              ),
            }}
            sx={{
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
              '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-row.Mui-hovered': {
                backgroundColor: 'transparent',
              },
            }}
            getRowClassName={() => `${styles.rowBackground}`}
            autoHeight
            rowHeight={70}
            rows={
              state === 0
                ? memberData.organizationsMemberConnection.edges
                : state === 1
                  ? adminData.organizationsMemberConnection.edges
                  : convertObject(usersData)
            }
            columns={columns}
            isRowSelectable={() => false}
          />
        </div>
      )}
      {showRemoveModal && selectedMemId && (
        <OrgPeopleListCard
          id={selectedMemId}
          toggleRemoveModal={toggleRemoveModal}
        />
      )}
      {showRemoveModal && selectedAdminId && (
        <OrgAdminListCard
          id={selectedAdminId}
          toggleRemoveModal={toggleRemoveModal}
        />
      )}
=======
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
      </OrganizationScreen>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </>
  );
}

export default organizationPeople;
<<<<<<< HEAD

// This code is used to remove 'user' object from the array index of userData and directly use store the properties at array index, this formatting is needed for DataGrid.

interface InterfaceUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  createdAt: string;
}
interface InterfaceOriginalObject {
  users: { user: InterfaceUser }[];
}
interface InterfaceConvertedObject {
  users: InterfaceUser[];
}
function convertObject(original: InterfaceOriginalObject): InterfaceUser[] {
  const convertedObject: InterfaceConvertedObject = {
    users: [],
  };
  original.users.forEach((item) => {
    convertedObject.users.push({
      firstName: item.user?.firstName,
      lastName: item.user?.lastName,
      email: item.user?.email,
      image: item.user?.image,
      createdAt: item.user?.createdAt,
      _id: item.user?._id,
    });
  });
  return convertedObject.users;
}
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
