import React from 'react';
import styles from './ContactCard.module.css';

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
  const imageUrl = props.image
    ? props.image
    : `https://api.dicebear.com/5.x/initials/svg?seed=${contactName}`;

  const handleSelectedContactChange = (): void => {
    props.setSelectedContact(props.id);
    props.setSelectedContactName(contactName);
  };

  const [isSelected, setIsSelected] = React.useState(
    props.selectedContact === props.id,
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
        <img src={imageUrl} alt={contactName} className={styles.contactImage} />
        <div className={styles.contactNameContainer}>
          <b>{contactName}</b>
          <small className={styles.grey}>{props.email}</small>
        </div>
      </div>
    </>
  );
}

export default contactCard;
