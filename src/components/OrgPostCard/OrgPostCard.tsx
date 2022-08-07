import React, { ChangeEvent, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import styles from './OrgPostCard.module.css';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';

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
  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postinfo: '',
  });

  useEffect(() => {
    setPostFormState({
      posttitle: props.postTitle,
      postinfo: props.postInfo,
    });
  }, []);

  const [create] = useMutation(DELETE_POST_MUTATION);
  const [updatePost] = useMutation(UPDATE_POST_MUTATION);

  const DeletePost = async () => {
    try {
      const { data } = await create({
        variables: {
          id: props.id,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('Post deleted successfully.');
        window.location.reload();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  const handleInputEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPostFormState({ ...postformState, [name]: value });
  };

  const updatePostHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await updatePost({
        variables: {
          id: props.id,
          title: postformState.posttitle,
          text: postformState.postinfo,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('Post Updated successfully.');
        window.location.reload();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="col-sm-6">
        <div className={styles.cards}>
          <div className={styles.dispflex}>
            <h2>{props.postTitle}</h2>
            <div className={styles.iconContainer}>
              <a
                data-testid="deletePostModalBtn"
                className={`${styles.icon} mr-1`}
                data-toggle="modal"
                data-target={`#deletePostModal${props.id}`}
              >
                <i className="fa fa-trash"></i>
              </a>
              <a
                data-testid="editPostModalBtn"
                className={styles.icon}
                data-toggle="modal"
                data-target={`#editPostModal${props.id}`}
              >
                <i className="fas fa-edit"></i>
              </a>
            </div>
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
      </div>

      {/* delete modal */}
      <div
        className="modal fade"
        id={`deletePostModal${props.id}`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={`deletePostModalLabel${props.id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`deletePostModalLabel${props.id}`}
              >
                Delete Post
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">Do you want to remove this post?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={DeletePost}
                data-testid="deletePostBtn"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id={`editPostModal${props.id}`}
        tabIndex={-1}
        aria-labelledby={`editPostModal${props.id}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`editPostModal${props.id}Label`}>
                Edit Post
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={updatePostHandler}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="postTitle" className="col-form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    name="posttitle"
                    value={postformState.posttitle}
                    onChange={handleInputEvent}
                    data-testid="updateTitle"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postText" className="col-form-label">
                    Information
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="postText"
                    name="postinfo"
                    value={postformState.postinfo}
                    onChange={handleInputEvent}
                    data-testid="updateText"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postImageUrl" className="col-form-label">
                    Image:
                  </label>
                  <input
                    accept="image/*"
                    id="postImageUrl"
                    name="photo"
                    type="file"
                    placeholder="Upload New Image"
                    multiple={false}
                    //onChange=""
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postVideoUrl" className="col-form-label">
                    Video:
                  </label>
                  <input
                    accept="image/*"
                    id="postVideoUrl"
                    name="video"
                    type="file"
                    placeholder="Upload New Video"
                    multiple={false}
                    //onChange=""
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  data-testid="updatePostBtn"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default OrgPostCard;
