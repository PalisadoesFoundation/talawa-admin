import React from 'react';
import styles from './OrgPost.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';

function OrgPost(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];
  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgpeople/id=' + currentUrl;
  const url_3 = '/orgevents/id=' + currentUrl;
  const url_4 = '/orgcontribution/id=' + currentUrl;
  const url_5 = '/orgpost/id=' + currentUrl;
  const url_6 = '/orgsetting/id=' + currentUrl;

  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: url },
          { name: 'People', url: url_2 },
          { name: 'Events', url: url_3 },
          { name: 'Contributions', url: url_4 },
          { name: 'Posts', url: url_5 },
        ]}
        url_1={url_6}
      />
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
            </Row>
            <OrgPostCard
              key="129"
              id="21"
              postTitle="Outreach for Donation"
              postInfo="Hello everyone we are going live in 30 minutes, share this information with your folks and join us soon. See you live."
              postAuthor="John Doe Xyz"
              postTime="16.00"
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrgPost;
