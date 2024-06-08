import React from 'react';
import styles from './ContactCard.module.css';
import Avatar from 'components/Avatar/Avatar';

type DirectMessage = {
  _id: string;
  createdAt: Date;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  messageContent: string;
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  updatedAt: Date;
};

type SelectedContact = {
  id: string;
  userId: string;
  messages: DirectMessage[];
};
interface InterfaceContactCardProps {
  id: string;
  firstName: string;
  userId: string;
  lastName: string;
  email: string;
  image: string;
  selectedContact: SelectedContact;
  setSelectedContact: React.Dispatch<React.SetStateAction<SelectedContact>>;
  setSelectedContactName: React.Dispatch<React.SetStateAction<string>>;
}

function contactCard(props: InterfaceContactCardProps): JSX.Element {
  const contactName = `${props.firstName} ${props.lastName}`;

  const handleSelectedContactChange = (): void => {
    console.log(props.userId, 'contact card userId');
    props.setSelectedContact({
      id: props.id,
      userId: props.userId,
      messages: props.selectedContact.messages,
    });
    props.setSelectedContactName(contactName);
  };

  const [isSelected, setIsSelected] = React.useState(
    props.selectedContact?.id === props.id,
  );

  React.useEffect(() => {
    setIsSelected(props.selectedContact?.id === props.id);
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
        <div className={styles.contactNameContainer}>
          <b>{contactName}</b>
          <small className={styles.grey}>{props.email}</small>
        </div>
      </div>
    </>
  );
}

export default contactCard;
