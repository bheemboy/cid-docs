# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

For alternate hosting targets, you can override the Docusaurus site URL and base path at build time:

```bash
DOCS_URL=https://example.pages.dev DOCS_BASE_URL=/ npm run build
```

## Cloudflare Pages

For a Cloudflare Pages project that builds the `security` branch, use:

- Build command: `npm run build`
- Build output directory: `build`
- Environment variable: `DOCS_URL=https://<your-project>.pages.dev`
- Environment variable: `DOCS_BASE_URL=/`
