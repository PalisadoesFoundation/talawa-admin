import { useLazyQuery } from '@apollo/client';
import { Search, Sort } from '@mui/icons-material';
import {
  ORGANIZATIONS_LIST,
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

/**
 * OrganizationPeople component is used to display the list of members, admins and users of the organization.
 * It also provides the functionality to search the members, admins and users by their full name.
 * It also provides the functionality to remove the members and admins from the organization.
 * @returns JSX.Element which contains the list of members, admins and users of the organization.
 */
function organizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

  const location = useLocation();
  const role = location?.state;

  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(role?.role || 0);

  const [filterData, setFilterData] = useState({
    firstName_contains: '',
    lastName_contains: '',
  });
  const [adminFilteredData, setAdminFilteredData] = useState();

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
  } = useLazyQuery(ORGANIZATIONS_LIST, {
    variables: {
      id: currentUrl,
    },
  })[1];

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: usersRefetch,
  } = useLazyQuery(USER_LIST_FOR_TABLE, {
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
        id: currentUrl,
      });
      setAdminFilteredData(adminData?.organizations[0].admins);
    } else {
      usersRefetch({
        ...filterData,
      });
    }
  }, [state, adminData]);

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
        orgId: currentUrl,
      });
    } else if (state === 1) {
      const filterData = adminData.organizations[0].admins.filter(
        (value: {
          _id: string;
          firstName: string;
          lastName: string;
          createdAt: string;
        }) => {
          return (value.firstName + value.lastName)
            .toLowerCase()
            .includes(userName.toLowerCase());
        },
      );
      setAdminFilteredData(filterData);
    } else {
      usersRefetch({
        ...newFilterData,
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'profile',
      headerName: tCommon('profile'),
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
      headerName: tCommon('name'),
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
      headerName: tCommon('email'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
    },
    {
      field: 'joined',
      headerName: tCommon('joined'),
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
      headerName: tCommon('action'),
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
            {tCommon('remove')}
          </Button>
        ) : (
          <Button
            onClick={() => toggleRemoveMemberModal(params.row._id)}
            data-testid="removeMemberModalBtn"
          >
            {tCommon('remove')}
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
                    d-inline
                    id="userslist"
                    data-value="userslist"
                    data-name="displaylist"
                    data-testid="users"
                    defaultChecked={state == 2 ? true : false}
                    onClick={(): void => {
                      setState(2);
                    }}
                  >
                    <Form.Label htmlFor="userslist">
                      {tCommon('users')}
                    </Form.Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    d-inline
                    id="memberslist"
                    data-value="memberslist"
                    data-name="displaylist"
                    data-testid="members"
                    defaultChecked={state == 0 ? true : false}
                    onClick={(): void => {
                      setState(0);
                    }}
                  >
                    <label htmlFor="memberslist">{tCommon('members')}</label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    d-inline
                    id="adminslist"
                    data-value="adminslist"
                    data-name="displaylist"
                    data-testid="admins"
                    defaultChecked={state == 1 ? true : false}
                    onClick={(): void => {
                      setState(1);
                    }}
                  >
                    <label htmlFor="adminslist">{tCommon('admins')}</label>
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
        (state == 1 && adminFilteredData) ||
        (state == 2 && usersData)) && (
        <div className="datatable">
          <DataGrid
            disableColumnMenu
            columnBufferPx={5}
            hideFooter={true}
            className={`${styles.datagrid}`}
            getRowId={(row) => row._id}
            slots={{
              noRowsOverlay: () => (
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
                  ? adminFilteredData
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
    </>
  );
}

export default organizationPeople;

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
