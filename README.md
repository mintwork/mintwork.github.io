# mintwork.github.io

Source of [mintwork.github.io](https://mintwork.github.io/): the mintwork landing page and one page per tool.

Plain static HTML (no Jekyll). `.github/workflows/pages.yml` runs `node build.mjs` on Node 26 and deploys
`docs/` to GitHub Pages on every push to `main`. Edit the data and templates in `build.mjs`; to preview locally:

```bash
node build.mjs   # writes docs/**/index.html, 404.html, sitemap.xml, robots.txt
node og.mjs      # re-renders docs/assets/og.png (needs playwright-core and local Chrome)
```

`docs/tokenscope/demo-report.html` is a copy of `docs/demo-report.html` from
[mintwork/tokenscope](https://github.com/mintwork/tokenscope); copy it again when that report is regenerated.
