// Builds the static site for https://mintwork.github.io/ (plain HTML, no Jekyll).
// Edit the TOOLS data or the templates below, then run `node build.mjs` and commit the output.
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://mintwork.github.io';
const ORG = 'https://github.com/mintwork';
const UPDATED = new Date().toISOString().slice(0, 10);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const raw = (repo, file) => `https://raw.githubusercontent.com/mintwork/${repo}/main/${file}`;

const MARK = `<svg class="mark" viewBox="104 104 304 304" aria-hidden="true" focusable="false"><defs><mask id="leaf-vein"><rect width="512" height="512" fill="#000"/><path d="M126 386 A260 260 0 0 1 386 126 A260 260 0 0 1 126 386 Z" fill="#fff"/><path d="M135.19 395.19 L301.41 213.41 A2 2 0 0 0 298.59 210.59 L116.81 376.81 Z" fill="#000"/></mask></defs><rect width="512" height="512" fill="currentColor" mask="url(#leaf-vein)"/></svg>`;

const TOOLS = [
  {
    repo: 'tokenscope',
    pkg: '@mintwork/tokenscope',
    title: 'tokenscope: find the money your AI coding agent wasted',
    description:
      'tokenscope reads your AI coding agent logs locally and shows what was wasted: cache rebuilds, loops, re-reads and huge tool outputs, each with a dollar estimate and a fix.',
    h1: 'Find the money your AI coding agent wasted',
    lede: 'ccusage tells you what you spent. tokenscope tells you what you wasted, and how to stop it.',
    tagline: 'Waste finder and token flame graph for AI coding agents',
    install: ['npx @mintwork/tokenscope               # waste first, then spend', 'npx @mintwork/tokenscope --html --open # interactive report with a flame graph'],
    image: { src: raw('tokenscope', 'docs/demo.png'), alt: 'tokenscope HTML report: estimated waste by pattern with a fix for each, and a flame graph of token spend', w: 2800, h: 2600 },
    extra: `<p class="center"><a href="demo-report.html">Open the interactive demo report</a> (synthetic logs).</p>`,
    problem: [
      'You know the bill. You don\'t know which part was wasted: a prompt cache that expired while you read the answer, so a 500k-token context was re-written at cache-write price; the agent running <code>npm test</code> five times and getting the same failure; one 2,000-line file read 40 times without an edit; a 60k-token log pasted into context and paid for on every later request.',
      'tokenscope reads the session logs your agents already keep on disk, finds these patterns, estimates what each one cost, and tells you how to stop it.',
    ],
    features: [
      ['Cache rebuilds, explained', 'Finds prompt-cache rebuilds after you paused or a tool ran long, names the cause, and says when a 1-hour cache TTL would actually save money.'],
      ['Loops and repeats', 'The same tool call with the same result, again and again, plus unchanged file re-reads and failed-edit retry storms.'],
      ['Counterfactual estimates', 'Every dollar figure is the difference to one specific better choice, never the full cost of a request. Uncertain savings are shown separately.'],
      ['Flame graph of spend', 'Project → session → turn → API call → subagent, in a self-contained HTML report you can click to zoom.'],
      ['16 agents', 'Claude Code, Codex CLI, Gemini CLI, OpenCode, Cline, Roo Code, GitHub Copilot CLI, Goose, Amp, Aider and more.'],
      ['100% local', 'Zero dependencies, no API keys, no network calls. Your logs never leave your machine.'],
    ],
    sections: [
      ['Install', `<p>Needs Node 22+. No configuration.</p>${code(['npx @mintwork/tokenscope', 'npx @mintwork/tokenscope --html --open', 'npx @mintwork/tokenscope diff        # what got more wasteful between two periods', 'npx @mintwork/tokenscope watch       # live waste alerts during a Claude Code session'])}`],
      ['tokenscope vs ccusage', `<p><a href="https://github.com/ccusage/ccusage">ccusage</a> is great at tracking spend: daily and monthly totals, a live status line, billing blocks. tokenscope answers a different question: <em>what did I waste, and how do I stop?</em> Use ccusage to track the bill. Run tokenscope when the bill surprises you.</p>`],
    ],
    keywords: ['Claude Code cost', 'token usage', 'prompt caching', 'AI coding agent', 'LLM cost', 'flame graph'],
  },
  {
    repo: 'honest-tests',
    pkg: '@mintwork/honest-tests',
    title: 'honest-tests: catch AI-written tests that can\'t fail',
    description:
      'honest-tests is an agent skill, CLI and GitHub Action that finds fake tests written by AI coding agents and proves it with mutation testing. Vitest, Jest, Mocha, node:test, Bun, Deno and pytest.',
    h1: 'Catch AI-written tests that can\'t fail',
    lede: 'Your AI wrote 200 tests. Many of them can\'t fail. honest-tests finds them, and proves it by breaking your code and watching the tests stay green.',
    tagline: 'Fake-test detector and mutation testing for AI coding agents',
    install: ['npx @mintwork/honest-tests audit .               # find tests that can\'t fail', 'npx @mintwork/honest-tests mutate src/pricing.ts # prove it: break the code, see who notices'],
    image: { src: raw('honest-tests', 'docs/demo.gif'), alt: 'honest-tests audit finds 11 of 15 tests that can\'t fail in a sample project; honest-tests mutate then shows 22 of 26 code changes survive the test suite', w: 1200, h: 760 },
    problem: [
      'Ask an agent to "add tests" and you get a wall of green checkmarks. Look closer: a value compared to itself, a test with no assertion, an assertion inside a <code>try/catch</code> that swallows the failure, a test that checks the mock it just configured. Every one passes. Coverage goes up. Nothing is verified.',
      'honest-tests is a skill that stops Claude Code, Codex and Cursor from writing these tests, plus a CLI that finds them in the suite you already have.',
    ],
    features: [
      ['16 fake-test rules', 'Tautologies, missing assertions, swallowed failures, asserting on mocks or on literals the test just built, mocked units under test, leftover <code>.only</code>, and more.'],
      ['Mutation testing built in', 'Flips operators, constants and return values on a temp copy of your project, runs the related tests, and lists every change nobody noticed.'],
      ['Agent skill', 'Teaches the agent to write tests that can go red for the right reason, and to self-audit before it says "done".'],
      ['PR comments', 'The <a href="https://github.com/marketplace/actions/honest-tests-audit">Honest Tests Audit</a> Action comments on every pull request with how many of its new tests can\'t fail.'],
      ['Every major runner', 'Vitest, Jest, Mocha, node:test, Bun, Deno, plus pytest and unittest for Python.'],
      ['SARIF and JSON', 'Findings in GitHub code scanning, or machine-readable output for any agent.'],
    ],
    sections: [
      ['Install', `<p><strong>Claude Code</strong> (plugin with skill and slash commands):</p>${code(['/plugin marketplace add mintwork/honest-tests', '/plugin install honest-tests@honest-tests'])}<p><strong>Codex and Cursor:</strong></p>${code(['npx @mintwork/honest-tests init codex    # adds a section to AGENTS.md', 'npx @mintwork/honest-tests init cursor   # writes .cursor/rules/honest-tests.mdc'])}`],
      ['GitHub Action', `<p>Comment on every pull request with what its tests are worth:</p>${code(['- uses: actions/checkout@v7', '  with:', '    fetch-depth: 0', '- uses: mintwork/honest-tests@v0'])}`],
    ],
    marketplace: 'https://github.com/marketplace/actions/honest-tests-audit',
    agensi: 'https://www.agensi.io/skills/honest-tests',
    keywords: ['mutation testing', 'test quality', 'fake tests', 'AI generated tests', 'vitest', 'jest'],
  },
  {
    repo: 'wcag-audit-skill',
    pkg: '@mintwork/wcag-audit-skill',
    title: 'WCAG 2.2 accessibility audit for AI coding agents',
    description:
      'An agent skill, CLI and GitHub Action that audits UIs against WCAG 2.2: static source scan, real-browser axe-core scan, verified findings, minimal fixes and SARIF output.',
    h1: 'WCAG 2.2 accessibility audit for AI coding agents',
    lede: 'AI ships inaccessible UIs. This makes your agent find the barriers, verify each one, and fix them with minimal, explained changes.',
    tagline: 'WCAG 2.2 accessibility audit skill and CLI',
    install: ['npx @mintwork/wcag-audit-skill scan ./src                  # static source scan', 'npx @mintwork/wcag-audit-skill scan http://localhost:3000   # real-browser scan'],
    image: { src: raw('wcag-audit-skill', 'docs/demo.gif'), alt: 'Terminal demo: the scan reports 10 issues in a React component, each with severity, rule, WCAG criterion, file and line, evidence and a fix; the fixed component reports 0 issues', w: 1200, h: 720 },
    problem: [
      'Ask an agent for a checkout form and it looks fine. A blind user hears "edit text, button, image". A keyboard user can\'t reach the Pay button at all. Roughly 95% of the top million home pages have detectable WCAG failures, and models learned from them.',
      'Install the skill and say "audit this for accessibility and fix it". The agent runs a phased audit: static scan, real-browser scan, adversarial verification, fixes, and a report.',
    ],
    features: [
      ['Static scan, many frameworks', '30 rules for HTML, React (JSX/TSX), Vue, Svelte, Astro, Angular, MDX and CSS, including Tailwind contrast and focus styles.'],
      ['Real browser', 'Runs axe-core in Chromium and tabs through the page to catch keyboard traps and invisible focus, across states like open dialogs and dark mode.'],
      ['Verified findings', 'Every candidate is re-checked to disprove it: confirmed, needs your input, or rejected, with the evidence written down.'],
      ['Minimal fixes', 'Native HTML first, in your framework\'s idiom. Visual or copy changes need your OK, and it never invents alt text.'],
      ['CI and code scanning', 'SARIF output, a CI baseline that fails only on new findings, and the <a href="https://github.com/marketplace/actions/wcag-accessibility-audit">WCAG Accessibility Audit</a> Action.'],
      ['Honest limits', 'Automation finds part of WCAG. Reports always list what still needs a human: a screen-reader pass, zoom and reflow, captions.'],
    ],
    sections: [
      ['Install', `<p><strong>Claude Code:</strong></p>${code(['/plugin marketplace add mintwork/wcag-audit-skill', '/plugin install wcag-audit@wcag-audit-skill'])}<p><strong>Any skills-compatible agent:</strong></p>${code(['npx skills add https://github.com/mintwork/wcag-audit-skill --skill wcag-audit'])}`],
      ['GitHub Action', `<p>Findings appear as pull request annotations and under Security → Code scanning:</p>${code(['- uses: actions/checkout@v7', '- uses: mintwork/wcag-audit-skill@v0'])}`],
      ['How is this different from axe or a linter?', `<p>eslint-plugin-jsx-a11y covers one framework with no browser and no fixes. axe and Lighthouse are runtime only, with no source locations. This uses axe-core under the hood, covers eight template languages, maps runtime results back to source, and drives an agent to fix and re-verify.</p>`],
    ],
    marketplace: 'https://github.com/marketplace/actions/wcag-accessibility-audit',
    agensi: 'https://www.agensi.io/skills/wcag-accessibility-audit',
    keywords: ['WCAG 2.2', 'accessibility audit', 'a11y', 'axe-core', 'Claude Code skill', 'SARIF'],
  },
  {
    repo: 'agent-ready',
    pkg: '@mintwork/agent-ready',
    title: 'agent-ready: Lighthouse for AI coding agents',
    description:
      'agent-ready scores how well Claude Code, Codex and Cursor can work in your repository, from 0 to 100, and auto-fixes the gaps: AGENTS.md, ignore files, test and lint commands.',
    h1: 'Lighthouse for AI coding agents',
    lede: 'Score how well Claude Code, Codex and Cursor can work in your repo, then auto-fix the gaps.',
    tagline: 'Agent readiness score for repositories',
    install: ['npx @mintwork/agent-ready         # score this repo', 'npx @mintwork/agent-ready --fix   # apply the safe fixes'],
    image: { src: raw('agent-ready', 'docs/demo.png'), alt: 'agent-ready scoring a repository at 59 out of 100, with a breakdown by category and a suggested fix for each gap', w: 1200, h: 832 },
    problem: [
      'Your agent is only as good as the repo you drop it into. No <code>AGENTS.md</code>? It guesses your test command. A stale <code>CLAUDE.md</code>? It confidently edits files deleted months ago. <code>dist/</code> not ignored? It greps your minified bundle and burns half its context window.',
      'agent-ready checks all of that in under a second and gives you a 0 to 100 score, a category breakdown, and a punch list of fixes, many of which it can apply for you.',
    ],
    features: [
      ['Five categories', 'Context docs, feedback loops, navigability, type safety and safety, weighted into one score.'],
      ['Auto-fix', '<code>--fix</code> writes a starter AGENTS.md and CLAUDE.md from your real scripts and structure, and fixes ignore files.'],
      ['Doc drift', 'Flags agent docs that mention files, scripts or commands that no longer exist.'],
      ['CI gate', 'The <a href="https://github.com/marketplace/actions/agent-readiness-score">Agent Readiness Score</a> Action fails pull requests that make the repo worse for agents.'],
      ['Many stacks', 'JS/TS, Python, Go and Rust, with basic Java and Kotlin support, and it understands monorepos.'],
      ['Read-only by default', 'Zero dependencies. Nothing changes unless you pass <code>--fix</code>.'],
    ],
    sections: [
      ['Install', `${code(['npx @mintwork/agent-ready            # no install', 'npm i -D @mintwork/agent-ready       # or pin it in your project', 'npx @mintwork/agent-ready --badge    # a README badge with your score'])}`],
      ['GitHub Action', code(['- uses: actions/checkout@v7', '  with: { fetch-depth: 0 }', '- uses: mintwork/agent-ready@v0', '  with:', '    min-score: 75'])],
      ['How is this different from a linter?', '<p>A linter tells you your code is wrong. agent-ready tells you your repository is hard to work in, for the coworker who reads every file literally, never asks a clarifying question, and runs whatever <code>npm run build</code> does.</p>'],
    ],
    marketplace: 'https://github.com/marketplace/actions/agent-readiness-score',
    keywords: ['AGENTS.md', 'CLAUDE.md', 'AI coding agent', 'repository score', 'developer experience'],
  },
];

function code(lines) {
  return `<pre><code>${esc(lines.join('\n'))}</code></pre>`;
}

function layout({ title, description, pathname, body, jsonld, ogImage = `${SITE}/assets/og.png` }) {
  const url = SITE + pathname;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="google-site-verification" content="WVu6Z85C__KQ1yxxumnjmCY1oyKOKbfml9HF-RDppuE">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="mintwork">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0D1714">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/favicon-180.png">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="/">${MARK}<span>mintwork</span></a>
    <nav aria-label="Main">
      <ul>
        <li><a href="/#tools">Tools</a></li>
        <li><a href="${ORG}">GitHub</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <p><a href="/">mintwork</a> · Developer tools you're glad you installed. · MIT licensed · Made in Germany</p>
    <p><a href="${ORG}">GitHub</a> · <a href="https://www.npmjs.com/org/mintwork">npm</a> · <a href="https://www.agensi.io/creators/mintwork">Agensi</a></p>
  </div>
</footer>
</body>
</html>
`;
}

function links(t) {
  const out = [
    [`${ORG}/${t.repo}`, 'Star on GitHub', 'primary'],
    [`https://www.npmjs.com/package/${t.pkg}`, 'npm'],
  ];
  if (t.marketplace) out.push([t.marketplace, 'GitHub Marketplace']);
  if (t.agensi) out.push([t.agensi, 'Agensi']);
  return `<ul class="actions">${out.map(([href, label, cls]) => `<li><a class="btn${cls ? ' ' + cls : ''}" href="${href}">${label}</a></li>`).join('')}</ul>`;
}

function toolPage(t) {
  const pathname = `/${t.repo}/`;
  const body = `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow">${esc(t.repo)}</p>
    <h1>${esc(t.h1)}</h1>
    <p class="lede">${esc(t.lede)}</p>
    ${code(t.install)}
    ${links(t)}
  </div>
</section>
<section class="wrap">
  <img class="demo" src="${t.image.src}" alt="${esc(t.image.alt)}" width="${t.image.w}" height="${t.image.h}" loading="lazy" decoding="async">
  ${t.extra ?? ''}
</section>
<section class="wrap prose">
  <h2>The problem</h2>
  ${t.problem.map((p) => `<p>${p}</p>`).join('\n  ')}
</section>
<section class="wrap">
  <h2>What it does</h2>
  <ul class="grid">
    ${t.features.map(([h, p]) => `<li class="card"><h3>${h}</h3><p>${p}</p></li>`).join('\n    ')}
  </ul>
</section>
${t.sections.map(([h, html]) => `<section class="wrap prose"><h2>${esc(h)}</h2>${html}</section>`).join('\n')}
<section class="wrap prose cta">
  <h2>Open source, MIT licensed</h2>
  <p>Built in CI and published to npm with signed provenance. Full documentation, changelog and issues are on <a href="${ORG}/${t.repo}">GitHub</a>.</p>
  ${links(t)}
</section>`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.repo,
    description: t.description,
    url: SITE + pathname,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    softwareRequirements: 'Node.js 22+',
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: `${ORG}/${t.repo}`,
    downloadUrl: `https://www.npmjs.com/package/${t.pkg}`,
    keywords: t.keywords.join(', '),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'mintwork', url: SITE + '/' },
  };
  return { pathname, html: layout({ title: t.title, description: t.description, pathname, body, jsonld }) };
}

function homePage() {
  const pathname = '/';
  const description =
    'mintwork makes small, open-source developer tools: find wasted AI agent spend, catch tests that can\'t fail, audit accessibility, and score repos for AI coding agents.';
  const body = `
<section class="hero home">
  <div class="wrap">
    <h1>Developer tools you're glad you installed.</h1>
    <p class="lede">Each one solves a real problem, runs where you work, and stays out of your way. Open source, MIT licensed, built in public.</p>
    <ul class="actions"><li><a class="btn primary" href="#tools">See the tools</a></li><li><a class="btn" href="${ORG}">GitHub</a></li></ul>
  </div>
</section>
<section class="wrap" id="tools">
  <h2>Tools</h2>
  <ul class="grid tools">
    ${TOOLS.map((t) => `<li class="card tool"><h3><a href="/${t.repo}/">${esc(t.repo)}</a></h3><p class="muted">${esc(t.tagline)}</p><p>${esc(t.lede)}</p><pre><code>npx ${esc(t.pkg)}</code></pre></li>`).join('\n    ')}
  </ul>
</section>
<section class="wrap prose">
  <h2>How we build</h2>
  <ul class="principles">
    <li><strong>One problem, one tool.</strong> Small, focused tools beat sprawling platforms.</li>
    <li><strong>Honest output.</strong> Estimates are labeled as estimates, and nothing is inflated to look impressive.</li>
    <li><strong>Local-first.</strong> Your code and data stay on your machine unless you ask otherwise.</li>
    <li><strong>Light footprint.</strong> Few dependencies, fast startup, nothing running in the background.</li>
    <li><strong>Verifiable releases.</strong> Every package is built in CI and published with signed npm provenance.</li>
    <li><strong>Open by default.</strong> MIT licensed, with issues and pull requests welcome.</li>
  </ul>
</section>`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'mintwork',
    url: SITE + '/',
    logo: `${SITE}/assets/mintwork-avatar-1024.png`,
    description,
    sameAs: [ORG, 'https://www.npmjs.com/org/mintwork', 'https://www.agensi.io/creators/mintwork'],
  };
  return { pathname, html: layout({ title: "mintwork: developer tools you're glad you installed", description, pathname, body, jsonld }) };
}

function notFound() {
  const body = `<section class="hero"><div class="wrap"><h1>Page not found</h1><p class="lede">That page doesn't exist. Try the <a href="/">home page</a> or one of the tools.</p><ul class="actions">${TOOLS.map((t) => `<li><a class="btn" href="/${t.repo}/">${t.repo}</a></li>`).join('')}</ul></div></section>`;
  return layout({ title: 'Page not found · mintwork', description: 'Page not found.', pathname: '/404.html', body, jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Page not found' } }).replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"');
}

const pages = [homePage(), ...TOOLS.map(toolPage)];
for (const { pathname, html } of pages) {
  const file = path.join('docs', pathname, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
fs.writeFileSync('docs/404.html', notFound());
fs.writeFileSync(
  'docs/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE}${p.pathname}</loc><lastmod>${UPDATED}</lastmod></url>`).join('\n')}\n</urlset>\n`,
);
fs.writeFileSync('docs/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync('docs/.nojekyll', '');
console.log(`built ${pages.length} pages + 404, sitemap, robots`);
