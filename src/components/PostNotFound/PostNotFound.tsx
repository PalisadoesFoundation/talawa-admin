import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './PostNotFound.module.css';

interface PostNotFoundProps {
  title: string;
  keyPrefix: string;
}

function PostNotFound(props: PostNotFoundProps): JSX.Element {
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

export default PostNotFound;
