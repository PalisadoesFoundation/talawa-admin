/**
 * NotFound Component
 *
 * This component is used to display a "Not Found" message for a given title.
 * It utilizes the `react-i18next` library for internationalization and
 * dynamically translates the message based on the provided key prefix and title.
 *
 * @file NotFound.tsx
 * @module components/NotFound
 * @author Your Name
 *
 * @interface InterfaceNotFoundProps
 * @property {string} title - The title to display in the "Not Found" message.
 * @property {string} keyPrefix - The key prefix used for translation lookup.
 *
 * @function notFound
 * @param {InterfaceNotFoundProps} props - The props for the NotFound component.
 * @returns {JSX.Element} A JSX element displaying the "Not Found" message.
 *
 * @example
 * ```tsx
 * <NotFound title="Page" keyPrefix="error" />
 * ```
 * This will display a translated message like "Page not found!".
 *
 * @remarks
 * - The component uses CSS modules for styling.
 * - Ensure that the `keyPrefix` matches the structure in your translation files.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from 'style/app-fixed.module.css';

interface InterfaceNotFoundProps {
  title: string;
  keyPrefix: string;
}

function notFound(props: InterfaceNotFoundProps): JSX.Element {
  const key = props.keyPrefix.toString();
  const { t } = useTranslation('translation', { keyPrefix: key });
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.error}> {t(`${props.title} not found!`)} </h2>
      </section>
    </>
  );
}

export default notFound;
