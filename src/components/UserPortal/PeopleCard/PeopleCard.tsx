import React from 'react';
import aboutImg from 'assets/images/defaultImg.png';
import styles from './PeopleCard.module.css';

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
<<<<<<< HEAD
  role: string;
  sno: string;
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
}

function peopleCard(props: InterfaceOrganizationCardProps): JSX.Element {
  const imageUrl = props.image ? props.image : aboutImg;

  return (
<<<<<<< HEAD
    <div className={`d-flex flex-row`}>
      <span style={{ flex: '1' }} className="d-flex">
        <span style={{ flex: '1' }} className="align-self-center">
          {props.sno}
        </span>
        <span style={{ flex: '1' }}>
          <img
            src={imageUrl}
            width="80px"
            height="auto"
            className={`${styles.personImage}`}
          />
        </span>
      </span>
      <b style={{ flex: '2' }} className="align-self-center">
        {props.name}
      </b>
      <span style={{ flex: '2' }} className="align-self-center">
        {props.email}
      </span>
      <div style={{ flex: '2' }} className="align-self-center">
        <div className={`w-75 border py-2 px-3 ${styles.borderBox}`}>
          <span className={`${styles.greenText}`}>{props.role}</span>
        </div>
=======
    <div className={styles.mainContainer}>
      <img
        src={imageUrl}
        width="80px"
        height="auto"
        className={styles.personImage}
      />
      <div className={styles.personDetails}>
        <b>{props.name}</b>
        <span>{props.email}</span>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </div>
  );
}

export default peopleCard;
