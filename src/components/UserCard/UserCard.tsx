import React from 'react';
import styles from './UserCard.module.css';

interface UserCardProps {
  key: any;
  firstName: any;
  lastName: any;
  image: any;
}

function UserCard(props: Details): JSX.Element {
  return (
    <>
      <div>
        <div className={styles.first_box}>
          {props.image ? (
            <img src={props.image} className={styles.alignimg} />
          ) : (
            <img
              src="https://via.placeholder.com/80"
              className={styles.alignimg}
            />
          )}
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
