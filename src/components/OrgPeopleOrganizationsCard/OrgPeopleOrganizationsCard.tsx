import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrgPeopleOrganizationsCard.module.css';
import { Tooltip } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useState } from 'react';
import { InterfaceOrgPeopleOrganizationsCard } from 'utils/interfaces';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
  ADD_MEMBER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';

function OrgPeopleOrganizationsCard(
  props: InterfaceOrgPeopleOrganizationsCard,
): JSX.Element {
  const {
    userId: userID,
    _id,
    admins,
    blockedUsers,
    members,
    resetAndRefetch,
    image,
    name,
    description,
  } = props;

  const [addMember] = useMutation(ADD_MEMBER_MUTATION);

  const [blockUser] = useMutation(BLOCK_USER_MUTATION);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPeopleOrganizationsCard',
  });

  const [role, setRole] = useState(
    admins.some((member) => member._id === userID) ? 'Admin' : 'User',
  );
  const [status, setStatus] = useState(
    blockedUsers.some((member) => member._id === userID) ? 'Blocked' : 'Active',
  );
  const [member, setMember] = useState(
    members.some((member) => member._id === userID) ? 'Yes' : 'No',
  );

  const [updateUserInOrgType] = useMutation(UPDATE_USER_ROLE_IN_ORG_MUTATION);
  const [remove] = useMutation(REMOVE_MEMBER_MUTATION);

  const handleBlockUser = async (): Promise<void> => {
    try {
      const { data } = await blockUser({
        variables: {
          userId: userID,
          orgId: _id,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('blockedSuccessfully'));
        setMember('No');
        setStatus('Blocked');
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleUnBlockUser = async (): Promise<void> => {
    try {
      const { data } = await unBlockUser({
        variables: {
          userId: userID,
          orgId: _id,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('Un-BlockedSuccessfully'));
        setMember('No');
        setStatus('Active');
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const removeMember = async (): Promise<void> => {
    const memberIds = members.map((member) => member._id);

    if (memberIds.includes(userID)) {
      try {
        const { data } = await remove({
          variables: {
            userid: userID,
            orgid: _id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          toast.success(t('memberRemoved'));
          setMember('No');

          resetAndRefetch();
        }
      } catch (error: unknown) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    } else {
      toast.error(t('notMember'));
    }
  };
  const acceptMember = async (): Promise<void> => {
    const memberIds = members.map((member) => member._id);
    const blockedUserIds = blockedUsers.map((member) => member._id);
    if (!memberIds.includes(userID) && !blockedUserIds.includes(userID)) {
      try {
        await addMember({
          variables: {
            userid: userID,
            orgid: _id,
          },
        });

        toast.success('Member added to the organization.');
        setMember('Yes');
        resetAndRefetch();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    } else {
      if (!blockedUserIds.includes(userID)) {
        toast.error(t('blockedUser'));
      }
      toast.error('You are already a member of this organization.');
    }
  };
  const changeRoleInOrg = async (roleToUpdate: string): Promise<void> => {
    const memberIds = members.map((member) => member._id);

    if (memberIds.includes(userID)) {
      try {
        const { data } = await updateUserInOrgType({
          variables: {
            userId: userID,
            role: roleToUpdate,
            organizationId: _id,
          },
        });
        if (data) {
          toast.success(t('roleUpdated'));
          setRole(roleToUpdate);
          resetAndRefetch();
        }
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    } else {
      toast.error(t('notMember'));
    }
  };
  return (
    <Row>
      <div className={styles.orgCard}>
        <div
          className={styles.innerContainer}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Col sm={7}>
            <div className={styles.orgImgContainer}>
              {image ? (
                <img src={image} alt={`${name} image`} />
              ) : (
                <Avatar
                  name={name}
                  alt={`${name} image`}
                  dataTestId="emptyContainerForImage"
                />
              )}
              <div className={styles.content}></div>
            </div>
            <div className={styles.orgDetails}>
              <Tooltip title={name} placement="top-end">
                <h4 className={`${styles.orgName} fw-semibold`}>{name}</h4>
              </Tooltip>
              <h6 className={`${styles.orgdesc} fw-semibold`}>
                <span>{description}</span>
              </h6>
            </div>
          </Col>
          <Col sm={4}>
            <Dropdown
              drop="down-centered"
              className="d-flex align-items-center w-100 mt-2 mb-2"
            >
              <Col sm={4}>
                <Dropdown.Header className={styles.dropdownTitle}>
                  Role
                </Dropdown.Header>
              </Col>
              <Col sm={7}>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-role"
                  data-testid="dropdown-role"
                  className="w-100"
                  disabled={member !== 'Yes'}
                >
                  {role}
                </Dropdown.Toggle>
              </Col>
              <Dropdown.Menu>
                <Dropdown.Item
                  data-testid="user-item"
                  onClick={() => {
                    changeRoleInOrg('USER');
                  }}
                >
                  User
                </Dropdown.Item>
                <Dropdown.Item
                  data-testid="admin-item"
                  onClick={() => {
                    changeRoleInOrg('ADMIN');
                  }}
                >
                  Admin
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              drop="down-centered"
              className="  d-flex align-items-center w-100 mt-2 mb-2"
              onSelect={(e) => {}}
            >
              <Col sm={4}>
                <Dropdown.Header className={styles.dropdownTitle}>
                  Member
                </Dropdown.Header>
              </Col>
              <Col sm={7}>
                <Dropdown.Toggle
                  variant={
                    member === 'No' ? 'outline-danger' : 'outline-success'
                  }
                  id="dropdown-member"
                  data-testid="dropdown-member"
                  className="w-100"
                >
                  {member}
                </Dropdown.Toggle>
              </Col>
              <Dropdown.Menu>
                <Dropdown.Item
                  eventKey="accept"
                  data-testid="accept-item"
                  onClick={() => {
                    acceptMember();
                  }}
                >
                  {t('yes')}
                </Dropdown.Item>
                <Dropdown.Item
                  data-testid="reject-item"
                  eventKey="reject"
                  onClick={() => {
                    removeMember();
                  }}
                >
                  {t('no')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              drop="down-centered"
              className="d-flex align-items-center w-100 mt-2 mb-2"
            >
              <Col sm={4}>
                <Dropdown.Header className={styles.dropdownTitle}>
                  Status
                </Dropdown.Header>
              </Col>

              <Col sm={7}>
                <Dropdown.Toggle
                  variant={
                    status === 'Blocked' ? 'outline-danger' : 'outline-success'
                  }
                  data-testid="dropdown-status"
                  id="dropdown-status"
                  className="w-100"
                >
                  {status}
                </Dropdown.Toggle>
              </Col>
              <Dropdown.Menu>
                <Dropdown.Item
                  data-testid="UnblockItem"
                  onClick={() => {
                    handleUnBlockUser();
                  }}
                >
                  Active
                </Dropdown.Item>
                <Dropdown.Item
                  data-testid="block-item"
                  onClick={() => {
                    handleBlockUser();
                  }}
                >
                  Blocked
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </div>
      </div>
    </Row>
  );
}
export default OrgPeopleOrganizationsCard;
