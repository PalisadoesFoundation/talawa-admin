import React, { useEffect } from 'react';
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

interface InterfaceOrganization {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  __typename: string;
}

function userSidebar(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userSidebar',
  });

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
      console.error(userError?.message || orgsError?.message);
    }
  }, [userError, orgsError]);

  return (
    <div className={`${styles.mainContainer} ${styles.boxShadow}`}>
      {loadingOrgs || loadingUser ? (
        <>
          <HourglassBottomIcon /> Loading...
        </>
      ) : (
        <>
          <img
            src={userDetails.image || AboutImg}
            className={styles.personImage}
            width="100px"
            height="auto"
          />
          <div className={styles.userDetails}>
            <h6>
              <b>{`${userDetails.firstName} ${userDetails.lastName}`}</b>
            </h6>
            <h6>{userDetails.email}</h6>
          </div>
          <div className={styles.organizationsConatiner}>
            <div className={styles.heading}>
              <b>{t('yourOrganizations')}</b>
            </div>
            <ListGroup variant="flush">
              {organizations.length ? (
                organizations.map(
                  (organization: InterfaceOrganization, index: number) => {
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
