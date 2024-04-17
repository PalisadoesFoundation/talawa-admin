import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
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
  ADD_MEMBER_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USERS_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, InputGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceQueryOrganizationsListObject,
  InterfaceQueryUserListItem,
} from 'utils/interfaces';
import styles from './OrganizationPeople.module.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function AddMember(): JSX.Element {
  const { t: translateOrgPeople } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  const { t: translateAddMember } = useTranslation('translation', {
    keyPrefix: 'addMember',
  });

  document.title = translateOrgPeople('title');

  const [addUserModalisOpen, setAddUserModalIsOpen] = useState(false);

  function openAddUserModal(): void {
    setAddUserModalIsOpen(true);
  }

  const toggleDialogModal = /* istanbul ignore next */ (): void =>
    setAddUserModalIsOpen(!addUserModalisOpen);

  const [createNewUserModalisOpen, setCreateNewUserModalIsOpen] =
    useState(false);
  function openCreateNewUserModal(): void {
    setCreateNewUserModalIsOpen(true);
  }

  function closeCreateNewUserModal(): void {
    setCreateNewUserModalIsOpen(false);
  }
  const toggleCreateNewUserModal = /* istanbul ignore next */ (): void =>
    setCreateNewUserModalIsOpen(!addUserModalisOpen);

  const [addMember] = useMutation(ADD_MEMBER_MUTATION);

  const createMember = async (userId: string): Promise<void> => {
    try {
      await addMember({
        variables: {
          userid: userId,
          orgid: currentUrl,
        },
      });
      toast.success('Member added to the organization.');
      memberRefetch({
        orgId: currentUrl,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
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
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const getMembersId = (): string[] => {
    if (memberData) {
      const ids = memberData?.organizationsMemberConnection.edges.map(
        (member: { _id: string }) => member._id,
      );
      return ids;
    }
    return [];
  };

  const { data: memberData, refetch: memberRefetch } = useLazyQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        firstName_contains: '',
        lastName_contains: '',
        orgId: currentUrl,
      },
    },
  )[1];

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(USERS_CONNECTION_LIST, {
    variables: {
      id_not_in: getMembersId(),
      firstName_contains: '',
      lastName_contains: '',
    },
  });

  useEffect(() => {
    memberRefetch({
      orgId: currentUrl,
    });
  });

  const [registerMutation] = useMutation(SIGNUP_MUTATION);

  const [createUserVariables, setCreateUserVariables] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleCreateUser = async (): Promise<void> => {
    if (
      !(
        createUserVariables.email &&
        createUserVariables.password &&
        createUserVariables.firstName &&
        createUserVariables.lastName
      )
    ) {
      toast.error(translateOrgPeople('invalidDetailsMessage'));
    } else if (
      createUserVariables.password !== createUserVariables.confirmPassword
    ) {
      toast.error(translateOrgPeople('passwordNotMatch'));
    } else {
      try {
        const registeredUser = await registerMutation({
          variables: {
            firstName: createUserVariables.firstName,
            lastName: createUserVariables.lastName,
            email: createUserVariables.email,
            password: createUserVariables.password,
            orgId: currentUrl,
          },
        });
        const createdUserId = registeredUser?.data.signUp.user._id;

        await createMember(createdUserId);

        closeCreateNewUserModal();

        /* istanbul ignore next */
        setCreateUserVariables({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (error: unknown) {
        /* istanbul ignore next */
        errorHandler(translateOrgPeople, error);
      }
    }
  };

  /* istanbul ignore next */
  const handleFirstName = (e: ChangeEvent<HTMLInputElement>): void => {
    const firstName = e.target.value;

    setCreateUserVariables({ ...createUserVariables, firstName });
  };

  /* istanbul ignore next */
  const handleLastName = (e: ChangeEvent<HTMLInputElement>): void => {
    const lastName = e.target.value;

    setCreateUserVariables({ ...createUserVariables, lastName });
  };

  /* istanbul ignore next */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;

    setCreateUserVariables({ ...createUserVariables, email });
  };

  /* istanbul ignore next */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;

    setCreateUserVariables({ ...createUserVariables, password });
  };

  /* istanbul ignore next */
  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const confirmPassword = e.target.value;

    setCreateUserVariables({ ...createUserVariables, confirmPassword });
  };

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    /* istanbul ignore next */
    const [firstName, lastName] = userName.split(' ');

    const newFilterData = {
      firstName_contains: firstName || '',
      lastName_contains: lastName || '',
    };

    allUsersRefetch({
      ...newFilterData,
    });
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className={styles.dropdown}
          data-testid="addMembers"
        >
          {translateOrgPeople('addMembers')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            id="existingUser"
            value="existingUser"
            name="existingUser"
            data-testid="existingUser"
            onClick={(): void => {
              openAddUserModal();
            }}
          >
            <Form.Label htmlFor="existingUser">
              {translateOrgPeople('existingUser')}
            </Form.Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="newUser"
            value="newUser"
            name="newUser"
            data-testid="newUser"
            onClick={(): void => {
              openCreateNewUserModal();
            }}
          >
            <label htmlFor="memberslist">{translateOrgPeople('newUser')}</label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

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
          {allUsersLoading ? (
            <>
              <Loader />
            </>
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
                    className={`position-absolute z-10 bottom-10 end-0  d-flex justify-content-center align-items-center `}
                  >
                    <Search />
                  </Button>
                </Form>
              </div>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">
                        {translateAddMember('user')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translateAddMember('addMember')}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsersData &&
                      allUsersData.users.length > 0 &&
                      allUsersData.users.map(
                        (
                          userDetails: InterfaceQueryUserListItem,
                          index: number,
                        ) => (
                          <StyledTableRow
                            data-testid="user"
                            key={userDetails.user._id}
                          >
                            <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Link
                                className={styles.membername}
                                to={{
                                  pathname: `/member/id=${currentUrl}`,
                                }}
                              >
                                {userDetails.user.firstName +
                                  ' ' +
                                  userDetails.user.lastName}
                                <br />
                                {userDetails.user.email}
                              </Link>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                onClick={() => {
                                  createMember(userDetails.user._id);
                                }}
                                data-testid="addBtn"
                              >
                                Add
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ),
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        data-testid="addNewUserModal"
        show={createNewUserModalisOpen}
        onHide={toggleCreateNewUserModal}
      >
        <Modal.Header className={styles.createUserModalHeader}>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="my-3">
            <div className="row">
              <div className="col-sm-6">
                <h6>{translateOrgPeople('firstName')}</h6>
                <InputGroup className="mt-2 mb-4">
                  <Form.Control
                    placeholder={translateOrgPeople('enterFirstName')}
                    className={styles.borderNone}
                    value={createUserVariables.firstName}
                    onChange={handleFirstName}
                    data-testid="firstNameInput"
                  />
                </InputGroup>
              </div>
              <div className="col-sm-6">
                <h6>{translateOrgPeople('lastName')}</h6>
                <InputGroup className="mt-2 mb-4">
                  <Form.Control
                    placeholder={translateOrgPeople('enterLastName')}
                    className={styles.borderNone}
                    value={createUserVariables.lastName}
                    onChange={handleLastName}
                    data-testid="lastNameInput"
                  />
                </InputGroup>
              </div>
            </div>
            <h6>{translateOrgPeople('emailAddress')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                placeholder={translateOrgPeople('enterEmail')}
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
            <h6>{translateOrgPeople('password')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                placeholder={translateOrgPeople('enterPassword')}
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
            <h6>{translateOrgPeople('confirmPassword')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                placeholder={translateOrgPeople('enterConfirmPassword')}
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
                value={organizationData?.organizations[0]?.name}
                onChange={handlePasswordChange}
                data-testid=""
                disabled
              />
            </InputGroup>
          </div>
          <div className={styles.createUserActionBtns}>
            <Button
              className={`${styles.borderNone}`}
              variant="danger"
              onClick={closeCreateNewUserModal}
              data-testid="closeBtn"
            >
              {translateOrgPeople('cancel')}
            </Button>
            <Button
              className={`${styles.colorPrimary} ${styles.borderNone}`}
              variant="success"
              onClick={handleCreateUser}
              data-testid="createBtn"
            >
              {translateOrgPeople('create')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddMember;
// | typeof ORGANIZATIONS_MEMBER_CONNECTION_LIST
// | typeof ORGANIZATIONS_LIST
// | typeof USER_LIST_FOR_TABLE
// | typeof ADD_MEMBER_MUTATION;
// {
//   id?: string;
//   orgId?: string;
//   orgid?: string;
//   fristNameContains?: string;
//   lastNameContains?: string;
//   firstName_contains?: string;
//   lastName_contains?: string;
//   id_not_in?: string[];
//   userid?: string;
// };
