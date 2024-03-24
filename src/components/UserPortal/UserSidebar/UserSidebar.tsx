import React from 'react';
import AboutImg from 'assets/images/defaultImg.png';
import styles from './UserSidebar.module.css';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useQuery } from '@apollo/client';
import {
  USER_DETAILS,
  USER_JOINED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import useLocalStorage from 'utils/useLocalstorage';

function userSidebar(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userSidebar',
  });

  const [organizations, setOrganizations] = React.useState([]);
  const [details, setDetails] = React.useState({} as any);

  const { getItem } = useLocalStorage();

  const userId: string | null = getItem('userId');

  const { data, loading: loadingJoinedOrganizations } = useQuery(
    USER_JOINED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  const {
    data: data2,
    loading: loadingUserDetails,
    error,
  } = useQuery(USER_DETAILS, {
    variables: { userId: userId },
  });

  console.log(error?.message);

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setOrganizations(data.users[0].user.joinedOrganizations);
    }
  }, [data]);

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data2) {
      setDetails(data2.user.user);
    }
  }, [data2]);

  return (
    <div className={`${styles.mainContainer} ${styles.boxShadow}`}>
      {loadingJoinedOrganizations || loadingUserDetails ? (
        <>
          <HourglassBottomIcon /> Loading...
        </>
      ) : (
        <>
          <img
            src={details.image ? details.image : AboutImg}
            className={styles.personImage}
            width="100px"
            height="auto"
          />
          <div className={styles.userDetails}>
            <h6>
              <b>{`${details.user?.firstName} ${details.user?.lastName}`}</b>
            </h6>
            <h6>{details.user?.email}</h6>
          </div>
          <div className={styles.organizationsConatiner}>
            <div className={styles.heading}>
              <b>{t('yourOrganizations')}</b>
            </div>
            <ListGroup variant="flush">
              {organizations.length ? (
                organizations.map((organization: any, index) => {
                  const organizationUrl = `/user/organization/id=${organization._id}`;

                  return (
                    <ListGroup.Item
                      key={index}
                      action
                      className={`${styles.rounded} ${styles.colorLight}`}
                    >
                      <Link to={organizationUrl} className={styles.link}>
                        <div className="d-flex flex-row justify-content-center">
                          <img
                            src={
                              organization.image ? organization.image : AboutImg
                            }
                            className={styles.personImage}
                            width="auto"
                            height="30px"
                          />
                          <div className={styles.orgName}>
                            {organization.name}
                          </div>
                        </div>
                      </Link>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <div className="w-100 text-center">{t('noOrganizations')}</div>
              )}
            </ListGroup>
            <div className={styles.alignRight}>
              <Link to="/user/organizations" className={styles.link}>
                {t('viewAll')}
                <ChevronRightIcon
                  fontSize="small"
                  className={styles.marginTop}
                />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default userSidebar;
