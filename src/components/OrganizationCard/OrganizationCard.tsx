import React from 'react';
import { Link } from 'react-router-dom';
import styles from './OrganizationCard.module.css';

interface Details {
  key: any;
  image: string;
  id: string;
  name: string;
  lastName: string;
  firstName: string;
}

function OrganizationCard(props: Details): JSX.Element {
  const uri = '/superorghome/i=' + props.id;

  return (
    <>
      <Link to={uri}>
        <div className={styles.box}>
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
      </Link>
    </>
  );
}

export default OrganizationCard;
