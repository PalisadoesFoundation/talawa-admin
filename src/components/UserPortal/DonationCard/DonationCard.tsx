import React from 'react';
import styles from './DonationCard.module.css';
import { type InterfaceDonationCardProps } from 'screens/UserPortal/Donate/Donate';
import { Button } from 'react-bootstrap';

function donationCard(props: InterfaceDonationCardProps): JSX.Element {
  const date = new Date(props.updatedAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={styles.img}></div>
      <div className={styles.personDetails}>
        <span>
          <b data-testid="DonorName">{props.name}</b>
        </span>
        <span>Amount: {props.amount}</span>
        <span>Date: {formattedDate}</span>
      </div>
      <div className={styles.btn}>
        <Button size="sm" variant="success">
          View
        </Button>
      </div>
    </div>
  );
}

export default donationCard;
