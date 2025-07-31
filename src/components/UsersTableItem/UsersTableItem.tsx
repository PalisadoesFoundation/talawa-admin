import { useMutation } from '@apollo/client';
import { Search } from '@mui/icons-material';
import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';

type Props = {
  user: InterfaceQueryUserListItem;
  index: number;
  loggedInUserId: string;
  resetAndRefetch: () => void;
};
const UsersTableItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');
  const { user, index, resetAndRefetch } = props;
  const [showJoinedOrganizations, setShowJoinedOrganizations] = useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [removeUserProps, setremoveUserProps] = useState<{
    orgName: string;
    orgId: string;
  }>({ orgName: '', orgId: '' });
  const [joinedOrgs, setJoinedOrgs] = useState(user.organizationsWhereMember);
  const [searchByNameJoinedOrgs, setSearchByNameJoinedOrgs] = useState('');
  const [removeUser] = useMutation(REMOVE_MEMBER_MUTATION);
  // Note: UPDATE_USER_ROLE_IN_ORG_MUTATION may not be usable if no role info.
  const navigate = useNavigate();

  const confirmRemoveUser = async (): Promise<void> => {
    try {
      const { data } = await removeUser({
        variables: { userid: user.id, orgid: removeUserProps.orgId },
      });
      if (data) {
        toast.success(
          tCommon('removedSuccessfully', { item: 'User' }) as string,
        );
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  function goToOrg(_id: string): void {
    const url = '/orgdash/' + _id;
    navigate(url);
  }

  const searchJoinedOrgs = (value: string): void => {
    setSearchByNameJoinedOrgs(value);
    if (value == '') {
      setJoinedOrgs(user.organizationsWhereMember);
    } else {
      const filteredOrgs = user.organizationsWhereMember.edges.filter((org) =>
        org.node.name.toLowerCase().includes(value.toLowerCase()),
      );
      setJoinedOrgs({ edges: filteredOrgs });
    }
  };

  const handleSearchJoinedOrgs = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
      searchJoinedOrgs(value);
    }
  };
  const handleSearchButtonClickJoinedOrgs = (): void => {
    const inputValue =
      (document.getElementById('orgname-joined-orgs') as HTMLInputElement)
        ?.value || '';
    searchJoinedOrgs(inputValue);
  };

  return (
    <>
      <tr>
        <th scope="row">{index + 1}</th>
        <td>{user.name}</td>
        <td>{user.emailAddress}</td>
        <td>
          <Button
            className={`btn ${styles.editButton}`}
            onClick={() => setShowJoinedOrganizations(true)}
            data-testid={`showJoinedOrgsBtn${user.id}`}
          >
            {t('view')} ({user.organizationsWhereMember?.edges?.length})
          </Button>
        </td>
      </tr>
      {/* Modal: Organizations Joined */}
      <Modal
        show={showJoinedOrganizations}
        key={`modal-joined-org-${index}`}
        size="xl"
        data-testid={`modal-joined-org-${user.id}`}
        onHide={() => setShowJoinedOrganizations(false)}
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title className="text-white">
            {t('orgJoinedBy')} {user.name} (
            {user.organizationsWhereMember.edges.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.organizationsWhereMember.edges.length !== 0 && (
            <div className={'position-relative mb-4 border rounded'}>
              <Form.Control
                id="orgname-joined-orgs"
                className={styles.inputField}
                defaultValue={searchByNameJoinedOrgs}
                placeholder={t('searchByOrgName')}
                data-testid="searchByNameJoinedOrgs"
                autoComplete="off"
                onKeyUp={handleSearchJoinedOrgs}
              />
              <Button
                tabIndex={-1}
                className={styles.searchButton}
                onClick={handleSearchButtonClickJoinedOrgs}
                data-testid="searchBtnJoinedOrgs"
              >
                <Search />
              </Button>
            </div>
          )}
          <Row>
            {user.organizationsWhereMember?.edges?.length === 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {user.name} {t('hasNotJoinedAnyOrg')}
                </h4>
              </div>
            ) : joinedOrgs?.edges?.length === 0 ? (
              <div className={styles.notJoined}>
                <h4>
                  {tCommon('noResultsFoundFor')} &quot;
                  {searchByNameJoinedOrgs}
                  &quot;
                </h4>
              </div>
            ) : (
              <Table className={styles.modalTable} responsive>
                <thead>
                  <tr>
                    <th>{tCommon('name')}</th>
                    {/* Add more columns if you fetch more org data */}
                    <th>{tCommon('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {joinedOrgs?.edges?.map((org) => (
                    <tr key={`org-joined-${org?.node?.id}`}>
                      <td>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => goToOrg(org?.node.id)}
                        >
                          {org?.node?.name}
                        </Button>
                      </td>
                      <td>
                        <Button
                          className={`btn btn-danger ${styles.removeButton}`}
                          size="sm"
                          data-testid={`removeUserFromOrgBtn${org.node.id}`}
                          onClick={() => {
                            setremoveUserProps({
                              orgId: org.node.id,
                              orgName: org.node.name,
                            });
                            setShowJoinedOrganizations(false);
                            setShowRemoveUserModal(true);
                          }}
                        >
                          {tCommon('removeUser')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowJoinedOrganizations(false)}
            data-testid={`closeJoinedOrgsBtn${user.id}`}
          >
            {tCommon('close')}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal: Confirm Remove User from Org */}
      <Modal
        show={showRemoveUserModal}
        key={`modal-remove-org-${index}`}
        data-testid={`modal-remove-user-${user.id}`}
        onHide={() => setShowRemoveUserModal(false)}
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title className="text-white">
            {t('removeUserFrom', { org: removeUserProps.orgName })}
          </Modal.Title>
        </Modal.Header>
        <hr style={{ margin: 0 }}></hr>
        <Modal.Body>
          <p>
            {t('removeConfirmation', {
              name: user.name,
              org: removeUserProps.orgName,
            })}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRemoveUserModal(false)}
            data-testid={`closeRemoveUserModal${user.id}`}
          >
            {tCommon('close')}
          </Button>
          <Button
            className={`btn btn-danger ${styles.removeButton}`}
            onClick={confirmRemoveUser}
            data-testid={`confirmRemoveUser${user.id}`}
          >
            {tCommon('remove')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UsersTableItem;
