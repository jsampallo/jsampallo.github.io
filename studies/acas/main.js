// ACAS case study: the hero, the feature animations and the page chrome.
// The mockups rebuild advancedcleanairsolutions.com in code (real copy, fonts and colors) so they can move like the Qata ones.
(() => {
'use strict';

/* ================= utils ================= */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Page chrome around the mockups (the mockups themselves are the client's real site, always in English)
const T = document.documentElement.lang.startsWith('es')
  ? { before: 'Antes', after: 'Después', dirs: ['Paleta vieja', 'Degradé suave'],
      bands: ['Hero fuerte', 'Lectura', 'Corte', 'Lectura', 'Cierre'], pages: ['Inicio', 'Inspección de moho', 'Limpieza de ductos'],
      review: [['Concepto', 'Armado con Claude'], ['Imagen', 'Generada en Nano Banana Pro'], ['Chequeo', 'Comparada con el equipo real']] }
  : { before: 'Before', after: 'After', dirs: ['Old palette', 'Soft gradient'],
      bands: ['Strong hero', 'Reading', 'Break', 'Reading', 'Close'], pages: ['Home', 'Mold Inspection', 'Air Duct Cleaning'],
      review: [['Concept', 'Worked out with Claude'], ['Image', 'Generated in Nano Banana Pro'], ['Check', 'Compared with the real equipment']] };

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
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.500-2 4.900-4 6.500S5 13 5 15a7 7 0 0 0 7 7z"/>',
  heart: '<path d="M19 14c1.500-1.500 3-3.200 3-5.500A5.500 5.500 0 0 0 16.500 3c-1.800 0-3 .5-4.500 2-1.500-1.500-2.700-2-4.500-2A5.500 5.500 0 0 0 2 8.500c0 2.300 1.500 4 3 5.500l7 7Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  badge: '<path d="M3.900 8.600a4 4 0 0 1 4.700-4.700 4 4 0 0 1 6.800 0 4 4 0 0 1 4.700 4.700 4 4 0 0 1 0 6.800 4 4 0 0 1-4.700 4.700 4 4 0 0 1-6.800 0 4 4 0 0 1-4.700-4.700 4 4 0 0 1 0-6.800Z"/><path d="m9 12 2 2 4-4"/>',
};
const ic = (n, s = 16, w = 2) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ================= the browser mockup ================= */
const W = 1180, H = 720;
const NAV = `<div class="nv-logo"><img src="/studies/acas/images/acas-logo.svg" alt="" width="25" height="24">Advanced Clean Air Solutions</div><span>About</span><span>Services</span><span>Blog</span><span>Contact</span><span class="nv-pill">Get Free Estimate</span><span class="nv-pill fill">${ic('phone', 14)}(805) 334-8498</span>`;

const card = (icon, title, text, link) => `<article class="cd"><span class="cd-i">${ic(icon, 20)}</span><h3>${title}</h3><p>${text}</p><b>${link}</b></article>`;

function build(root) {
  root.innerHTML = `
    <div class="fit"><div class="br">
      <div class="br-bar"><i></i><i></i><i></i><span class="br-url">advancedcleanairsolutions.com</span></div>
      <div class="vp">
        <div class="nv">${NAV}</div>
        <div class="scr">
          <section class="pg p-hero">
            <div class="h-in">
              <h2>Independent Mold Testing<em>in Santa Barbara &amp; Ventura Counties.</em></h2>
              <p>Clear Answers. Healthy Air. Peace of Mind.</p>
              <span class="cta">Call Now for Your Free Mold Testing Estimate</span>
            </div>
          </section>
          <section class="pg p-cards">
            <h2>When the Air Starts Raising Questions</h2>
            <p>Mold growth does not give you much warning. It spreads in the places you cannot check, long before a stain, a smell, or a symptom gives it away.</p>
            <div class="c3">
              ${card('heart', 'The Symptoms That Won\'t Leave', 'You feel better the moment you step outside and worse the moment you come back.', 'See if Mold Testing Makes Sense')}
              ${card('wind', 'The Smell That Arrives With the AC', 'The AC turns on, and the same stale smell reaches your living room, bedroom, or kitchen.', 'See Residential Duct Cleaning')}
              ${card('drop', 'The Leak You Can\'t Stop Thinking About', 'A flood, a slow drip, or a remediation job that wrapped up fast leaves a doubt that lingers.', 'See Moisture Mapping')}
            </div>
          </section>
          <section class="pg p-form">
            <div class="f-l">
              <h2>Tell Us What's Going On</h2><hr>
              <p>You do not have to have the right words for it yet. Maybe it started with a smell, a leak, a room that feels different. Start there.</p>
              <span class="cta">Call Now for Your Mold Concerns</span>
            </div>
            <div class="slot">
              <div class="fc">
                <h3>Request an Estimate</h3>
                <div class="fi" data-f="name" data-ph="Full name*"></div>
                <div class="fi" data-f="phone" data-ph="Phone*"></div>
                <div class="fi" data-f="email" data-ph="Email*"></div>
                <div class="fi" data-f="zip" data-ph="Zip Code*"></div>
                <div class="fi area" data-f="note" data-ph="What are you noticing? Odor, symptoms, leak history, visible growth, real estate deadline"></div>
                <div class="go" data-r="go">Get My Estimate</div>
              </div>
              <div class="oldf" data-r="oldf">
                <div class="o2"><span>Full Name*</span><span>Phone*</span></div>
                <div class="o2"><span>Email</span><i></i></div>
                <span class="w">What services are you interested in?*</span>
                <span class="w">How Did You Hear About Us?*</span>
                <span class="t">Please tell us about your air quality and/or mold concerns.*</span>
                <span class="sb">SUBMIT</span>
              </div>
              <div class="wl" data-r="wl2"></div>
            </div>
          </section>
        </div>
        <div class="old" data-r="old">
          <div class="ob">
            <h2>Independent Mold Testing in Santa Barbara &amp; Ventura Counties</h2>
            <p class="sub">Unbiased mold inspection and indoor air quality testing — so you get clear answers, not a remediation sales pitch.</p>
            <hr>
            <p class="tx">Whether you're experiencing unexplained health symptoms, navigating a real estate transaction, or addressing water damage, we deliver fast, independent lab results — so you can make informed decisions with confidence.</p>
            <span class="b1">Call Now for a Mold Testing Estimate</span>
            <span class="b1 b2"><em>or</em> Take the Free Mold Risk Assessment Quiz</span>
            <small>find out if your home is showing early warning signs in less than 2 minutes.</small>
            <div class="ck"><span><i>${ic('check', 12, 3)}</i>Certified Mold Inspectors</span><span><i>${ic('check', 12, 3)}</i>500+ Properties Tested</span><span><i>${ic('check', 12, 3)}</i>Woman-Owned Business</span></div>
          </div>
        </div>
        <div class="wl" data-r="wl"></div>
        <span class="tag" data-r="tag"></span>
      </div>
      <div class="cursor" data-r="cur"></div>
    </div></div>`;
}

function createHero(root) {
  build(root);
  const R = k => $(`[data-r="${k}"]`, root);
  const fitEl = $('.fit', root), br = $('.br', root), vp = $('.vp', root), scr = $('.scr', root), nv = $('.nv', root), cards = $('.p-cards', root);
  const cur = R('cur'), fields = $$('.fi', root);
  const pause = ms => wait(root, ms);
  let s = 1;

  const size = () => {
    s = Math.min(1, root.clientWidth / W);
    br.style.setProperty('--s', s);
    fitEl.style.width = `${W * s}px`; fitEl.style.height = `${H * s}px`;
  };
  new ResizeObserver(size).observe(root); size();

  const tag = t => { R('tag').textContent = t; };
  const page = n => { scr.style.transform = `translateY(${-680 * n}px)`; nv.classList.toggle('light', n > 0); };
  const moveTo = el => {
    const r = el.getBoundingClientRect(), R0 = br.getBoundingClientRect();
    cur.style.translate = `${(r.left - R0.left + r.width / 2) / s}px ${(r.top - R0.top + r.height / 2) / s}px`;
    cur.classList.add('show');
  };
  const tap = () => { cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap'); };
  const wipe = async (layer, line) => {
    line.classList.remove('run', 'out'); void line.offsetWidth;
    line.classList.add('run'); layer.classList.add('gone');
    await sleep(1550);
    line.classList.add('out');
  };
  const type = async (el, text) => {
    el.classList.add('on', 'val'); el.textContent = '';
    for (let i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await sleep(26); }
    el.classList.remove('on');
  };
  const fill = async (key, text) => { const el = $(`[data-f="${key}"]`, root); moveTo(el); await pause(760); tap(); await sleep(180); await type(el, text); await pause(160); };

  function reset() {
    root.classList.add('snap');
    R('old').classList.remove('gone'); R('oldf').classList.remove('gone');
    [R('wl'), R('wl2')].forEach(l => l.classList.remove('run', 'out'));
    cards.classList.remove('on'); page(0); tag(T.before);
    fields.forEach(f => { f.textContent = f.dataset.ph; f.classList.remove('on', 'val'); });
    R('go').classList.remove('done'); R('go').textContent = 'Get My Estimate';
    cur.classList.remove('show', 'tap');
    void root.offsetWidth;
    root.classList.remove('snap');
  }

  async function pilot() {
    for (;;) {
      await visible(root);
      reset(); vp.classList.remove('fade');
      await pause(1900);
      // 1. the old hero becomes the new one
      await wipe(R('old'), R('wl'));
      tag(T.after);
      moveTo($('.p-hero .cta', root)); await pause(1900);
      // 2. down to the moments
      cards.classList.add('on'); page(1); await pause(700);
      moveTo($('.cd:nth-child(2) b', root)); await pause(2200);
      // 3. the old form becomes the new one, and the new one gets sent
      page(2); cur.classList.remove('show'); await pause(1500);
      tag(T.before); await pause(1300);
      await wipe(R('oldf'), R('wl2'));
      tag(T.after);
      await fill('name', 'Sarah Mitchell');
      await fill('phone', '(805) 555-0142');
      await fill('email', 'sarah@email.com');
      await fill('zip', '93101');
      moveTo(R('go')); await pause(800); tap(); await sleep(220);
      R('go').classList.add('done'); R('go').innerHTML = `${ic('check', 18)} Estimate Requested`;
      await pause(2600);
      cur.classList.remove('show');
      vp.classList.add('fade'); await sleep(500);
    }
  }

  // Before / after needs motion to make sense: with reduced motion, just show the new hero
  if (reduced) { reset(); R('old').classList.add('gone'); tag(T.after); return; }
  reset(); pilot();
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

const FX = {
  // The brand overhaul in one moment: the phone version of the hero
  morph(fx) {
    const art = mount(fx, `
      <div class="mm-f">
        <div class="mm-new">
          <div class="mm-top"><img src="/studies/acas/images/acas-logo.svg" alt="" width="42" height="40"><span class="nv-pill fill">${ic('phone', 14)}(805) 334-8498</span></div>
          <h2>Independent Mold Testing<em>in Santa Barbara &amp; Ventura Counties.</em></h2>
          <p>Clear Answers. Healthy Air.<br>Peace of Mind.</p>
          <span class="mm-cta">Call Now for Your Free Estimate</span>
        </div>
        <div class="mm-old">
          <div class="mm-ob">
            <h2>Independent Mold Testing in Santa Barbara &amp; Ventura Counties</h2>
            <hr>
            <p>Unbiased mold inspection and indoor air quality testing — so you get clear answers, not a remediation sales pitch.</p>
            <span class="mm-b">Call Now for a Mold Testing Estimate</span>
            <span class="mm-b nv2">Take the Free Mold Risk Assessment Quiz</span>
          </div>
        </div>
        <div class="wl"></div>
      </div>
      <div class="mm-s">
        <div class="mm-id was"><b>Aa</b><i></i><i></i></div>
        <div class="mm-id now"><b>Aa</b><i></i><i></i></div>
        <span class="tag">${T.before}</span>
      </div>`, 'mm', 0);
    const box = $('.mm-f', art), old = $('.mm-old', art), line = $('.wl', art), strip = $('.mm-s', art), tag = $('.tag', art), cta = $('.mm-cta', art);
    const after = () => { strip.classList.add('after'); tag.textContent = T.after; };
    const reset = () => {
      art.classList.add('snap');
      old.classList.remove('gone'); line.classList.remove('run', 'out'); strip.classList.remove('after'); cta.classList.remove('press'); tag.textContent = T.before;
      void art.offsetWidth;
      art.classList.remove('snap'); box.classList.remove('fade');
    };
    if (reduced) { old.classList.add('gone'); after(); return; }
    loop(fx, async () => {
      reset(); await wait(fx, 2300);
      line.classList.add('run'); old.classList.add('gone'); await sleep(800);
      after(); await sleep(750); line.classList.add('out');
      await wait(fx, 1500);
      tap(fx, cta); cta.classList.add('press'); await sleep(240); cta.classList.remove('press');
      await wait(fx, 2500);
      box.classList.add('fade'); await sleep(450);
    });
  },

  // The old palette and the redesign, on the same card
  palette(fx) {
    const LONG = "We only test. We never do remediation. Unlike companies that both test and fix mold problems, we don't have an incentive to exaggerate issues.";
    const SHORT = 'We only test. We never do remediation. Your results are unbiased by default.';
    const art = mount(fx, `
      <div class="pl" data-dir="0">
        <i class="pl-b b0"></i><i class="pl-b b1"></i>
        <div class="pl-card"><span class="pl-ic">${ic('badge', 24, 1.8)}</span><h4>Independent Testing</h4><p data-t>${LONG}</p></div>
      </div>
      <div class="pl-tabs">${T.dirs.map((d, i) => `<span class="${i ? '' : 'on'}">${d}</span>`).join('')}</div>`);
    const pl = $('.pl', art), card = $('.pl-card', art), text = $('[data-t]', art), tabs = $$('.pl-tabs span', art);
    const set = i => { pl.dataset.dir = i; text.textContent = i ? SHORT : LONG; tabs.forEach((t, k) => t.classList.toggle('on', k === i)); };
    const show = async i => { card.classList.add('swap'); await sleep(240); set(i); card.classList.remove('swap'); };
    if (reduced) { set(1); return; }
    loop(fx, async () => {
      await show(0); await wait(fx, 3000);
      tap(fx, tabs[1]); await sleep(240); await show(1); await wait(fx, 4400);
    });
  },

  // The dense navy panel becomes the airy section
  sections(fx) {
    const art = mount(fx, `
      <div class="sc">
        <div class="sc-old">
          <b class="sc-k">ADVANCED CLEAN AIR SOLUTIONS</b>
          <h4>Accurate, Science-Based Results</h4>
          <hr>
          <p>DIY hardware store kits can't accurately identify mold species — or determine whether there's actually a problem. Mold spores are naturally present everywhere, including outdoors and in normal indoor environments. Just because something grows in a petri dish doesn't mean your home has a harmful mold issue.</p>
          <p>We use professional sampling methods and ISO/IEC 17025:2017 accredited third-party laboratory analysis, led by Certified Industrial Hygienists and nationally recognized mycology experts, to identify mold types, measure spore concentrations, and compare indoor levels to outdoor baselines — so you receive accurate, defensible data, not misleading results.</p>
        </div>
        <div class="sc-new">
          <h4>We Only Test, and That Keeps Us Honest</h4>
          <hr>
          <p>When you are worried about the air inside your home, the last thing you need is someone turning your concern into a bigger project.</p>
          <p>Our work is built around clear evidence, independent analysis, and honest interpretation.</p>
          <p>You get clear findings, honest guidance, and room to decide your next step without pressure.</p>
          <span class="sc-cta">Request Your Free Estimate</span>
        </div>
        <span class="tag">${T.before}</span>
      </div>`);
    const sc = $('.sc', art), tag = $('.tag', art), cta = $('.sc-cta', art);
    const reset = () => { sc.classList.add('snap'); sc.classList.remove('after', 'gone'); tag.textContent = T.before; void sc.offsetWidth; sc.classList.remove('snap'); };
    if (reduced) { sc.classList.add('after'); tag.textContent = T.after; return; }
    loop(fx, async () => {
      reset(); await wait(fx, 2800);
      sc.classList.add('after'); await sleep(700); tag.textContent = T.after;
      await wait(fx, 2300); tap(fx, cta); await wait(fx, 2700);
      sc.classList.add('gone'); await sleep(450);
    });
  },

  // The homepage as bands: dark, light, gradient, light, dark
  rhythm(fx) {
    const skel = {
      hero: '<i class="w6"></i><i class="w4"></i><i class="btn"></i>',
      white: '<span class="pic"></span><div><i class="w9"></i><i class="w9"></i><i class="w6"></i></div>',
      grad: '<u></u><u></u><u></u>',
      steps: '<s></s><s></s><s></s><s></s>',
      dark: '<i class="w6"></i><i class="w8"></i>',
    };
    const rows = [['hero', 'dk'], ['white', ''], ['grad', 'gr'], ['steps', ''], ['dark', 'dk end']];
    mount(fx, `<div class="ry">${rows.map(([k, c], i) => `<div class="ry-b ${c} k-${k}">${skel[k]}</div><p class="ry-t">${T.bands[i]}</p>`).join('')}</div>`, 'sm');
  },

  // The new type pairing, with the site's real headline
  type(fx) {
    mount(fx, `
      <div class="ty">
        <div class="ty-a">
          <div><b>Aa</b><span>Roboto</span></div>
          <div class="sf"><b>Aa</b><span>Instrument Serif</span></div>
        </div>
        <h4>Independent Mold Testing<em>in Santa Barbara &amp; Ventura Counties.</em></h4>
        <p>Clear Answers. Healthy Air. Peace of Mind.</p>
      </div>`, 'sm');
  },

  // How the hero images were made
  review(fx) {
    mount(fx, `
      <div class="rv">
        <img src="/studies/acas/images/ai-technician.jpg" alt="" width="1200" height="705" loading="lazy" decoding="async">
        <ul>${T.review.map(([k, v]) => `<li><span class="rv-c">${ic('check', 13, 3)}</span><b>${k}</b><em>${v}</em></li>`).join('')}</ul>
      </div>`, 'sm');
  },

  // The homepage system on three real pages (real page titles; same section pattern, checked on the live site)
  pages(fx) {
    const P = [['Independent Mold Testing', 3, '#2b2926'], ['House Mold Inspection', 2, '#30343a'], ['Residential Air Duct Cleaning', 3, '#2f3a3d']];
    mount(fx, `<div class="tp">${P.map(([t, n, c], i) => `
      <figure>
        <div class="tp-p">
          <div class="tp-h" style="background:${c}"><span></span><b>${t}</b><i></i></div>
          <div class="tp-w"><u></u><u></u><u></u></div>
          <div class="tp-g">${'<s></s>'.repeat(n)}</div>
          <div class="tp-d"><u></u><u></u></div>
          <div class="tp-w"><u></u><u></u></div>
        </div>
        <figcaption>${T.pages[i]}</figcaption>
      </figure>`).join('')}</div>`, 'sm');
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
