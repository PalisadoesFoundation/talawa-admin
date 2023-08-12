import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Search } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import {
  ACCEPT_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import debounce from 'utils/debounce';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
import styles from './Requests.module.css';
import TableLoader from 'components/TableLoader/TableLoader';

const Requests = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });

  document.title = t('title');

  const [usersData, setUsersData] = useState([]);
  const [searchByName, setSearchByName] = useState('');

  const [acceptAdminFunc] = useMutation(ACCEPT_ADMIN_MUTATION);
  const [rejectAdminFunc] = useMutation(REJECT_ADMIN_MUTATION);
  const {
    data: currentUserData,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const {
    data: dataUsers,
    loading: loadingUsers,
    refetch: refetchUsers,
  } = useQuery(USER_LIST, {
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: dataOrgs,
  }: {
    data: InterfaceOrgConnectionType | undefined;
    error?: Error;
  } = useQuery(ORGANIZATION_CONNECTION_LIST);

  // To clear the search when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

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

  // Set the usersData to the users that are not approved yet after every api call
  useEffect(() => {
    if (dataUsers) {
      setUsersData(
        dataUsers.users.filter(
          (user: any) =>
            user.userType === 'ADMIN' && user.adminApproved === false
        )
      );
    }
  }, [dataUsers]);

  const acceptAdmin = async (userId: any): Promise<void> => {
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
    refetchUsers({
      firstName_contains: value,
      lastName_contains: '',
      // Later on we can add several search and filter options
    });
  };

  const debouncedHandleSearchByName = debounce(handleSearchByName);

  const headerTitles: string[] = [
    '#',
    t('name'),
    t('email'),
    t('accept'),
    t('reject'),
  ];

  return (
    <>
      <SuperAdminScreen title={t('requests')} screenName="Requests">
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
                onChange={debouncedHandleSearchByName}
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
                  {t('sort')}
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
                  {t('filter')}
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
        {loadingUsers == false &&
        usersData.length === 0 &&
        searchByName.length > 0 ? (
          <div className={styles.notFound}>
            <h4>
              {t('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : loadingUsers == false && usersData.length === 0 ? (
          <div className={styles.notFound}>
            <h4>{t('noRequestFound')}</h4>
          </div>
        ) : (
          <div className={styles.listBox}>
            {loadingUsers ? (
              <TableLoader headerTitles={headerTitles} noOfRows={10} />
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    {headerTitles.map((title: string, index: number) => {
                      return (
                        <th key={index} scope="col">
                          {title}
                        </th>
                      );
                    })}
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
                          <th scope="row">{index + 1}</th>
                          <td>{`${user.firstName} ${user.lastName}`}</td>
                          <td>{user.email}</td>
                          <td>
                            <Button
                              className="btn btn-success btn-sm"
                              onClick={async (): Promise<void> => {
                                await acceptAdmin(user._id);
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
            )}
          </div>
        )}
      </SuperAdminScreen>
    </>
  );
};

export default Requests;
