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

## Product screenshots

The `#dashboard` section shows real screenshots of the Parley web admin
(`public/shots/*.webp`). They are captured against a marketing-safe demo
database (a fictional "Pixelforge" game studio), not real meetings:

1. In the [Parley repo](https://github.com/SakethKanchi/parley): seed the demo
   DB with `node scripts/seed-demo-db.mjs`, then serve it and the web UI.
2. Screenshot each page (dark + light) into `/tmp/demo-<theme>-<page>.png`.
3. Back here: `node scripts/make-shots.mjs` downscales them into
   `public/shots/`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages. The site is served under the `/parley-landing` base path (set in `astro.config.mjs`).
To use a custom domain, drop `base` from the config and add a `CNAME` file in `public/`.

## License

[ISC](./LICENSE) © Saketh Kanchi
