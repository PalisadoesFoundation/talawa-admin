import React from 'react';
import styles from './MemberRequestCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import defaultImg from 'assets/third_image.png';

interface MemberRequestCardProps {
  key: string;
  id: string;
  memberName: string;
  memberLocation: string;
  joinDate: string;
  memberImage: string;
  email: string;
}

function MemberRequestCard(props: MemberRequestCardProps): JSX.Element {
  const [acceptMutation] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectMutation] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'membershipRequest',
  });

  const AddMember = async () => {
    try {
      await acceptMutation({
        variables: {
          id: props.id,
        },
      });

      /* istanbul ignore next */
      toast.success('it is accepted');
      /* istanbul ignore next */
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'Failed to fetch') {
        toast.error(
          'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  const RejectMember = async () => {
    const sure = window.confirm('Are you sure you want to Reject Request ?');
    if (sure) {
      try {
        await rejectMutation({
          variables: {
            userid: props.id,
          },
        });

        /* istanbul ignore next */
        window.location.reload();
      } catch (error: any) {
        /* istanbul ignore next */
        if (error.message === 'Failed to fetch') {
          toast.error(
            'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
          );
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  return (
    <>
      <div className={styles.peoplelistdiv}>
        <Row className={styles.memberlist}>
          {props.memberImage ? (
            <img
              src={props.memberImage}
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
                {props.memberName ? <>{props.memberName}</> : <>Dogs Care</>}
              </p>
              <p className={styles.memberfont}>{props.memberLocation}</p>
              <p className={styles.memberfontcreated}>{props.email}</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                {t('joined')}: <span>{props.joinDate}</span>
              </p>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={AddMember}
              >
                {t('accept')}
              </button>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={RejectMember}
              >
                {t('reject')}
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <hr></hr>
    </>
  );
}
export {};
export default MemberRequestCard;
