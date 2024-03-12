import type { ApolloError } from '@apollo/client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Form, InputGroup, Modal } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USERS_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import NotFound from 'components/NotFound/NotFound';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationPeople.module.css';
import { toast } from 'react-toastify';
import { Search, Sort } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Loader from 'components/Loader/Loader';
import UserListCard from 'components/UserListCard/UserListCard';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import {
  ADD_MEMBER_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';

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

function organizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

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
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const location = useLocation();
  const role = location?.state;

  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(role?.role || 0);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  const [filterData, setFilterData] = useState({
    firstName_contains: '',
    lastName_contains: '',
  });

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');

  const {
    data: organizationData,
    loading: loadingOrgData,
    error: errorOrg,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
    loading: boolean;
    error?: ApolloError;
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const getMembersId = (): any => {
    if (memberData) {
      const ids = memberData?.organizationsMemberConnection.edges.map(
        (member: { _id: string }) => member._id,
      );
      return ids;
    }
    return [];
  };

  const {
    data: memberData,
    loading: memberLoading,
    error: memberError,
    refetch: memberRefetch,
  } = useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
      orgId: currentUrl,
    },
  })[1];

  const {
    data: adminData,
    loading: adminLoading,
    error: adminError,
    refetch: adminRefetch,
  } = useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
      orgId: currentUrl,
      admin_for: currentUrl,
    },
  })[1];

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: usersRefetch,
  } = useLazyQuery(USER_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
    },
  })[1];

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
    refetch: allUsersRefetch,
  } = useQuery(USERS_CONNECTION_LIST, {
    variables: {
      id_not_in: getMembersId(),
      firstName_contains: '',
      lastName_contains: '',
    },
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
      toast.error(t('invalidDetailsMessage'));
    } else if (
      createUserVariables.password !== createUserVariables.confirmPassword
    ) {
      toast.error(t('passwordNotMatch'));
    } else {
      try {
        const registeredUser = await registerMutation({
          variables: {
            firstName: createUserVariables.firstName,
            lastName: createUserVariables.lastName,
            email: createUserVariables.email,
            password: createUserVariables.password,
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
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
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

  useEffect(() => {
    if (state === 0) {
      memberRefetch({
        ...filterData,
        orgId: currentUrl,
      });
    } else if (state === 1) {
      adminRefetch({
        ...filterData,
        orgId: currentUrl,
        admin_for: currentUrl,
      });
    } else {
      usersRefetch({
        ...filterData,
      });
    }
  }, [state]);

  /* istanbul ignore next */
  if (memberError || usersError || adminError) {
    const error = memberError ?? usersError ?? adminError;
    toast.error(error?.message);
  }

  const handleFullNameSearchChange = (e: any): void => {
    /* istanbul ignore next */
    if (e.key === 'Enter') {
      const [firstName, lastName] = fullName.split(' ');

      const newFilterData = {
        firstName_contains: firstName ?? '',
        lastName_contains: lastName ?? '',
      };

      setFilterData(newFilterData);

      if (state === 0) {
        memberRefetch({
          ...newFilterData,
          orgId: currentUrl,
        });
      } else if (state === 1) {
        adminRefetch({
          ...newFilterData,
          orgId: currentUrl,
          admin_for: currentUrl,
        });
      } else {
        usersRefetch({
          ...newFilterData,
        });
      }
    }
  };

  const handleUserModalSearchChange = (e: any): void => {
    /* istanbul ignore next */
    if (e.key === 'Enter') {
      const [firstName, lastName] = userName.split(' ');

      const newFilterData = {
        firstName_contains: firstName ?? '',
        lastName_contains: lastName ?? '',
      };

      allUsersRefetch({
        ...newFilterData,
      });
    }
  };

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchLastName"
                placeholder={t('searchFullName')}
                autoComplete="off"
                required
                className={styles.inputField}
                value={fullName}
                onChange={(e): void => {
                  const { value } = e.target;
                  setFullName(value);
                  handleFullNameSearchChange(value);
                }}
                onKeyUp={handleFullNameSearchChange}
              />
              <Button
                className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
                onClick={handleFullNameSearchChange}
                style={{ marginBottom: '10px' }}
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className={styles.dropdown}
                  data-testid="role"
                >
                  <Sort />
                  {t('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    inline
                    id="userslist"
                    value="userslist"
                    name="displaylist"
                    data-testid="users"
                    defaultChecked={state == 2 ? true : false}
                    onClick={(): void => {
                      setState(2);
                    }}
                  >
                    <Form.Label htmlFor="userslist">{t('users')}</Form.Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="memberslist"
                    value="memberslist"
                    name="displaylist"
                    data-testid="members"
                    defaultChecked={state == 0 ? true : false}
                    onClick={(): void => {
                      setState(0);
                    }}
                  >
                    <label htmlFor="memberslist">{t('members')}</label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="adminslist"
                    value="adminslist"
                    name="displaylist"
                    data-testid="admins"
                    defaultChecked={state == 1 ? true : false}
                    onClick={(): void => {
                      setState(1);
                    }}
                  >
                    <label htmlFor="adminslist">{t('admins')}</label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className={styles.dropdown}
                  data-testid="addMembers"
                >
                  {t('addMembers')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    inline
                    id="existingUser"
                    value="existingUser"
                    name="existingUser"
                    data-testid="existingUser"
                    onClick={(): void => {
                      openAddUserModal();
                    }}
                  >
                    <Form.Label htmlFor="existingUser">
                      {t('existingUser')}
                    </Form.Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="newUser"
                    value="newUser"
                    name="newUser"
                    data-testid="newUser"
                    onClick={(): void => {
                      openCreateNewUserModal();
                    }}
                  >
                    <label htmlFor="memberslist">{t('newUser')}</label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </Row>
      <Col sm={9}>
        <div className={styles.mainpageright}>
          {memberLoading || usersLoading || adminLoading ? (
            <>
              <Loader />
            </>
          ) : (
            /* istanbul ignore next */
            <div className={styles.list_box} data-testid="orgpeoplelist">
              <Col sm={5}>
                <TableContainer component={Paper} sx={{ minWidth: '820px' }}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell align="center">
                          Profile
                        </StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">Joined</StyledTableCell>
                        <StyledTableCell align="center">
                          Actions
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        /* istanbul ignore next */
                        state === 0 &&
                        memberData &&
                        memberData.organizationsMemberConnection.edges.length >
                          0 ? (
                          memberData.organizationsMemberConnection.edges.map(
                            (datas: any, index: number) => (
                              <StyledTableRow key={datas._id}>
                                <StyledTableCell component="th" scope="row">
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.image ? (
                                    <img
                                      src={datas.image}
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  ) : (
                                    <img
                                      src="/images/svg/profiledefault.svg"
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Link
                                    className={styles.membername}
                                    to={`/member/${currentUrl}`}
                                    state={{ id: datas._id }}
                                  >
                                    {datas.firstName + ' ' + datas.lastName}
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.email}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {dayjs(datas.createdAt).format('DD/MM/YYYY')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <OrgPeopleListCard
                                    key={index}
                                    id={datas._id}
                                  />
                                </StyledTableCell>
                              </StyledTableRow>
                            ),
                          )
                        ) : /* istanbul ignore next */
                        state === 1 &&
                          adminData &&
                          adminData.organizationsMemberConnection.edges.length >
                            0 ? (
                          adminData.organizationsMemberConnection.edges.map(
                            (datas: any, index: number) => (
                              <StyledTableRow key={datas._id}>
                                <StyledTableCell component="th" scope="row">
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.image ? (
                                    <img
                                      src={datas.image}
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  ) : (
                                    <img
                                      src="/images/svg/profiledefault.svg"
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Link
                                    className={styles.membername}
                                    to={`/member/${currentUrl}`}
                                    state={{ id: datas._id }}
                                  >
                                    {datas.firstName + ' ' + datas.lastName}
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.email}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {dayjs(datas.createdAt).format('DD/MM/YYYY')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <OrgAdminListCard
                                    key={index}
                                    id={datas._id}
                                  />
                                </StyledTableCell>
                              </StyledTableRow>
                            ),
                          )
                        ) : state === 2 &&
                          usersData &&
                          usersData.users.length > 0 ? (
                          usersData.users.map((datas: any, index: number) => (
                            <StyledTableRow key={datas._id}>
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {datas.image ? (
                                  <img
                                    src={datas.image}
                                    alt="memberImage"
                                    className="TableImage"
                                  />
                                ) : (
                                  <img
                                    src="/images/svg/profiledefault.svg"
                                    alt="memberImage"
                                    className="TableImage"
                                  />
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Link
                                  className={styles.membername}
                                  to={`/member/${currentUrl}`}
                                  state={{ id: datas._id }}
                                >
                                  {datas.firstName + ' ' + datas.lastName}
                                </Link>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {datas.email}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {dayjs(datas.createdAt).format('DD/MM/YYYY')}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <UserListCard key={index} id={datas._id} />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          /* istanbul ignore next */
                          <NotFound
                            title={
                              state === 0
                                ? 'member'
                                : state === 1
                                  ? 'admin'
                                  : 'user'
                            }
                            keyPrefix="userNotFound"
                          />
                        )
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Col>
            </div>
          )}
        </div>
      </Col>
      <Modal
        data-testid="addExistingUserModal"
        show={addUserModalisOpen}
        onHide={toggleDialogModal}
      >
        <Modal.Header closeButton data-testid="pluginNotificationHeader">
          <Modal.Title>{t('addMembers')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allUsersLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className={styles.input}>
                <Form.Control
                  type="name"
                  id="searchLastName"
                  placeholder={t('searchFullName')}
                  autoComplete="off"
                  required
                  className={styles.inputField}
                  value={userName}
                  onChange={(e): void => {
                    const { value } = e.target;
                    setUserName(value);
                    handleUserModalSearchChange(value);
                  }}
                  onKeyUp={handleUserModalSearchChange}
                />
                <Button
                  className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
                  onClick={handleUserModalSearchChange}
                >
                  <Search />
                </Button>
              </div>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">
                        User Name
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Add Member
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsersData &&
                      allUsersData.users.length > 0 &&
                      allUsersData.users.map((user: any, index: number) => (
                        <StyledTableRow data-testid="user" key={user._id}>
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
                              {user.firstName + ' ' + user.lastName}
                            </Link>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              onClick={() => {
                                createMember(user._id);
                              }}
                              data-testid="addBtn"
                            >
                              Add
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
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
                <h6>{t('firstName')}</h6>
                <InputGroup className="mt-2 mb-4">
                  <Form.Control
                    placeholder={t('enterFirstName')}
                    className={styles.borderNone}
                    value={createUserVariables.firstName}
                    onChange={handleFirstName}
                    data-testid="firstNameInput"
                  />
                </InputGroup>
              </div>
              <div className="col-sm-6">
                <h6>{t('lastName')}</h6>
                <InputGroup className="mt-2 mb-4">
                  <Form.Control
                    placeholder={t('enterLastName')}
                    className={styles.borderNone}
                    value={createUserVariables.lastName}
                    onChange={handleLastName}
                    data-testid="lastNameInput"
                  />
                </InputGroup>
              </div>
            </div>
            <h6>{t('emailAddress')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                placeholder={t('enterEmail')}
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
            <h6>{t('password')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                placeholder={t('enterPassword')}
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
            <h6>{t('confirmPassword')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                placeholder={t('enterConfirmPassword')}
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
            <h6>{t('organization')}</h6>
            <InputGroup className="mt-2 mb-4">
              <Form.Control
                className={styles.borderNone}
                value={organizationData?.organizations[0].name}
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
              {t('cancel')}
            </Button>
            <Button
              className={`${styles.colorPrimary} ${styles.borderNone}`}
              variant="success"
              onClick={handleCreateUser}
              data-testid="createBtn"
            >
              {t('create')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default organizationPeople;
