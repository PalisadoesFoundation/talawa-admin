import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import { CircularProgress } from '@mui/material';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { BLOCK_PAGE_MEMBER_LIST } from 'GraphQl/Queries/Queries';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import PaginationList from 'components/PaginationList/PaginationList';
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const currentUrl = window.location.href.split('=')[1];

  const [membersData, setMembersData] = useState<InterfaceMember[]>([]);
  const [state, setState] = useState(0);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const {
    data: memberData,
    loading: memberLoading,
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

    if (state === 0) {
      setMembersData(memberData?.organizationsMemberConnection.edges);
    } else {
      const blockUsers = memberData?.organizationsMemberConnection.edges.filter(
        (user: InterfaceMember) =>
          user.organizationsBlockedBy.some((org) => org._id === currentUrl)
      );

      setMembersData(blockUsers);
    }
  }, [state, memberData]);

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

  const handleSearch = (): void => {
    const filterData = {
      orgId: currentUrl,
      firstName_contains: firstNameRef.current?.value ?? '',
      lastName_contains: lastNameRef.current?.value ?? '',
    };

    memberRefetch(filterData);
  };

  const handleSearchDebounced = debounce(handleSearch);

  return (
    <>
      <OrganizationScreen screenName="Block/Unblock" title={t('title')}>
        <Row>
          <Col sm={3}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarsticky}>
                <h6 className={styles.searchtitle}>{t('searchByName')}</h6>
                <Form.Control
                  type="name"
                  id="firstName"
                  placeholder={t('searchFirstName')}
                  name="firstName_contains"
                  data-testid="searchByFirstName"
                  autoComplete="off"
                  onChange={handleSearchDebounced}
                  ref={firstNameRef}
                />

                <Form.Control
                  type="name"
                  id="lastName"
                  placeholder={t('searchLastName')}
                  name="lastName_contains"
                  data-testid="searchByLastName"
                  autoComplete="off"
                  onChange={handleSearchDebounced}
                  ref={lastNameRef}
                />

                <div
                  className={styles.radio_buttons}
                  data-testid="usertypelist"
                >
                  <Form.Check
                    id="allusers"
                    value="allusers"
                    name="displaylist"
                    type="radio"
                    data-testid="allusers"
                    defaultChecked={state == 0}
                    onClick={(): void => {
                      setState(0);
                    }}
                  />
                  <label htmlFor="allusers">{t('allMembers')}</label>

                  <Form.Check
                    id="blockedusers"
                    value="blockedusers"
                    name="displaylist"
                    data-testid="blockedusers"
                    type="radio"
                    defaultChecked={state == 1}
                    onClick={(): void => {
                      setState(1);
                    }}
                  />
                  <label htmlFor="blockedusers">{t('blockedUsers')}</label>
                </div>
              </div>
            </div>
          </Col>

          <Col sm={8}>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.logintitle}>{t('listOfUsers')}</p>
              </Row>
              {memberLoading ? (
                <div className={styles.loader}>
                  <CircularProgress />
                </div>
              ) : (
                <div className={styles.list_box}>
                  <div className="table-responsive">
                    <table
                      className={`table table-hover ${styles.userListTable}`}
                    >
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">{t('name')}</th>
                          <th scope="col">{t('email')}</th>
                          <th scope="col" className="text-center">
                            {t('block_unblock')}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          /* istanbul ignore next */
                          (rowsPerPage > 0
                            ? membersData.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                            : membersData
                          ).map((user, index: number) => {
                            return (
                              <tr key={user._id}>
                                <th scope="row">{page * 10 + (index + 1)}</th>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.email}</td>
                                <td className="text-center">
                                  {user.organizationsBlockedBy.some(
                                    (spam: any) => spam._id === currentUrl
                                  ) ? (
                                    <Button
                                      className="btn btn-danger"
                                      onClick={async (): Promise<void> => {
                                        await handleUnBlockUser(user._id);
                                      }}
                                      data-testid={`unBlockUser${user._id}`}
                                    >
                                      {t('unblock')}
                                    </Button>
                                  ) : (
                                    <Button
                                      className="btn btn-success"
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
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div>
                <table
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <tbody>
                    <tr>
                      <PaginationList
                        count={membersData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </OrganizationScreen>
    </>
  );
};

export default Requests;
