/**
 * Component: AddMember
 *
 * This component allows users to add members to an organization. It provides two options:
 * 1. Adding an existing user from the user list.
 * 2. Creating a new user and adding them to the organization.
 *
 * @Features
 * - Fetches and displays a paginated list of users with search functionality.
 * - Allows adding existing users to the organization.
 * - Provides a modal for creating new users with validation for required fields.
 * - Supports cursor-based pagination for user listing.
 *
 * @Hooks
 * - `useLazyQuery`: Fetches users with pagination.
 * - `useMutation`: Handles adding members and creating new users.
 * - `useQuery`: Fetches organization details.
 * - `useTranslation`: Provides translations for UI text.
 *
 * @StateManagement
 * - `addUserModalisOpen`: Controls the visibility of the "Add Existing User" modal.
 * - `createNewUserModalisOpen`: Controls the visibility of the "Create New User" modal.
 * - `page`: Tracks the current page for pagination.
 * - `paginationMeta`: Stores pagination metadata (e.g., hasNextPage, hasPreviousPage).
 * - `createUserVariables`: Stores input values for creating a new user.
 *
 * @Props
 * - None
 *
 * @Dependencies
 * - Apollo Client for GraphQL queries and mutations.
 * - React Bootstrap for modals and forms.
 * - Material-UI for table and icons.
 * - React Router for navigation.
 * - React Toastify for notifications.
 *
 * @Usage
 * - This component is used in the "Organization People" section of the application.
 * - It allows administrators to manage members of an organization.
 *
 * @returns {JSX.Element} The rendered AddMember component.
 */
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Check, Close, Search } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import {
  CREATE_MEMBER_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_BASIC_DATA,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import type { ChangeEvent } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, InputGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import Avatar from 'components/Avatar/Avatar';
import SortingButton from 'subComponents/SortingButton';
import { TablePagination } from '@mui/material';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'var(--table-head-bg, blue)',
    color: 'var(--table-header-color, black)',
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
}));

interface IEdge {
  cursor: string;
  node: {
    id: string;
    name: string;
    role: string;
    avatarURL: string;
    emailAddress: string;
    createdAt?: string;
  };
}
interface IUserDetails {
  id: string;
  name: string;
  emailAddress: string;
  avatarURL?: string;
}

interface IQueryVariable {
  orgId?: string | undefined;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  where?: { role: { equal: 'administrator' | 'regular' } };
}

function AddMember(): JSX.Element {
  const { t: translateOrgPeople } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  const { t: translateAddMember } = useTranslation('translation', {
    keyPrefix: 'addMember',
  });

  const { t: tCommon } = useTranslation('common');

  document.title = translateOrgPeople('title');

  const [addUserModalisOpen, setAddUserModalIsOpen] = useState(false);

  const PAGE_SIZE = 10;
  // Pagination state
  const [page, setPage] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Refs to store cursors for navigation
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

  // Query for fetching users with pagination
  const [
    fetchUsers,
    { loading: userLoading, error: userError, data: userData },
  ] = useLazyQuery(USER_LIST_FOR_TABLE, {
    variables: { first: PAGE_SIZE, after: null, last: null, before: null },
  });

  function openAddUserModal(): void {
    setAddUserModalIsOpen(true);
  }
  useEffect(() => {
    setUserName('');
  }, [addUserModalisOpen]);

  const toggleDialogModal = (): void =>
    setAddUserModalIsOpen(!addUserModalisOpen);

  const [createNewUserModalisOpen, setCreateNewUserModalIsOpen] =
    useState(false);
  function openCreateNewUserModal(): void {
    setCreateNewUserModalIsOpen(true);
  }

  function closeCreateNewUserModal(): void {
    setCreateNewUserModalIsOpen(false);
  }

  const [addMember] = useMutation(CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG);

  const createMember = async (userId: string): Promise<void> => {
    try {
      await addMember({
        variables: {
          memberId: userId,
          organizationId: currentUrl,
          role: 'regular',
        },
      });
      toast.success(tCommon('addedSuccessfully', { item: 'Member' }) as string);
    } catch (error: unknown) {
      errorHandler(tCommon, error);
    }
  };

  const { orgId: currentUrl } = useParams();

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

  // const {
  //   data: allUsersData,
  //   loading: allUsersLoading,
  //   refetch: allUsersRefetch,
  // } = useQuery(USER_LIST_FOR_TABLE, {
  //   variables: {
  //     id_not_in: getMembersId(),
  //     firstName_contains: '',
  //     lastName_contains: '',
  //   },
  // });

  const [registerMutation] = useMutation(CREATE_MEMBER_PG);

  const [createUserVariables, setCreateUserVariables] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  enum OrganizationMembershipRole {
    ADMIN = 'administrator',
    REGULAR = 'regular',
  }

  const handleCreateUser = async (): Promise<void> => {
    if (
      !(
        createUserVariables.email &&
        createUserVariables.password &&
        createUserVariables.name
      )
    ) {
      toast.error(translateOrgPeople('invalidDetailsMessage') as string);
    } else if (
      createUserVariables.password !== createUserVariables.confirmPassword
    ) {
      toast.error(translateOrgPeople('passwordNotMatch') as string);
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

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    resetPagination();
    const variables = {
      first: PAGE_SIZE,
      where: userName ? { name: userName } : null,
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

  // Initial data fetch
  useEffect(() => {
    if (addUserModalisOpen) {
      resetPagination();
      fetchUsers({
        variables: { first: PAGE_SIZE, after: null, last: null, before: null },
      });
    }
  }, [currentUrl, addUserModalisOpen]);

  // Process data when it arrives
  useEffect(() => {
    if (userData?.allUsers) {
      const { pageInfo } = userData.allUsers;

      // Store cursors relative to the page for which this response was requested
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

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    const isForwardNavigation = newPage > page;

    // Check if navigation is allowed
    if (isForwardNavigation && !paginationMeta.hasNextPage) {
      return; // Prevent navigation if there's no next page
    }
    if (!isForwardNavigation && !paginationMeta.hasPreviousPage) {
      return; // Prevent navigation if there's no previous page
    }

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

  // Extract user data from the query result
  const allUsersData =
    userData?.allUsers?.edges?.map((edge: IEdge) => edge.node) || [];

  return (
    <>
      <SortingButton
        title={translateOrgPeople('addMembers')}
        sortingOptions={[
          { label: translateOrgPeople('existingUser'), value: 'existingUser' },
          { label: translateOrgPeople('newUser'), value: 'newUser' },
        ]}
        selectedOption={translateOrgPeople('addMembers')}
        onSortChange={handleSortChange}
        dataTestIdPrefix="addMembers"
        className={styles.dropdown}
      />

      {/* Existing User Modal */}
      <Modal
        data-testid="addExistingUserModal"
        show={addUserModalisOpen}
        onHide={toggleDialogModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="pluginNotificationHeader">
          <Modal.Title>{translateOrgPeople('addMembers')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userLoading ? (
            <Loader />
          ) : (
            <>
              <div className={styles.input}>
                <Form onSubmit={handleUserModalSearchChange}>
                  <Form.Control
                    type="name"
                    id="searchUser"
                    data-testid="searchUser"
                    placeholder={translateOrgPeople('searchFullName')}
                    autoComplete="off"
                    className={styles.inputFieldModal}
                    value={userName}
                    onChange={(e): void => {
                      const { value } = e.target;
                      setUserName(value);
                    }}
                  />
                  <Button
                    type="submit"
                    data-testid="submitBtn"
                    className={styles.searchButton}
                  >
                    <Search className={styles.searchIcon} />
                  </Button>
                </Form>
              </div>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">
                        {translateAddMember('profile')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translateAddMember('user')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translateAddMember('addMember')}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userLoading ? (
                      <StyledTableRow>
                        <StyledTableCell colSpan={4} align="center">
                          Loading...
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : userError ? (
                      <StyledTableRow>
                        <StyledTableCell colSpan={4} align="center">
                          Error loading users.
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : allUsersData.length === 0 ? (
                      <StyledTableRow>
                        <StyledTableCell colSpan={4} align="center">
                          No users found.
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : (
                      allUsersData.map(
                        (userDetails: IUserDetails, index: number) => (
                          <StyledTableRow
                            data-testid="user"
                            key={userDetails.id}
                          >
                            <StyledTableCell component="th" scope="row">
                              {page * PAGE_SIZE + index + 1}
                            </StyledTableCell>
                            <StyledTableCell
                              align="center"
                              data-testid="profileImage"
                            >
                              {userDetails.avatarURL ? (
                                <img
                                  src={userDetails.avatarURL}
                                  alt={`${userDetails.name} avatar`}
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
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Link
                                className={`${styles.membername} ${styles.subtleBlueGrey}`}
                                to={{ pathname: `/member/${currentUrl}` }}
                              >
                                {userDetails.name}
                                <br />
                                {userDetails.emailAddress}
                              </Link>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                onClick={() => {
                                  createMember(userDetails.id);
                                }}
                                data-testid="addBtn"
                                className={styles.addButton}
                              >
                                <i className={'fa fa-plus me-2'} />
                                Add
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ),
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={-1} // Use -1 for infinite/unknown count with cursor-based pagination
                rowsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[PAGE_SIZE]} // Fixed page size
                backIconButtonProps={{
                  disabled: !paginationMeta.hasPreviousPage,
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  disabled: !paginationMeta.hasNextPage,
                  'aria-label': 'Next Page',
                }}
                labelDisplayedRows={({ page }) => `Page ${page + 1}`}
              />
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* New User Modal */}
      <Modal data-testid="addNewUserModal" show={createNewUserModalisOpen}>
        <Modal.Header className={styles.headers} data-testid="createUser">
          <Modal.Title>{translateOrgPeople('createUser')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="my-3">
            <div className="row">
              <div className="col-sm-12">
                <h6>{translateAddMember('enterName')}</h6>
                <InputGroup className="mt-2 mb-4">
                  <Form.Control
                    placeholder={translateAddMember('name')}
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
              <Form.Control
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
              <Form.Control
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
              <Form.Control
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
              <Form.Control
                className={styles.borderNone}
                value={organizationData?.organization?.name}
                data-testid="organizationName"
                disabled
              />
            </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddMember;
