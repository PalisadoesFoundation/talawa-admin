import React from 'react';
import styles from './OrgPeopleListCard.module.css';
import { Link } from 'react-router-dom';
import defaultImg from 'assets/images/blank.png';

interface InterfaceOrgPeopleListCardProps {
  key: string;
  id: string;
  memberName: string;
  joinDate: string;
  memberImage: string;
  memberEmail: string;
}

function orgPeopleListCard(
  props: InterfaceOrgPeopleListCardProps
): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  return (
    <Link
      className={styles.membername}
      to={{
        pathname: `/member/id=${currentUrl}`,
        state: { id: props.id },
      }}
    >
      <div className={styles.listItemParent}>
        <div className={styles.listItemChild} key={props.id}>
          <div className={styles.tableHeader1}>
            <div className={styles.frame}>{1}</div>
            {props.memberImage ? (
              <img src={props.memberImage} className={styles.memberimg} />
            ) : (
              <img src={defaultImg} className={styles.memberimg} />
            )}
          </div>
          <div className={styles.membername}>
            {props.memberName ? <>{props.memberName}</> : <>Dogs Care</>}
          </div>
          <div className={styles.rectangle}>
            <div className={styles.memberemail}>{props.memberEmail}</div>
          </div>
        </div>
        <div className={styles.memberdateParent}>
          <p className={styles.memberJoinDate}>{props.joinDate}</p>
        </div>
      </div>
    </Link>
  );
}
export default orgPeopleListCard;
