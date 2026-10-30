// Kourosh Dini case study: the two UI animations and the page chrome.
// The mockups rebuild the live site in code (its copy, fonts, colors and paper), the way the Qata mockups rebuild the app.
(() => {
'use strict';

/* ================= utils ================= */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loops only run while their element is on screen and the tab is visible
const watchers = new Map();
const wake = w => { if (w.vis && !document.hidden) { w.waiting.forEach(f => f()); w.waiting = []; } };
const io = new IntersectionObserver(es => es.forEach(e => { const w = watchers.get(e.target); if (w) { w.vis = e.isIntersecting; wake(w); } }), { threshold: .2 });
const watch = el => { if (!watchers.has(el)) { watchers.set(el, { vis: false, waiting: [] }); io.observe(el); } return watchers.get(el); };
const visible = el => { const w = watch(el); return w.vis && !document.hidden ? Promise.resolve() : new Promise(r => w.waiting.push(r)); };
document.addEventListener('visibilitychange', () => watchers.forEach(wake));
const wait = async (el, ms) => { await sleep(ms); await visible(el); };
const loop = (el, fn) => { watch(el); (async () => { for (;;) { await visible(el); try { await fn(); } catch (err) { console.error(err); await sleep(2000); } } })(); };

function tap(fx, el) {
  let d = fx.querySelector(':scope > .tapdot');
  if (!d) { d = document.createElement('i'); d.className = 'tapdot'; fx.appendChild(d); }
  const r = el.getBoundingClientRect(), f = fx.getBoundingClientRect();
  d.style.left = (r.left - f.left + r.width / 2) + 'px'; d.style.top = (r.top - f.top + r.height / 2) + 'px';
  d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
}
const press = async (fx, el) => { tap(fx, el); el.classList.add('press'); await sleep(200); el.classList.remove('press'); };
const type = async (el, text) => { el.classList.add('on', 'val'); el.textContent = ''; for (let i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await sleep(45); } el.classList.remove('on'); };

const ICON = {
  signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/>',
  wifi: '<path d="M12 20h.01M2 8.800a15 15 0 0 1 20 0M5 12.900a10 10 0 0 1 14 0M8.500 16.400a5 5 0 0 1 7 0"/>',
  batt: '<rect width="16" height="10" x="2" y="7" rx="2"/><path d="M22 11v2"/><rect width="9" height="4" x="5" y="10" fill="currentColor"/>',
  at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};
const ic = (n, s = 16, w = 2) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const IMG = n => `/studies/kd/images/${n}`;

/* ================= the animations ================= */
const FX = {
  // The first step on a phone: the button, the sign-up, sent
  phone(fx) {
    fx.innerHTML = `
      <div class="kp app-k"><div class="kp-in">
        <div class="sb"><span>9:41</span><span>${ic('signal', 15, 2.5)}${ic('wifi', 15, 2.5)}${ic('batt', 20)}</span></div>
        <div class="kp-bar"><span class="kp-b"><i></i><i></i><i></i></span><img src="${IMG('ui-logo.jpg')}" alt="" width="40" height="40"><span class="kp-at">${ic('at', 18)}</span></div>
        <div class="kp-scr">
          <div class="kp-pg">
            <section class="kp-hero">
              <span class="kp-sun"></span>
              <h4>Kourosh Dini, MD<br>Mind, Music, &amp; Mastery</h4>
              <p class="kp-tag">From overwhelmed to engaged.<br>Begin taking charge with a simple “visit.”</p>
              <span class="kp-btn" data-r="cta">Take Your First Step</span>
              <img class="kp-lf l" src="${IMG('ui-leaves-l.png')}" alt=""><img class="kp-lf r" src="${IMG('ui-leaves-r.png')}" alt="">
            </section>
            <section class="kp-form">
              <h4>Break Free From Force-Based Work</h4>
              <p>Sign up to the Weekly Wind Down and receive a free PDF: <b>“Your First Step to Breaking Free from Force-Based Work”</b></p>
              <span class="kp-in-f" data-r="name" data-ph="First Name"></span>
              <span class="kp-in-f" data-r="mail" data-ph="Email Address"></span>
              <span class="kp-btn wide" data-r="go">Begin</span>
              <p class="kp-ok" data-r="ok">${ic('check', 16, 2.5)}Success! Now check your email.</p>
            </section>
          </div>
        </div>
      </div></div>`;
    const R = k => $(`[data-r="${k}"]`, fx), box = $('.kp', fx), pg = $('.kp-pg', fx);
    const fit = () => fx.style.setProperty('--s', Math.min(1, (fx.clientHeight - 32) / 556).toFixed(3));
    new ResizeObserver(fit).observe(fx); fit();
    const reset = () => {
      fx.classList.add('snap');
      pg.style.transform = ''; box.classList.remove('fade'); R('ok').classList.remove('show');
      R('go').textContent = 'Begin';
      ['name', 'mail'].forEach(k => { R(k).textContent = R(k).dataset.ph; R(k).classList.remove('val', 'on'); });
      void fx.offsetWidth; fx.classList.remove('snap');
    };
    reset();
    if (reduced) return;
    loop(fx, async () => {
      reset(); await wait(fx, 1900);
      await press(fx, R('cta')); await sleep(240);
      pg.style.transform = 'translateY(-418px)'; await wait(fx, 1500);
      tap(fx, R('name')); await sleep(240); await type(R('name'), 'Sarah'); await wait(fx, 280);
      tap(fx, R('mail')); await sleep(240); await type(R('mail'), 'sarah@email.com'); await wait(fx, 420);
      await press(fx, R('go')); R('go').textContent = 'Sent';
      R('ok').classList.add('show'); await wait(fx, 3200);
      box.classList.add('fade'); await sleep(450);
    });
  },

  // From the podcast to the community, on one site
  path(fx) {
    fx.innerHTML = `
      <div class="art kt"><div class="kt-pg">
        <section class="kt-a">
          <h4>The Rhythms of Focus Podcast</h4>
          <div class="pl">
            <img class="pl-c" src="${IMG('ui-podcast-cover.jpg')}" alt="">
            <div class="pl-t"><b>79. Intentional AI with Guest David Sparks</b><span>Episode 79 • 29th October 2026</span></div>
            <button class="pl-p" type="button" tabindex="-1" aria-hidden="true"><i></i></button>
            <div class="pl-r"><span data-r="t">00:00:00</span><u><s data-r="bar"></s></u></div>
          </div>
        </section>
        <section class="kt-b">
          <h4>A Wandering Mind Can Be a Powerful Mind</h4>
          <div class="kt-g">
            <img src="${IMG('ui-waves-box.jpg')}" alt="">
            <div>
              <p class="kt-o">An interactive community of peers</p>
              <p class="kt-o">Live Q&amp;A group sessions with Kourosh</p>
              <span class="kp-btn" data-r="go">Get the full overview</span>
            </div>
          </div>
        </section>
      </div></div>`;
    const art = fx.firstElementChild, R = k => $(`[data-r="${k}"]`, fx), pg = $('.kt-pg', fx), play = $('.pl-p', fx), b = $('.kt-b', fx);
    const fit = () => fx.style.setProperty('--s', Math.min(1.1, (fx.clientWidth - 28) / art.offsetWidth, (fx.clientHeight - 28) / art.offsetHeight).toFixed(3));
    new ResizeObserver(fit).observe(fx); fit();
    const reset = () => {
      fx.classList.add('snap');
      pg.style.transform = ''; b.classList.remove('on'); art.classList.remove('fade'); play.classList.remove('on');
      R('t').textContent = '00:00:00'; R('bar').style.width = '0';
      void fx.offsetWidth; fx.classList.remove('snap');
    };
    reset();
    if (reduced) { pg.style.transform = 'translateY(-166px)'; b.classList.add('on'); return; }
    loop(fx, async () => {
      reset(); await wait(fx, 1700);
      tap(fx, play); await sleep(200); play.classList.add('on');
      for (let i = 1; i <= 5; i++) { R('t').textContent = `00:00:0${i}`; R('bar').style.width = `${i * 2.4}%`; await wait(fx, 520); }
      pg.style.transform = 'translateY(-166px)'; b.classList.add('on'); await wait(fx, 1900);
      await press(fx, R('go')); await wait(fx, 2500);
      art.classList.add('fade'); await sleep(450);
    });
  },
};

// The video loops only for people who are fine with motion
if (reduced) $$('video').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
$$('[data-fx]').forEach(fx => FX[fx.dataset.fx] && FX[fx.dataset.fx](fx));

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
progress();
})();
