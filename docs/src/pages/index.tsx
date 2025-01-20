import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HeroSection from '@site/src/components/HeroImage/HeroSection';

import styles from './index.module.css';
import GuideCards from '../components/GuideCards/GuideCards';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="section-container">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HeroSection />
        <GuideCards />
      </main>
    </Layout>
  );
}
