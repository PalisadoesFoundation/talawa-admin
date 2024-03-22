import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { ReactComponent as PinIcon } from 'assets/svgs/pinUserCard.svg';
import { ReactComponent as TheeDotIcon } from 'assets/svgs/threeDotUserCard.svg';
import { ReactComponent as EditPostIcon } from 'assets/svgs/editPost.svg';
import { ReactComponent as DeletePostIcon } from 'assets/svgs/deletePost.svg';
import { ReactComponent as ReportIcon } from 'assets/svgs/report.svg';
import { ReactComponent as SharePostIcon } from 'assets/svgs/sharePost.svg';

import styles from './PostCard.module.css';
interface InterfacePostCardProps {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    image: string;
    id: string;
  };
  image: string;
  video: string;
  text: string;
  title: string;
  createdAt: number;
}

export default function postCard(props: InterfacePostCardProps): JSX.Element {
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  const formatDate = (dateString: number): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <Card className={`${styles.cardStyle}`}>
        <div className={`${styles.cardAuthorSection}`}>
          <div className={`${styles.user}`}>
            {props.creator.image && (
              <img
                src={props.creator.image}
                className={`${styles.profile}`}
                alt="postImage"
                aria-label="profileImg"
              />
            )}
            {!props.creator.image && (
              <div className={`${styles.profileNotPresent}`}></div>
            )}

            <span data-testid="creator-name">
              {props.creator.firstName} {props.creator.lastName}
            </span>
          </div>
          <div className={`${styles.icons}`}>
            <button className={`${styles.threeDotButton}`}>
              <PinIcon />
            </button>
            <button
              data-testid="three-dots-button"
              className={`${styles.threeDotButton}`}
              onClick={toggleMenu}
            >
              <TheeDotIcon />
            </button>
            {isMenuOpen && (
              <div className={`${styles.menu}`}>
                <button>
                  <EditPostIcon />
                  Edit
                </button>
                <button>
                  <DeletePostIcon />
                  Delete
                </button>
                <button>
                  <ReportIcon />
                  Report
                </button>
                <button>
                  <PinIcon />
                  Pin Post
                </button>
                <button>
                  <SharePostIcon />
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
        {props.image && (
          <img
            src={props.image}
            className={`${styles.img}`}
            aria-label="postImg"
          />
        )}
        {!props.image && <div className={`${styles.imgNotPresent}`}></div>}
        <div className={`${styles.postCardContent}`}>
          <span className={`${styles.postHeading}`}>{props.title}</span>
          <div>
            <span className={`${styles.postedOnText}`}>Posted On: </span>
            <span>{formatDate(props.createdAt)}</span>
          </div>
          <span className={`${styles.postMessage}`} data-testid="post-text">
            {props.text}
          </span>
          <div className={`${styles.buttonContainer}`}>
            <Button className={`${styles.viewPostButton}`}>View Post</Button>
          </div>
        </div>
      </Card>
    </>
  );
}
