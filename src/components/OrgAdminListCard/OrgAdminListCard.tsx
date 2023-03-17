import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
// import { ApolloProvider } from '@apollo/react-hooks';

import styles from './OrgAdminListCard.module.css';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface OrgPeopleListCardProps {
  key: string;
  id: string;
  memberName: string;
  joinDate: string;
  memberImage: string;
  memberEmail: string;
}
const currentUrl = window.location.href.split('=')[1];

function OrgAdminListCard(props: OrgPeopleListCardProps): JSX.Element {
  const [remove] = useMutation(REMOVE_ADMIN_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgAdminListCard',
  });

  const RemoveAdmin = async () => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('The admin is removed.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
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
  return (
    <>
      <div className={styles.peoplelistdiv}>
        <Row className={styles.memberlist}>
          {props.memberImage ? (
            <img src={props.memberImage} className={styles.memberimg} />
          ) : (
            <img
              src="https://via.placeholder.com/200x100"
              className={styles.memberimg}
            />
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
                data-target={`#removeAdminModal${props.id}`}
                data-testid="removeAdminModalBtn"
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
        id={`removeAdminModal${props.id}`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={`removeAdminModalLabel${props.id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`removeAdminModalLabel${props.id}`}
              >
                {t('removeAdmin')}
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
            <div className="modal-body">{t('removeAdminMsg')}</div>
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
                onClick={RemoveAdmin}
                data-testid="removeAdminBtn"
              >
                {t('yes')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export {};
export default OrgAdminListCard;
