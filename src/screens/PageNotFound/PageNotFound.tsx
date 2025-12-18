/**
 * PageNotFound Component
 *
 * This component renders a 404 "Page Not Found" screen with internationalization support.
 * It displays a message and provides navigation options based on the user's admin status.
 *
 * @component
 * @returns {JSX.Element} The rendered 404 page component.
 *
 * @remarks
 * - The component uses the `react-i18next` library for translations.
 * - The `useLocalStorage` hook is used to retrieve the admin status from local storage.
 * - The document title is dynamically set based on the translated title for the 404 page.
 *
 * @example
 * ```tsx
 * import PageNotFound from './PageNotFound';
 *
 * function App() {
 *   return <PageNotFound />;
 * }
 * ```
 *
 * @dependencies
 * - `react-router-dom`: For navigation links.
 * - `react-i18next`: For internationalization.
 * - `utils/useLocalstorage`: Custom hook for local storage operations.
 * - `style/app-fixed.module.css`: CSS module for styling.
 * - `assets/images/talawa-logo-600x600.png`: Logo image for branding.
 *
 * @translationKeys
 * - `pageNotFound.title`: Title for the 404 page.
 * - `pageNotFound.404`: The "404" error code text.
 * - `pageNotFound.talawaUser`: Message for non-admin users.
 * - `common.talawaAdminPortal`: Message for admin users.
 * - `errors.notFoundMsg`: Error message for not found pages.
 * - `pageNotFound.backToHome`: Text for the "Back to Home" button.
 *
 * @localStorage
 * - `AdminFor`: Key used to determine if the user is an admin.
 */
import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';

import styles from 'style/app-fixed.module.css';
import Logo from 'assets/images/talawa-logo-600x600.png';

const PageNotFound = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Set the document title to the translated title for the 404 page
  document.title = t('pageNotFound.title');

  // Get the admin status from local storage
  const { getItem } = useLocalStorage();
  const isAdmin = getItem('role') === 'administrator';

  return (
    <section className={styles.pageNotFound}>
      <div className="container text-center">
        <div className="brand">
          <img src={Logo} alt="Logo" className="img-fluid" />
          {/* Display a message based on admin status */}
          {isAdmin ? (
            <h3 className="text-uppercase mt-4">
              {tCommon('talawaAdminPortal')}
            </h3>
          ) : (
            <h3 className="text-uppercase mt-4">
              {t('pageNotFound.talawaUser')}
            </h3>
          )}
        </div>
        {/* Display the 404 error code */}
        <h1 className={styles.head}>
          <span>{t('pageNotFound.404')}</span>
        </h1>
        {/* Display a not found message */}
        <p>{tErrors('notFoundMsg')}</p>
        {/* Provide a link to redirect users based on admin status */}
        {isAdmin ? (
          <Link to="/orglist" className="btn btn-outline-success mt-3">
            <i className="fas fa-home"></i> {t('pageNotFound.backToHome')}
          </Link>
        ) : (
          <Link
            to="/user/organizations"
            className="btn btn-outline-success mt-3"
          >
            <i className="fas fa-home"></i> {t('pageNotFound.backToHome')}
          </Link>
        )}
      </div>
    </section>
  );
};

export default PageNotFound;
