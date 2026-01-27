/**
 * PageNotFound component.
 *
 * Renders the 404 page with i18n and admin-aware navigation.
 *
 * @remarks
 * Uses translations from `react-i18next` and reads the role from local storage.
 *
 * @example
 * ```tsx
 * <PageNotFound />
 * ```
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './PageNotFound.module.css';
import Logo from 'assets/images/talawa-logo-600x600.png';

const PageNotFound = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'pageNotFound' });
  const { t: tErrors } = useTranslation('errors');

  // Set the document title to the translated title for the 404 page
  document.title = t('title');

  return (
    <section className={styles.pageNotFound}>
      <div className="container text-center">
        <div className="brand">
          <img src={Logo} alt={t('logoAlt')} className="img-fluid" />
        </div>
        {/* Display the 404 error code */}
        <h1 className={styles.head}>
          <span>{t('404')}</span>
        </h1>
        {/* Display a not found message */}
        <p>{tErrors('notFoundMsg')}</p>
      </div>
    </section>
  );
};

export default PageNotFound;
