import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import { Search } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { BLOCK_PAGE_MEMBER_LIST } from 'GraphQl/Queries/Queries';
<<<<<<< HEAD
import TableLoader from 'components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './BlockUser.module.css';
import { useParams } from 'react-router-dom';
=======
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import TableLoader from 'components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';
import debounce from 'utils/debounce';
import { errorHandler } from 'utils/errorHandler';
import styles from './BlockUser.module.css';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

interface InterfaceMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationsBlockedBy: {
    _id: string;
    __typename: 'Organization';
  }[];
  __typename: 'User';
}

const Requests = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'blockUnblockUser',
  });

  document.title = t('title');
<<<<<<< HEAD
  const { orgId: currentUrl } = useParams();
  const [membersData, setMembersData] = useState<InterfaceMember[]>([]);
  const [searchByFirstName, setSearchByFirstName] = useState<boolean>(true);
  const [searchByName, setSearchByName] = useState<string>('');
  const [showBlockedMembers, setShowBlockedMembers] = useState<boolean>(true);
=======
  const currentUrl = window.location.href.split('=')[1];
  const [membersData, setMembersData] = useState<InterfaceMember[]>([]);
  const [searchByFirstName, setSearchByFirstName] = useState<boolean>(true);
  const [searchByName, setSearchByName] = useState<string>('');
  const [showBlockedMembers, setShowBlockedMembers] = useState<boolean>(false);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const {
    data: memberData,
    loading: loadingMembers,
    error: memberError,
    refetch: memberRefetch,
  } = useQuery(BLOCK_PAGE_MEMBER_LIST, {
    variables: {
      orgId: currentUrl,
      firstName_contains: '',
      lastName_contains: '',
    },
  });

  const [blockUser] = useMutation(BLOCK_USER_MUTATION);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION);

  useEffect(() => {
    if (!memberData) {
      setMembersData([]);
      return;
    }

    if (showBlockedMembers == false) {
      setMembersData(memberData?.organizationsMemberConnection.edges);
    } else {
      const blockUsers = memberData?.organizationsMemberConnection.edges.filter(
        (user: InterfaceMember) =>
<<<<<<< HEAD
          user.organizationsBlockedBy.some((org) => org._id === currentUrl),
=======
          user.organizationsBlockedBy.some((org) => org._id === currentUrl)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      );
      setMembersData(blockUsers);
    }
  }, [memberData, showBlockedMembers]);

  const handleBlockUser = async (userId: string): Promise<void> => {
    try {
      const { data } = await blockUser({
        variables: {
          userId,
          orgId: currentUrl,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('blockedSuccessfully'));
        memberRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleUnBlockUser = async (userId: string): Promise<void> => {
    try {
      const { data } = await unBlockUser({
        variables: {
          userId,
          orgId: currentUrl,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('Un-BlockedSuccessfully'));
        memberRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  if (memberError) {
    toast.error(memberError.message);
  }

<<<<<<< HEAD
  const handleSearch = (value: string): void => {
=======
  const handleSearch = (e: any): void => {
    const { value } = e.target;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    setSearchByName(value);
    memberRefetch({
      orgId: currentUrl,
      firstName_contains: searchByFirstName ? value : '',
      lastName_contains: searchByFirstName ? '' : value,
    });
  };

<<<<<<< HEAD
  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };

  const handleSearchByBtnClick = (): void => {
    const inputValue =
      (document.getElementById('searchBlockedUsers') as HTMLInputElement)
        ?.value || '';
    handleSearch(inputValue);
  };

=======
  const handleSearchDebounced = debounce(handleSearch);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const headerTitles: string[] = [
    '#',
    t('name'),
    t('email'),
    t('block_unblock'),
  ];

  return (
    <>
<<<<<<< HEAD
      <div>
=======
      <OrganizationScreen screenName="Block/Unblock" title={t('listOfUsers')}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
<<<<<<< HEAD
                id="searchBlockedUsers"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                className="bg-white"
                placeholder={
                  searchByFirstName
                    ? t('searchByFirstName')
                    : t('searchByLastName')
                }
                data-testid="searchByName"
                autoComplete="off"
                required
<<<<<<< HEAD
                onKeyUp={handleSearchByEnter}
=======
                onChange={handleSearchDebounced}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
<<<<<<< HEAD
                onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className={styles.btnsBlock}>
            <div className={styles.largeBtnsWrapper}>
              <Dropdown aria-expanded="false" title="Sort organizations">
                <Dropdown.Toggle variant="success" data-testid="userFilter">
                  <SortIcon className={'me-1'} />
                  {showBlockedMembers ? t('blockedUsers') : t('allMembers')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={!showBlockedMembers}
                    data-testid="showMembers"
                    onClick={(): void => setShowBlockedMembers(false)}
                  >
                    {t('allMembers')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={showBlockedMembers}
                    data-testid="showBlockedMembers"
                    onClick={(): void => setShowBlockedMembers(true)}
                  >
                    {t('blockedUsers')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown aria-expanded="false">
                <Dropdown.Toggle variant="success" data-testid="nameFilter">
                  <SortIcon className={'me-1'} />
                  {searchByFirstName
                    ? t('searchByFirstName')
                    : t('searchByLastName')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={searchByFirstName}
                    data-testid="searchByFirstName"
                    onClick={(): void => setSearchByFirstName(true)}
                  >
                    {t('searchByFirstName')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={!searchByFirstName}
                    data-testid="searchByLastName"
                    onClick={(): void => setSearchByFirstName(false)}
                  >
                    {t('searchByLastName')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        {/* Table */}
        {loadingMembers == false &&
        membersData.length === 0 &&
        searchByName.length > 0 ? (
          <div className={styles.notFound}>
            <h4>
              {t('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : loadingMembers == false && membersData.length === 0 ? (
          <div className={styles.notFound}>
            <h4>{t('noSpammerFound')}</h4>
          </div>
        ) : (
          <div className={styles.listBox}>
            {loadingMembers ? (
              <TableLoader headerTitles={headerTitles} noOfRows={10} />
            ) : (
              <Table responsive data-testid="userList">
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
                  {membersData.map((user, index: number) => {
                    return (
                      <tr key={user._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.organizationsBlockedBy.some(
<<<<<<< HEAD
                            (spam: any) => spam._id === currentUrl,
=======
                            (spam: any) => spam._id === currentUrl
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                          ) ? (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={async (): Promise<void> => {
                                await handleUnBlockUser(user._id);
                              }}
                              data-testid={`unBlockUser${user._id}`}
                            >
                              {t('unblock')}
                            </Button>
                          ) : (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={async (): Promise<void> => {
                                await handleBlockUser(user._id);
                              }}
                              data-testid={`blockUser${user._id}`}
                            >
                              {t('block')}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        )}
<<<<<<< HEAD
      </div>
=======
      </OrganizationScreen>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </>
  );
};

export default Requests;
