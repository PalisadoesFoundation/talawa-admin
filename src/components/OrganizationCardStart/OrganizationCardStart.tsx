import React from 'react';
import styles from './OrganizationCardStart.module.css';
import type { InterfaceOrganizationCardStartProps } from 'types/Organization/interface';

/**
 * Component to display a simplified card for an organization.
 *
 * @param image - URL of the organization's image.
 * @param id - Unique identifier for the organization.
 * @param name - Name of the organization.
 * @returns JSX element representing the organization card.
 */
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
