import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './NotFound.module.css';

interface NotFoundProps {
  title: string;
  keyPrefix: string;
}

function NotFound(props: NotFoundProps): JSX.Element {
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

export default NotFound;
