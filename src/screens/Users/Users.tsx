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
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import { errorHandler } from 'utils/errorHandler';
import styles from './Users.module.css';
import type { InterfaceUserType } from 'utils/interfaces';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';
import debounce from 'utils/debounce';
import TableLoader from 'components/TableLoader/TableLoader';

const Users = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });

  document.title = t('title');

  const [searchByName, setSearchByName] = useState('');

  const userType = localStorage.getItem('UserType');
  const userId = localStorage.getItem('id');
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

  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const { data: dataOrgs } = useQuery(ORGANIZATION_CONNECTION_LIST);

  // To clear the search when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  // Warn if there is no organization
  useEffect(() => {
    if (!dataOrgs) {
      return;
    }

    if (dataOrgs.organizationsConnection.length === 0) {
      toast.warning(t('noOrgError'));
    }
  }, [dataOrgs]);

  // Send to orgList page if user is not superadmin
  useEffect(() => {
    if (userType != 'SUPERADMIN') {
      window.location.assign('/orglist');
    }
  }, []);

  const changeRole = async (e: any): Promise<void> => {
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
        toast.success(t('roleUpdated'));
        refetchUsers();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleSearchByName = (e: any): void => {
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
    t('roles_userType'),
  ];

  return (
    <>
      <SuperAdminScreen title={t('users')} screenName="Users">
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
        dataUsers &&
        dataUsers.users.length === 0 &&
        searchByName.length > 0 ? (
          <div className={styles.notFound}>
            <h4>
              {t('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : loadingUsers == false &&
          dataUsers &&
          dataUsers.users.length === 0 ? (
          // eslint-disable-next-line react/jsx-indent
          <div className={styles.notFound}>
            <h4>{t('noUserFound')}</h4>
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
                  {dataUsers &&
                    dataUsers?.users.map(
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
                              <select
                                className="form-select"
                                name={`role${user._id}`}
                                data-testid={`changeRole${user._id}`}
                                onChange={changeRole}
                                disabled={user._id === userId}
                                defaultValue={`${user.userType}?${user._id}`}
                              >
                                <option value={`ADMIN?${user._id}`}>
                                  {t('admin')}
                                </option>
                                <option value={`SUPERADMIN?${user._id}`}>
                                  {t('superAdmin')}
                                </option>
                                <option value={`USER?${user._id}`}>
                                  {t('user')}
                                </option>
                              </select>
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

export default Users;
