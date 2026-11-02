// Pareto case study: the hero, the feature animations and the page chrome.
// The mockups rebuild the real funnel in code (its tokens, fonts and copy) so they can move like the Qata ones.
(() => {
'use strict';

/* ================= utils ================= */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMG = f => `/studies/pareto/images/${f}`;
// Page chrome around the mockups (the mockups themselves are the real funnel, always in English)
const T = document.documentElement.lang.startsWith('es')
  ? { lanes: ['$500K o más', 'Menos de $500K'] }
  : { lanes: ['$500K+', 'Under $500K'] };

// Loops only run while their element is on screen and the tab is visible
const watchers = new Map();
const wake = w => { if (w.vis && !document.hidden) { w.waiting.forEach(f => f()); w.waiting = []; } };
const io = new IntersectionObserver(es => es.forEach(e => { const w = watchers.get(e.target); if (w) { w.vis = e.isIntersecting; wake(w); } }), { threshold: .2 });
const watch = el => { if (!watchers.has(el)) { watchers.set(el, { vis: false, waiting: [] }); io.observe(el); } return watchers.get(el); };
const visible = el => { const w = watch(el); return w.vis && !document.hidden ? Promise.resolve() : new Promise(r => w.waiting.push(r)); };
document.addEventListener('visibilitychange', () => watchers.forEach(wake));
const wait = async (el, ms) => { await sleep(ms); await visible(el); };
const loop = (el, fn) => { watch(el); (async () => { for (;;) { await visible(el); try { await fn(); } catch (err) { console.error(err); await sleep(2000); } } })(); };

/* ================= icons (lucide shapes) ================= */
const P = {
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.970 5.700a1.940 1.940 0 0 1-2.060 0L2 7"/>',
  branch: '<path d="M12 3v6"/><path d="M12 9c0 4-6 4-6 9"/><path d="M12 9c0 4 6 4 6 9"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.600 16.800a3 3 0 1 1-5.800-1.600"/>',
  layout: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  list: '<path d="M11 6h10"/><path d="M11 12h10"/><path d="M11 18h10"/><path d="m3 6 1.500 1.500L7 5"/><path d="m3 12 1.500 1.500L7 11"/><path d="m3 18 1.500 1.500L7 17"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  badge: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.300 21a1.940 1.940 0 0 0 3.400 0"/>',
  phone: '<path d="M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1.900.4 1.800.7 2.700a2 2 0 0 1-.5 2.100L8 9.800a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.3 1.800.6 2.700.7a2 2 0 0 1 1.700 2Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.870"/><path d="M16 3.130a4 4 0 0 1 0 7.750"/>',
  mailopen: '<path d="M21.200 8.400c.5.380.800.970.800 1.600v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.600l8-6a2 2 0 0 1 2.400 0l8 6Z"/><path d="m22 10-8.970 5.700a1.940 1.940 0 0 1-2.060 0L2 10"/>',
};
const ic = (n, s = 16, w = 2) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ================= the real quiz, with the sample agency owner's answers ================= */
const QS = [
  { k: 'Built for', t: 'list', h: 'What kind of business is your right hand joining?', o: ['Agency or service firm', 'Coach, speaker or consultant', 'Professional firm', 'E-commerce or product'], a: 0,
    f: { built: 'Agency owners', for: 'Built for: Agency owners' } },
  { k: 'First 3 handoffs', t: 'tiles', h: 'Which 3 things should your right hand take off your plate first?', o: ['Inbox and messages', 'Calendar and scheduling', 'Client follow-ups and onboarding', 'Invoices, payments and expenses', 'CRM and sales pipeline', 'Content and social media'], a: [0, 2, 3],
    f: { hand: ['Inbox management', 'Client follow-up and onboarding', 'Billing and expenses'].map((s, i) => `<span><em>0${i + 1}</em>${s}</span>`).join('') } },
  { k: 'Ownership level', t: 'list', h: 'Picture it: you disappear for 2 weeks, no phone, no laptop. What happens to the business?', o: ['It keeps growing', 'It slows down', 'It stalls', 'It falls apart'], a: 2,
    f: { own: 'Operator → Chief of Staff' } },
  { k: 'Time to hand off', t: 'slider', h: 'How many hours a week do those 3 areas take from you?', o: ['1–5', '5–10', '10–20', '20+'], a: 2, u: 'hrs / week',
    f: { hrs: 'Up to 15<small> hrs/wk</small>' } },
  { k: "What it's worth", t: 'slider', h: "What's an hour of your time worth?", o: ['<$100', '$100–250', '$250–500', '$500+'], a: 2, u: '/ hour',
    f: { val: '$5,625<small>/wk</small>' } },
  { k: 'Work style · Pace', t: 'ab', h: 'How fast should your right hand move?', o: [['Fast', 'Keeps up with decisions made on the fly'], ['Steady', 'Plans ahead and keeps things predictable']], a: 0,
    f: { style: '<span>Keeps up with fast decisions</span>' } },
  { k: 'Work style · Updates', t: 'ab', h: 'How should your right hand keep you posted?', o: [['Short', 'Only when it matters'], ['Detailed', 'Regular check-ins with detail']], a: 0,
    f: { style: '<span>Keeps up with fast decisions</span><span>Brief, exception-only updates</span>' } },
  { k: 'Work style · Ownership', t: 'ab', h: 'When you hand something off, your right hand…', o: [['Runs with it', 'Uses their own judgment'], ['Follows the process', 'Does it the way you set']], a: 0,
    f: { style: '<span>Keeps up with fast decisions</span><span>Brief, exception-only updates</span><span>Takes ownership and decides within limits</span>' } },
  { k: 'Tool stack', t: 'tiles', h: 'Which tools will your right hand work in?', o: ['Google Workspace', 'Microsoft 365', 'Slack', 'A CRM', 'Notion / ClickUp / Asana', 'QuickBooks / Xero'], a: [0, 2, 3],
    f: { tools: ['Google Workspace', 'Slack', 'Your CRM'].map(s => `<span>${s}</span>`).join('') } },
  { k: "What's different this time", t: 'list', h: 'Is this your first right hand?', o: ['Yes, this would be my first', "No, I've had an assistant or VA, and it worked", "No, I've had an assistant or VA, and it didn't work"], a: 2,
    f: { diff: 'Proactive, not reactive: anticipates, owns and closes loops instead of waiting for instructions' } },
];

const qBody = q => {
  const opts = {
    list: () => `<div class="q-l">${q.o.map((o, i) => `<span class="q-o" data-a><u>${i + 1}</u>${o}</span>`).join('')}</div>`,
    tiles: () => `<div class="q-g">${q.o.map((o, i) => `<span class="q-t" data-a><u>${i + 1}</u>${o}</span>`).join('')}</div>`,
    ab: () => `${q.o.map(([b, s], i) => `<span class="q-c" data-a><u>${'AB'[i]}</u><b>${b}</b><span>${s}</span></span>`).join('<span class="q-or">OR</span>')}`,
    slider: () => `<div class="q-s"><p class="q-v"><span data-v>${q.o[0]}</span><small>${q.u}</small></p><div class="q-tr"><i></i><b></b></div><div class="q-st">${q.o.map(o => `<span>${o}</span>`).join('')}</div></div><span class="btn">Continue ${ic('arrow', 15)}</span>`,
  };
  return `<p class="eye">Building · ${q.k}</p><h4>${q.h}</h4>${opts[q.t]()}`;
};
const quizPanel = () => `
  <div class="q">
    <div class="q-top"><span class="q-back">${ic('back', 13)}</span><img src="${IMG('logo-white.svg')}" alt=""><span class="q-n"></span></div>
    <div class="q-bar"><i></i></div>
    <div class="q-me"><span class="rg"><svg viewBox="0 0 46 46"><circle class="bg" cx="23" cy="23" r="21"/><circle class="fg" cx="23" cy="23" r="21"/></svg><img src="${IMG('silhouette.webp')}" alt=""></span><div><b>Building your right hand</b><span><em>0</em> of 10 traits set</span></div></div>
    <div class="q-b"></div>
  </div>`;
// Shows question i in a quiz panel
const qSet = async (el, i) => {
  const b = $('.q-b', el);
  b.classList.add('swap'); await sleep(240);
  b.innerHTML = qBody(QS[i]);
  $('.q-n', el).textContent = `${i + 1} / 10`;
  $('.q-bar i', el).style.width = `${(i + 1) * 10}%`;
  $('.q-me em', el).textContent = i;
  $('.rg .fg', el).style.strokeDashoffset = 132 * (1 - i / 10);
  b.classList.remove('swap');
};
const setSlider = (el, q, stop) => {
  const x = stop / (q.o.length - 1) * 100;
  $('.q-tr i', el).style.width = `${x}%`; $('.q-tr b', el).style.left = `${x}%`;
  $('[data-v]', el).textContent = q.o[stop];
  $$('.q-st span', el).forEach((s, k) => s.classList.toggle('on', k === stop));
};
// Answers the current question: touch(el) points at something and resolves on the tap
async function qAnswer(el, q, touch) {
  const a = $$('[data-a]', el);
  if (q.t === 'slider') {
    await touch($$('.q-st span', el)[q.a]); setSlider(el, q, q.a); await sleep(620);
    await touch($('.btn', el)); return;
  }
  for (const i of [].concat(q.a)) { await touch(a[i]); a[i].classList.add('on'); await sleep(q.t === 'tiles' ? 140 : 340); }
}

/* ================= the spec card ================= */
const SK = (w = 'w6') => `<i class="sk ${w}"></i>`;
const cardHTML = (full = false, av = 'avatar-1.webp') => {
  const F = (k, html) => `<span data-f="${k}">${html}</span>`;
  const V = Object.assign({}, ...QS.map(q => q.f));
  const v = (k, sk) => (full ? V[k] : sk);
  return `
  <div class="sp ${full ? 'done' : ''}">
    <div class="sp-h"><span class="sp-a"><img src="${IMG('silhouette.webp')}" alt=""><img src="${IMG(av)}" alt=""></span><div><b>Your Right Hand</b>${F('for', v('for', SK('w8')))}</div><small>Your blueprint</small></div>
    <div class="sp-r two">
      <div><p class="lb">Built for</p><b class="vl">${F('built', v('built', SK()))}</b></div>
      <div><p class="lb">Ownership level</p><b class="vl">${F('own', v('own', SK('w8')))}</b><div class="mt ${full ? 'on' : ''}"><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i></div></div>
    </div>
    <div class="sp-r"><p class="lb">First 3 handoffs</p><div class="ch">${full ? V.hand : `<span data-f="hand" style="display:contents">${SK()}${SK()}${SK()}</span>`}</div></div>
    <div class="sp-r"><p class="lb">Work style</p><div class="ch dim">${full ? V.style : `<span data-f="style" style="display:contents">${SK()}${SK()}</span>`}</div></div>
    <div class="sp-r"><p class="lb">Works in</p><div class="ch">${full ? V.tools : `<span data-f="tools" style="display:contents">${SK()}${SK()}</span>`}</div></div>
    <div class="sp-r sp-st">
      <div><b>${F('hrs', v('hrs', SK('w8')))}</b><span>you could hand off</span></div>
      <div><b>${F('val', v('val', SK('w8')))}</b><span>worth of your time</span></div>
    </div>
    <div class="sp-r"><p class="lb">What's different this time</p><div class="sp-d">${F('diff', v('diff', SK('w8') + SK('w6')))}</div></div>
  </div>`;
};

/* ================= the hero: every answer fills a field on the card ================= */
function createHero(root) {
  const phone = matchMedia('(max-width: 640px)');
  root.innerHTML = `
    <div class="fit"><div class="hd">
      <div class="hd-q pn">${quizPanel()}
        <div class="hd-ready"><span class="rg"><svg viewBox="0 0 46 46"><circle class="bg" cx="23" cy="23" r="21"/><circle class="fg" cx="23" cy="23" r="21" style="stroke-dashoffset:0"/></svg><img src="${IMG('avatar-1.webp')}" alt=""></span><b>Your right hand is ready</b></div>
      </div>
      <div class="hd-c"></div>
      <div class="cursor"></div>
    </div></div>`;
  const fitEl = $('.fit', root), hd = $('.hd', root), panel = $('.hd-q', root), slot = $('.hd-c', root), cur = $('.cursor', root), ready = $('.hd-ready', root);
  let s = 1;
  const size = () => {
    const W = phone.matches ? 372 : 880, H = phone.matches ? 730 : 636;
    s = Math.min(1.05, root.clientWidth / W);
    hd.style.setProperty('--s', s);
    fitEl.style.width = `${W * s}px`; fitEl.style.height = `${H * s}px`;
  };
  new ResizeObserver(size).observe(root); size();
  slot.innerHTML = cardHTML();
  $('.q-b', panel).innerHTML = qBody(QS[0]);

  const touch = async el => {
    const r = el.getBoundingClientRect(), o = hd.getBoundingClientRect();
    cur.style.translate = `${(r.left - o.left + r.width / 2) / s}px ${(r.top - o.top + r.height / 2) / s}px`;
    cur.classList.add('show');
    await wait(root, 680);
    cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap');
    await sleep(170);
  };
  const fill = f => Object.entries(f).forEach(([k, html]) => {
    const el = $(`[data-f="${k}"]`, slot);
    el.innerHTML = html;
    if (el.style.display === 'contents') [...el.children].forEach(c => c.classList.add('set')); else el.classList.add('set');
    if (k === 'own') $('.mt', slot).classList.add('on');
  });
  const reset = () => {
    slot.innerHTML = cardHTML();
    hd.classList.remove('card'); ready.classList.remove('on');
    cur.classList.remove('show');
  };

  (async () => {
    if (reduced) { slot.innerHTML = cardHTML(true); hd.classList.add('card'); await qSet(panel, 0); return; }
    for (;;) {
      await visible(root);
      reset(); await qSet(panel, 0); await wait(root, 900);
      for (let i = 0; i < QS.length; i++) {
        await qAnswer(panel, QS[i], touch);
        fill(QS[i].f);
        await wait(root, 460);
        if (i < QS.length - 1) await qSet(panel, i + 1);
        await wait(root, 240);
      }
      cur.classList.remove('show');
      ready.classList.add('on'); await wait(root, 1500);
      $('.sp', slot).classList.add('done'); hd.classList.add('card');
      await wait(root, 4800);
      hd.style.opacity = 0; hd.style.transition = 'opacity .4s'; await sleep(420);
      reset(); hd.style.opacity = 1; await sleep(420); hd.style.transition = '';
    }
  })();
}

/* ================= feature animations ================= */
// Drawn at a fixed size, then scaled to the stage
function mount(fx, html, cls = '', pad = 28) {
  fx.innerHTML = `<div class="art m ${cls}">${html}</div>`;
  const art = fx.firstElementChild;
  const fit = () => { const s = Math.min(1.12, (fx.clientWidth - pad) / art.offsetWidth, (fx.clientHeight - pad) / art.offsetHeight); fx.style.setProperty('--s', s.toFixed(3)); };
  new ResizeObserver(fit).observe(fx); new ResizeObserver(fit).observe(art); fit();
  return art;
}
function tap(fx, el) {
  let d = fx.querySelector(':scope > .tapdot');
  if (!d) { d = document.createElement('i'); d.className = 'tapdot'; fx.appendChild(d); }
  const r = el.getBoundingClientRect(), f = fx.getBoundingClientRect();
  d.style.left = (r.left - f.left + r.width / 2) + 'px'; d.style.top = (r.top - f.top + r.height / 2) + 'px';
  d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
}
// Runs a dot along an SVG path over ms, calling step(x, y) on every frame
const along = (path, dot, ms, step) => new Promise(res => {
  const L = path.getTotalLength(); let t0;
  const tick = t => {
    t0 = t0 || t;
    const k = Math.min(1, (t - t0) / ms), p = path.getPointAtLength(L * k);
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); if (step) step(p.x, p.y, k);
    if (k < 1) requestAnimationFrame(tick); else res();
  };
  requestAnimationFrame(tick);
});

const FX = {
  // The business map in full. The ideal journey is one continuous line: the same progress drives the dot and the camera, so nothing can jump
  map(fx) {
    const W = 1860, H = 440;
    // x, y, width, label, icon: steps with an icon are on the ideal journey, the rest are the alternate paths
    const N = {
      a1: [84, 96, 128, 'Ads campaign', 'megaphone'], a2: [84, 158, 128, 'Organic content'], a3: [84, 220, 128, "Ivan's YouTube"], a4: [84, 282, 128, 'Email campaign'],
      land: [276, 190, 130, 'Landing page', 'layout'], quiz: [438, 190, 130, 'Quiz &amp; form', 'list'],
      res: [790, 120, 146, 'Results + booking', 'calendar'], ty: [1130, 62, 140, 'Thank-you page', 'badge'], seq: [1130, 200, 124, 'Email sequence'],
      rem: [1294, 62, 116, 'Reminder', 'bell'], call: [1426, 62, 96, 'Call', 'phone'], close: [1750, 62, 140, 'Close &amp; matching', 'users'], noshow: [1570, 200, 124, 'No-show sequence'],
      nq: [790, 336, 146, 'Not qualified page'], nur: [960, 336, 124, 'Nurture emails'],
    };
    const D = { rev: [600, 190, 112, 'Revenue<br>$500K+?'], book: [960, 120, 92, 'Booked?'], show: [1570, 62, 92, 'Showed<br>up?'] };
    const E = ['M148 158H178V190', 'M148 220H178V190', 'M148 282H178V190', 'M600 246V336H717', 'M960 166V200H1068', 'M1130 222V276H790V142', 'M1570 108V178', 'M1570 222V404H276V212', 'M863 336H898', 'M960 358V404'];
    const IDEAL = 'M84 96H178V190H600V120H960V62H1750';
    // Rounds the corners of a path made of straight lines
    const curve = (d, r = 14) => {
      const pts = []; let x = 0, y = 0;
      d.match(/[MHV][^MHV]+/g).forEach(c => { const v = c.slice(1).trim().split(/\s+/).map(Number); if (c[0] === 'M') [x, y] = v; if (c[0] === 'H') x = v[0]; if (c[0] === 'V') y = v[0]; pts.push([x, y]); });
      return pts.map(([a, b], i) => {
        if (!i) return `M${a} ${b}`;
        if (i === pts.length - 1) return `L${a} ${b}`;
        const [p, q] = pts[i - 1], [m, n] = pts[i + 1], t = (u, v) => Math.sign(u - v) * r;
        return `L${a + t(p, a)} ${b + t(q, b)}Q${a} ${b} ${a + t(m, a)} ${b + t(n, b)}`;
      }).join('');
    };
    fx.innerHTML = `<div class="fm">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${E.map(d => `<path class="alt" d="${curve(d)}"/>`).join('')}<path class="base" d="${curve(IDEAL)}"/><path class="lit" d="${curve(IDEAL)}"/><circle class="dot" r="5.500"/></svg>
      ${Object.entries(N).map(([k, [x, y, w, t, i]]) => `<div class="fm-n ${i ? '' : 'alt'}" ${i ? `data-x="${x}" data-y="${y}"` : ''} style="left:${x - w / 2}px;top:${y}px;width:${w}px">${i ? `<span>${ic(i, 15, 2)}</span>` : ''}${t}</div>`).join('')}
      ${Object.entries(D).map(([k, [x, y, s, t]]) => `<div class="fm-d" data-x="${x}" data-y="${y}" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px"><span>${t}</span></div>`).join('')}
      <span class="fm-y" style="left:610px;top:112px">YES</span><span class="fm-y alt" style="left:610px;top:262px">NO</span>
      <span class="fm-y" style="left:970px;top:54px">YES</span><span class="fm-y alt" style="left:970px;top:172px">NO</span>
      <span class="fm-y" style="left:1626px;top:40px">YES</span><span class="fm-y alt" style="left:1580px;top:128px">NO</span>
    </div>`;
    const art = $('.fm', fx), lit = $('.lit', art), dot = $('.dot', art), marks = $$('[data-x]', art), len = lit.getTotalLength();
    lit.style.strokeDasharray = len; lit.style.strokeDashoffset = len;
    // How far along the line each step sits, so it lights up exactly when the dot gets there
    const at = marks.map(m => { let best = 0, gap = Infinity; for (let d = 0; d <= len; d += 2) { const p = lit.getPointAtLength(d), g = Math.hypot(p.x - m.dataset.x, p.y - m.dataset.y); if (g < gap) { gap = g; best = d; } } return best; });
    let s = 1, top = 0, pan = 0;
    const move = k => { art.style.transform = `translate3d(${-pan * k * k * (3 - 2 * k)}px, ${top}px, 0) scale(${s})`; };
    const fit = () => { s = Math.max(.72, fx.clientHeight / H); top = Math.max(0, (fx.clientHeight - H * s) / 2); pan = Math.max(0, W * s - fx.clientWidth); move(0); };
    new ResizeObserver(fit).observe(fx); fit();
    const reset = () => { marks.forEach(m => m.classList.remove('on')); lit.style.strokeDashoffset = len; move(0); };
    if (reduced) { lit.style.strokeDashoffset = 0; marks.forEach(m => m.classList.add('on')); return; }
    loop(fx, async () => {
      reset(); art.classList.remove('off'); await wait(fx, 1000);
      dot.style.opacity = 1;
      await along(lit, dot, 13000, (x, y, k) => {
        move(k); lit.style.strokeDashoffset = len * (1 - k);
        marks.forEach((m, i) => { if (len * k >= at[i]) m.classList.add('on'); });
      });
      dot.style.opacity = 0;
      await wait(fx, 2200);
      art.classList.add('off'); await sleep(480);
    });
  },

  // The landing page in its mobile layout: the slow blur-up reveal, then a scroll down to the sample card.
  // Pinned to the top of the stage, so the phone runs past its bottom edge
  landing(fx) {
    const faces = ['joe-polish', 'justin-donald', 'jon-vroman', 'kevin-mohler'];
    fx.innerHTML = `
      <div class="art m lm">
        <div class="lm-u">paretotalent.com</div>
        <div class="lm-v pn"><div class="lm-s">
          <div class="lm-n rv" style="--i:0"><img src="${IMG('logo-white.svg')}" alt=""></div>
          <span class="lp-p rv" style="--i:1">For founders doing $500K+</span>
          <h4><span class="rv" style="--i:2">The 2-Minute</span><span class="rv grad" style="--i:3">Delegation</span><span class="rv grad" style="--i:4">Blueprint</span></h4>
          <p class="lm-l rv" style="--i:6">Know exactly who to hire, and the first 3 things to hand them.</p>
          <div class="lm-f rv" style="--i:7"><span>${faces.map(f => `<img src="${IMG(`${f}.webp`)}" alt="" width="84" height="84">`).join('')}</span><p>Built from matching <b>100+ founders</b> with their right hands.</p></div>
          <span class="btn rv" style="--i:8">Build my blueprint ${ic('arrow', 16)}</span>
          <div class="lm-c rv" style="--i:9">${['10 quick questions', '2 minutes', 'Free'].map(t => `<span>${ic('check', 13, 2.5)}${t}</span>`).join('')}</div>
          <div class="lm-k rv" style="--i:10">
            <span class="ch-f">${ic('clock', 14)}Ready in 2 minutes</span>
            ${cardHTML(true).replace('Your blueprint', 'Sample').replace('Built for: Agency owners', 'Example: agency owner')}
          </div>
        </div></div>
      </div>`;
    const art = fx.firstElementChild, view = $('.lm-v', art), page = $('.lm-s', art), card = $('.lm-k', art);
    const fit = () => fx.style.setProperty('--s', (fx.clientWidth * .6 / art.offsetWidth).toFixed(3));
    new ResizeObserver(fit).observe(fx); fit();
    if (reduced) { view.classList.add('show'); return; }
    loop(fx, async () => {
      page.classList.add('snap'); page.style.transform = ''; void page.offsetWidth; page.classList.remove('snap');
      view.classList.remove('show', 'gone'); await sleep(700);
      view.classList.add('show'); await wait(fx, 3600);
      page.style.transform = `translateY(${-(card.offsetTop - 34)}px)`;
      await wait(fx, 4200);
      view.classList.add('gone'); await sleep(500);
    });
  },

  // The GoHighLevel form, restyled to match the brand
  form(fx) {
    const F = [['What\'s your full name?', 'Alex Morgan'], ['What\'s the best email to contact you?', 'alex@agency.com'], ['What\'s your annual revenue?', '$500k-$1M/year']];
    const art = mount(fx, `
      <div class="pn fo">
        <p class="eye">Last step</p>
        <h4>Where should we send your <span class="grad">blueprint?</span></h4>
        ${F.map(([l], i) => `<div class="fo-f"><label>${l}</label><div class="fo-i" data-i="${i}"><span></span><i></i></div></div>`).join('')}
        <span class="btn" data-go>Show my Blueprint</span>
      </div>`, 'mf');
    const inputs = $$('.fo-i', art), go = $('[data-go]', art);
    if (reduced) { inputs.forEach((n, i) => { n.firstElementChild.textContent = F[i][1]; }); return; }
    loop(fx, async () => {
      inputs.forEach(n => { n.firstElementChild.textContent = ''; n.classList.remove('on'); });
      await wait(fx, 1000);
      for (let k = 0; k < F.length; k++) {
        inputs[k].classList.add('on');
        const t = F[k][1];
        for (let i = 1; i <= t.length; i++) { inputs[k].firstElementChild.textContent = t.slice(0, i); await sleep(36); }
        await sleep(260); inputs[k].classList.remove('on');
      }
      await wait(fx, 700); tap(fx, go); go.classList.add('press'); await sleep(200); go.classList.remove('press');
      await wait(fx, 2200);
    });
  },

  // Q4 × Q5: the conservative values from the quiz, counted up on the two result boxes
  math(fx) {
    const Q = [{ o: ['1–5', '5–10', '10–20', '20+'], v: [3, 7.5, 15, 20], u: 'hrs / week' }, { o: ['<$100', '$100–250', '$250–500', '$500+'], v: [75, 175, 375, 600], u: '/ hour' }];
    const art = mount(fx, `
      <div class="pn ma">
        ${Q.map(q => `<div class="q-s"><p class="q-v"><span data-v></span><small>${q.u}</small></p><div class="q-tr"><i></i><b></b></div><div class="q-st">${q.o.map(o => `<span>${o}</span>`).join('')}</div></div>`).join('')}
        <div class="ma-r sp-st">
          <div><b data-h></b><span>you could hand off</span></div>
          <div><b data-w></b><span>worth of your time</span></div>
        </div>
      </div>`, 'mc');
    const boxes = $$('.q-s', art), hrs = $('[data-h]', art), wk = $('[data-w]', art);
    let cur = 0;
    const money = n => `$${Math.round(n).toLocaleString('en-US')}<small>/wk</small>`;
    const put = (a, b) => {
      [a, b].forEach((st, i) => setSlider(boxes[i], Q[i], st));
      const h = Q[0].v[a], to = h * Q[1].v[b], from = cur, t0 = performance.now();
      hrs.innerHTML = `Up to ${h}<small> hrs/wk</small>`;
      cur = to;
      if (reduced) { wk.innerHTML = money(to); return; }
      const tick = t => { const k = Math.min(1, (t - t0) / 650); wk.innerHTML = money(from + (to - from) * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    put(2, 2);
    if (reduced) return;
    const steps = [[1, 2], [1, 1], [3, 1], [3, 3], [2, 2]];
    let at = 0;
    loop(fx, async () => { await wait(fx, 2300); put(...steps[at]); at = (at + 1) % steps.length; });
  },

  // The result, simplified to what fits at a glance: it builds itself field by field
  card(fx) {
    const art = mount(fx, `
      <div class="sp mini">
        <div class="sp-h rv" style="--i:0"><span class="sp-a"><img src="${IMG('silhouette.webp')}" alt=""><img src="${IMG('avatar-1.webp')}" alt=""></span><div><b>Your Right Hand</b><span>Built for: Agency owners</span></div><small>Your blueprint</small></div>
        <div class="sp-r rv" style="--i:2"><p class="lb">Ownership level</p><b class="vl">Operator → Chief of Staff</b><div class="mt on"><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i></div></div>
        <div class="sp-r rv" style="--i:4"><p class="lb">First 3 handoffs</p><div class="ch">${QS[1].f.hand}</div></div>
        <div class="sp-r sp-st rv" style="--i:6"><div><b>Up to 15<small> hrs/wk</small></b><span>you could hand off</span></div><div><b>$5,625<small>/wk</small></b><span>worth of your time</span></div></div>
      </div>`, 'mc');
    const c = $('.sp', art);
    if (reduced) { c.classList.add('show', 'done'); return; }
    loop(fx, async () => {
      c.classList.remove('show', 'done'); await sleep(1100);
      c.classList.add('show'); await wait(fx, 1500);
      c.classList.add('done'); await wait(fx, 4200);
    });
  },

  // The revenue answer picks the lane
  lanes(fx) {
    const days = 'S M T W T F S'.split(' '), open = [9, 10, 12, 16, 17];
    const art = mount(fx, `
      <div class="pn la" data-l="0">
        <div class="la-a">
          <p class="eye">Your next step</p>
          <h4>This is the spec. Now <span class="grad">meet the people.</span></h4>
          <div class="cal"><p>Book your Matching Call</p><div>${days.map(d => `<span>${d}</span>`).join('')}${Array.from({ length: 14 }, (_, i) => `<span class="${open.includes(i + 7) ? 'a' : ''}" ${i + 7 === 12 ? 'data-d' : ''}>${i + 7}</span>`).join('')}</div></div>
        </div>
        <div class="la-b">
          <p class="eye">Your first move</p>
          <h4>Start with your first handoff <span class="grad">this week.</span></h4>
          <div class="st3"><div><u>1</u><span><b>List it.</b> Every recurring task for one week.</span></div><div><u>2</u><span><b>Record it.</b> A 5-minute screen video of how you do it.</span></div><div><u>3</u><span><b>Hand it off.</b> One task, with the video as instructions.</span></div></div>
        </div>
      </div>
      <div class="tabs">${T.lanes.map((t, i) => `<span class="${i ? '' : 'on'}">${t}</span>`).join('')}</div>`, 'mw');
    const la = $('.la', art), tabs = $$('.tabs span', art), day = $('[data-d]', art);
    if (reduced) return;
    const go = l => { tap(fx, tabs[l]); la.dataset.l = l; tabs.forEach((t, k) => t.classList.toggle('on', k === l)); };
    loop(fx, async () => {
      await wait(fx, 1600); tap(fx, day); day.classList.add('on');
      await wait(fx, 2200); go(1);
      await wait(fx, 3800); day.classList.remove('on'); go(0);
    });
  },

  // The real workflow: "Email 1: Didn't book", a wait, a condition and two branches
  workflow(fx) {
    const art = mount(fx, `
      <div class="gh">
        <div class="gh-t">FP | Joaquin Sampallo | Qualified Workflow<nav><b>Builder</b><span>Settings</span><span>Enrollment history</span><span>Execution logs</span></nav></div>
        <div class="gh-c">
          <svg viewBox="0 0 438 330" aria-hidden="true">
            <path data-p="a" d="M220 28V88"/><path data-p="b" d="M220 88V168"/><path data-p="c" d="M219 168V218Q219 232 205 232H120Q106 232 106 246V266"/><path data-p="d" d="M219 168V218Q219 232 233 232H318Q332 232 332 246V266"/>
            <circle class="dot" r="5"/>
          </svg>
          <div class="gh-n" data-n="1" style="top:6px"><span style="background:#e7f6ee;color:#0a7a4c">${ic('mailopen', 15, 2)}</span>Email 1: Didn't book<em>···</em></div>
          <div class="gh-n" data-n="2" style="top:66px"><span style="background:#efe9fd;color:#5b34da">${ic('clock', 15, 2)}</span>Wait 'til next day<em>···</em></div>
          <div class="gh-n" data-n="3" style="top:146px"><span style="background:#e8f0fe;color:#2563eb;font-weight:700;font-size:12px">{ }</span>Condition<em>···</em></div>
          <div class="gh-b" data-n="4" style="left:20px;top:224px"><b>Booked?</b>If "Tags" includes "fp_joaquin…</div>
          <div class="gh-b" data-n="5" style="left:246px;top:224px"><b>None</b>When none of the conditions are met</div>
        </div>
      </div>`, 'mg');
    const dot = $('.dot', art), n = k => $(`[data-n="${k}"]`, art), p = k => $(`[data-p="${k}"]`, art);
    const clear = () => $$('.on', art).forEach(e => e.classList.remove('on'));
    if (reduced) return;
    let side = 0;
    loop(fx, async () => {
      clear(); dot.style.opacity = 1;
      n(1).classList.add('on'); await along(p('a'), dot, 900);
      clear(); n(2).classList.add('on'); await wait(fx, 900); await along(p('b'), dot, 900);
      clear(); n(3).classList.add('on'); await wait(fx, 700);
      await along(p(side ? 'c' : 'd'), dot, 1000);
      clear(); n(side ? 4 : 5).classList.add('on'); dot.style.opacity = 0;
      side = 1 - side;
      await wait(fx, 1700);
    });
  },

  // The blueprint email in an inbox, with the result card inside it
  email(fx) {
    const art = mount(fx, `
      <div class="em">
        <div class="em-h">
          <h4>Alex, here's your Delegation Blueprint</h4>
          <div class="em-f"><span><img src="${IMG('logo-white.svg')}" alt=""></span><div><b>Pareto Talent</b><small>to me</small></div><em>9:41 AM</em></div>
        </div>
        <div class="em-b">
          <h5 class="rv" style="--i:0">Here's your <span class="grad">Delegation Blueprint.</span></h5>
          <div class="sp rv" style="--i:2">
            <div class="sp-h"><span class="sp-a"><img src="${IMG('avatar-1.webp')}" alt=""></span><div><b>Your Right Hand</b><span>Built for: Agency owners</span></div></div>
            <div class="sp-r"><p class="lb">First 3 handoffs</p><div class="ch">${QS[1].f.hand}</div></div>
            <div class="sp-r sp-st"><div><b>Up to 15<small> hrs/wk</small></b><span>you could hand off</span></div><div><b>$5,625<small>/wk</small></b><span>worth of your time</span></div></div>
          </div>
          <span class="btn rv" style="--i:4">Book my Matching Call →</span>
        </div>
      </div>`, 'me');
    const body = $('.em-b', art);
    if (reduced) { body.classList.add('show'); return; }
    loop(fx, async () => {
      body.classList.remove('show'); await sleep(1000);
      body.classList.add('show'); await wait(fx, 5600);
    });
  },
};

/* ================= page chrome ================= */
function progress() {
  const secs = $$('[data-sec]'), menu = $('#prog-menu'), prog = $('#prog'), btn = $('#prog-btn');
  menu.innerHTML = secs.map(s => `<a href="#${s.id}">${s.dataset.sec}</a>`).join('');
  btn.addEventListener('click', () => { const o = prog.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  menu.addEventListener('click', () => { prog.classList.remove('open'); btn.setAttribute('aria-expanded', false); });
  document.addEventListener('click', e => { if (!prog.contains(e.target)) { prog.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
  const arc = $('#prog-arc'), pct = $('#prog-pct'), name = $('#prog-name');
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? Math.min(1, scrollY / max) : 0;
    arc.style.strokeDashoffset = 47.1 * (1 - k); pct.textContent = Math.round(k * 100) + '%';
    let cur = secs[0]; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s; });
    name.textContent = cur.dataset.sec;
    $$('a', menu).forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id));
  };
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
}

/* ================= boot ================= */
createHero($('#hero-demo'));
$$('[data-fx]').forEach(fx => FX[fx.dataset.fx] && FX[fx.dataset.fx](fx));
progress();
})();
