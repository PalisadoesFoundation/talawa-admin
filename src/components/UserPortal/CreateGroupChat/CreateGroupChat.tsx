import React, { useEffect, useRef, useState } from 'react';
import { Paper, TableBody } from '@mui/material';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './CreateGroupChat.module.css';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
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
import { useParams } from 'react-router-dom';
import convertToBase64 from 'utils/convertToBase64';
import Avatar from 'components/Avatar/Avatar';
import { FiEdit } from 'react-icons/fi';

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
  const userId: string | null = getItem('userId');
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });

  const [createChat] = useMutation(CREATE_CHAT);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userIds, setUserIds] = useState<string[]>([]);

  const [addUserModalisOpen, setAddUserModalisOpen] = useState(false);

  function openAddUserModal(): void {
    setAddUserModalisOpen(true);
  }

  const toggleAddUserModal = /* istanbul ignore next */ (): void =>
    setAddUserModalisOpen(!addUserModalisOpen);

  const { orgId: currentOrg } = useParams();

  function reset(): void {
    setTitle('');
    setUserIds([]);
  }

  useEffect(() => {
    setUserIds(userIds);
  }, [userIds]);

  async function handleCreateGroupChat(): Promise<void> {
    await createChat({
      variables: {
        organizationId: currentOrg,
        userIds: [userId, ...userIds],
        name: title,
        isGroup: true,
        image: selectedImage,
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setSelectedImage(base64);
    }
  };

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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }} // Hide the input
            onChange={handleImageChange}
            data-testid="fileInput"
          />
          <div className={styles.groupInfo}>
            {selectedImage ? (
              <img className={styles.chatImage} src={selectedImage} alt="" />
            ) : (
              <Avatar avatarStyle={styles.groupImage} name={title} />
            )}
            <button
              data-testid="editImageBtn"
              onClick={handleImageClick}
              className={styles.editImgBtn}
            >
              <FiEdit />
            </button>
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder={'Group name'}
                autoComplete="off"
                required
                data-testid="groupTitleInput"
                value={title}
                onChange={(e): void => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder={'Group Description'}
                autoComplete="off"
                required
                data-testid="groupDescriptionInput" //corrected spelling
                value={description}
                onChange={(e): void => {
                  setDescription(e.target.value);
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
