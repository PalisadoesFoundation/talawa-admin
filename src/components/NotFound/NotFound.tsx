import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './NotFound.module.css';

interface InterfaceNotFoundProps {
  title: string; // Title of the page or resource not found
  keyPrefix: string; // Translation key prefix
}

/**
 * Component to display a "Not Found" message.
 *
 * @param title - Title of the page or resource that was not found.
 * @param keyPrefix - Prefix for translation keys.
 * @returns JSX element for the "Not Found" page.
 */
function notFound(props: InterfaceNotFoundProps): JSX.Element {
  const key = props.keyPrefix.toString();
  const { t } = useTranslation('translation', {
    keyPrefix: key,
  });
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.error}> {t(`${props.title} not found!`)} </h2>
      </section>
    </>
  );
}

export default notFound;
