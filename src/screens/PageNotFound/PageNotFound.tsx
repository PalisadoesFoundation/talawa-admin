import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';

import styles from '../../style/app.module.css';
import Logo from 'assets/images/talawa-logo-600x600.png';

/**
 * The `PageNotFound` component displays a 404 error page when a user navigates to a non-existent route.
 * It shows a message indicating that the page was not found and provides a link to redirect users back
 * to the appropriate home page based on their admin status.
 *
 */
const PageNotFound = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'pageNotFound',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Set the document title to the translated title for the 404 page
  document.title = t('title');

  // Get the admin status from local storage
  const { getItem } = useLocalStorage();
  const adminFor = getItem('AdminFor');

  return (
    <section className={styles.pageNotFound}>
      <div className="container text-center">
        <div className="brand">
          <img src={Logo} alt="Logo" className="img-fluid" />
          {/* Display a message based on admin status */}
          {adminFor != undefined ? (
            <h3 className="text-uppercase mt-4">
              {tCommon('talawaAdminPortal')}
            </h3>
          ) : (
            <h3 className="text-uppercase mt-4">{t('talawaUser')}</h3>
          )}
        </div>
        {/* Display the 404 error code */}
        <h1 className={styles.head}>
          <span>{t('404')}</span>
        </h1>
        {/* Display a not found message */}
        <p>{tErrors('notFoundMsg')}</p>
        {/* Provide a link to redirect users based on admin status */}
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
      </div>
    </section>
  );
};

export default PageNotFound;
