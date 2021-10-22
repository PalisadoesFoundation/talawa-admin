import React from 'react';
import styles from './OrgAdminListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';

// import { ApolloProvider } from '@apollo/react-hooks';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
interface OrgPeopleListCardProps {
  key: string;
  id: string;
  memberName: string;
  memberLocation: string;
  joinDate: string;
  memberImage: string;
}
const currentUrl = window.location.href.split('=')[1];

/**
 * Displays the details about an organization administrator
 * @author Yasharth Dubey
 * @param {props} OrgPeopleListCard
 * @returns template for the card that displays information on a selected admin
 */
function OrgAdminListCard(props: OrgPeopleListCardProps): JSX.Element {
  const [remove] = useMutation(REMOVE_ADMIN_MUTATION);

  /**
   * Allows user to remove an organization administrator from their position
   * @author Yasharth Dubey
   * @param none, howeever passes the url for the organization and the ID of the organization admin to be removed 
   * @async 
   */
  const RemoveAdmin = async () => {
    console.log(currentUrl);
    console.log(props.id);
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });
      console.log(data);
      window.alert('The admin is removed');
      window.location.reload();
    } catch (error) {
      window.alert(error);
    }
  };
  return (
    <>
      <div className={styles.peoplelistdiv}>
        <Row className={styles.memberlist}>
          {props.memberImage ? (
            <img src={props.memberImage} className={styles.alignimg} />
          ) : (
            <img
              src="https://via.placeholder.com/200x100"
              className={styles.memberimg}
            />
          )}
          <Col className={styles.singledetails}>
            <div className={styles.singledetails_data_left}>
              <p className={styles.membername}>
                {props.memberName ? (
                  <p>{props.memberName}</p>
                ) : (
                  <p>Dogs Care</p>
                )}
              </p>
              <p className={styles.memberfont}>
                <span>{props.memberLocation}</span>
              </p>
              <p className={styles.memberfontcreated}>saumya47999@gmail.com</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                Joined: <span>{props.joinDate}</span>
              </p>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={RemoveAdmin}
              >
                Remove
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
export default OrgAdminListCard;
