import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

import styles from './PageNotFound.module.css';
import Logo from 'assets/images/talawa-logo-200x200.png';

const PageNotFound = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pageNotFound',
  });

  document.title = t('title');

<<<<<<< HEAD
  const { getItem } = useLocalStorage();
  const adminFor = getItem('AdminFor');

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  return (
    <section className={styles.notfound}>
      <div className="container text-center">
        <div className="brand">
          <img src={Logo} alt="Logo" className="img-fluid" />
<<<<<<< HEAD
          {adminFor != undefined ? (
            <h3 className="text-uppercase mt-4">{t('talawaAdmin')}</h3>
          ) : (
            <h3 className="text-uppercase mt-4">{t('talawaUser')}</h3>
          )}
=======
          <h3 className="text-uppercase mt-4">{t('talawaAdmin')}</h3>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        </div>
        <h1 className={styles.head}>
          <span>{t('404')}</span>
        </h1>
        <p>{t('notFoundMsg')}</p>
<<<<<<< HEAD
        {adminFor != undefined ? (
          <Link to="/orglist" className="btn btn-outline-success mt-3">
            <i className="fas fa-home"></i> {t('backToHome')}
          </Link>
        ) : (
          <Link
            to="/user/organizations"
            className="btn btn-outline-success mt-3"
          >
            <i className="fas fa-home"></i> {t('backToHome')}
          </Link>
        )}
=======
        <Link to="/" className="btn btn-outline-success mt-3">
          <i className="fas fa-home"></i> {t('backToHome')}
        </Link>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </section>
  );
};

export default PageNotFound;
