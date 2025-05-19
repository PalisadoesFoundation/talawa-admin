import React from 'react';
import HomeCallToAction from '../../utils/HomeCallToAction';

function HeaderHero() {
  return (
    <section className="HeaderHero" role="banner">
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
    </section>
  );
}

export default HeaderHero;
