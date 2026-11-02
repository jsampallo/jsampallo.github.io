// 3D & Retouching: the videos play while on screen, the before / after sliders, and the page chrome.
(() => {
'use strict';

const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Videos only run while they're on screen. With reduced motion they stay on their first frame
if (!reduced) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: .2 });
  $$('video').forEach(v => io.observe(v));
}

$$('.cmp').forEach(c => {
  const set = v => c.style.setProperty('--x', `${v}%`);
  const input = c.querySelector('input');
  input.addEventListener('input', () => set(input.value));
  set(input.value);
});

function progress() {
  const secs = $$('[data-sec]'), menu = document.getElementById('prog-menu'), prog = document.getElementById('prog'), btn = document.getElementById('prog-btn');
  menu.innerHTML = secs.map(s => `<a href="#${s.id}">${s.dataset.sec}</a>`).join('');
  btn.addEventListener('click', () => { const o = prog.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  menu.addEventListener('click', () => { prog.classList.remove('open'); btn.setAttribute('aria-expanded', false); });
  document.addEventListener('click', e => { if (!prog.contains(e.target)) { prog.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
  const arc = document.getElementById('prog-arc'), pct = document.getElementById('prog-pct'), name = document.getElementById('prog-name');
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? Math.min(1, scrollY / max) : 0;
    arc.style.strokeDashoffset = 47.1 * (1 - k); pct.textContent = Math.round(k * 100) + '%';
    let cur = secs[0]; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s; });
    name.textContent = cur.dataset.sec;
    $$('a', menu).forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id));
  };
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
}
progress();
})();
