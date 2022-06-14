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

function OrgSettings(): JSX.Element {
  document.title = 'Talawa Setting';
  const [screenVariable, setScreenVariable] = React.useState(0);

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

  /* istanbul ignore next */
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
                  onClick={() => setScreenVariable(1)}
                >
                  Update Your Details
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgupdate"
                  onClick={() => setScreenVariable(2)}
                >
                  Update Organization
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  onClick={() => setScreenVariable(3)}
                >
                  Delete Organization
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  onClick={() => setScreenVariable(4)}
                >
                  See Request
                </button>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Settings</p>
            </Row>
            <div>{screenVariable == 1 ? <UserUpdate id="abcd" /> : null}</div>
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
                data.organizations.membershipRequests ? (
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
                        };
                      };
                    }) => {
                      return (
                        <MemberRequestCard
                          key={datas.membershipRequests._id}
                          id={datas.membershipRequests._id}
                          memberName={datas.membershipRequests.user.firstName}
                          memberLocation="India"
                          joinDate="12/12/2012"
                          memberImage="https://via.placeholder.com/200x100"
                          email={datas.membershipRequests.user.email}
                        />
                      );
                    }
                  )
                ) : (
                  <div>No data</div>
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
