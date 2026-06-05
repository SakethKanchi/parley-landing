# Parley — landing site

Marketing site for [Parley](https://github.com/SakethKanchi/parley), the
self-hosted Discord meeting-notes bot. Astro + Tailwind v4 + GSAP, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run test:e2e # Playwright smoke tests
npm run make:og  # regenerate public/og-image.png
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages. The site is served under the `/parley-landing` base path (set in `astro.config.mjs`).
To use a custom domain, drop `base` from the config and add a `CNAME` file in `public/`.

## License

[ISC](./LICENSE) © Saketh Kanchi
