import React, { FC } from 'react';
import styles from './PostNotFound.module.css';

interface PostNotFoundProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  errorMessage: string;
  subMessage?: string;
}

const PostNotFound: FC<PostNotFoundProps> = ({
  image,
  errorMessage,
  subMessage,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.postNotFoundContainer}>
        <div className={styles.insideDiv}>
          <div className={styles.pnfImage}>
            <img alt="Error Image" className={styles.image} src={image} />
          </div>
          <div className={styles.errorContainer}>
            <h2 className={styles.error}>{errorMessage}</h2>
            <h4 className={styles.errorMessage}>{subMessage}</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostNotFound;
