import React from 'react';
import styles from './OrgPostCard.module.css';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

interface OrgPostCardProps {
  key: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string;
  postVideo: string;
}

function OrgPostCard(props: OrgPostCardProps): JSX.Element {
  const [create] = useMutation(DELETE_POST_MUTATION);

  const DeletePost = async () => {
    const sure = true;
    if (sure) {
      try {
        const { data } = await create({
          variables: {
            id: props.id,
          },
        });
        console.log(data);
        window.location.reload();
      } catch (error) {
        toast.error('User is not authorized for performing this operation', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Row>
        <div className={styles.cards}>
          <div className={styles.dispflex}>
            <h2>{props.postTitle}</h2>
            <a onClick={DeletePost} className={styles.icon}>
              <i className="fa fa-trash"></i>
            </a>
          </div>
          <p>
            Author:
            <span> {props.postAuthor}</span>
          </p>
          <p>{props.postInfo}</p>
          <p>
            Image URL:
            <span>
              {' '}
              <a href={props.postPhoto}>{props.postPhoto}</a>
            </span>
          </p>
          <p>
            Video URL:
            <span>
              {' '}
              <a href={props.postVideo}>{props.postVideo}</a>
            </span>
          </p>
        </div>
      </Row>
    </>
  );
}
export default OrgPostCard;
