import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './PostNotFound.module.css';

interface PostNotFoundProps {
  title: string;
}

function PostNotFound(props: PostNotFoundProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'postNotFound',
  });
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.error}>{t(`${props.title} not found!`)}</h2>
      </section>
    </>
  );
}

export default PostNotFound;
