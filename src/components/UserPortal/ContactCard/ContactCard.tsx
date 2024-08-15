import React from 'react';
import styles from './ContactCard.module.css';
import Avatar from 'components/Avatar/Avatar';
import { Spa } from '@mui/icons-material';
import { Badge } from 'react-bootstrap';

interface InterfaceContactCardProps {
  id: string;
  title: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  isGroup: boolean;
  unseenMessages: number;
  lastMessage: any;
}

function contactCard(props: InterfaceContactCardProps): JSX.Element {
  const handleSelectedContactChange = (): void => {
    props.setSelectedContact(props.id);
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
          isSelected ? styles.bgGreen : styles.bgWhite
        }`}
        onClick={handleSelectedContactChange}
        data-testid="contactContainer"
      >
        {props.image ? (
          <img
            src={props.image}
            alt={props.title}
            className={styles.contactImage}
          />
        ) : (
          <Avatar
            name={props.title}
            alt={props.title}
            avatarStyle={styles.contactImage}
          />
        )}
        <div className={styles.contactNameContainer}>
          <div>
            <b>{props.title}</b>{' '}
            <p className={styles.lastMessage}>{props.lastMessage}</p>
          </div>
          {!!props.unseenMessages && (
            <Badge className={styles.unseenMessagesCount}>
              {props.unseenMessages}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
}

export default contactCard;
