import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/reducers';
import { Container, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Marker } from '../../assets/svgs/icons/location.svg';
import { ReactComponent as Trash } from '../../assets/svgs/icons/trash.svg';
import { Link } from 'react-router-dom';
import LatestPostsCard from 'components/LatestPostsCard/LatestPostsCard';
import UpcomingEventsCard from 'components/UpcomingEventsCard/UpcomingEventsCard';
import styles from './OrganizationDashboard.module.css';
import AboutImg from 'assets/images/defaultImg.png';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_LIST,
  ORGANIZATION_POST_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';

function organizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  document.title = t('title');
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets } = appRoutes;

  const { data, loading, error } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: postData,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: eventData,
    loading: loadingEvent,
    error: errorEvent,
  } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: currentUrl },
  });

  const { data: data2 } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const canDelete = data2?.user.userType === 'SUPERADMIN';
  const toggleDeleteModal = (): void => setShowDeleteModal(!showDeleteModal);
  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const deleteOrg = async (): Promise<void> => {
    try {
      const { data } = await del({
        variables: {
          id: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        window.location.replace('/orglist');
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (loading || loadingPost || loadingEvent) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error || errorPost || errorEvent) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <OrganizationScreen screenName="Dashboard" title={t('title')}>
        <Row>
          <Col sm={3}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarsticky}>
                <h6 className={styles.titlename}>{t('about')}</h6>
                <p className={styles.description}>
                  {data?.organizations[0].description}
                </p>
                <p className={styles.toporgloc}>
                  <Marker width={20} fill="#31bb6b" />
                  {data?.organizations[0].location}
                </p>
                <img
                  src={data?.organizations[0].image ?? AboutImg}
                  className={styles.org_about_img}
                  data-testid={
                    data?.organizations[0].image
                      ? 'orgDashImgPresent'
                      : 'orgDashImgAbsent'
                  }
                />
                <p className={styles.tagdetailsGreen}>
                  {canDelete && (
                    <Button
                      variant="danger"
                      className={`mt-3 ${styles.deleteBtn}`}
                      data-testid="deleteClick"
                      onClick={toggleDeleteModal}
                    >
                      <Trash width={20} fill="white" />
                      {t('deleteOrganization')}
                    </Button>
                  )}
                </p>
              </div>
            </div>
          </Col>
          <Col sm={9} className="mt-sm-0 mt-5">
            <Container className={styles.statsContainer}>
              <div className={styles.mainpageright}>
                <Row className={styles.justifysp}>
                  <p className={styles.titlename}>{t('statistics')}</p>
                </Row>
                <Row>
                  <Col sm={4} className="mb-5">
                    <Link
                      to={`${targets
                        .filter((target: any) => {
                          const { name } = target;
                          return name == 'People';
                        })
                        .map((target: any) => {
                          return target.url;
                        })}`}
                    >
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <i
                            className={`fas fa-user ${styles.dashboardIcon}`}
                          ></i>
                        </div>
                        <div className="text-center">
                          <p className={styles.counterNumber}>
                            {data?.organizations[0].members.length}
                          </p>
                          <p className={styles.counterHead}>{t('members')}</p>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col sm={4} className="mb-5">
                    <Link
                      to={`${targets
                        .filter((target: any) => {
                          const { name } = target;
                          return name == 'People';
                        })
                        .map((target: any) => {
                          return target.url;
                        })}`}
                    >
                      <div>
                        <div className="card-body">
                          <div className="text-center mb-3">
                            <i
                              className={`fas fa-user ${styles.dashboardIcon}`}
                            ></i>
                          </div>
                          <div className="text-center">
                            <p className={styles.counterNumber}>
                              {data?.organizations[0].admins.length}
                            </p>
                            <p className={styles.counterHead}>{t('admins')}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col sm={4} className="mb-5">
                    <Link
                      to={`${targets
                        .filter((target: any) => {
                          const { name } = target;
                          return name == 'Posts';
                        })
                        .map((target: any) => {
                          return target.url;
                        })}`}
                    >
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <i
                            className={`fas fa-comment-alt ${styles.dashboardIcon}`}
                          ></i>
                        </div>
                        <div className="text-center">
                          <p className={styles.counterNumber}>
                            {postData?.postsByOrganization.length}
                          </p>
                          <p className={styles.counterHead}>{t('posts')}</p>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col sm={4} className="mb-5">
                    <Link
                      to={`${targets
                        .filter((target: any) => {
                          const { name } = target;
                          return name == 'Events';
                        })
                        .map((target: any) => {
                          return target.url;
                        })}`}
                    >
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <i
                            className={`fas fa-calendar ${styles.dashboardIcon}`}
                          ></i>
                        </div>
                        <div className="text-center">
                          <p className={styles.counterNumber}>
                            {eventData?.eventsByOrganization.length}
                          </p>
                          <p className={styles.counterHead}>{t('events')}</p>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col sm={4} className="mb-5">
                    <Link
                      to={`${targets
                        .filter((target: any) => {
                          const { name } = target;
                          return name == 'Block/Unblock';
                        })
                        .map((target: any) => {
                          return target.url;
                        })}`}
                    >
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <i
                            className={`fas fa-user-alt-slash ${styles.dashboardIcon}`}
                          ></i>
                        </div>
                        <div className="text-center">
                          <p className={styles.counterNumber}>
                            {data?.organizations[0].blockedUsers.length}
                          </p>
                          <p className={styles.counterHead}>
                            {t('blockedUsers')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col sm={4} className="mb-5">
                    <div>
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <i
                            className={`fas fa-users ${styles.dashboardIcon}`}
                          ></i>
                        </div>
                        <div className="text-center">
                          <p className={styles.counterNumber}>
                            {data?.organizations[0].membershipRequests.length}
                          </p>
                          <p className={styles.counterHead}>
                            {t('membershipRequests')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Container>
          </Col>
        </Row>

        <Modal show={showDeleteModal} onHide={toggleDeleteModal}>
          <Modal.Header>
            <h5 id="deleteOrganizationModalLabel">{t('deleteOrganization')}</h5>
            <Button variant="danger" onClick={toggleDeleteModal}>
              <i className="fa fa-times"></i>
            </Button>
          </Modal.Header>
          <Modal.Body>{t('deleteMsg')}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={toggleDeleteModal}>
              {t('no')}
            </Button>
            <Button
              variant="success"
              onClick={deleteOrg}
              data-testid="deleteOrganizationBtn"
            >
              {t('yes')}
            </Button>
          </Modal.Footer>
        </Modal>

        <div className={styles.latestContainer}>
          <LatestPostsCard
            posts={postData?.postsByOrganization.slice(-5).reverse()}
          />
          <UpcomingEventsCard
            events={eventData?.eventsByOrganization.slice(-5).reverse()}
          />
        </div>
      </OrganizationScreen>
    </>
  );
}

export default organizationDashboard;
