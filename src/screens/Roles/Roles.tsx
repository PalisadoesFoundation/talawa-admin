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
import styles from './Roles.module.css';
import type { InterfaceUserType } from 'utils/interfaces';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';

const Roles = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'roles' });

  document.title = t('title');

  const [componentLoader, setComponentLoader] = useState(true);
  const [searchByName, setSearchByName] = useState('');
  const [count, setCount] = useState(0);

  const userType = localStorage.getItem('UserType');
  const userId = localStorage.getItem('id');
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
    loading: loadingUsers,
    data: userData,
    refetch: userRefetch,
  } = useQuery(USER_LIST);

  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const { data: dataOrgs } = useQuery(ORGANIZATION_CONNECTION_LIST);

  // To search by name
  useEffect(() => {
    if (searchByName !== '') {
      userRefetch({
        firstName_contains: searchByName,
      });
    } else {
      if (count !== 0) {
        userRefetch({
          firstName_contains: searchByName,
        });
      }
    }
  }, [count, searchByName]);

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
    setComponentLoader(false);
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
        userRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleSearchByName = (e: any): void => {
    const { value } = e.target;
    setSearchByName(value);
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <SuperAdminScreen data={currentUserData} title={'Roles'}>
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
        ) : userData && userData.users.length === 0 ? (
          <div className={styles.notFound}>
            <h4>No User Found</h4>
          </div>
        ) : (
          <div className={styles.listBox}>
            <Table responsive>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t('name')}</th>
                  <th scope="col">{t('email')}</th>
                  <th scope="col">{t('roles_userType')}</th>
                </tr>
              </thead>
              <tbody>
                {userData &&
                  userData?.users.map(
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
                              className="form-control"
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
          </div>
        )}
      </SuperAdminScreen>
    </>
  );
};

export default Roles;
