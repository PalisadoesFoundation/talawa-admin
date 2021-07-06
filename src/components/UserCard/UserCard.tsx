import React from 'react';
import styles from './UserCard.module.css';

function UserCard(props: {
  key: any;
  firstName: any;
  lastName: any;
  image: any;
}): JSX.Element {
  return (
    <>
      <div>
        <div className={styles.first_box}>
          <img
            src="https://via.placeholder.com/80"
            className={styles.alignimg}
          />
          <div className={styles.second_box}>
            <h4>
              {props.firstName}
              &nbsp;
              {props.lastName}
            </h4>
            <h5>Location</h5>
          </div>
        </div>
        <div className={styles.deco}></div>
      </div>
    </>
  );
}

export default UserCard;
