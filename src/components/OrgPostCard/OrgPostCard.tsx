import React from 'react';
import styles from './OrgPostCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
interface OrgPostCardProps {
  key: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postTime: string;
}
function OrgPostCard(props: OrgPostCardProps): JSX.Element {
  return (
    <>
      <Row>
        <Col className={styles.cards}>
          <h2>{props.postTitle}</h2>
          <p>
            Author:
            <span> {props.postAuthor}</span>
          </p>
          <p>{props.postInfo}</p>
          <p>
            Posted:
            <span> {props.postTime}</span>
          </p>
        </Col>
        <Col className={styles.cards}>
          <h2>{props.postTitle}</h2>
          <p>
            Author:
            <span> {props.postAuthor}</span>
          </p>
          <p>{props.postInfo}</p>
          <p>
            Posted:
            <span> {props.postTime}</span>
          </p>
        </Col>
      </Row>
    </>
  );
}
export default OrgPostCard;
