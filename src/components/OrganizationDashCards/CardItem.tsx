import React from 'react';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import dayjs from 'dayjs';
import styles from './CardItem.module.css';
import { NotificationsOutlined } from '@mui/icons-material';

interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'Notification';
  title: string;
  time: string;
}

const cardItem = (props: InterfaceCardItem): JSX.Element => {
  const { type, title, time } = props;
  return (
    <>
      <div className={`${styles.cardItem} border-bottom`}>
        <div className={`${styles.iconWrapper} me-2`}>
          <div className={styles.themeOverlay} />
          {type == 'Event' ? (
            <EventsIcon fill="var(--bs-primary)" width={20} height={20} />
          ) : type == 'Post' ? (
            <PostsIcon fill="var(--bs-primary)" width={20} height={20} />
          ) : (
            <NotificationsOutlined
              style={{ color: 'var(--bs-primary)' }}
              width={20}
              height={20}
            />
          )}
        </div>
        <span className={styles.title}>{`${title}`}</span>
        <span className={styles.time}>{dayjs(time).format('DD-MM-YYYY')}</span>
      </div>
    </>
  );
};

export default cardItem;
