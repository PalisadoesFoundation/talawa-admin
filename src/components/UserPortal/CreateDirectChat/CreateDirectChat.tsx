import { Paper, TableBody } from '@mui/material';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
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
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from '../../../style/app.module.css';

interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
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

export default function createDirectChatModal({
  toggleCreateDirectChatModal,
  createDirectChatModalisOpen,
  chatsListRefetch,
}: InterfaceCreateDirectChatProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });
  const { orgId: organizationId } = useParams();

  const userId: string | null = getItem('userId');

  const [userName, setUserName] = useState('');

  const [createChat] = useMutation(CREATE_CHAT);

  const handleCreateDirectChat = async (id: string): Promise<void> => {
    await createChat({
      variables: {
        organizationId,
        userIds: [userId, id],
        isGroup: false,
      },
    });
    await chatsListRefetch();
    toggleCreateDirectChatModal();
  };

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
                                  handleCreateDirectChat(userDetails.user._id);
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
