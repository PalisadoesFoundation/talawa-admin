import React from 'react';
import styles from './ContactCard.module.css';
<<<<<<< HEAD
import Avatar from 'components/Avatar/Avatar';
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

interface InterfaceContactCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  setSelectedContactName: React.Dispatch<React.SetStateAction<string>>;
}

function contactCard(props: InterfaceContactCardProps): JSX.Element {
  const contactName = `${props.firstName} ${props.lastName}`;
<<<<<<< HEAD
=======
  const imageUrl = props.image
    ? props.image
    : `https://api.dicebear.com/5.x/initials/svg?seed=${contactName}`;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const handleSelectedContactChange = (): void => {
    props.setSelectedContact(props.id);
    props.setSelectedContactName(contactName);
  };

  const [isSelected, setIsSelected] = React.useState(
<<<<<<< HEAD
    props.selectedContact === props.id,
=======
    props.selectedContact === props.id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );

  React.useEffect(() => {
    setIsSelected(props.selectedContact === props.id);
  }, [props.selectedContact]);

  return (
    <>
      <div
        className={`${styles.contact} ${
          isSelected ? styles.bgGrey : styles.bgWhite
        }`}
        onClick={handleSelectedContactChange}
        data-testid="contactContainer"
      >
<<<<<<< HEAD
        {props.image ? (
          <img
            src={props.image}
            alt={contactName}
            className={styles.contactImage}
          />
        ) : (
          <Avatar
            name={contactName}
            alt={contactName}
            avatarStyle={styles.contactImage}
          />
        )}
=======
        <img src={imageUrl} alt={contactName} className={styles.contactImage} />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        <div className={styles.contactNameContainer}>
          <b>{contactName}</b>
          <small className={styles.grey}>{props.email}</small>
        </div>
      </div>
    </>
  );
}

export default contactCard;
