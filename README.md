# mintwork.github.io

Source of [mintwork.github.io](https://mintwork.github.io/): the mintwork landing page and one page per tool.

Static HTML (no Jekyll), with React islands on top: `islands/main.jsx` mounts the hero threads,
decrypting headlines and the live prompt (components from [React Bits](https://reactbits.dev),
in `islands/reactbits/`). Every page works without JavaScript and with reduced motion. `.github/workflows/pages.yml` runs `npm ci && npm run build` on Node 26 and deploys
`docs/` to GitHub Pages on every push to `main`. Edit the data and templates in `build.mjs`; to preview locally:

```bash
npm ci
npm run build    # writes docs/**/index.html, 404.html, sitemap.xml, robots.txt, docs/assets/app.js
node og.mjs      # re-renders docs/assets/og.png (needs playwright-core and local Chrome)
```

`docs/tokenscope/demo-report.html` is a copy of `docs/demo-report.html` from
[mintwork/tokenscope](https://github.com/mintwork/tokenscope); copy it again when that report is regenerated.
