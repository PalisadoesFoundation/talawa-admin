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
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import type {
  ApolloCache,
  ApolloQueryResult,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import {
  CREATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Loader from 'components/Loader/Loader';
import { Search } from '@mui/icons-material';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { errorHandler } from 'utils/errorHandler';
import type { TFunction } from 'i18next';
import { type GroupChat } from 'types/Chat/type';

interface InterfaceOrganizationMember {
  id: string;
  name: string;
  avatarURL?: string;
  role: string;
}
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
  userName: string,
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
        input: {
          organizationId: string;
          name: string;
          description: string;
          avatar: null;
        };
      };
    }): unknown;
  },
  createChatMembership: {
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
        input: {
          memberId: string;
          chatId: string;
          role: string;
        };
      };
    }): unknown;
  },
  organizationId: string | undefined,
  userId: string | null,
  currentUserName: string,
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
      const chatResult = await createChat({
        variables: {
          input: {
            organizationId,
            name: `${currentUserName} & ${userName}`,
            description: 'A direct chat conversation',
            avatar: null,
          },
        },
      });

      const chatId = (chatResult.data as { createChat: { id: string } })
        ?.createChat?.id;

      if (chatId && userId) {
        await createChatMembership({
          variables: {
            input: {
              memberId: userId,
              chatId,
              role: 'regular',
            },
          },
        });
        await createChatMembership({
          variables: {
            input: {
              memberId: id,
              chatId,
              role: 'regular',
            },
          },
        });
      }

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

  // Support both 'userId' (for regular users) and 'id' (for admins)
  const userId: string | null = getItem('userId') || getItem('id');

  const [userName, setUserName] = useState('');

  const [createChat] = useMutation(CREATE_CHAT);
  const [createChatMembership] = useMutation(CREATE_CHAT_MEMBERSHIP);

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(ORGANIZATION_MEMBERS, {
    variables: {
      input: { id: organizationId },
      first: 20,
      after: null,
      where: {},
    },
  });
  const currentUser = allUsersData?.organization?.members?.edges?.find(
    (edge: { node: InterfaceOrganizationMember }) => edge.node.id === userId,
  )?.node;

  const currentUserName = currentUser?.name || 'You';

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    const trimmedName = userName.trim();

    allUsersRefetch({
      input: { id: organizationId },
      first: 20,
      after: null,
      where: trimmedName ? { name_contains: trimmedName } : undefined,
    });
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
                      allUsersData.organization?.members?.edges?.length > 0 &&
                      allUsersData.organization.members.edges
                        .filter(
                          ({
                            node: userDetails,
                          }: {
                            node: InterfaceOrganizationMember;
                          }) => userDetails.id !== userId,
                        )
                        .map(
                          (
                            {
                              node: userDetails,
                            }: { node: InterfaceOrganizationMember },
                            index: number,
                          ) => (
                            <StyledTableRow
                              data-testid="user"
                              key={userDetails.id}
                            >
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {userDetails.name}
                                <br />
                                {userDetails.role || 'Member'}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Button
                                  onClick={() => {
                                    handleCreateDirectChat(
                                      userDetails.id,
                                      userDetails.name,
                                      chats,
                                      t,
                                      createChat,
                                      createChatMembership,
                                      organizationId,
                                      userId,
                                      currentUserName,
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
