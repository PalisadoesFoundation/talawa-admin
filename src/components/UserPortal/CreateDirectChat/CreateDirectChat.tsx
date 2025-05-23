/**
 * This component renders a modal for creating a direct chat with a user.
 * It allows users to search for other users and initiate a direct chat.
 *
 * @file CreateDirectChat.tsx
 * @module components/UserPortal/CreateDirectChat
 *
 * @param {InterfaceCreateDirectChatProps} props - The props for the component.
 * @param {boolean} props.createDirectChatModalisOpen - Determines if the modal is open.
 * @param {() => void} props.toggleCreateDirectChatModal - Function to toggle the modal visibility.
 * @param {(variables?: Partial<{ id: string }>) => Promise<ApolloQueryResult<unknown>>} props.chatsListRefetch - Function to refetch the chat list.
 * @param {GroupChat[]} props.chats - List of existing group chats.
 *
 * @returns {JSX.Element} The rendered CreateDirectChat modal component.
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries and mutations.
 * - Integrates with Material-UI and React-Bootstrap for UI components.
 * - Includes a search functionality to filter users by name.
 *
 * @example
 * ```tsx
 * <CreateDirectChatModal
 *   toggleCreateDirectChatModal={toggleModal}
 *   createDirectChatModalisOpen={isModalOpen}
 *   chatsListRefetch={refetchChats}
 *   chats={existingChats}
 * />
 * ```
 *
 */
import { Paper, TableBody } from '@mui/material';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type {
  ApolloCache,
  ApolloQueryResult,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';
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
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { errorHandler } from 'utils/errorHandler';
import type { TFunction } from 'i18next';
import { type GroupChat } from 'types/Chat/type';
interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
  chats: GroupChat[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

/**
 * Styled table row with custom styles.
 */

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
}));

const { getItem } = useLocalStorage();

export const handleCreateDirectChat = async (
  id: string,
  chats: GroupChat[],
  t: TFunction<'translation', 'userChat'>,
  createChat: {
    (
      options?:
        | MutationFunctionOptions<
            unknown,
            OperationVariables,
            DefaultContext,
            ApolloCache<unknown>
          >
        | undefined,
    ): Promise<FetchResult<unknown>>;
    (arg0: {
      variables: {
        organizationId: unknown;
        userIds: unknown[];
        isGroup: boolean;
      };
    }): unknown;
  },
  organizationId: string | undefined,
  userId: string | null,
  chatsListRefetch: {
    (
      variables?: Partial<{ id: string }> | undefined,
    ): Promise<ApolloQueryResult<unknown>>;
    (): Promise<ApolloQueryResult<unknown>>;
  },
  toggleCreateDirectChatModal: { (): void; (): void },
): Promise<void> => {
  const existingChat = chats.find(
    (chat) =>
      chat.users?.length === 2 && chat.users.some((user) => user._id === id),
  );
  if (existingChat) {
    const existingUser = existingChat.users.find((user) => user._id === id);
    errorHandler(
      t,
      new Error(
        `A conversation with ${existingUser?.firstName || 'this user'} already exists!`,
      ),
    );
  } else {
    try {
      await createChat({
        variables: { organizationId, userIds: [userId, id], isGroup: false },
      });
      await chatsListRefetch();
      toggleCreateDirectChatModal();
    } catch (error) {
      errorHandler(t, error);
    }
  }
};

export default function createDirectChatModal({
  toggleCreateDirectChatModal,
  createDirectChatModalisOpen,
  chatsListRefetch,
  chats,
}: InterfaceCreateDirectChatProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });
  const { orgId: organizationId } = useParams();

  const userId: string | null = getItem('userId');

  const [userName, setUserName] = useState('');

  const [createChat] = useMutation(CREATE_CHAT);

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(USERS_CONNECTION_LIST, {
    variables: { firstName_contains: '', lastName_contains: '' },
  });

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    const [firstName, lastName] = userName.split(' ');

    const newFilterData = {
      firstName_contains: firstName || '',
      lastName_contains: lastName || '',
    };

    allUsersRefetch({ ...newFilterData });
  };

  return (
    <>
      <Modal
        data-testid="createDirectChatModal"
        show={createDirectChatModalisOpen}
        onHide={toggleCreateDirectChatModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="createDirectChat">
          <Modal.Title>{'Chat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allUsersLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className={styles.inputContainer}>
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
                    className={styles.submitBtn}
                  >
                    <Search />
                  </Button>
                </Form>
              </div>
              <TableContainer
                className={styles.tableContainer}
                component={Paper}
              >
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
                              <Button
                                onClick={() => {
                                  handleCreateDirectChat(
                                    userDetails.user._id,
                                    chats,
                                    t,
                                    createChat,
                                    organizationId,
                                    userId,
                                    chatsListRefetch,
                                    toggleCreateDirectChatModal,
                                  );
                                }}
                                data-testid="addBtn"
                              >
                                {t('add')}
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
    </>
  );
}
