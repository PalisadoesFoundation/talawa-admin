import React from 'react';
import aboutImg from 'assets/images/defaultImg.png';
import styles from './PeopleCard.module.css';

/**
 * Props interface for the PeopleCard component.
 */
interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

/**
 * PeopleCard component displays information about a person within an organization.
 *
 * It includes:
 * - An image of the person or a default image if none is provided.
 * - The serial number of the person.
 * - The person's name.
 * - The person's email address.
 * - The person's role within the organization, styled with a border.
 *
 * @param props - The properties passed to the component.
 * @returns JSX.Element representing a card with the person's details.
 */
function peopleCard(props: InterfaceOrganizationCardProps): JSX.Element {
  // Determine the image URL; use default image if no image URL is provided
  const imageUrl = props.image ? props.image : aboutImg;

  return (
    <div className={`d-flex flex-row`}>
      {/* Container for serial number and image */}
      <span style={{ flex: '1' }} className="d-flex">
        {/* Serial number */}
        <span style={{ flex: '1' }} className="align-self-center">
          {props.sno}
        </span>
        {/* Person's image */}
        <span style={{ flex: '1' }}>
          <img
            src={imageUrl}
            width="80px"
            height="auto"
            className={`${styles.personImage}`}
          />
        </span>
      </span>
      {/* Person's name */}
      <b style={{ flex: '2' }} className="align-self-center">
        {props.name}
      </b>
      {/* Person's email */}
      <span style={{ flex: '2' }} className="align-self-center">
        {props.email}
      </span>
      {/* Person's role with additional styling */}
      <div style={{ flex: '2' }} className="align-self-center">
        <div className={`w-75 border py-2 px-3 ${styles.borderBox}`}>
          <span className={`${styles.greenText}`}>{props.role}</span>
        </div>
      </div>
    </div>
  );
}

export default peopleCard;
