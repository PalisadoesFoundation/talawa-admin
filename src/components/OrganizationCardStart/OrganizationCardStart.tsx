import React from 'react';
import styles from './OrganizationCardStart.module.css';

/**
* Props for the `organizationCardStart` component.
* @typedef {Object} InterfaceOrganizationCardStartProps
* @property {any} key - Key for React's reconciliation algorithm.
* @property {string} image - URL of the organization's image.
* @property {string} id - Identifier for the organization.
* @property {string} name - Name of the organization.
*/

/**
* `organizationCardStart` represents a simplified card displaying basic organization information.
* This data is a subset to the one displayed in OrganizationCard.
* @component
*
* @param {InterfaceOrganizationCardStartProps} props - The props object containing organization data.
* @returns {JSX.Element} A JSX element representing the basic organization card.
*
* @example
* // Usage of the `organizationCardStart` component
* <organizationCardStart
*   key={orgData.id}
*   image={orgData.image}
*   id={orgData.id}
*   name={orgData.name}
* />
*/

interface InterfaceOrganizationCardStartProps {
  key: any;
  image: string;
  id: string;
  name: string;
}

function organizationCardStart(
  props: InterfaceOrganizationCardStartProps
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
