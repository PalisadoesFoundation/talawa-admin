import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
// import { ApolloProvider } from '@apollo/react-hooks';

import styles from './OrgAdminListCard.module.css';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';

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
        window.alert('The admin is removed.');
        window.location.reload();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
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
              <p className={styles.membername}>
                {props.memberName ? <>{props.memberName}</> : <>Dogs Care</>}
              </p>
              <p className={styles.memberfontcreated}>{props.memberEmail}</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                Joined: <span>{props.joinDate}</span>
              </p>
              <button
                className={styles.memberfontcreatedbtn}
                data-toggle="modal"
                data-target="#removeAdminModal"
                data-testid="removeAdminModalBtn"
              >
                Remove
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <hr></hr>
      <div
        className="modal fade"
        id="removeAdminModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="removeAdminModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="removeAdminModalLabel">
                Remove Admin
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
            <div className="modal-body">Do you want to remove this admin?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={RemoveAdmin}
                data-testid="removeAdminBtn"
              >
                Yes
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
