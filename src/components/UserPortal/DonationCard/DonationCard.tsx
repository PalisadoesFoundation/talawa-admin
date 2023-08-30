import React from 'react';
import styles from './DonationCard.module.css';

interface InterfaceDonationCardProps {
  id: string;
  name: string;
  amount: string;
  userId: string;
  payPalId: string;
}

function donationCard(props: InterfaceDonationCardProps): JSX.Element {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.personDetails}>
        <b>{props.name}</b>
        <span>Amount: {props.amount}</span>
        <span>PayPal Id: {props.payPalId}</span>
      </div>
    </div>
  );
}

export default donationCard;
