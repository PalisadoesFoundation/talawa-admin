<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React from 'react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';

interface InterfaceOrganization {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  __typename: string;
}
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

function userSidebar(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userSidebar',
  });

<<<<<<< HEAD
  const { getItem } = useLocalStorage();

  const userId: string | null = getItem('userId');

  const {
    data: orgsData,
    loading: loadingOrgs,
    error: orgsError,
  } = useQuery(USER_JOINED_ORGANIZATIONS, {
    variables: { id: userId },
  });

  const {
    data: userData,
    loading: loadingUser,
    error: userError,
  } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  const organizations = orgsData?.users[0]?.user?.joinedOrganizations || [];
  const userDetails = userData?.user?.user || {};

  useEffect(() => {
    if (userError || orgsError) {
      console.log(userError?.message || orgsError?.message);
    }
  }, [userError, orgsError]);

  return (
    <div className={`${styles.mainContainer} ${styles.boxShadow}`}>
      {loadingOrgs || loadingUser ? (
=======
  const [organizations, setOrganizations] = React.useState([]);
  const [details, setDetails] = React.useState({} as any);

  const userId: string | null = localStorage.getItem('userId');

  const { data, loading: loadingJoinedOrganizations } = useQuery(
    USER_JOINED_ORGANIZATIONS,
    {
      variables: { id: userId },
    }
  );

  const { data: data2, loading: loadingUserDetails } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setOrganizations(data.users[0].joinedOrganizations);
    }
  }, [data]);

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data2) {
      setDetails(data2.user);
    }
  }, [data2]);

  return (
    <div className={`${styles.mainContainer} ${styles.boxShadow}`}>
      {loadingJoinedOrganizations || loadingUserDetails ? (
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        <>
          <HourglassBottomIcon /> Loading...
        </>
      ) : (
        <>
          <img
<<<<<<< HEAD
            src={userDetails.image || AboutImg}
=======
            src={details.image ? details.image : AboutImg}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            className={styles.personImage}
            width="100px"
            height="auto"
          />
          <div className={styles.userDetails}>
            <h6>
<<<<<<< HEAD
              <b>{`${userDetails.firstName} ${userDetails.lastName}`}</b>
            </h6>
            <h6>{userDetails.email}</h6>
=======
              <b>{`${details.firstName} ${details.lastName}`}</b>
            </h6>
            <h6>{details.email}</h6>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          </div>
          <div className={styles.organizationsConatiner}>
            <div className={styles.heading}>
              <b>{t('yourOrganizations')}</b>
            </div>
            <ListGroup variant="flush">
              {organizations.length ? (
<<<<<<< HEAD
                organizations.map(
                  (organization: InterfaceOrganization, index: number) => {
                    const organizationUrl = `/user/organization/${organization._id}`;

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
                                organization.image
                                  ? organization.image
                                  : AboutImg
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
                  },
                )
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
