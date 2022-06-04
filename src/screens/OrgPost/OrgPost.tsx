import React, { useState } from 'react';
import styles from './OrgPost.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import { Form } from 'antd';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import { useMutation, useQuery } from '@apollo/client';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { useSelector } from 'react-redux';
import { RootState } from 'state/reducers';
import Button from 'react-bootstrap/Button';

function OrgPost(): JSX.Element {
  document.title = 'Talawa Posts';
  const [postmodalisOpen, setPostModalIsOpen] = useState(false);

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const showInviteModal = () => {
    setPostModalIsOpen(true);
  };
  const hideInviteModal = () => {
    setPostModalIsOpen(false);
  };

  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postinfo: '',
    postphoto: '',
    postvideo: '',
  });
  const currentUrl = window.location.href.split('=')[1];

  const {
    data,
    loading: loading2,
    error: error_post,
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: { id: currentUrl },
  });

  const CreatePost = async () => {
    const { data } = await create({
      variables: {
        // _id: currentUrl,
        title: postformState.posttitle,
        text: postformState.postinfo,
        imageUrl: postformState.postphoto,
        videoUrl: postformState.postvideo,
        organizationId: currentUrl,
      },
    });
    console.log(data);
    window.alert('Congratulations you have Posted Something');
    window.location.replace('/orgpost/id=' + currentUrl);
  };

  const [create, { loading }] = useMutation(CREATE_POST_MUTATION);

  if (loading || loading2) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error_post) {
    window.location.href = '/orglist';
  }

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Posts by Author</h6>
              <input
                type="name"
                id="orgname"
                placeholder="Search by Name"
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>Posts by Title</h6>
              <input
                type="text"
                id="posttitle"
                placeholder="Search by Title"
                autoComplete="off"
                required
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Posts</p>
              <Button
                variant="success"
                className={styles.addbtn}
                onClick={showInviteModal}
              >
                + Create Post
              </Button>
            </Row>
            <div className={styles.grid_section_div}>
              {data
                ? data.postsByOrganization.map(
                    (datas: {
                      _id: string;
                      title: string;
                      text: string;
                      imageUrl: string;
                      videoUrl: string;
                      organizationId: string;
                    }) => {
                      return (
                        <OrgPostCard
                          key={datas._id}
                          id={datas._id}
                          postTitle={datas.title}
                          postInfo={datas.text}
                          postAuthor="John Doe"
                          postPhoto={datas.imageUrl}
                          postVideo={datas.videoUrl}
                        />
                      );
                    }
                  )
                : null}
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={postmodalisOpen}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.titlemodal}>Post Details</p>
              <a onClick={hideInviteModal} className={styles.cancel}>
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form>
              <label htmlFor="posttitle">Title</label>
              <input
                type="title"
                id="postitle"
                placeholder="Post Title"
                autoComplete="off"
                required
                value={postformState.posttitle}
                onChange={(e) => {
                  setPostFormState({
                    ...postformState,
                    posttitle: e.target.value,
                  });
                }}
              />
              <label htmlFor="postinfo">Information</label>
              <textarea
                id="postinfo"
                className={styles.postinfo}
                placeholder="What do you want to talk about?"
                autoComplete="off"
                required
                value={postformState.postinfo}
                onChange={(e) => {
                  setPostFormState({
                    ...postformState,
                    postinfo: e.target.value,
                  });
                }}
              />
              <label htmlFor="postphoto" className={styles.orgphoto}>
                Image URL:
              </label>
              <input
                type="url"
                id="postphoto"
                name="postphoto"
                placeholder="Enter Image URL"
                value={postformState.postphoto}
                onChange={(e) => {
                  setPostFormState({
                    ...postformState,
                    postphoto: e.target.value,
                  });
                }}
              />
              <label htmlFor="postvideo">Video URL:</label>
              <input
                type="url"
                id="postvideo"
                placeholder="Enter Video URL"
                autoComplete="off"
                value={postformState.postvideo}
                onChange={(e) => {
                  setPostFormState({
                    ...postformState,
                    postvideo: e.target.value,
                  });
                }}
              />
              <Button
                className={styles.greenregbtn}
                variant="success"
                value="createpost"
                onClick={CreatePost}
              >
                <i className="fa fa-plus"></i> Add Post
              </Button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}

export default OrgPost;
