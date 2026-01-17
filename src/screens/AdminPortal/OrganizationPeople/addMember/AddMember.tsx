/**
 * Component: AddMember
 *
 * This component allows users to add members to an organization. It provides two options:
 * 1. Adding an existing user from the user list.
 * 2. Creating a new user and adding them to the organization.
 *
 * @returns JSX.Element - The rendered AddMember component.
 */
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Check, Close } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  CREATE_MEMBER_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_BASIC_DATA,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import Avatar from 'shared-components/Avatar/Avatar';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import PageHeader from 'shared-components/Navbar/Navbar';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import styles from './AddMember.module.css';
import type { IEdge, IQueryVariable, IUserDetails } from './types';
import { OrganizationMembershipRole } from './types';

function AddMember(): JSX.Element {
  const { t: translateOrgPeople } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: translateAddMember } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    document.title = translateOrgPeople('title');
  }, [translateOrgPeople]);

  const [addUserModalisOpen, setAddUserModalIsOpen] = useState(false);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const mapPageToCursor = useRef<Record<number, string>>({});
  const backwardMapPageToCursor = useRef<Record<number, string>>({});
  const responsePageRef = useRef<number>(0);

  const resetPagination = useCallback(() => {
    mapPageToCursor.current = {};
    backwardMapPageToCursor.current = {};
    setPage(0);
    responsePageRef.current = 0;
    setPaginationMeta({ hasNextPage: false, hasPreviousPage: false });
  }, []);

  const [
    fetchUsers,
    { loading: userLoading, error: userError, data: userData },
  ] = useLazyQuery(USER_LIST_FOR_TABLE, {
    variables: { first: PAGE_SIZE, after: null, last: null, before: null },
  });

  const openAddUserModal = () => setAddUserModalIsOpen(true);

  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName('');
  }, [addUserModalisOpen]);

  const toggleDialogModal = (): void =>
    setAddUserModalIsOpen(!addUserModalisOpen);

  const [createNewUserModalisOpen, setCreateNewUserModalIsOpen] =
    useState(false);
  const openCreateNewUserModal = () => setCreateNewUserModalIsOpen(true);
  const closeCreateNewUserModal = () => setCreateNewUserModalIsOpen(false);

  const [addMember] = useMutation(CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG);
  const { orgId: currentUrl } = useParams();

  const createMember = async (userId: string): Promise<void> => {
    try {
      await addMember({
        variables: {
          memberId: userId,
          organizationId: currentUrl,
          role: 'regular',
        },
      });
      NotificationToast.success(
        tCommon('addedSuccessfully', { item: 'Member' }) as string,
      );
    } catch (error: unknown) {
      errorHandler(tCommon, error);
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  const {
    data: organizationData,
  }: { data?: { organization: InterfaceQueryOrganizationsListObject } } =
    useQuery(GET_ORGANIZATION_BASIC_DATA, { variables: { id: currentUrl } });

  const [registerMutation] = useMutation(CREATE_MEMBER_PG);
  const [createUserVariables, setCreateUserVariables] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleCreateUser = async (): Promise<void> => {
    if (
      !(
        createUserVariables.email &&
        createUserVariables.password &&
        createUserVariables.name
      )
    ) {
      NotificationToast.error(
        translateOrgPeople('invalidDetailsMessage') as string,
      );
    } else if (
      createUserVariables.password !== createUserVariables.confirmPassword
    ) {
      NotificationToast.error(translateOrgPeople('passwordNotMatch') as string);
    } else {
      try {
        const registeredUser = await registerMutation({
          variables: {
            name: createUserVariables.name,
            email: createUserVariables.email,
            password: createUserVariables.password,
            role: OrganizationMembershipRole.REGULAR,
            isEmailAddressVerified: true,
          },
        });
        const createdUserId = registeredUser?.data.createUser.user.id;
        await createMember(createdUserId);
        closeCreateNewUserModal();
        setCreateUserVariables({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (error: unknown) {
        errorHandler(translateOrgPeople, error);
      }
    }
  };

  const handleFirstName = (val: string): void => {
    setCreateUserVariables((prev) => ({ ...prev, name: val }));
  };
  const handleEmailChange = (val: string): void => {
    setCreateUserVariables((prev) => ({ ...prev, email: val }));
  };
  const handlePasswordChange = (val: string): void => {
    setCreateUserVariables((prev) => ({ ...prev, password: val }));
  };
  const handleConfirmPasswordChange = (val: string): void => {
    setCreateUserVariables((prev) => ({ ...prev, confirmPassword: val }));
  };

  const handleUserModalSearchChange = (searchTerm: string): void => {
    resetPagination();
    const variables = {
      first: PAGE_SIZE,
      where: searchTerm ? { name: searchTerm } : null,
      after: null,
      last: null,
      before: null,
    };
    fetchUsers({ variables });
  };

  const handleSortChange = (value: string): void => {
    if (value === 'existingUser') {
      openAddUserModal();
    } else if (value === 'newUser') {
      openCreateNewUserModal();
    }
  };

  useEffect(() => {
    if (addUserModalisOpen) {
      resetPagination();
      fetchUsers({
        variables: { first: PAGE_SIZE, after: null, last: null, before: null },
      });
    }
  }, [currentUrl, addUserModalisOpen, fetchUsers, resetPagination]);

  useEffect(() => {
    if (userData?.allUsers) {
      const { pageInfo } = userData.allUsers;
      const pageIndex = responsePageRef.current;
      if (pageInfo.endCursor) {
        mapPageToCursor.current[pageIndex + 1] = pageInfo.endCursor;
      }
      if (pageIndex > 0 && pageInfo.startCursor) {
        backwardMapPageToCursor.current[pageIndex - 1] = pageInfo.startCursor;
      }
      setPaginationMeta({
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.hasPreviousPage,
      });
    }
  }, [userData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    const isForwardNavigation = newPage > page;
    if (isForwardNavigation && !paginationMeta.hasNextPage) return;
    if (!isForwardNavigation && !paginationMeta.hasPreviousPage) return;
    const variables: IQueryVariable = {};
    if (isForwardNavigation) {
      const afterCursor = mapPageToCursor.current[newPage];
      if (!afterCursor) return;
      variables.first = PAGE_SIZE;
      variables.after = afterCursor;
      variables.last = null;
      variables.before = null;
    } else {
      const beforeCursor = backwardMapPageToCursor.current[newPage];
      if (!beforeCursor) return;
      variables.last = PAGE_SIZE;
      variables.before = beforeCursor;
      variables.first = null;
      variables.after = null;
    }
    setPage(newPage);
    responsePageRef.current = newPage;
    fetchUsers({ variables });
  };

  const allUsersData =
    userData?.allUsers?.edges?.map((edge: IEdge) => edge.node) || [];

  return (
    <>
      <PageHeader
        sorting={[
          {
            title: translateOrgPeople('addMembers'),
            options: [
              {
                label: translateOrgPeople('existingUser'),
                value: 'existingUser',
              },
              { label: translateOrgPeople('newUser'), value: 'newUser' },
            ],
            selected: translateOrgPeople('addMembers'),
            onChange: (value) => handleSortChange(value.toString()),
            testIdPrefix: 'addMembers',
          },
        ]}
      />
      <BaseModal
        dataTestId="addExistingUserModal"
        show={addUserModalisOpen}
        onHide={toggleDialogModal}
        className={styles.modalContent}
        title={translateOrgPeople('addMembers')}
        headerTestId="pluginNotificationHeader"
      >
        <div className={styles.input}>
          <SearchBar
            placeholder={translateOrgPeople('searchFullName')}
            value={userName}
            onChange={(value) => setUserName(value)}
            onSearch={handleUserModalSearchChange}
            onClear={() => {
              setUserName('');
              handleUserModalSearchChange('');
            }}
            inputTestId="searchUser"
            buttonTestId="submitBtn"
          />
        </div>
        <TableContainer component={Paper}>
          <Table aria-label={translateOrgPeople('users')}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeadCell}>#</TableCell>
                <TableCell align="center" className={styles.tableHeadCell}>
                  {translateAddMember('addMember.profile')}
                </TableCell>
                <TableCell align="center" className={styles.tableHeadCell}>
                  {translateAddMember('addMember.user')}
                </TableCell>
                <TableCell align="center" className={styles.tableHeadCell}>
                  {translateAddMember('addMember.addMember')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className={styles.tableBodyCell}
                  >
                    {tCommon('loading')}
                  </TableCell>
                </TableRow>
              ) : userError ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className={styles.tableBodyCell}
                  >
                    {translateAddMember('users.errorLoadingUsers')}
                  </TableCell>
                </TableRow>
              ) : allUsersData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className={styles.tableBodyCell}
                  >
                    {translateOrgPeople('notFound')}
                  </TableCell>
                </TableRow>
              ) : (
                allUsersData.map((userDetails: IUserDetails, index: number) => (
                  <TableRow
                    className={styles.tableRow}
                    data-testid="user"
                    key={userDetails.id}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className={styles.tableBodyCell}
                    >
                      {page * PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={styles.tableBodyCell}
                      data-testid="profileImage"
                    >
                      {userDetails.avatarURL ? (
                        <img
                          src={userDetails.avatarURL}
                          alt={`${userDetails.name} ${tCommon('avatar')}`}
                          className={styles.TableImage}
                          crossOrigin="anonymous"
                          loading="lazy"
                        />
                      ) : (
                        <Avatar
                          avatarStyle={styles.TableImage}
                          name={`${userDetails.name}`}
                          data-testid="avatarImage"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>
                      <Link
                        className={`${styles.membername} ${styles.subtleBlueGrey}`}
                        to={{ pathname: `/member/${currentUrl}` }}
                      >
                        {userDetails.name}
                        <br />
                        {userDetails.emailAddress}
                      </Link>
                    </TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>
                      <Button
                        onClick={() => {
                          createMember(userDetails.id);
                        }}
                        data-testid="addBtn"
                        className={styles.addButton}
                      >
                        <i className={'fa fa-plus me-2'} />
                        {translateAddMember('addMember.add')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={-1}
          rowsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[PAGE_SIZE]}
          backIconButtonProps={{
            disabled: !paginationMeta.hasPreviousPage,
            'aria-label': tCommon('previousPage'),
          }}
          nextIconButtonProps={{
            disabled: !paginationMeta.hasNextPage,
            'aria-label': tCommon('nextPage'),
          }}
          labelDisplayedRows={({ page }) =>
            tCommon('pageNumber', { page: page + 1 })
          }
        />
      </BaseModal>
      <BaseModal
        dataTestId="addNewUserModal"
        show={createNewUserModalisOpen}
        onHide={closeCreateNewUserModal}
        title={translateOrgPeople('createUser')}
        headerClassName={styles.headers}
        headerTestId="createUser"
        showCloseButton={false}
        footer={
          <div>
            <Button
              className={`${styles.removeButton}`}
              variant="danger"
              onClick={closeCreateNewUserModal}
              data-testid="closeBtn"
            >
              <Close />
              {translateOrgPeople('cancel')}
            </Button>
            <Button
              className={`${styles.addButton}`}
              variant="success"
              onClick={handleCreateUser}
              data-testid="createBtn"
            >
              <Check />
              {translateOrgPeople('create')}
            </Button>
          </div>
        }
      >
        <div className="my-3">
          <div className="row">
            <div className="col-sm-12">
              <FormTextField
                name="name"
                label={translateAddMember('addMember.enterName')}
                placeholder={translateAddMember('addMember.name')}
                value={createUserVariables.name}
                onChange={handleFirstName}
                data-testid="nameInput"
              />
            </div>
          </div>
          <FormTextField
            name="email"
            label={translateOrgPeople('enterEmail')}
            placeholder={translateOrgPeople('emailAddress')}
            type="email"
            value={createUserVariables.email}
            onChange={handleEmailChange}
            data-testid="emailInput"
            endAdornment={
              <div
                className={`input-group-text ${styles.colorPrimary} ${styles.borderNone}`}
              >
                <EmailOutlinedIcon className={`${styles.colorWhite}`} />
              </div>
            }
          />
          <FormTextField
            name="password"
            label={translateOrgPeople('enterPassword')}
            placeholder={translateOrgPeople('password')}
            type={showPassword ? 'text' : 'password'}
            value={createUserVariables.password}
            onChange={handlePasswordChange}
            data-testid="passwordInput"
            endAdornment={
              <button
                type="button"
                className={`input-group-text ${styles.colorPrimary} ${styles.borderNone} ${styles.colorWhite}`}
                onClick={togglePassword}
                data-testid="showPassword"
                aria-label={
                  showPassword
                    ? translateOrgPeople('hidePassword')
                    : translateOrgPeople('showPassword')
                }
              >
                {showPassword ? (
                  <i className="fas fa-eye"></i>
                ) : (
                  <i className="fas fa-eye-slash"></i>
                )}
              </button>
            }
          />
          <FormTextField
            name="confirmPassword"
            label={translateOrgPeople('enterConfirmPassword')}
            placeholder={translateOrgPeople('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            value={createUserVariables.confirmPassword}
            onChange={handleConfirmPasswordChange}
            data-testid="confirmPasswordInput"
            endAdornment={
              <button
                type="button"
                className={`input-group-text ${styles.colorPrimary} ${styles.borderNone} ${styles.colorWhite}`}
                onClick={toggleConfirmPassword}
                data-testid="showConfirmPassword"
                aria-label={
                  showConfirmPassword
                    ? translateOrgPeople('hidePassword')
                    : translateOrgPeople('showPassword')
                }
              >
                {showConfirmPassword ? (
                  <i className="fas fa-eye"></i>
                ) : (
                  <i className="fas fa-eye-slash"></i>
                )}
              </button>
            }
          />
          <FormTextField
            name="organization"
            label={translateOrgPeople('organization')}
            value={organizationData?.organization?.name || ''}
            onChange={() => {}}
            disabled
            data-testid="organizationName"
          />
        </div>
      </BaseModal>
    </>
  );
}
export default AddMember;
