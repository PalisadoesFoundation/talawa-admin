import React, { useState } from 'react';
import styles from './LandingPage.module.css';
import slide1 from 'assets/images/dogscare.jpg';
import slide2 from 'assets/images/children.jpg';
import slide3 from 'assets/images/dogshelter.jpg';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import Carousel from 'react-bootstrap/Carousel';
function LandingPage(): JSX.Element {
  return (
    <>
      <div>
        <h1 className={styles.maintitle}>
          This is <span>Talawa Admin Management Portal</span> for the seamless
          management of Talawa Application.
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
        <h2 className={styles.fromtitle}>FROM PALISADOES</h2>
      </div>
    </>
  );
}
export default LandingPage;
