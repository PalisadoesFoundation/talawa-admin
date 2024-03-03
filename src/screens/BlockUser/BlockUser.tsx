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
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import TableLoader from 'components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';
import debounce from 'utils/debounce';
import { errorHandler } from 'utils/errorHandler';
import styles from './BlockUser.module.css';

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
  const currentUrl = window.location.href.split('=')[1];
  const [membersData, setMembersData] = useState<InterfaceMember[]>([]);
  const [searchByFirstName, setSearchByFirstName] = useState<boolean>(true);
  const [searchByName, setSearchByName] = useState<string>('');
  const [showBlockedMembers, setShowBlockedMembers] = useState<boolean>(false);

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
          user.organizationsBlockedBy.some((org) => org._id === currentUrl)
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
    const regex = /\{ _id: 'undefined' \}/;
    const isIdNotFound = regex.test(memberError?.message);
    if (isIdNotFound) toast.error('Id not found');
    else toast.error(memberError?.message);
  }

  const handleSearch = (e: any): void => {
    const { value } = e.target;
    setSearchByName(value);
    memberRefetch({
      orgId: currentUrl,
      firstName_contains: searchByFirstName ? value : '',
      lastName_contains: searchByFirstName ? '' : value,
    });
  };

  const handleSearchDebounced = debounce(handleSearch);
  const headerTitles: string[] = [
    '#',
    t('name'),
    t('email'),
    t('block_unblock'),
  ];

  return (
    <>
      <OrganizationScreen screenName="Block/Unblock" title={t('listOfUsers')}>
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                className="bg-white"
                placeholder={
                  searchByFirstName
                    ? t('searchByFirstName')
                    : t('searchByLastName')
                }
                data-testid="searchByName"
                autoComplete="off"
                required
                onChange={handleSearchDebounced}
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
                            (spam: any) => spam._id === currentUrl
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
      </OrganizationScreen>
    </>
  );
};

export default Requests;
