import React from 'react';
import aboutImg from 'assets/images/defaultImg.png';
import styles from './OrganizationCard.module.css';
import { Link } from 'react-router-dom';

// Define the props interface for the OrganizationCard component
interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
}


function organizationCard(props: InterfaceOrganizationCardProps): JSX.Element {
  // Set the image URL, use default image if not provided
  const imageUrl = props.image ? props.image : aboutImg;

  // Generate the link for redirecting to the organization details
  const redirectLink = `/user/organization/id=${props.id}`;

  return (
    <Link to={redirectLink} className={`${styles.removeDecoration}`}>
      <div className={styles.mainContainer}>
        <img src={imageUrl} width="100px" height="auto" />
        <div className={styles.organizationDetails}>
          <b>{props.name}</b>
          <span>{props.description}</span>
        </div>
      </div>
    </Link>
  );
}

export default organizationCard;
