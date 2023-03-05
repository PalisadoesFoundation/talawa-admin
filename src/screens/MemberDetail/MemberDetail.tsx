import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { RootState } from 'state/reducers';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

type MemberDetailProps = {
  id: string; // This is the userId
};

function MemberDetail(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });

  const location = useLocation<MemberDetailProps>();
  const currentUrl = window.location.href.split('=')[1];
  document.title = t('title');

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const [adda] = useMutation(ADD_ADMIN_MUTATION);
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

  const AddAdmin = async () => {
    try {
      const { data } = await adda({
        variables: {
          userid: location.state?.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        window.alert('User is added as admin.');
        window.location.reload();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  const prettyDate = (param: string): string => {
    try {
      const date = new Date(param);
      return `${date?.toDateString()} ${date.toLocaleTimeString()}`;
    } catch (e: any) {
      return 'Unavailable';
    }
  };

  const getLanguageName = (code: string): string => {
    let language = 'Unavailable';
    languages.map((data) => {
      if (data.code == code) {
        language = data.name;
      }
    });
    return language;
  };

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <br />
              <button className={styles.activeBtn}>
                <div className={styles.bgFill}>
                  <i className="fa fa-user" />
                </div>
                {t('title')}
              </button>
              <button className={styles.inactiveBtn}>
                <div className={styles.bgFill}>
                  <i className="fa fa-building" />
                </div>
                {t('organizations')}
              </button>
              <button className={styles.inactiveBtn}>
                <div className={styles.bgFill}>
                  <i className="fa fa-calendar" />
                </div>
                {t('events')}
              </button>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('title')}</p>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={AddAdmin}
              >
                {t('addAdmin')}
              </button>
            </Row>
            <Row className={styles.justifysp}>
              <Col sm={6} lg={4}>
                <div>
                  {data?.user.image ? (
                    <img className={styles.userImage} src={data?.user?.image} />
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
                  <h2 className="mt-3 mb-4">
                    <strong>
                      {data?.user.firstName} {data.user.lastName}
                    </strong>
                  </h2>
                  <p>
                    <strong>{t('role')} :</strong> {data?.user?.__typename}
                  </p>
                  <p>
                    <strong>{t('email')} :</strong> {data?.user?.email}
                  </p>
                  <p>
                    <b>{t('createdOn')} :</b>{' '}
                    {prettyDate(data?.user?.createdAt)}
                  </p>
                </div>
              </Col>
            </Row>
            <br />
            <br />
            <br />
            {/* Main Section And Activity section */}
            <section className="mb-5">
              <Row className={styles.justifysp}>
                {/* Main Section */}
                <Col sm={12} lg={6}>
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5>
                        <strong>{t('main')}</strong>
                      </h5>
                    </div>
                    <div className="card-body">
                      <Row className="border-bottom pt-2 pb-3">
                        <Col sm={6}>{t('firstName')}</Col>
                        <Col sm={6}>{data?.user?.firstName}</Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={6}>{t('lastName')}</Col>
                        <Col sm={6}>{data?.user?.lastName}</Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={6}>{t('role')}</Col>
                        <Col sm={6}>{data?.user?.__typename}</Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={6}>{t('memberOfOrganization')}</Col>
                        <Col sm={6}>
                          {data?.user?.organizationUserBelongsTo ?? 'None'}
                        </Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={6}>{t('language')}</Col>
                        <Col sm={6}>
                          {getLanguageName(data?.user?.appLanguageCode)}
                        </Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={6}>{t('adminApproved')}</Col>
                        <Col sm={6}>
                          {data?.user?.adminApproved ? 'True' : 'False'}
                        </Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={6}>{t('pluginCreationAllowed')}</Col>
                        <Col sm={6}>
                          {data?.user?.pluginCreationAllowed ? 'True' : 'False'}
                        </Col>
                      </Row>
                      <Row className="pt-3">
                        <Col sm={6}>{t('createdOn')}</Col>
                        <Col sm={6}>{prettyDate(data?.user?.createdAt)}</Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                {/* Activity Section */}
                <Col sm={12} lg={6}>
                  {/* Organizations */}
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        <strong>{t('organizations')}</strong>
                      </h5>
                    </div>
                    <div className="card-body">
                      <Row className="border-bottom pt-2 pb-3">
                        <Col sm={8}>{t('created')}</Col>
                        <Col sm={4}>
                          {data?.user?.createdOrganizations?.length}
                        </Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={8}>{t('joined')}</Col>
                        <Col sm={4}>
                          {data?.user?.joinedOrganizations?.length}
                        </Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={8}>{t('adminForOrganizations')}</Col>
                        <Col sm={4}>{data?.user?.adminFor?.length}</Col>
                      </Row>
                      <Row className="pt-3">
                        <Col sm={8}>{t('membershipRequests')}</Col>
                        <Col sm={4}>
                          {data?.user?.membershipRequests?.length}
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {/* Events */}
                  <div className="card mt-4">
                    <div className="card-header">
                      <h5>
                        <strong>{t('events')}</strong>
                      </h5>
                    </div>
                    <div className="card-body">
                      <Row className="border-bottom pt-2 pb-3">
                        <Col sm={8}>{t('created')}</Col>
                        <Col sm={4}>{data?.user?.createdEvents?.length}</Col>
                      </Row>
                      <Row className="border-bottom py-3">
                        <Col sm={8}>{t('joined')}</Col>
                        <Col sm={4}>{data?.user?.registeredEvents?.length}</Col>
                      </Row>
                      <Row className="pt-3">
                        <Col sm={8}>{t('adminForEvents')}</Col>
                        <Col sm={4}>{data?.user?.eventAdmin?.length}</Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </section>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default MemberDetail;
