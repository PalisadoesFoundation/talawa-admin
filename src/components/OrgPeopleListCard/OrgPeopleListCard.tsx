import React from 'react';
import styles from './OrgPeopleListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

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
        window.alert('The Member is removed');
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
                data-target={`#removeMemberModal${props.id}`}
                data-testid="removeMemberModalBtn"
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
                Remove Member
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
            <div className="modal-body">Do you want to remove this member?</div>
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
                onClick={RemoveMember}
                data-testid="removeMemberBtn"
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
export default OrgPeopleListCard;
