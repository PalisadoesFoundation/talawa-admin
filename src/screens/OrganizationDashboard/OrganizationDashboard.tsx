import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from 'state/reducers';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './OrganizationDashboard.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import AboutImg from 'assets/images/dogo.png';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

function OrganizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  document.title = t('title');
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const { data, loading, error } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });
  const {
    data: postData,
    loading: loading_post,
    error: error_post,
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: { id: currentUrl },
  });
  const {
    data: eventData,
    loading: loading_event,
    error: error_event,
  } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: currentUrl },
  });

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const delete_org = async () => {
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
      toast.error(error.message);
    }
  };

  if (loading || loading_post || loading_event) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error || error_post || error_event) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row className={styles.toporginfo}>
        <p className={styles.toporgname}>{data.organizations[0].name}</p>
        <p className={styles.toporgloc}>
          {t('location')} : {data.organizations[0].location}
        </p>
      </Row>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.titlename}>{t('about')}</h6>
              <p className={styles.description}>
                {data.organizations[0].description}
              </p>
              {data.organizations[0].image ? (
                <img
                  src={data.organizations[0].image}
                  className={styles.org_about_img}
                  data-testid="orgDashImgPresent"
                />
              ) : (
                <img
                  src={AboutImg}
                  className={styles.org_about_img}
                  data-testid="orgDashImgAbsent"
                />
              )}
              <p className={styles.tagdetailsGreen}>
                <button
                  type="button"
                  className="mt-3"
                  data-testid="deleteClick"
                  data-toggle="modal"
                  data-target="#deleteOrganizationModal"
                >
                  {t('deleteThisOrganization')}
                </button>
              </p>
            </div>
          </div>
        </Col>
        <Col sm={8} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
          <Container>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.titlename}>{t('statistics')}</p>
              </Row>
              <Row>
                <Col sm={4} className="mb-5">
                  <Link
                    className={`card ${styles.cardContainer}`}
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
                          {data.organizations[0].members.length}
                        </p>
                        <p className={styles.counterHead}>{t('members')}</p>
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col sm={4} className="mb-5">
                  <div className={`card ${styles.cardContainer}`}>
                    <div className="card-body">
                      <div className="text-center mb-3">
                        <i
                          className={`fas fa-user ${styles.dashboardIcon}`}
                        ></i>
                      </div>
                      <div className="text-center">
                        <p className={styles.counterNumber}>
                          {data.organizations[0].admins.length}
                        </p>
                        <p className={styles.counterHead}>{t('admins')}</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col sm={4} className="mb-5">
                  <Link
                    className={`card ${styles.cardContainer}`}
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
                          {postData.postsByOrganization.length}
                        </p>
                        <p className={styles.counterHead}>{t('posts')}</p>
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col sm={4} className="mb-5">
                  <Link
                    className={`card ${styles.cardContainer}`}
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
                          {eventData.eventsByOrganization.length}
                        </p>
                        <p className={styles.counterHead}>{t('events')}</p>
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col sm={4} className="mb-5">
                  <Link
                    className={`card ${styles.cardContainer}`}
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
                          {data.organizations[0].blockedUsers.length}
                        </p>
                        <p className={styles.counterHead}>
                          {t('blockedUsers')}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col sm={4} className="mb-5">
                  <div className={`card ${styles.cardContainer}`}>
                    <div className="card-body">
                      <div className="text-center mb-3">
                        <i
                          className={`fas fa-users ${styles.dashboardIcon}`}
                        ></i>
                      </div>
                      <div className="text-center">
                        <p className={styles.counterNumber}>
                          {data.organizations[0].membershipRequests.length}
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

      <div
        className="modal fade"
        id="deleteOrganizationModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="deleteOrganizationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteOrganizationModalLabel">
                {t('deleteOrganization')}
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
            <div className="modal-body">{t('deleteMsg')}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                {t('no')}
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={delete_org}
                data-testid="deleteOrganizationBtn"
              >
                {t('yes')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizationDashboard;
