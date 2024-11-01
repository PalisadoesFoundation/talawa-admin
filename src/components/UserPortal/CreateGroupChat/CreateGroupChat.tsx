import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TableBody,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './CreateGroupChat.module.css';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { USER_JOINED_ORGANIZATIONS } from 'GraphQl/Queries/OrganizationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { CREATE_CHAT } from 'GraphQl/Mutations/OrganizationMutations';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface InterfaceCreateGroupChatProps {
  toggleCreateGroupChatModal: () => void;
  createGroupChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

interface InterfaceOrganization {
  _id: string;
  name: string;
  image: string;
  description: string;
  admins: [];
  members: [];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    _id: string;
    user: {
      _id: string;
    };
  }[];
}

/**
 * Styled table cell with custom styles.
 */

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

/**
 * Styled table row with custom styles.
 */

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const { getItem } = useLocalStorage();

export default function CreateGroupChat({
  toggleCreateGroupChatModal,
  createGroupChatModalisOpen,
  chatsListRefetch,
}: InterfaceCreateGroupChatProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });

  const userId: string | null = getItem('userId');

  const [createChat] = useMutation(CREATE_CHAT);

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [userIds, setUserIds] = useState<string[]>([]);

  const [addUserModalisOpen, setAddUserModalisOpen] = useState(false);

  function openAddUserModal(): void {
    setAddUserModalisOpen(true);
  }

  const toggleAddUserModal = /* istanbul ignore next */ (): void =>
    setAddUserModalisOpen(!addUserModalisOpen);

  const handleChange = (event: SelectChangeEvent<string>): void => {
    setSelectedOrganization(event.target.value as string);
  };

  const { data: joinedOrganizationsData } = useQuery(
    USER_JOINED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  function reset(): void {
    setTitle('');
    setUserIds([]);
    setSelectedOrganization('');
  }

  useEffect(() => {
    setUserIds(userIds);
  }, [userIds]);

  async function handleCreateGroupChat(): Promise<void> {
    await createChat({
      variables: {
        organizationId: selectedOrganization,
        userIds: [userId, ...userIds],
        name: title,
        isGroup: true,
      },
    });
    chatsListRefetch();
    toggleAddUserModal();
    toggleCreateGroupChatModal();
    reset();
  }

  const [userName, setUserName] = useState('');

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(USERS_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
    },
  });

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

  useEffect(() => {
    if (joinedOrganizationsData && joinedOrganizationsData.users.length > 0) {
      const organizations =
        joinedOrganizationsData.users[0]?.user?.joinedOrganizations || [];
      setOrganizations(organizations);
    }
  }, [joinedOrganizationsData]);

  return (
    <>
      <Modal
        data-testid="createGroupChatModal"
        show={createGroupChatModalisOpen}
        onHide={toggleCreateGroupChatModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="">
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <FormControl fullWidth>
              <InputLabel id="select-org">Select Organization</InputLabel>
              <Select
                labelId="select-org"
                id="select-org"
                data-testid="orgSelect"
                label="Select Organization"
                value={selectedOrganization}
                onChange={(e) => handleChange(e)}
              >
                {organizations?.length &&
                  organizations.map((organization: InterfaceOrganization) => (
                    <MenuItem
                      data-testid="selectOptions"
                      key={organization._id}
                      value={organization._id}
                    >
                      {`${organization.name}(${organization.address?.city},${organization.address?.state},${organization.address?.countryCode})`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl> */}
            <FormControl fullWidth>
              <InputLabel id="select-org">Select Organization</InputLabel>
              <Select
                labelId="select-org"
                id="select-org"
                data-testid="orgSelect"
                label="Select Organization"
                value={selectedOrganization}
                onChange={handleChange}
              >
                {organizations &&
                  organizations.length &&
                  organizations.map((organization: InterfaceOrganization) => (
                    <MenuItem
                      data-testid="selectOptions"
                      key={organization._id}
                      value={organization._id}
                    >
                      {`${organization.name}(${organization.address?.city},${organization.address?.state},${organization.address?.countryCode})`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>Group name</Form.Label>
              <Form.Control
                type="text"
                placeholder={'Group name'}
                autoComplete="off"
                required
                data-tsetid="groupTitleInput"
                value={title}
                onChange={(e): void => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              className={`${styles.colorPrimary} ${styles.borderNone}`}
              variant="success"
              onClick={openAddUserModal}
              data-testid="nextBtn"
            >
              Next
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        data-testid="addExistingUserModal"
        show={addUserModalisOpen}
        onHide={toggleAddUserModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="pluginNotificationHeader">
          <Modal.Title>{'Chat'}</Modal.Title>
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
                    placeholder="searchFullName"
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

              <TableContainer className={styles.userData} component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">{'user'}</StyledTableCell>
                      <StyledTableCell align="center">{'Chat'}</StyledTableCell>
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
                              {userDetails.user.firstName +
                                ' ' +
                                userDetails.user.lastName}
                              <br />
                              {userDetails.user.email}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {userIds.includes(userDetails.user._id) ? (
                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    const updatedUserIds = userIds.filter(
                                      (id) => id !== userDetails.user._id,
                                    );
                                    setUserIds(updatedUserIds);
                                  }}
                                  data-testid="removeBtn"
                                >
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setUserIds([
                                      ...userIds,
                                      userDetails.user._id,
                                    ]);
                                  }}
                                  data-testid="addBtn"
                                >
                                  {t('add')}
                                </Button>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ),
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          <Button
            className={`${styles.colorPrimary} ${styles.borderNone}`}
            variant="success"
            onClick={handleCreateGroupChat}
            data-testid="createBtn"
          >
            {t('create')}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
