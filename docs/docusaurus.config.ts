import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Talawa-Admin Documentation',
  tagline: 'Complete guides and references for building with Talawa',
  favicon: 'img/favicon_palisadoes.ico',

  url: 'https://docs-admin.talawa.io',
  baseUrl: '/',
  deploymentBranch: 'gh-pages',

  organizationName: 'PalisadoesFoundation', // GitHub org
  projectName: 'talawa-admin', // repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: ({ docPath }) => {
            return `https://github.com/PalisadoesFoundation/talawa-docs/edit/develop/docs/${docPath}`;
          },
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/PalisadoesFoundation/talawa-docs/tree/develop/docs',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/index.css'),
          ],
        },
      },
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      title: 'Talawa-docs',
      logo: {
        alt: 'Talawa Logo',
        src: 'img/favicon_palisadoes.ico',
        className: 'LogoAnimation',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          to: 'docs/',
          activeBasePath: 'docs',
          position: 'left',
          label: 'General',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Web Guide',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Admin Guide',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'API',
          position: 'left',
          items: [
            {
              label: 'General',
              to: 'docs/',
              activeBasePath: 'docs',
            },
            {
              label: 'Talawa API',
              to: 'docs/talawa-api-docs/modules',
              activeBasePath: 'docs',
            },
            {
              label: 'Talawa Flutter Docs',
              to: 'docs/talawa-mobile-docs',
              activeBasePath: 'docs',
            },
            {
              label: 'Talawa Admin',
              to: 'docs/talawa-admin-docs/modules',
              activeBasePath: 'docs',
            },
          ],
        },
        {
          to: 'https://github.com/PalisadoesFoundation',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          to: 'https://www.youtube.com/@PalisadoesOrganization',
          position: 'right',
          className: 'header-youtube-link',
          'aria-label': 'Palisadoes Youtube channel',
        },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: ' Slack',
              to: 'https://github.com/PalisadoesFoundation',
              className: 'footer__icon footer__slack',
            },
            {
              label: ' News',
              to: 'https://www.palisadoes.org/news/',
              className: 'footer__icon footer__news',
            },
            {
              label: ' Contact Us',
              to: 'https://www.palisadoes.org/contact/',
              className: 'footer__icon footer__contact',
            },
          ],
        },
        {
          title: 'Social Media',
          items: [
            {
              label: ' Twitter',
              to: 'https://twitter.com/palisadoesorg?lang=en',
              className: 'footer__icon footer__twitter',
            },
            {
              label: ' Facebook',
              to: 'https://www.facebook.com/palisadoesproject/',
              className: 'footer__icon footer__facebook',
            },
            {
              label: ' Instagram',
              to: 'https://www.instagram.com/palisadoes/?hl=en',
              className: 'footer__icon footer__instagram',
            },
          ],
        },
        {
          title: 'Development',
          items: [
            {
              label: ' GitHub',
              to: 'https://github.com/PalisadoesFoundation',
              className: 'footer__icon footer__github',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Palisadoes Foundation, LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
