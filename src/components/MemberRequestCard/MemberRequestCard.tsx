/**
 * MemberRequestCard Component
 *
 * This component represents a card displaying details of a membership request.
 * It provides functionality to accept or reject a membership request.
 *
 * @param {InterfaceMemberRequestCardProps} props - The properties passed to the component.
 * @param {string} props.id - The unique identifier of the membership request.
 * @param {string} [props.memberImage] - The URL of the member's profile image.
 * @param {string} [props.memberName] - The name of the member.
 * @param {string} [props.memberLocation] - The location of the member.
 * @param {string} [props.email] - The email address of the member.
 * @param {string} [props.joinDate] - The date the member requested to join.
 *
 * @returns {JSX.Element} A JSX element representing the membership request card.
 *
 * @remarks
 * - The component uses GraphQL mutations to handle accept and reject actions.
 * - It utilizes `react-toastify` for success notifications and `window.confirm` for rejection confirmation.
 * - The `useTranslation` hook is used for internationalization.
 * - The `errorHandler` utility is used to handle errors gracefully.
 *
 * @example
 * ```tsx
 * <MemberRequestCard
 *   id="123"
 *   memberImage="https://example.com/image.jpg"
 *   memberName="John Doe"
 *   memberLocation="New York"
 *   email="john.doe@example.com"
 *   joinDate={dayjs().subtract(1, 'year').format('YYYY-MM-DD')}}
 * />
 * ```
 */
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
import defaultImg from 'assets/images/blank.png';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceMemberRequestCardProps } from 'types/Member/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

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
      NotificationToast.success(t('memberAdded') as string);

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
          <ProfileAvatarDisplay
            fallbackName={memberName}
            imageUrl={memberImage || defaultImg}
            size="medium"
          />
          <Col className={styles.singledetails}>
            <div className={styles.singledetails_data_left}>
              <p className={styles.membername}>{memberName}</p>
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
