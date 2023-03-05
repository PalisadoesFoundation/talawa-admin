import React from 'react';
import { useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { RootState } from 'state/reducers';
import styles from './MemberDetail.module.css';

type MemberDetailProps = {
  id: string; // This is the userId
};

function MemberDetail(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });

  const location = useLocation<MemberDetailProps>();

  document.title = t('title');

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const {
    data: data,
    loading: loading,
    error: error,
  } = useQuery(USER_DETAILS, {
    variables: { id: location.state?.id },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error) {
    console.error(error);
    // window.location.assign('/orglist');
  }

  const prettyDate = (param: string): string => {
    try {
      const date = new Date(param);
      return `${date?.toDateString()} ${date.toLocaleTimeString()}`;
    } catch (e: any) {
      return 'Unavailable';
    }
  };

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h4>User</h4>
              <pre>{JSON.stringify(data.user, null, 4)}</pre>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('title')}</p>
            </Row>
            <Row className={styles.justifysp}>
              <Col sm={6} lg={4}>
                <div>
                  {data?.user.image ? (
                    <img
                      className={styles.userImage}
                      src="https://m.media-amazon.com/images/M/MV5BNWZlM2IwMzYtYjM4MS00YTZhLTk2OWUtNWI2M2VmM2Y1ODRkXkEyXkFqcGdeQXVyMzQ3Nzk5MTU@._V1_.jpg"
                    />
                  ) : (
                    <img
                      className={styles.userImage}
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${data?.user?.firstName} ${data?.user?.lastName}`}
                    />
                  )}
                </div>
              </Col>
              <Col sm={6} lg={8}>
                {/* User section */}
                <div>
                  <h2 className="mb-3">
                    {data?.user.firstName} {data.user.lastName}
                  </h2>
                  <p>
                    {' '}
                    <i className="fa text-success fa-envelope"></i>{' '}
                    {data?.user?.email}
                  </p>
                  <p>
                    <b>Role :</b> {data?.user?.__typename}
                  </p>
                  <p>
                    <b>Created on :</b> {prettyDate(data?.user?.createdAt)}
                  </p>
                </div>
                <Row>
                  <Col sm={6}></Col>
                  <Col sm={6}></Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default MemberDetail;
