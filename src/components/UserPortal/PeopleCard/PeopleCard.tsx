import React from 'react';
import aboutImg from 'assets/images/defaultImg.png';
import styles from './PeopleCard.module.css';

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
}

function peopleCard(props: InterfaceOrganizationCardProps): JSX.Element {
  const imageUrl = props.image ? props.image : aboutImg;

  return (
    <div className={styles.mainContainer}>
      <img src={imageUrl} width="100px" height="auto" />
      <div className={styles.personDetails}>
        <b>{props.name}</b>
        <span>{props.email}</span>
      </div>
    </div>
  );
}

export default peopleCard;
