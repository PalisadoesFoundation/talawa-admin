import React from 'react';
import styles from './DonationCard.module.css';
import { type InterfaceDonationCardProps } from 'screens/UserPortal/Donate/Donate';
import { Button } from 'react-bootstrap';

/**
 * Displays a card with details about a donation.
 *
 * Shows the donor's name, the amount donated, and the date of the donation.
 * Includes a button to view more details about the donation.
 *
 * @param  props - The properties passed to the component.
 * @param  name - The name of the donor.
 * @param amount - The amount donated.
 * @param  updatedAt - The date of the donation, in ISO format.
 *
 * @returns The rendered donation card component.
 */
function donationCard(props: InterfaceDonationCardProps): JSX.Element {
  // Create a date object from the donation date string
  const date = new Date(props.updatedAt);

  // Format the date into a readable string
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
