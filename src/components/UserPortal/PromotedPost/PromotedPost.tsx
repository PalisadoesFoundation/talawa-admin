import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './PromotedPost.module.css';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
interface InterfacePostCardProps {
  id: string;
  media: string;
  title: string;
}
export default function promotedPost(
  props: InterfacePostCardProps
): JSX.Element {
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <div className={`${styles.cardHeader}`}>
            <StarPurple500Icon />
            {'Promoted Content'}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.title}</Card.Text>
          {props.media?.includes('videos') ? (
            <video
              muted
              className={styles.admedia}
              autoPlay={true}
              loop={true}
              playsInline
              data-testid="media"
              crossOrigin="anonymous"
            >
              <source src={props.media} type="video/mp4" />
            </video>
          ) : (
            <Card.Img
              className={styles.admedia}
              variant="top"
              src={props.media}
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
}
