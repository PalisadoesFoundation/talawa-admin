import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './OrgSettings.module.css';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import UserPasswordUpdate from 'components/UserPasswordUpdate/UserPasswordUpdate';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrgDelete from 'components/OrgDelete/OrgDelete';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import MemberRequestCard from 'components/MemberRequestCard/MemberRequestCard';
import { useQuery } from '@apollo/client';
import { MEMBERSHIP_REQUEST } from 'GraphQl/Queries/Queries';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/reducers';
import { useTranslation } from 'react-i18next';
import defaultImg from 'assets/images/blank.png';
import Button from 'react-bootstrap/Button';
import Loader from 'components/Loader/Loader';

function orgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  document.title = t('title');
  const [screenVariable, setScreenVariable] = React.useState(0);
  const [screenDisplayVariable, setDisplayScreenVariable] = React.useState('');

  const handleClick = (number: any): void => {
    if (number === 1) {
      setDisplayScreenVariable('updateYourDetails');
      setScreenVariable(1);
    } else if (number === 2) {
      setDisplayScreenVariable('updateOrganization');
      setScreenVariable(2);
    } else if (number === 3) {
      setDisplayScreenVariable('deleteOrganization');
      setScreenVariable(3);
    } else if (number === 4) {
      setDisplayScreenVariable('seeRequest');
      setScreenVariable(4);
    } else {
      setDisplayScreenVariable('updateYourPassword');
      setScreenVariable(5);
    }
  };

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const currentUrl = window.location.href.split('=')[1];

  const { data, loading, error } = useQuery(MEMBERSHIP_REQUEST, {
    variables: { id: currentUrl },
  });

  if (loading) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <AdminNavbar targets={targets} url1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <div>
                <Button
                  className={styles.greenregbtn}
                  type="button"
                  value="userupdate"
                  data-testid="userUpdateBtn"
                  onClick={(): void => handleClick(1)}
                  // onClick={() => setScreenVariable(1)}
                >
                  {t('updateYourDetails')}
                </Button>
                <Button
                  className={styles.greenregbtn}
                  type="button"
                  value="userPasswordUpdate"
                  data-testid="userPasswordUpdateBtn"
                  onClick={(): void => handleClick(5)}
                  // onClick={() => setScreenVariable(1)}
                >
                  {t('updateYourPassword')}
                </Button>
                <Button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgupdate"
                  data-testid="orgUpdateBtn"
                  onClick={(): void => handleClick(2)}
                  // onClick={() => setScreenVariable(2)}
                >
                  {t('updateOrganization')}
                </Button>
                <Button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  data-testid="orgDeleteBtn"
                  onClick={(): void => handleClick(3)}
                  // onClick={() => setScreenVariable(3)}
                >
                  {t('deleteOrganization')}
                </Button>
                <Button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  data-testid="orgDeleteBtn2"
                  onClick={(): void => handleClick(4)}
                  // onClick={() => setScreenVariable(4)}
                >
                  {t('seeRequest')}
                </Button>
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
                {/* <p className={styles.loginSubtitle}>{t("abc")}</p> */}
              </div>

              {/* <p className={styles.logintitle}>{t('settings')}</p> */}
            </Row>
            <div>{screenVariable == 1 ? <UserUpdate id="abcd" /> : null}</div>
            <div>
              {screenVariable == 5 ? <UserPasswordUpdate id="abcd" /> : null}
            </div>
            <div>
              {screenVariable == 2 ? (
                <OrgUpdate
                  id="abcd"
                  orgid={window.location.href.split('=')[1]}
                />
              ) : null}
            </div>
            <div>{screenVariable == 3 ? <OrgDelete /> : null}</div>
            <div>
              {screenVariable == 4 ? (
                data?.organizations?.membershipRequests ? (
                  /* istanbul ignore next */
                  data.organizations.map(
                    /* istanbul ignore next */
                    (datas: {
                      _id: string;
                      membershipRequests: {
                        _id: string;
                        user: {
                          _id: string;
                          firstName: string;
                          lastName: string;
                          email: string;
                        };
                      };
                    }) => {
                      /* istanbul ignore next */
                      return (
                        <MemberRequestCard
                          key={datas.membershipRequests._id}
                          id={datas.membershipRequests._id}
                          memberName={datas.membershipRequests.user.firstName}
                          memberLocation="India"
                          joinDate="12/12/2012"
                          memberImage={defaultImg}
                          email={datas.membershipRequests.user.email}
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

export default orgSettings;
