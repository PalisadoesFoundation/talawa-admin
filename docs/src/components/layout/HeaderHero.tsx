import React from 'react';
import Section from '../../utils/Section';
import HomeCallToAction from '../../utils/HomeCallToAction';

function HeaderHero() {
  return (
    <Section background="light" className="HeaderHero" role="banner">
      <h1 className="title" id="main-title">
        Talawa
      </h1>
      <h2 className="tagline" aria-describedby="main-title">
        Admin Docs
      </h2>
      <p className="description">
        Web based administrative dashboard for the Talawa mobile app
      </p>
      <div className="buttons" role="navigation" aria-label="Quick links">
        <HomeCallToAction />
      </div>
    </Section>
  );
}

export default HeaderHero;
