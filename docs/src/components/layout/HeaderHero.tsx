import React from 'react';
import Section from '../../utils/Section';
import HomeCallToAction from '../../utils/HomeCallToAction';

function HeaderHero() {
  return (
    <Section background="light" className="HeaderHero">
      <h1 className="title">Talawa</h1>
      <h2 className="tagline">Admin Docs</h2>
      <p className="description">
        Web based administrative dashboard for the Talawa mobile app
      </p>
      <div className="buttons">
        <HomeCallToAction />
      </div>
    </Section>
  );
}

export default HeaderHero;
