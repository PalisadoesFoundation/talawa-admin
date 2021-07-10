import React from 'react';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import styles from './SuperAdminOrgHomePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram,
  faDribbble,
  faGooglePlus,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { useQuery } from '@apollo/client';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';

function SuperAdminOrgHomePage(): JSX.Element {
  const a = window.location.href.split('=')[1];

  const b = '/superorgmember/id=' + a;

  const { data, loading } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: a },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <div className={styles.wrappage}>
        <AdminNavbar
          targets={[
            { name: 'Home', url: '/superdash' },
            { name: 'People', url: '/supermember' },
            { name: 'Organisation', url: '/superorg' },
            { name: 'LogOut', url: '/' },
            { name: 'Members', url: b },
          ]}
        />
        <div className={styles.main}>
          <div className={styles.align_row}>
            <a href="#">
              <img
                src="https://via.placeholder.com/80"
                className={styles.alignimg}
              />
            </a>
            <div className={styles.orginfomain}>
              <div className={styles.orginfo}>
                <h4>{data.organizations[0].name}</h4>
                <h5>Location: Spain</h5>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className={styles.box}>
            <h5>Description</h5>
            <p>{data.organizations[0].description}</p>
            <hr></hr>
          </div>
          <div className={styles.second_box}>
            <h5>Creator</h5>
            <div className={styles.ownerdata}>
              <img src="https://via.placeholder.com/55" />
              <div className={styles.ownerdata_inner}>
                <div className={styles.ownerinfo_one}>
                  <h4>
                    {data.organizations[0].creator.firstName}
                    &nbsp;
                    {data.organizations[0].creator.lastName}
                  </h4>
                  <h5>Location: India</h5>
                </div>
                <div className={styles.ownerinfo_two}>
                  <a href="mailto:saumya4799@gmail.com">
                    <h5>
                      <strong>Email: </strong>
                      {data.organizations[0].creator.email}
                    </h5>
                  </a>
                </div>
              </div>
            </div>
            <hr></hr>
          </div>
          <div className={styles.third_box}>
            <h5>Interests Offered</h5>
            <div className={styles.interests_data}>
              <p className={styles.interests_data_even}>Shelter</p>
            </div>
            <hr></hr>
          </div>
          <div className={styles.forth_box}>
            <h5>Links</h5>
            <div className={styles.link_data}>
              <div className={styles.left_style}>
                <a href="https://www.facebook.com/palisadoesproject/">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    color="#4968ad"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
                <a href="https://www.youtube.com/c/palisadoesorganization">
                  <FontAwesomeIcon
                    icon={faYoutube}
                    color="#eb3223"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
                <a href="https://twitter.com/palisadoesorg?lang=en">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    color="#49a1eb"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
                <a href="http://www.palisadoes.org/gsoc/">
                  <FontAwesomeIcon
                    icon={faGooglePlus}
                    color="#db4a39"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
                <a href="https://www.instagram.com/palisadoes/?hl=en">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    color="#8a3ab9"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
                <a href="#">
                  <FontAwesomeIcon
                    icon={faDribbble}
                    color="#ea4c89"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
                <a href="https://www.linkedin.com/company/palisadoes/">
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    color="#0077b5"
                    size="2x"
                    className={styles.icons}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminOrgHomePage;
