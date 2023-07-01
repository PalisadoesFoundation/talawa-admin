import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UserUpdate from 'components/UserUpdate/UserUpdate';

import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import type { RootState } from 'state/reducers';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';

type MemberDetailProps = {
  id: string; // This is the userId
};

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });

  const [state, setState] = useState(1);

  const location = useLocation<MemberDetailProps>();
  const currentUrl = window.location.href.split('=')[1];
  document.title = t('title');

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const [adda] = useMutation(ADD_ADMIN_MUTATION);
  const {
    data: userData,
    loading: loading,
    error: error,
  } = useQuery(USER_DETAILS, {
    variables: { id: location.state?.id ?? id }, // For testing we are sending the id as a prop
  });

  if (loading) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign(`/orgpeople/id=${currentUrl}`);
  }

  const addAdmin = async (): Promise<void> => {
    try {
      const { data } = await adda({
        variables: {
          userid: location.state?.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('addedAsAdmin'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      <AdminNavbar targets={targets} url1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <br />
              <Button
                className={styles.activeBtn}
                data-testid="dashboardTitleBtn"
              >
                <div className={styles.bgFill}>
                  <i className="fa fa-user" />
                </div>
                {t('title')}
              </Button>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          {state == 1 ? (
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.logintitle}>{t('title')}</p>
                <Button
                  className={styles.memberfontcreatedbtn}
                  onClick={addAdmin}
                >
                  {t('addAdmin')}
                </Button>
                <Button
                  className={styles.memberfontcreatedbtn}
                  role="stateBtn"
                  onClick={(): void => {
                    setState(2);
                  }}
                >
                  edit
                </Button>
              </Row>
              <Row className={styles.justifysp}>
                <Col sm={6} lg={4}>
                  <div>
                    {userData?.user?.image ? (
                      <img
                        className={styles.userImage}
                        src={userData?.user?.image}
                        data-testid="userImagePresent"
                      />
                    ) : (
                      <img
                        className={styles.userImage}
                        src={`https://api.dicebear.com/5.x/initials/svg?seed=${userData?.user?.firstName} ${userData?.user?.lastName}`}
                        data-testid="userImageAbsent"
                      />
                    )}
                  </div>
                </Col>
                <Col sm={6} lg={8}>
                  {/* User section */}
                  <div>
                    <h2 className="mt-3 mb-4">
                      <strong>
                        {userData?.user?.firstName} {userData?.user?.lastName}
                      </strong>
                    </h2>
                    <p>
                      <strong>{t('role')} :</strong>{' '}
                      <span>{userData?.user?.userType}</span>
                    </p>
                    <p>
                      <strong>{t('email')} :</strong>{' '}
                      <span>{userData?.user?.email}</span>
                    </p>
                    <p>
                      <strong>{t('createdOn')} :</strong>{' '}
                      {prettyDate(userData?.user?.createdAt)}
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
                          <Col sm={6}>{userData?.user?.firstName}</Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('lastName')}</Col>
                          <Col sm={6}>{userData?.user?.lastName}</Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('role')}</Col>
                          <Col sm={6}>{userData?.user?.userType}</Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('memberOfOrganization')}</Col>
                          <Col sm={6}>
                            {userData?.user?.organizationUserBelongsTo ??
                              'None'}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('language')}</Col>
                          <Col sm={6}>
                            {getLanguageName(userData?.user?.appLanguageCode)}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('adminApproved')}</Col>
                          <Col sm={6} data-testid="adminApproved">
                            {userData?.user?.adminApproved ? 'Yes' : 'No'}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('pluginCreationAllowed')}</Col>
                          <Col sm={6} data-testid="pluginCreationAllowed">
                            {userData?.user?.pluginCreationAllowed
                              ? 'Yes'
                              : 'No'}
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col sm={6}>{t('createdOn')}</Col>
                          <Col data-testid="createdOn" sm={6}>
                            {prettyDate(userData?.user?.createdAt)}
                          </Col>
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
                            {userData?.user?.createdOrganizations?.length}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={8}>{t('joined')}</Col>
                          <Col sm={4}>
                            {userData?.user?.joinedOrganizations?.length}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={8}>{t('adminForOrganizations')}</Col>
                          <Col sm={4}>{userData?.user?.adminFor?.length}</Col>
                        </Row>
                        <Row className="pt-3">
                          <Col sm={8}>{t('membershipRequests')}</Col>
                          <Col sm={4}>
                            {userData?.user?.membershipRequests?.length}
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
                          <Col sm={4}>
                            {userData?.user?.createdEvents?.length}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={8}>{t('joined')}</Col>
                          <Col sm={4}>
                            {userData?.user?.registeredEvents?.length}
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col sm={8}>{t('adminForEvents')}</Col>
                          <Col sm={4}>{userData?.user?.eventAdmin?.length}</Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </section>
            </div>
          ) : (
            <UserUpdate id="abcd" />
          )}
        </Col>
      </Row>
    </>
  );
};

export const prettyDate = (param: string): string => {
  const date = new Date(param);
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
  return `${date?.toDateString()} ${date.toLocaleTimeString()}`;
};

export const getLanguageName = (code: string): string => {
  let language = 'Unavailable';
  languages.map((data) => {
    if (data.code == code) {
      language = data.name;
    }
  });
  return language;
};

export default MemberDetail;
