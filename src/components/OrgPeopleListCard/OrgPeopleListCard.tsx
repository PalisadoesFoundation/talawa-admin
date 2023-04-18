import React from 'react';
import styles from './OrgPeopleListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { Link } from 'react-router-dom';
import defaultImg from 'assets/third_image.png';
import { errorHandler } from 'utils/errorHandler';

interface OrgPeopleListCardProps {
  key: string;
  id: string;
  memberName: string;
  joinDate: string;
  memberImage: string;
  memberEmail: string;
}

function OrgPeopleListCard(props: OrgPeopleListCardProps): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];
  const [remove] = useMutation(REMOVE_MEMBER_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPeopleListCard',
  });

  const RemoveMember = async () => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('memberRemoved'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };
  return (
    <div>
      <div className={styles.peoplelistdiv} data-testid="peoplelistitem">
        <Row className={styles.memberlist}>
          {props.memberImage ? (
            <img src={props.memberImage} className={styles.memberimg} />
          ) : (
            <img src={defaultImg} className={styles.memberimg} />
          )}
          <Col className={styles.singledetails}>
            <div className={styles.singledetails_data_left}>
              <Link
                className={styles.membername}
                to={{
                  pathname: `/member/id=${currentUrl}`,
                  state: { id: props.id },
                }}
              >
                {props.memberName ? <>{props.memberName}</> : <>Dogs Care</>}
              </Link>
              <p className={styles.memberfontcreated}>{props.memberEmail}</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                {t('joined')}: <span>{props.joinDate}</span>
              </p>
              <button
                className={styles.memberfontcreatedbtn}
                data-toggle="modal"
                data-target={`#removeMemberModal${props.id}`}
                data-testid="removeMemberModalBtn"
              >
                {t('remove')}
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <hr></hr>

      <div
        className="modal fade"
        id={`removeMemberModal${props.id}`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={`removeMemberModalLabel${props.id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`removeMemberModalLabel${props.id}`}
              >
                {t('removeMember')}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{t('removeMemberMsg')}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                {t('no')}
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={RemoveMember}
                data-testid="removeMemberBtn"
              >
                {t('yes')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export {};
export default OrgPeopleListCard;
