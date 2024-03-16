import { useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationPeople.module.css';
import { toast } from 'react-toastify';
import { Search, Sort } from '@mui/icons-material';
import Loader from 'components/Loader/Loader';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import AddMember from './AddMember';

function organizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

  const location = useLocation();
  const role = location?.state;

  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(role?.role || 0);

  const [filterData, setFilterData] = useState({
    firstName_contains: '',
    lastName_contains: '',
  });

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
  if (memberLoading || usersLoading || adminLoading) {
    return (
      <div className={styles.mainpageright}>
        <Loader />
      </div>
    );
  }

  const handleFullNameSearchChange = (e: any): void => {
    /* istanbul ignore next */
    if (e.key === 'Enter') {
      const [firstName, lastName] = e.target.value.split(' ');

      const newFilterData = {
        firstName_contains: firstName ?? '',
        lastName_contains: lastName ?? '',
      };

      setFilterData(newFilterData);

      if (state === 0) {
        memberRefetch({
          ...newFilterData,
          orgId: currentUrl,
        });
      } else if (state === 1) {
        adminRefetch({
          ...newFilterData,
          orgId: currentUrl,
          admin_for: currentUrl,
        });
      } else {
        usersRefetch({
          ...newFilterData,
        });
      }
    }
  };
  const columns: GridColDef[] = [
    {
      field: 'profile',
      headerName: 'Profile',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: any): any => {
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
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: any): any => {
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
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: any): any => {
        return dayjs(params.row.createdAt).format('DD/MM/YYYY');
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: any): any => {
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
              <Form.Control
                type="name"
                id="searchLastName"
                placeholder={t('searchFullName')}
                autoComplete="off"
                required
                className={styles.inputField}
                onKeyUp={handleFullNameSearchChange}
              />
              <Button
                className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
                onClick={handleFullNameSearchChange}
                style={{ marginBottom: '10px' }}
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown>
                <Dropdown.Toggle
                  defaultValue="members"
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
                    inline
                    id="userslist"
                    value="userslist"
                    name="displaylist"
                    data-testid="users"
                    defaultChecked={state == 2 ? true : false}
                    onClick={(): void => {
                      setState(2);
                    }}
                  >
                    <Form.Label htmlFor="userslist">{t('users')}</Form.Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="memberslist"
                    value="memberslist"
                    name="displaylist"
                    data-testid="members"
                    defaultChecked={state == 0 ? true : false}
                    onClick={(): void => {
                      setState(0);
                    }}
                  >
                    <label htmlFor="memberslist">{t('members')}</label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="adminslist"
                    value="adminslist"
                    name="displaylist"
                    data-testid="admins"
                    defaultChecked={state == 1 ? true : false}
                    onClick={(): void => {
                      setState(1);
                    }}
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
                  : usersData.users
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
    </>
  );
}

export default organizationPeople;
