import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './OrgSettings.module.css';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrgDelete from 'components/OrgDelete/OrgDelete';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import MemberRequestCard from 'components/MemberRequestCard/MemberRequestCard';
import { useMutation, useQuery } from '@apollo/client';
import {
  MEMBERSHIP_REQUEST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
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
  const { loading: loadingOrg, error: errorOrg } = useQuery(
    ORGANIZATIONS_LIST,
    {
      variables: { id: currentUrl },
    }
  );

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

  if (loading || loadingOrg) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error || errorOrg) {
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
                  // onClick={() => setScreenVariable(1)}
                >
                  {t('updateYourDetails')}
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgupdate"
                  data-testid="orgUpdateBtn"
                  onClick={() => handleClick(2)}
                  // onClick={() => setScreenVariable(2)}
                >
                  {t('updateOrganization')}
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  data-testid="orgDeleteBtn2"
                  onClick={() => handleClick(4)}
                  // onClick={() => setScreenVariable(4)}
                >
                  {t('seeRequest')}
                </button>
                <button
                  type="button"
                  className={`${styles.btndanger}`}
                  data-testid="deleteClick"
                  data-toggle="modal"
                  data-target="#deleteOrganizationModal"
                >
                  {t('deleteOrganization')}
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
                {/* <p className={styles.loginSubtitle}>{t("abc")}</p> */}
              </div>

              {/* <p className={styles.logintitle}>{t('settings')}</p> */}
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
                  <div>{t('noData')}</div>
                )
              ) : null}
            </div>
          </div>
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

export default OrgSettings;
