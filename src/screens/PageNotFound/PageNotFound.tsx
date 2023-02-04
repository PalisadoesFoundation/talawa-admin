import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './PageNotFound.module.css';
import Logo from 'assets/talawa-logo-200x200.png';

const PageNotFound = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pageNotFound',
  });

  document.title = t('title');

  return (
    <section className={styles.notfound}>
      <div className="container text-center">
        <div className="brand">
          <img src={Logo} alt="Logo" className="img-fluid" />
          <h3 className="text-uppercase mt-4">{t('talawaAdmin')}</h3>
        </div>
        <h1 className={styles.head}>
          <span>{t('404')}</span>
        </h1>
        <p>{t('notFoundMsg')}</p>
        <Link to="/" className="btn btn-outline-success mt-3">
          <i className="fas fa-home"></i> {t('backToHome')}
        </Link>
      </div>
    </section>
  );
};

export default PageNotFound;
