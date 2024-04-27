import React from 'react';
import styles from './OrganizationCardStart.module.css';

interface InterfaceOrganizationCardStartProps {
  key: any;
  image: string;
  id: string;
  name: string;
}

function organizationCardStart(
  props: InterfaceOrganizationCardStartProps,
): JSX.Element {
  const uri = '/orghome/i=' + props.id;

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
              <h5></h5>
            </div>
          </div>
          <div className={styles.deco}></div>
        </div>
      </a>
    </>
  );
}

export default organizationCardStart;
