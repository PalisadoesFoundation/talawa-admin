import React from 'react';
import styles from './OrganizationCard.module.css';

/**
 * Props for the `organizationCard` component.
 * @typedef {Object} InterfaceOrganizationCardProps
 * @property {any} key - Key for React's reconciliation algorithm.
 * @property {string} image - URL of the organization's image.
 * @property {string} id - Identifier for the organization.
 * @property {string} name - Name of the organization.
 * @property {string} lastName - Last name of the organization owner.
 * @property {string} firstName - First name of the organization owner.
 */

/**
 * `organizationCard` is a React component that represents a card displaying information of a particular organization.
 * @component
 *
 * @param {InterfaceOrganizationCardProps} props - The props object containing organization data.
 * @returns {JSX.Element} A JSX element representing the organization card.
 *
 * @example
 * // Usage of the `organizationCard` component
 * <organizationCard
 *   key={orgData.id}
 *   image={orgData.image}
 *   id={orgData.id}
 *   name={orgData.name}
 *   firstName={orgData.owner.firstName}
 *   lastName={orgData.owner.lastName}
 * />
 */

interface InterfaceOrganizationCardProps {
  key: any;
  image: string;
  id: string;
  name: string;
  lastName: string;
  firstName: string;
}

function organizationCard(props: InterfaceOrganizationCardProps): JSX.Element {
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
                <span>{props.firstName}</span>
                <span>
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
export default organizationCard;
