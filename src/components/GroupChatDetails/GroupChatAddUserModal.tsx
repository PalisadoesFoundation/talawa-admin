import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_CHAT_MEMBERSHIP } from 'GraphQl/Mutations/OrganizationMutations';
import Loader from 'components/Loader/Loader';
import { toast } from 'react-toastify';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from '@mui/material';
import styles from 'style/app-fixed.module.css';
import type { InterfaceGroupChatDetailsProps } from 'types/Chat/interface';

interface InterfaceGroupChatAddUserModalProps {
  show: boolean;
  toggle: () => void;
  chat: InterfaceGroupChatDetailsProps['chat'];
  chatRefetch: InterfaceGroupChatDetailsProps['chatRefetch'];
  t: (k: string, v?: Record<string, unknown>) => string;
}

export default function GroupChatAddUserModal(
  props: InterfaceGroupChatAddUserModalProps,
) {
  const { show, toggle, chat, chatRefetch, t } = props;
  const [userName, setUserName] = useState('');

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(ORGANIZATION_MEMBERS, {
    variables: {
      input: { id: chat.organization?.id },
      first: 20,
      after: null,
      where: {},
    },
  });

  const [addUser] = useMutation(CREATE_CHAT_MEMBERSHIP);

  const addUserToGroupChat = async (userId: string): Promise<boolean> => {
    try {
      await addUser({
        variables: {
          input: { memberId: userId, chatId: chat.id, role: 'regular' },
        },
      });
      toast.success(t('userAddedSuccess'));
      return true;
    } catch (error) {
      toast.error(t('failedAddUser'));

      console.error(error);
      return false;
    }
  };

  const handleUserModalSearchChange = (value: string): void => {
    const trimmedName = value.trim();
    allUsersRefetch({
      input: { id: chat.organization?.id },
      first: 20,
      after: null,
      where: trimmedName ? { name_contains: trimmedName } : {},
    });
  };

  return (
    <Modal
      data-testid="addExistingUserModal"
      show={show}
      onHide={toggle}
      contentClassName={styles.modalContent}
    >
      <Modal.Header closeButton data-testid="pluginNotificationHeader">
        <Modal.Title>{t('chat')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {allUsersLoading ? (
          <Loader />
        ) : (
          <>
            <div className={styles.input}>
              <SearchBar
                placeholder={t('searchFullName')}
                value={userName}
                onChange={(value) => {
                  setUserName(value);
                  handleUserModalSearchChange(value);
                }}
                onSearch={(value) => handleUserModalSearchChange(value)}
                onClear={() => {
                  setUserName('');
                  handleUserModalSearchChange('');
                }}
                inputTestId="searchUser"
                buttonTestId="searchBtn"
              />
            </div>

            <TableContainer className={styles.userData} component={Paper}>
              <Table aria-label={t('customizedTable')}>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.groupChatTableCellHead}>
                      #
                    </TableCell>
                    <TableCell
                      className={styles.groupChatTableCellHead}
                      align="center"
                    >
                      {t('user')}
                    </TableCell>
                    <TableCell
                      className={styles.groupChatTableCellHead}
                      align="center"
                    >
                      {t('chat')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody data-testid="userList">
                  {allUsersData &&
                    allUsersData.organization?.members?.edges?.length > 0 &&
                    allUsersData.organization.members.edges
                      .filter(
                        ({ node: userDetails }: { node: { id: string } }) =>
                          !chat.members.edges.some(
                            (edge) => edge.node.user?.id === userDetails.id,
                          ),
                      )
                      .map(
                        (
                          {
                            node: userDetails,
                          }: {
                            node: {
                              id: string;
                              name: string;
                              avatarURL?: string;
                              role: string;
                            };
                          },
                          index: number,
                        ) => (
                          <TableRow data-testid="user" key={userDetails.id}>
                            <TableCell
                              component="th"
                              scope="row"
                              className={styles.groupChatTableCellBody}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={styles.groupChatTableCellBody}
                            >
                              {userDetails.name}
                              <br />
                              {userDetails.role || t('member')}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={styles.groupChatTableCellBody}
                            >
                              <Button
                                type="button"
                                onClick={async () => {
                                  const ok = await addUserToGroupChat(
                                    userDetails.id,
                                  );
                                  if (ok) {
                                    toggle();
                                    chatRefetch({ input: { id: chat.id } });
                                  }
                                }}
                                data-testid="addUserBtn"
                              >
                                {t('add')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
