import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';

type MemberDetailProps = {
  id?: string; // This is the userId
};

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  const { getItem } = useLocalStorage();
  const currentUrl = location.state?.id || getItem('id') || id;
  const { orgId } = useParams();
  document.title = t('title');

  const [adda] = useMutation(ADD_ADMIN_MUTATION);

  const {
    data: userData,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery(USER_DETAILS, {
    variables: { userId: currentUrl }, // For testing we are sending the id as a prop
  });

  useEffect(() => {
    if (userData) {
      const isAdmin =
        userData.user.appUserProfile.adminFor.length > 0 ||
        userData.user.appUserProfile.isSuperAdmin;
      setIsAdmin(isAdmin);
    }
  }, [userData]);

  /* istanbul ignore next */
  const toggleStateValue = (): void => {
    if (state === 1) setState(2);
    else setState(1);
    refetch();
  };

  if (loading) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error) {
    navigate(`/orgpeople/${currentUrl}`);
  }

  const addAdmin = async (): Promise<void> => {
    try {
      const { data } = await adda({
        variables: {
          userid: location.state?.id,
          orgid: orgId,
        },
      });

      if (data) {
        toast.success(t('addedAsAdmin'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      /* istanbul ignore next */
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      <Row>
        <Col sm={8}>
          {state == 1 ? (
            <div className={styles.mainpageright}>
              <Row className={styles.flexclm}>
                <p
                  className={styles.logintitle}
                  data-testid="dashboardTitleBtn"
                >
                  {t('title')}
                </p>
                <div className={styles.btngroup}>
                  <Button
                    className={styles.memberfontcreatedbtn}
                    data-testid="addAdminBtn"
                    onClick={addAdmin}
                    disabled={isAdmin}
                  >
                    {t('addAdmin')}
                  </Button>

                  <Button
                    className={styles.memberfontcreatedbtn}
                    role="stateBtn"
                    data-testid="stateBtn"
                    onClick={(): void => {
                      setState(2);
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
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
                        src={`https://api.dicebear.com/5.x/initials/svg?seed=${userData?.user?.user?.firstName} ${userData?.user?.user.lastName}`}
                        data-testid="userImageAbsent"
                      />
                    )}
                  </div>
                </Col>
                <Col sm={6} lg={8}>
                  {/* User section */}
                  <div>
                    <h2>
                      <strong>
                        {userData?.user?.user?.firstName}{' '}
                        {userData?.user?.user?.lastName}
                      </strong>
                    </h2>
                    <p>
                      <strong>{t('role')} :</strong>{' '}
                      <span>
                        {userData.user.appUserProfile.isSuperAdmin
                          ? 'SuperAdmin'
                          : userData.user.appUserProfile.adminFor.length > 0
                            ? 'Admin'
                            : 'User'}
                      </span>
                    </p>
                    <p>
                      <strong>{t('email')} :</strong>{' '}
                      <span>{userData?.user?.user?.email}</span>
                    </p>
                    <p>
                      <strong>{t('createdOn')} :</strong>{' '}
                      {prettyDate(userData?.user.user?.createdAt)}
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
                          <Col sm={6}>{userData?.user?.user?.firstName}</Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('lastName')}</Col>
                          <Col sm={6}>{userData?.user?.user?.lastName}</Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('role')}</Col>
                          <Col sm={6}>
                            {userData.user.appUserProfile.isSuperAdmin
                              ? 'SuperAdmin'
                              : userData.user.appUserProfile.adminFor.length > 0
                                ? 'Admin'
                                : 'User'}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('language')}</Col>
                          <Col sm={6}>
                            {getLanguageName(
                              userData?.user?.appUserProfile?.appLanguageCode,
                            )}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('adminApproved')}</Col>
                          <Col sm={6} data-testid="adminApproved">
                            {userData?.user?.appUserProfile?.adminApproved
                              ? 'Yes'
                              : 'No'}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={6}>{t('pluginCreationAllowed')}</Col>
                          <Col sm={6} data-testid="pluginCreationAllowed">
                            {userData?.user?.appUserProfile
                              ?.pluginCreationAllowed
                              ? 'Yes'
                              : 'No'}
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col sm={6}>{t('createdOn')}</Col>
                          <Col data-testid="createdOn" sm={6}>
                            {prettyDate(userData?.user?.user?.createdAt)}
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
                            {
                              userData?.user?.appUserProfile
                                ?.createdOrganizations?.length
                            }
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={8}>{t('joined')}</Col>
                          <Col sm={4}>
                            {userData?.user?.user?.joinedOrganizations?.length}
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={8}>{t('adminForOrganizations')}</Col>
                          <Col sm={4}>
                            {userData?.user?.appUserProfile?.adminFor?.length}
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col sm={8}>{t('membershipRequests')}</Col>
                          <Col sm={4}>
                            {userData?.user?.user?.membershipRequests?.length}
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
                            {
                              userData?.user?.appUserProfile?.createdEvents
                                ?.length
                            }
                          </Col>
                        </Row>
                        <Row className="border-bottom py-3">
                          <Col sm={8}>{t('joined')}</Col>
                          <Col sm={4}>
                            {userData?.user?.user?.registeredEvents?.length}
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col sm={8}>{t('adminForEvents')}</Col>
                          <Col sm={4}>
                            {userData?.user?.appUserProfile?.eventAdmin?.length}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </section>
            </div>
          ) : (
            <UserUpdate id={currentUrl} toggleStateValue={toggleStateValue} />
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
