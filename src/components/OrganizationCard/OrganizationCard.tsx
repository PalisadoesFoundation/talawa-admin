import React from 'react';
import styles from './OrganizationCard.module.css';

function OrganizationCard(props: {
  key: any | undefined;
  image: string;
  name: string;
  lastName: string;
  firstName: string;
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
            <h4>{props.name}</h4>
            <h5>
              Owner:{props.firstName}
              &nbsp;
              {props.lastName}
            </h5>
          </div>
        </div>
        <div className={styles.deco}></div>
      </div>
    </>
  );
}

export default OrganizationCard;
