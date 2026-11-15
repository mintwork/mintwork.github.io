# mintwork.github.io

Source of [mintwork.github.io](https://mintwork.github.io/): the mintwork landing page and one page per tool.

Plain static HTML, served by GitHub Pages from `docs/` (no Jekyll). Edit the data and templates in
`build.mjs`, then rebuild and commit the output:

```bash
node build.mjs   # writes docs/**/index.html, 404.html, sitemap.xml, robots.txt
node og.mjs      # re-renders docs/assets/og.png (needs playwright-core and local Chrome)
```

`docs/tokenscope/demo-report.html` is a copy of `docs/demo-report.html` from
[mintwork/tokenscope](https://github.com/mintwork/tokenscope); copy it again when that report is regenerated.
