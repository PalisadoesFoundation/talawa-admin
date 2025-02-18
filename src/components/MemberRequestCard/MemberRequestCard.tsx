import React from 'react';
import styles from './MemberRequestCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import defaultImg from 'assets/images/blank.png';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceMemberRequestCardProps } from 'types/Member/interface';

/**
 * Component for displaying and managing member requests.
 *
 * @param props - Properties for the member request card.
 * @returns JSX element for member request card.
 */

function MemberRequestCard({
  id,
  memberImage,
  memberName,
  memberLocation,
  email,
  joinDate,
}: InterfaceMemberRequestCardProps): JSX.Element {
  const [acceptMutation] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectMutation] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'membershipRequest',
  });
  const { t: tCommon } = useTranslation('common');

  const addMember = async (): Promise<void> => {
    try {
      await acceptMutation({ variables: { id } });
      toast.success(t('memberAdded') as string);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const rejectMember = async (): Promise<void> => {
    const sure = window.confirm('Are you sure you want to Reject Request ?');
    if (sure) {
      try {
        await rejectMutation({ variables: { userid: id } });
        window.location.reload();
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    }
  };

  return (
    <>
      <div className={styles.peoplelistdiv}>
        <Row className={styles.memberlist}>
          {memberImage ? (
            <img
              src={memberImage}
              className={styles.alignimg}
              alt="userImage"
            />
          ) : (
            <img
              src={defaultImg}
              className={styles.memberimg}
              alt="userImage"
            />
          )}
          <Col className={styles.singledetails}>
            <div className={styles.singledetails_data_left}>
              <p className={styles.membername}>
                {memberName ? <>{memberName}</> : <>Dogs Care</>}
              </p>
              <p className={styles.memberfont}>{memberLocation}</p>
              <p className={styles.memberfontcreated}>{email}</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                {tCommon('joined')}: <span>{joinDate}</span>
              </p>
              <Button
                className={styles.memberfontcreatedbtn}
                onClick={addMember}
              >
                {t('accept')}
              </Button>
              <Button
                className={styles.memberfontcreatedbtn}
                onClick={rejectMember}
              >
                {t('reject')}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <hr />
    </>
  );
}

export default MemberRequestCard;
