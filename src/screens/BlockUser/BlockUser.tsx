import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState, useCallback } from 'react';
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
import TableLoader from 'components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './BlockUser.module.css';
import { useParams } from 'react-router-dom';

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

/**
 * Requests component displays and manages a list of users that can be blocked or unblocked.
 *
 * This component allows users to search for members by their first name or last name,
 * toggle between viewing blocked and all members, and perform block/unblock operations.
 *
 * @returns JSX.Element - The `Requests` component.
 *
 * @example
 * ```tsx
 * <Requests />
 * ```
 */
const Requests = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'blockUnblockUser',
  });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title'); // Set document title
  const { orgId: currentUrl } = useParams(); // Get current organization ID from URL

  // State hooks
  const [membersData, setMembersData] = useState<InterfaceMember[]>([]);
  const [searchByFirstName, setSearchByFirstName] = useState<boolean>(true);
  const [searchByName, setSearchByName] = useState<string>('');
  const [showBlockedMembers, setShowBlockedMembers] = useState<boolean>(true);

  // Query to fetch members list
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

  // Mutations for blocking and unblocking users
  const [blockUser] = useMutation(BLOCK_USER_MUTATION);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION);

  // Effect to update member data based on filters and data changes
  useEffect(() => {
    if (!memberData) {
      setMembersData([]);
      return;
    }

    if (!showBlockedMembers) {
      setMembersData(memberData?.organizationsMemberConnection.edges || []);
    } else {
      const blockUsers = memberData?.organizationsMemberConnection.edges.filter(
        (user: InterfaceMember) =>
          user.organizationsBlockedBy.some((org) => org._id === currentUrl),
      );
      setMembersData(blockUsers || []);
    }
  }, [memberData, showBlockedMembers, currentUrl]);

  // Handler for blocking a user
  const handleBlockUser = useCallback(
    async (userId: string): Promise<void> => {
      try {
        const { data } = await blockUser({
          variables: {
            userId,
            orgId: currentUrl,
          },
        });
        /* istanbul ignore next */
        if (data) {
          toast.success(t('blockedSuccessfully') as string);
          memberRefetch();
        }
      } catch (error: unknown) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    },
    [blockUser, currentUrl, memberRefetch, t],
  );

  // Handler for unblocking a user
  const handleUnBlockUser = useCallback(
    async (userId: string): Promise<void> => {
      try {
        const { data } = await unBlockUser({
          variables: {
            userId,
            orgId: currentUrl,
          },
        });
        /* istanbul ignore next */
        if (data) {
          toast.success(t('Un-BlockedSuccessfully') as string);
          memberRefetch();
        }
      } catch (error: unknown) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    },
    [unBlockUser, currentUrl, memberRefetch, t],
  );

  // Display error if member query fails
  useEffect(() => {
    if (memberError) {
      toast.error(memberError.message);
    }
  }, [memberError]);

  // Search handler
  const handleSearch = useCallback(
    (value: string): void => {
      setSearchByName(value);
      memberRefetch({
        orgId: currentUrl,
        firstName_contains: searchByFirstName ? value : '',
        lastName_contains: searchByFirstName ? '' : value,
      });
    },
    [searchByFirstName, memberRefetch, currentUrl],
  );

  // Search by Enter key
  const handleSearchByEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        const { value } = e.currentTarget;
        handleSearch(value);
      }
    },
    [handleSearch],
  );

  // Search button click handler
  const handleSearchByBtnClick = useCallback((): void => {
    const inputValue = searchByName;
    handleSearch(inputValue);
  }, [handleSearch, searchByName]);

  // Header titles for the table
  const headerTitles: string[] = [
    '#',
    tCommon('name'),
    tCommon('email'),
    t('block_unblock'),
  ];

  return (
    <>
      <div>
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchBlockedUsers"
                className="bg-white"
                placeholder={
                  searchByFirstName
                    ? t('searchByFirstName')
                    : t('searchByLastName')
                }
                data-testid="searchByName"
                autoComplete="off"
                required
                value={searchByName}
                onChange={(e) => setSearchByName(e.target.value)}
                onKeyUp={handleSearchByEnter}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className={styles.btnsBlock}>
            <div className={styles.largeBtnsWrapper}>
              {/* Dropdown for filtering members */}
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
              {/* Dropdown for sorting by name */}
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
        {loadingMembers === false &&
        membersData.length === 0 &&
        searchByName.length > 0 ? (
          <div className={styles.notFound}>
            <h4>
              {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : loadingMembers === false && membersData.length === 0 ? (
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
                            (spam) => spam._id === currentUrl,
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
      </div>
    </>
  );
};

export default Requests;
