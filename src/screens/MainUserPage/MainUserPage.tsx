import React from 'react';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import styles from './MainUserPage.module.css';
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

function MainUserPage(): JSX.Element {
  return (
    <>
      <div className={styles.wrappage}>
        <AdminNavbar
          targets={[
            { name: 'Home', url: '/mainuser' },
            { name: 'Member', url: '/' },
            { name: 'LogOut', url: '/' },
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
                <h4>Saumya Singh</h4>
                <h5>Location: Spain</h5>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className={styles.box}>
            <h5>About</h5>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s, when an unknown printer took a galley oftype
              and scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronictypesetting,
              remaining essentially unchanged. It was popularised in the 1960s
              with the release of Letraset sheets containing LoremIpsumpassages,
              and more recently with desktop publishing software like Aldus
              PageMaker including versions of Lorem Ipsum.
            </p>
            <hr></hr>
          </div>
          <div className={styles.third_box}>
            <h5>Interests</h5>
            <div className={styles.interests_data}>
              <p className={styles.interests_data_odd}>NGO</p>
              <p className={styles.interests_data_even}>Feeding Dogs</p>
              <p className={styles.interests_data_odd}>Donations</p>
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
                  <h2>https://www.facebook.com/palisadoesproject/</h2>
                </a>
                <a href="https://www.youtube.com/c/palisadoesorganization">
                  <FontAwesomeIcon
                    icon={faYoutube}
                    color="#eb3223"
                    size="2x"
                    className={styles.icons}
                  />
                  <h2>https://www.youtube.com/c/palisadoesorganization</h2>
                </a>
                <a href="https://twitter.com/palisadoesorg?lang=en">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    color="#49a1eb"
                    size="2x"
                    className={styles.icons}
                  />
                  <h2>https://twitter.com/palisadoesorg?lang=en</h2>
                </a>
                <a href="http://www.palisadoes.org/gsoc/">
                  <FontAwesomeIcon
                    icon={faGooglePlus}
                    color="#db4a39"
                    size="2x"
                    className={styles.icons}
                  />
                  <h2>http://www.palisadoes.org/gsoc/</h2>
                </a>
              </div>
              <div className={styles.right_style}>
                <a href="https://www.instagram.com/palisadoes/?hl=en">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    color="#8a3ab9"
                    size="2x"
                    className={styles.icons}
                  />
                  <h2>https://www.instagram.com/palisadoes/?hl=en</h2>
                </a>
                <a href="#">
                  <FontAwesomeIcon
                    icon={faDribbble}
                    color="#ea4c89"
                    size="2x"
                    className={styles.icons}
                  />
                  <h2>http://www.palisadoes.org/</h2>
                </a>
                <a href="https://www.linkedin.com/company/palisadoes/">
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    color="#0077b5"
                    size="2x"
                    className={styles.icons}
                  />
                  <h2>https://www.linkedin.com/company/palisadoes/</h2>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainUserPage;
