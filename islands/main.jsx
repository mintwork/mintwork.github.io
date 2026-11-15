// Interactive islands on top of the static pages build.mjs writes. Every page is complete HTML
// without this script (search engines, no-JS, reduced motion); these only add motion on top.
// Components in ./reactbits are from React Bits (https://reactbits.dev, MIT + Commons Clause).
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DecryptedText from './reactbits/DecryptedText.jsx';
import RotatingText from './reactbits/RotatingText.jsx';
import SpotlightCard from './reactbits/SpotlightCard.jsx';
import Threads from './reactbits/Threads.jsx';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MINT = [126 / 255, 226 / 255, 184 / 255];
const POLLEN = [242 / 255, 229 / 255, 138 / 255];

// Copy buttons on every command block: <pre data-copy="text">.
async function copy(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Press ⌘C';
  }
  button.dataset.state = 'done';
  setTimeout(() => {
    button.textContent = 'Copy';
    delete button.dataset.state;
  }, 1600);
}

for (const pre of document.querySelectorAll('pre[data-copy]')) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy command');
  button.addEventListener('click', () => copy(pre.dataset.copy, button));
  pre.append(button);
}

// The flowing lines behind each hero. Threads pauses itself off-screen and for reduced motion.
for (const el of document.querySelectorAll('[data-threads]')) {
  createRoot(el).render(
    <Threads
      color={MINT}
      accentColor={POLLEN}
      amplitude={1.2}
      distance={0.3}
      lineCount={42}
      thickness={0.5}
      speed={0.25}
      brightness={1.1}
      fade={0.6}
      opacity={0.55}
      angle={18}
      enableMouseInteraction={!reduceMotion}
    />,
  );
}

// Headlines decrypt into place once, on load. The real text stays in the DOM for screen readers.
if (!reduceMotion) {
  for (const el of document.querySelectorAll('[data-decrypt]')) {
    const lines = JSON.parse(el.dataset.decrypt);
    createRoot(el).render(
      lines.map((line, i) => (
        <span className="line" key={line}>
          <DecryptedText
            text={line}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={22 + i * 6}
            useOriginalCharsOnly={false}
            characters="abcdefghijklmnopqrstuvwxyz/<>{}=+*#01"
            encryptedClassName="scramble"
          />
        </span>
      )),
    );
  }
}

// The home page prompt: `npx @mintwork/<tool>`, cycling through the tools, copyable.
function Prompt({ tools }) {
  const [index, setIndex] = useState(0);
  const command = `npx ${tools[index].pkg}`;
  const [state, setState] = useState('idle');
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 1600);
  };
  return (
    <div className="prompt-live">
      <code>
        <span className="sigil" aria-hidden="true">
          $
        </span>
        <span>npx @mintwork/</span>
        <RotatingText
          texts={tools.map((t) => t.name)}
          mainClassName="rotating"
          splitBy="characters"
          staggerDuration={0.018}
          rotationInterval={2600}
          pauseOnHover
          onNext={setIndex}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        />
      </code>
      <button type="button" className="copy" data-state={state === 'idle' ? undefined : 'done'} onClick={onCopy}>
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press ⌘C' : 'Copy'}
      </button>
      <a className="prompt-link" href={`/${tools[index].name}/`}>
        What {tools[index].name} does
      </a>
    </div>
  );
}

for (const el of document.querySelectorAll('[data-prompt]')) {
  if (reduceMotion) continue; // the static list of commands stays
  createRoot(el).render(<Prompt tools={JSON.parse(el.dataset.prompt)} />);
}

// A soft light that follows the cursor across each tool in the index.
for (const el of document.querySelectorAll('[data-spotlight]')) {
  const html = el.innerHTML;
  createRoot(el).render(
    <SpotlightCard
      className="spot"
      spotlightColor="rgba(126, 226, 184, 0.14)"
      spotlightSize={460}
      borderGlow={0.5}
      flare={false}
      style={{
        '--spotlight-card-surface': 'transparent',
        '--spotlight-card-border': 'transparent',
        '--spotlight-card-shadow': 'none',
        padding: 0,
        borderRadius: 18,
      }}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: our own static markup, moved inside */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </SpotlightCard>,
  );
}
