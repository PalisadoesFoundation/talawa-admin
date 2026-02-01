/**
 * Modal that lets a user start a direct chat with another member.
 *
 * Presents a searchable member list and creates the two-person chat plus memberships.
 *
 * @remarks
 * Uses Apollo Client for member queries and chat mutations, Material UI and React-Bootstrap for UI,
 * and i18n strings for labels.
 *
 * @param props - Modal controls, refetch handler, and existing chats.
 * @returns The rendered CreateDirectChat modal.
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
 */
import { Paper, TableBody } from '@mui/material';
import React, { useState } from 'react';
import Button from 'shared-components/Button';

import { useQuery, useMutation } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import {
  CREATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './CreateDirectChat.module.css';
import { errorHandler } from 'utils/errorHandler';

import type {
  InterfaceOrganizationMember,
  InterfaceCreateDirectChatProps,
  InterfaceHandleCreateDirectChatParams,
} from 'types/UserPortal/Chat/interface';

import SearchBar from 'shared-components/SearchBar/SearchBar';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

/**
 * Handles the logic for checking existing chats and creating a new direct chat if one doesn't exist.
 *
 * @param params - The parameters object containing user info, chat data, and mutation functions.
 * @returns Resolves when the direct chat check/creation completes.
 */

export const handleCreateDirectChat = async (
  params: InterfaceHandleCreateDirectChatParams,
): Promise<void> => {
  const {
    id,
    userName,
    chats,
    t,
    tCommon,
    createChat,
    createChatMembership,
    organizationId,
    userId,
    currentUserName,
    chatsListRefetch,
    toggleCreateDirectChatModal,
  } = params;

  // Check if a direct chat with this user already exists
  // Direct chats have exactly 2 members & are NOT groups
  const existingChat = chats.find((chat) => {
    const edges = chat.members?.edges;
    return (
      !chat.isGroup &&
      edges?.length === 2 &&
      edges?.some((edge) => edge.node?.user?.id === id)
    );
  });
  if (existingChat) {
    const existingUser = existingChat.members?.edges?.find(
      (edge) => edge.node?.user?.id === id,
    )?.node?.user;
    errorHandler(
      t,
      new Error(
        t('directChatExists', {
          name: existingUser?.name ?? tCommon('unknownUser'),
        }),
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
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');
  const { orgId: organizationId } = useParams();
  const { getItem } = useLocalStorage();

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

  const handleUserModalSearchChange = (value: string): void => {
    const trimmedName = value.trim();
    allUsersRefetch({
      input: { id: organizationId },
      first: 20,
      after: null,
      where: trimmedName ? { name_contains: trimmedName } : undefined,
    });
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={chatsListRefetch}
    >
      <BaseModal
        dataTestId="createDirectChatModal"
        show={createDirectChatModalisOpen}
        onHide={toggleCreateDirectChatModal}
        title={t('chat', { defaultValue: 'Chat' })}
        className={styles.modalContent}
        headerTestId="createDirectChat"
      >
        <LoadingState
          isLoading={allUsersLoading}
          variant="inline"
          size="lg"
          data-testid="createDirectChatLoading"
        >
          <>
            <div className={styles.inputContainer}>
              <SearchBar
                placeholder={t('searchFullName', {
                  defaultValue: 'Search full name',
                })}
                value={userName}
                onChange={(value) => setUserName(value)}
                onSearch={(value) => handleUserModalSearchChange(value)}
                onClear={() => {
                  setUserName('');
                  handleUserModalSearchChange('');
                }}
                inputTestId="searchUser"
                buttonTestId="submitBtn"
              />
            </div>
            <TableContainer className={styles.tableContainer} component={Paper}>
              <Table
                aria-label={t('organizationMembersTable', {
                  defaultValue: 'Organization Members Table',
                })}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {tCommon('hash', { defaultValue: '#' })}
                    </TableCell>
                    <TableCell align="center">
                      {t('user', { defaultValue: 'User' })}
                    </TableCell>
                    <TableCell align="center">
                      {t('chat', { defaultValue: 'Chat' })}
                    </TableCell>
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
                          <TableRow data-testid="user" key={userDetails.id}>
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell align="center">
                              {userDetails.name}
                              <br />
                              {userDetails.role ||
                                t('role.member', { defaultValue: 'Member' })}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() => {
                                  handleCreateDirectChat({
                                    id: userDetails.id,
                                    userName: userDetails.name,
                                    chats,
                                    t,
                                    tCommon,
                                    createChat,
                                    createChatMembership,
                                    organizationId,
                                    userId,
                                    currentUserName,
                                    chatsListRefetch,
                                    toggleCreateDirectChatModal,
                                  });
                                }}
                                data-testid="addBtn"
                              >
                                {t('add', { defaultValue: 'Add' })}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        </LoadingState>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
}
