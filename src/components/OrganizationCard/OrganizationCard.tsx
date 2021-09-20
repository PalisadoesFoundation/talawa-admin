import React from 'react';
import styles from './OrganizationCard.module.css';

interface OrganizationCardProps {
  key: any;
  image: string;
  id: string;
  name: string;
  lastName: string;
  firstName: string;
}

function OrganizationCard(props: OrganizationCardProps): JSX.Element {
  const uri = '/superorghome/i=' + props.id;

  return (
    <>
      <a href={uri}>
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
                Owner:
                <span>
                  {props.firstName}
                  &nbsp;
                  {props.lastName}
                </span>
              </h5>
            </div>
          </div>
          <div className={styles.deco}></div>
        </div>
      </a>
    </>
  );
}

export {};
export default OrganizationCard;
