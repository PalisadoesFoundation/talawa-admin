import React from 'react';
import styles from './LandingPage.module.css';
import slide1 from 'assets/images/palisadoes_logo.png';
import { useTranslation } from 'react-i18next';

function LandingPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  return (
    <>
      <div>
        <h1 className={styles.maintitle}>
          {t('talawa_description.part1')}
          <span>{t('talawa_description.part2')}</span>
          {t('talawa_description.part3')}
        </h1>
        <div className={styles.carouseldiv}>
          <img className="d-block w-100" src={slide1} alt="First slide" />
        </div>
        <h2 className={styles.fromtitle}>
          <p>{t('fromPalisadoes')}</p>
        </h2>
      </div>
    </>
  );
}
export {};
export default LandingPage;
