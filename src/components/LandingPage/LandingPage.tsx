import React from 'react';
import styles from './LandingPage.module.css';
import slide1 from 'assets/images/dogscare.jpg';
import slide2 from 'assets/images/children.jpg';
import slide3 from 'assets/images/dogshelter.jpg';
import Carousel from 'react-bootstrap/Carousel';
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
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={slide1} alt="First slide" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slide2} alt="Second slide" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slide3} alt="Third slide" />
            </Carousel.Item>
          </Carousel>
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
