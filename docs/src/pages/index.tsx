import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

export default function Home(): JSX.Element {
  const pageTitle = 'Talawa-Docs: Powered by The Palisadoes';

  return (
    <Layout
      title={pageTitle}
      description="Description will go into a meta tag in <head />"
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
    </Layout>
  );
}
