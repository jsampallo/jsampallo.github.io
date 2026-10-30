// Portfolio home: the hero headline rises in word by word, and the statement lights up word by word as it scrolls past.
// Without JS (or with reduced motion) both simply show as plain text.
(() => {
'use strict';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The EN/ES link wins over the browser's language from then on
document.querySelectorAll('[data-lang]').forEach(a => a.addEventListener('click', () => {
  try { localStorage.setItem('lang', a.dataset.lang); } catch (e) {}
}));

// Wrap every word of an element in a span, keeping inner spans (like .faint) intact
function words(el) {
  const out = [];
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { frag.append(t); return; }
        const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); out.push(s);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el);
  return out;
}

if (!reduced) {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    words(el).forEach((w, i) => w.style.setProperty('--i', i));
    el.classList.add('reveal');
  });
}

// Qata cover: the iframe takes the height of the demo inside it
const cover = document.querySelector('.cover');
if (cover) {
  const start = () => {
    const d = cover.contentDocument;
    if (!d || !d.getElementById('hero-demo')) return; // still the blank frame
    const fit = () => { cover.style.height = d.getElementById('hero-demo').offsetHeight + 'px'; };
    fit(); new ResizeObserver(fit).observe(d.body);
  };
  cover.addEventListener('load', start);
  start();
}

// Statement: the share of words lit follows how far the block has scrolled up the screen
const lit = [...document.querySelectorAll('[data-lit]')];
if (!lit.length || reduced) return;
const all = lit.flatMap(words);
document.documentElement.classList.add('lit-on');
let ticking = false;
function update() {
  ticking = false;
  const box = lit[0].parentElement.getBoundingClientRect(), vh = innerHeight;
  // 0 when the block's top reaches 85% of the screen, 1 when its bottom reaches 55%
  const p = Math.min(1, Math.max(0, (vh * .85 - box.top) / (box.height + vh * .3)));
  const n = Math.round(p * all.length);
  all.forEach((w, i) => w.classList.toggle('on', i < n));
}
const ask = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
addEventListener('scroll', ask, { passive: true });
addEventListener('resize', ask);
update();
})();
