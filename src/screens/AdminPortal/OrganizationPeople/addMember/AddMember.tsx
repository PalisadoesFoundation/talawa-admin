/**
 * AddMember component allows users to add members to an organization.
 *
 * @remarks
 * This component provides two options:
 * 1. Adding an existing user from the user list.
 * 2. Creating a new user and adding them to the organization.
 *
 * Key features include:
 * - Paginated list of users with search functionality.
 * - Modal for creating new users with validation.
 * - Integration with Apollo Client for GraphQL logic.
 * - Responsive layout using React Bootstrap and Material-UI.
 *
 * @returns \{JSX.Element\} The rendered `AddMember` component.
 */
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Check, Close } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  CREATE_MEMBER_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_BASIC_DATA,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import type { ChangeEvent } from 'react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import styles from './AddMember.module.css';
import Avatar from 'shared-components/Avatar/Avatar';
import PageHeader from 'shared-components/Navbar/Navbar';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { IEdge, IUserDetails, IQueryVariable } from './types';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import PaginationList from 'shared-components/PaginationList/PaginationList';
import { OrganizationMembershipRole } from 'types/AdminPortal/OrganizationMembershipRole/interface';

// Removed StyledTableCell and StyledTableRow in favor of CSS modules

import type { InterfaceAddMemberProps } from 'types/AdminPortal/OrganizationPeople/addMember/interface';

function AddMember({
  rootClassName,
  containerClassName,
  toggleClassName,
}: InterfaceAddMemberProps = {}): JSX.Element {
  const { t: translateOrgPeople } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: translateAddMember } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  document.title = translateOrgPeople('title');
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
  const createMember = useCallback(
    async (userId: string): Promise<void> => {
      try {
        if (!currentUrl) return;
        await addMember({
          variables: {
            memberId: userId,
            organizationId: currentUrl,
            role: OrganizationMembershipRole.REGULAR,
          },
        });
        NotificationToast.success(
          tCommon('addedSuccessfully', {
            item: translateAddMember('role.member'),
          }) as string,
        );
      } catch (error: unknown) {
        errorHandler(tCommon, error);
      }
    },
    [addMember, currentUrl, tCommon, translateAddMember],
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);
  const [userName, setUserName] = useState('');
  const {
    data: organizationData,
  }: { data?: { organization: InterfaceQueryOrganizationsListObject } } =
    useQuery(GET_ORGANIZATION_BASIC_DATA, { variables: { id: currentUrl } });
  const [registerMutation] = useMutation(CREATE_MEMBER_PG);
  const [createUserVariables, setCreateUserVariables] = React.useState({
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
        if (!createdUserId) return;
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
  const handleFirstName = (e: ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;
    setCreateUserVariables({ ...createUserVariables, name });
  };
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;
    setCreateUserVariables({ ...createUserVariables, email });
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;
    setCreateUserVariables({ ...createUserVariables, password });
  };
  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const confirmPassword = e.target.value;
    setCreateUserVariables({ ...createUserVariables, confirmPassword });
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
  }, [currentUrl, addUserModalisOpen]);
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
  const allUsersData = useMemo(
    () => userData?.allUsers?.edges?.map((edge: IEdge) => edge.node) || [],
    [userData?.allUsers],
  );

  const tableData = useMemo(
    () =>
      allUsersData.map((user: IUserDetails, index: number) => ({
        ...user,
        rowIndex: page * PAGE_SIZE + index + 1,
      })),
    [allUsersData, page],
  );

  const columns = useMemo(
    () =>
      [
        {
          id: 'index',
          header: '#',
          accessor: 'rowIndex',
        },
        {
          id: 'profile',
          header: translateAddMember('addMember.profile'),
          accessor: 'avatarURL',
          render: (value, row) => {
            const displayName =
              row.name?.trim() ||
              (tCommon('avatar') as string) ||
              'User avatar';
            return (
              <div data-testid="profileImage" className={styles.profileCell}>
                {value ? (
                  <img
                    src={value as string}
                    alt={`${displayName} ${tCommon('avatar')}`}
                    className={styles.TableImage}
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                ) : (
                  <Avatar
                    avatarStyle={styles.TableImage}
                    name={displayName}
                    dataTestId="avatarImage"
                  />
                )}
              </div>
            );
          },
        },
        {
          id: 'user',
          header: translateAddMember('addMember.user'),
          accessor: 'name',
          render: (_, row) => (
            <Link
              className={`${styles.membername} ${styles.subtleBlueGrey}`}
              to={{
                pathname: `/admin/member/${currentUrl}/${row.id}`,
              }}
              aria-label={
                row.name && row.emailAddress
                  ? `${row.name} (${row.emailAddress})`
                  : row.name || row.emailAddress || undefined
              }
            >
              {row.name}
              <br />
              <span aria-hidden="true">{row.emailAddress}</span>
            </Link>
          ),
        },
        {
          id: 'action',
          header: translateAddMember('addMember.addMember'),
          accessor: 'id',
          render: (_, row) => (
            <Button
              onClick={() => {
                createMember(row.id);
              }}
              data-testid="addBtn"
              className={styles.addButton}
            >
              <i className={'fa fa-plus me-2'} />
              {translateAddMember('addMember.add')}
            </Button>
          ),
        },
      ] as IColumnDef<IUserDetails & { rowIndex: number }>[],
    [translateAddMember, tCommon, currentUrl, styles, createMember],
  );

  return (
    <>
      <PageHeader
        rootClassName={rootClassName}
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
            containerClassName,
            toggleClassName,
          },
        ]}
      />
      <BaseModal
        dataTestId="addExistingUserModal"
        title={translateOrgPeople('addMembers')}
        show={addUserModalisOpen}
        onHide={toggleDialogModal}
        className={styles.modalContent}
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
        <DataTable<IUserDetails & { rowIndex: number }>
          data={tableData}
          columns={columns}
          rowKey="id"
          loading={userLoading}
          error={userError || undefined}
          emptyMessage={translateOrgPeople('notFound')}
          tableClassName={styles.dataTable}
          ariaLabel={translateOrgPeople('users')}
        />
        <PaginationList
          count={-1}
          rowsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={() => {}}
        />
      </BaseModal>
      <BaseModal
        dataTestId="addNewUserModal"
        title={translateOrgPeople('createUser')}
        headerClassName={styles.headers}
        show={createNewUserModalisOpen}
        onHide={closeCreateNewUserModal}
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
              <h6>{translateAddMember('addMember.enterName')}</h6>
              <InputGroup className="mt-2 mb-4">
                <FormControl
                  placeholder={translateAddMember('addMember.name')}
                  className={styles.borderNone}
                  value={createUserVariables.name}
                  onChange={handleFirstName}
                  data-testid="firstNameInput"
                />
              </InputGroup>
            </div>
          </div>
          <h6>{translateOrgPeople('enterEmail')}</h6>
          <InputGroup className="mt-2 mb-4">
            <FormControl
              placeholder={translateOrgPeople('emailAddress')}
              type="email"
              className={styles.borderNone}
              value={createUserVariables.email}
              onChange={handleEmailChange}
              data-testid="emailInput"
            />
            <InputGroup.Text
              className={`${styles.colorPrimary} ${styles.borderNone}`}
            >
              <EmailOutlinedIcon className={`${styles.colorWhite}`} />
            </InputGroup.Text>
          </InputGroup>
          <h6>{translateOrgPeople('enterPassword')}</h6>
          <InputGroup className="mt-2 mb-4">
            <FormControl
              placeholder={translateOrgPeople('password')}
              type={showPassword ? 'text' : 'password'}
              className={styles.borderNone}
              value={createUserVariables.password}
              onChange={handlePasswordChange}
              data-testid="passwordInput"
            />
            <InputGroup.Text
              className={`${styles.colorPrimary} ${styles.borderNone} ${styles.colorWhite}`}
              onClick={togglePassword}
              data-testid="showPassword"
            >
              {showPassword ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fas fa-eye-slash"></i>
              )}
            </InputGroup.Text>
          </InputGroup>
          <h6>{translateOrgPeople('enterConfirmPassword')}</h6>
          <InputGroup className="mt-2 mb-4">
            <FormControl
              placeholder={translateOrgPeople('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              className={styles.borderNone}
              value={createUserVariables.confirmPassword}
              onChange={handleConfirmPasswordChange}
              data-testid="confirmPasswordInput"
            />
            <InputGroup.Text
              className={`${styles.colorPrimary} ${styles.borderNone} ${styles.colorWhite}`}
              onClick={toggleConfirmPassword}
              data-testid="showConfirmPassword"
            >
              {showConfirmPassword ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fas fa-eye-slash"></i>
              )}
            </InputGroup.Text>
          </InputGroup>
          <h6>{translateOrgPeople('organization')}</h6>
          <InputGroup className="mt-2 mb-4">
            <FormControl
              className={styles.borderNone}
              value={organizationData?.organization?.name}
              data-testid="organizationName"
              disabled
            />
          </InputGroup>
        </div>
      </BaseModal>
    </>
  );
}
export default AddMember;
