import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Production URL and base path are provided at build time via env vars
// (e.g. Cloudflare Pages: DOCS_URL=https://<project>.pages.dev DOCS_BASE_URL=/).
const url = process.env.DOCS_URL ?? 'https://docs.example.com';
const baseUrl = process.env.DOCS_BASE_URL ?? '/';

const config: Config = {
  title: 'CID Documentation',
  tagline: 'CIDs are awesome',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url,
  // Set the /<baseUrl>/ pathname under which your site is served.
  baseUrl,

  trailingSlash: false, // or true, but pick one explicitly

  onBrokenLinks: 'throw',
  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    '@docusaurus/theme-mermaid',
  ],

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      rel: 'stylesheet',
    },
  ],

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
      {
        docs: {
          routeBasePath: '/', // Serve docs at the site's root          
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/bheemboy/cid-docs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/cid-social-card.jpg',
    navbar: {
      title: 'CID Hub',
      logo: {
        alt: 'CID Logo',
        src: 'img/cid-hub-logo-white.svg',
        width: 40,
        height: 40,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'documentationSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/start',
          position: 'left',
          label: 'Get started',
        },
        {
          to: '/security',
          position: 'left',
          label: 'Security',
        },
        {
          to: '/reference/release-notes',
          position: 'left',
          label: 'Release notes',
        },
        {
          href: 'https://hub.cid.agilent.com/assets/agilent-support-contact-information.pdf',
          position: 'left',
          label: 'Support',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Agilent',
          items: [
            {
              label: 'OpenLab CDS',
              href: 'https://www.agilent.com/en/product/software-informatics/analytical-software-suite/chromatography-data-systems/openlab-cds',
            },
            {
              label: 'Connected Instrument Device',
              href: 'https://www.agilent.com/en/product/software-informatics/analytical-software-suite/chromatography-data-systems/openlab-cds/connected-instrument-device',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Contact CID Support',
              href: 'https://hub.cid.agilent.com/assets/agilent-support-contact-information.pdf',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Agilent OpenLab`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
