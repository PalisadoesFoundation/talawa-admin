import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './OrgSettings.module.css';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrgDelete from 'components/OrgDelete/OrgDelete';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import MemberRequestCard from 'components/MemberRequestCard/MemberRequestCard';
import { useQuery } from '@apollo/client';
import { MEMBERSHIP_REQUEST } from 'GraphQl/Queries/Queries';
import { useSelector } from 'react-redux';
import { RootState } from 'state/reducers';
import { useTranslation } from 'react-i18next';

function OrgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  document.title = t('title');
  const [screenVariable, setScreenVariable] = React.useState(0);
  const [screenDisplayVariable, setDisplayScreenVariable] = React.useState('');

  const handleClick = (number: any) => {
    if (number === 1) {
      setDisplayScreenVariable('updateYourDetails');
      setScreenVariable(1);
    } else if (number === 2) {
      setDisplayScreenVariable('updateOrganization');
      setScreenVariable(2);
    } else if (number === 3) {
      setDisplayScreenVariable('deleteOrganization');
      setScreenVariable(3);
    } else {
      setDisplayScreenVariable('seeRequest');
      setScreenVariable(4);
    }
  };

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const currentUrl = window.location.href.split('=')[1];

  const { data, loading, error } = useQuery(MEMBERSHIP_REQUEST, {
    variables: { id: currentUrl },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  if (error) {
    window.location.href = '/orglist';
  }

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <div>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="userupdate"
                  data-testid="userUpdateBtn"
                  onClick={() => handleClick(1)}
                >
                  {t('updateYourDetails')}
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgupdate"
                  data-testid="orgUpdateBtn"
                  onClick={() => handleClick(2)}
                >
                  {t('updateOrganization')}
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  data-testid="orgDeleteBtn"
                  onClick={() => handleClick(3)}
                >
                  {t('deleteOrganization')}
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgrequests"
                  data-testid="orgRequestsBtn"
                  onClick={() => handleClick(4)}
                >
                  {t('seeRequest')}
                </button>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <div className={styles.headerDiv}>
                <p className={styles.logintitle}>{t('settings')}</p>
                {screenDisplayVariable != '' && (
                  <p className={styles.loginSubtitle}>
                    {t(screenDisplayVariable)}
                  </p>
                )}
              </div>
            </Row>
            <div>
              {screenVariable == 1 ? <UserUpdate id="userupdate" /> : null}
            </div>
            <div>
              {screenVariable == 2 ? (
                <OrgUpdate
                  id="orgupdate"
                  orgid={window.location.href.split('=')[1]}
                />
              ) : null}
            </div>
            <div>{screenVariable == 3 ? <OrgDelete /> : null}</div>
            <div>
              {screenVariable == 4 ? (
                data.organizations[0].membershipRequests.length > 0 ? (
                  data.organizations.map(
                    (datas: {
                      _id: string;
                      membershipRequests: {
                        _id: string;
                        user: {
                          _id: string;
                          firstName: string;
                          lastName: string;
                          email: string;
                          image: string;
                          location: string;
                          created_at: string;
                        };
                      };
                    }) => {
                      return (
                        <MemberRequestCard
                          key={datas.membershipRequests._id}
                          id={datas.membershipRequests._id}
                          memberName={datas.membershipRequests.user.firstName}
                          joinDate={datas.membershipRequests.user.created_at}
                          memberImage={datas.membershipRequests.user.image}
                          email={datas.membershipRequests.user.email}
                          memberLocation={
                            datas.membershipRequests.user.location
                          }
                        />
                      );
                    }
                  )
                ) : (
                  <div>{t('noData')}</div>
                )
              ) : null}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrgSettings;
