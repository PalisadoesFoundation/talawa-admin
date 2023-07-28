import React, { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import styles from './Requests.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import {
  ACCPET_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import PaginationList from 'components/PaginationList/PaginationList';
import { errorHandler } from 'utils/errorHandler';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Search } from '@mui/icons-material';
import type {
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';

const Requests = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });

  document.title = t('title');

  const [usersData, setUsersData] = useState([]);
  const [searchByName, setSearchByName] = useState('');

  const [acceptAdminFunc] = useMutation(ACCPET_ADMIN_MUTATION);
  const [rejectAdminFunc] = useMutation(REJECT_ADMIN_MUTATION);
  const {
    data: currentUserData,
    error: errorUser,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const {
    data: userData,
    loading: loadingUsers,
    error: errorUsersList,
    refetch,
  } = useQuery(USER_LIST);

  const {
    data: dataOrgs,
    error: errorOrgs,
  }: {
    data: InterfaceOrgConnectionType | undefined;
    error?: Error;
  } = useQuery(ORGANIZATION_CONNECTION_LIST);

  // If the user is not Superadmin, redirect to Organizations screen
  useEffect(() => {
    const userType = localStorage.getItem('UserType');
    if (userType != 'SUPERADMIN') {
      window.location.assign('/orglist');
    }
  }, []);

  // Check if there are no organizations then show a warning
  useEffect(() => {
    if (!dataOrgs) {
      return;
    }
    if (dataOrgs.organizationsConnection.length === 0) {
      toast.warning(t('noOrgError'));
    }
  }, [dataOrgs]);

  useEffect(() => {
    if (userData) {
      setUsersData(
        userData.users.filter(
          (user: any) =>
            user.userType === 'ADMIN' && user.adminApproved === false
        )
      );
    }
  }, [userData]);

  const accpetAdmin = async (userId: any): Promise<void> => {
    try {
      const { data } = await acceptAdminFunc({
        variables: {
          id: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('userApproved'));
        setUsersData(usersData.filter((user: any) => user._id !== userId));
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const rejectAdmin = async (userId: any): Promise<void> => {
    try {
      const { data } = await rejectAdminFunc({
        variables: {
          id: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('userRejected'));
        setUsersData(usersData.filter((user: any) => user._id !== userId));
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleSearchByName = (e: any): any => {
    const { value } = e.target;
    setSearchByName(value);

    refetch({
      filter: searchByName,
    });
  };

  return (
    <>
      <SuperAdminScreen data={currentUserData} title={t('requests')}>
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.inputContainer}>
            <div
              className={styles.input}
              style={{
                display:
                  currentUserData &&
                  currentUserData.user.userType === 'SUPERADMIN'
                    ? 'block'
                    : 'none',
              }}
            >
              <Form.Control
                type="name"
                className="bg-white"
                placeholder={t('enterName')}
                data-testid="searchByName"
                autoComplete="off"
                required
                onChange={handleSearchByName}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className={styles.btnsBlock}>
            <div className="d-flex">
              <Dropdown aria-expanded="false" title="Sort organizations">
                <Dropdown.Toggle variant="outline-success">
                  <SortIcon className={'me-1'} />
                  Sort
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown aria-expanded="false" title="Filter organizations">
                <Dropdown.Toggle variant="outline-success">
                  <FilterListIcon className={'me-1'} />
                  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        {loadingUsers ? (
          <div className={styles.notFound}>
            <h4>Loading requests ...</h4>
          </div>
        ) : usersData.length === 0 ? (
          <div className={styles.notFound}>
            <h4>No Pending Requests</h4>
          </div>
        ) : (
          <div className={styles.listBox}>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('accept')}</th>
                  <th>{t('reject')}</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map(
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
                        <td>{index + 1}</td>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button
                            className="btn btn-success btn-sm"
                            onClick={async (): Promise<void> => {
                              await accpetAdmin(user._id);
                            }}
                            data-testid={`acceptUser${user._id}`}
                          >
                            {t('accept')}
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn btn-danger btn-sm"
                            onClick={async (): Promise<void> => {
                              await rejectAdmin(user._id);
                            }}
                            data-testid={`rejectUser${user._id}`}
                          >
                            {t('reject')}
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          </div>
        )}
      </SuperAdminScreen>
    </>
  );
};

export default Requests;
