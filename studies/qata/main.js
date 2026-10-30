// Qata case study: the order demo, the feature mockups and the page chrome.
// Mockups reuse the app's real copy, sizes and colours (StoreFront.jsx, AdminDashboard.jsx).
(() => {
'use strict';

/* ================= utils ================= */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const fmt = n => money.format(n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const randCode = () => Math.random().toString(16).slice(2, 6).toUpperCase().padEnd(4, '0');
const img = n => `/studies/qata/images/${n}.webp`;
const LOGO = '/studies/qata/images/qata-logo.svg';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Page chrome around the mockups (the mockups themselves are always in Spanish, like the app)
const T = document.documentElement.lang.startsWith('es')
  ? { customer: 'Cliente', owner: 'Dueño', pane1: 'El cliente pide', pane2: 'Llega escrito', pane3: 'El dueño confirma', ready: 'Escrito para vos. Un toque y se envía.', wait: 'El pedido va a aparecer acá, ya escrito.', bell: '▶ Escuchar la campanita', soundOn: 'Sonido activado', soundOff: 'Sonido desactivado' }
  : { customer: 'Customer', owner: 'Owner', pane1: 'The customer orders', pane2: 'It arrives written', pane3: 'The owner confirms', ready: 'Written for you. One tap sends it.', wait: 'The order will show up here, already written.', bell: '▶ Play the bell', soundOn: 'Sound on', soundOff: 'Sound off' };
const lum = hex => { const c = hex.replace('#', '').match(/../g).map(h => parseInt(h, 16) / 255).map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const ratio = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
const onBrand = hex => ratio(hex, '#000000') >= ratio(hex, '#ffffff') ? '#000000' : '#ffffff';

// Loops only run while their element is on screen and the tab is visible
const watchers = new Map();
const wake = w => { if (w.vis && !document.hidden) { w.waiting.forEach(f => f()); w.waiting = []; } };
const io = new IntersectionObserver(es => es.forEach(e => { const w = watchers.get(e.target); if (w) { w.vis = e.isIntersecting; wake(w); } }), { threshold: .2 });
const watch = el => { if (!watchers.has(el)) { watchers.set(el, { vis: false, waiting: [] }); io.observe(el); } return watchers.get(el); };
const visible = el => { const w = watch(el); return w.vis && !document.hidden ? Promise.resolve() : new Promise(r => w.waiting.push(r)); };
document.addEventListener('visibilitychange', () => watchers.forEach(wake));
const wait = async (el, ms) => { await sleep(ms); await visible(el); };
const loop = (el, fn) => { watch(el); (async () => { for (;;) { await visible(el); try { await fn(); } catch (err) { console.error(err); await sleep(2000); } } })(); };

/* ================= icons (lucide shapes, as in the app) ================= */
const P = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  listPlus: '<path d="M11 12H3M16 6H3M16 18H3M18 9v6M21 12h-6"/>',
  list: '<path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  msg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  cash: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  bank: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkC: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  bell: '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M4 2C2.8 3.7 2 5.7 2 8M22 8c0-2.3-.8-4.3-2-6"/>',
  menu: '<path d="M4 12h16M4 6h16M4 18h16"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  imgPlus: '<path d="M16 5h6M19 2v6"/><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/><circle cx="9" cy="9" r="2"/>',
  images: '<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.3-1.3a2.4 2.4 0 0 0-3.4 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',
  pencil: '<path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8l-1.3 4.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5z"/>',
  trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  vol: '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6M19.4 18.4a9 9 0 0 0 0-12.7"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  send: '<path d="M14.5 21.7a.5.5 0 0 0 .9 0L22 2.6a.5.5 0 0 0-.6-.6L2.3 8.6a.5.5 0 0 0 0 .9l8 3.2a2 2 0 0 1 1.1 1.1z"/><path d="m21.9 2.1-11 10.9"/>',
  signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8"/>',
  wifi: '<path d="M12 20h.01M2 8.8a15 15 0 0 1 20 0M5 12.9a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0"/>',
  battery: '<rect width="16" height="10" x="2" y="7" rx="2"/><path d="M22 11v2M6 11v2M10 11v2M14 11v2"/>',
};
const ic = (n, s = 16, w = 2) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const SB = `<div class="sb"><span>9:41</span><span>${ic('signal', 16, 2.5)}${ic('wifi', 16, 2.5)}${ic('battery', 20, 2)}</span></div>`;

/* ================= the bell (same settings as the app's sound.js) ================= */
let actx = null;
function playBell() {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
  const ctx = actx, start = ctx.currentTime + .01, SILENT = .0001, ATTACK = .006;
  const partials = [{ r: 1, g: .5, d: 1.6 }, { r: 1.0055, g: .3, d: 1.5 }, { r: 2.74, g: .08, d: .6 }, { r: 5.43, g: .02, d: .2 }];
  const taps = [{ at: 0, l: 1 }, { at: .14, l: .55 }];
  const master = ctx.createGain(); master.gain.value = .5;
  const soften = ctx.createBiquadFilter(); soften.type = 'lowpass'; soften.frequency.value = 4000; soften.Q.value = .5;
  soften.connect(master).connect(ctx.destination);
  const faded = (peak, decay, t) => peak * Math.pow(SILENT / peak, Math.min(1, t / (decay - ATTACK)));
  partials.forEach(({ r, g, d }) => {
    const o = ctx.createOscillator(), env = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 1318.5 * r; env.gain.setValueAtTime(SILENT, start);
    let peak = 0, peakAt = start;
    taps.forEach(({ at, l }) => {
      const t = start + at, rem = peak ? faded(peak, d, t - peakAt) : SILENT;
      if (peak) env.gain.exponentialRampToValueAtTime(rem, t);
      peak = rem + g * l; peakAt = t + ATTACK;
      env.gain.exponentialRampToValueAtTime(peak, peakAt);
    });
    env.gain.exponentialRampToValueAtTime(SILENT, peakAt + d);
    o.connect(env).connect(soften); o.start(start); o.stop(peakAt + d + .05);
  });
  taps.forEach(({ at, l }) => {
    const len = Math.floor(ctx.sampleRate * .015), buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
    let seed = 7; for (let i = 0; i < len; i++) { seed = (seed * 16807) % 2147483647; data[i] = ((seed / 2147483647) * 2 - 1) * Math.pow(1 - i / len, 3); }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 1;
    const sg = ctx.createGain(); sg.gain.value = .08 * l;
    src.connect(bp).connect(sg).connect(soften); src.start(start + at);
  });
}

/* ================= sample store ================= */
const STORE = 'La Esquina';
const PRODUCTS = [
  { id: 'burger', name: 'Hamburguesa', desc: 'Medallón de carne, cheddar, lechuga y tomate.', cat: 'Hamburguesas', img: 'hamburguesa-clasica', options: [{ n: 'Simple', p: 9500 }, { n: 'Doble', p: 12500 }, { n: 'Triple', p: 15000, out: true }] },
  { id: 'cheddar', name: 'Doble cheddar', desc: 'Dos medallones, cheddar y panceta.', cat: 'Hamburguesas', img: 'hamburguesa-doble', price: 13000, off: 10 },
  { id: 'fries', name: 'Papas fritas', desc: 'Porción grande, para compartir.', cat: 'Papas y más', img: 'papas-fritas', price: 5500 },
  { id: 'empanada', name: 'Empanada de carne', desc: 'Cortada a cuchillo, al horno.', cat: 'Papas y más', img: 'empanada', price: 1800 },
  { id: 'muzza', name: 'Muzzarella', desc: 'Salsa de tomate, muzzarella y orégano.', cat: 'Pizzas', img: 'pizza-muzzarella', price: 11000 },
  { id: 'napo', name: 'Napolitana', desc: 'Muzzarella, tomate en rodajas, ajo y jamón.', cat: 'Pizzas', img: 'pizza-napolitana', price: 12500 },
  { id: 'cuatro', name: 'Cuatro quesos', desc: 'Muzzarella, roquefort, parmesano y provolone.', cat: 'Pizzas', img: 'pizza-cuatro-quesos', price: 13500 },
  { id: 'especial', name: 'Especial', desc: 'Jamón, morrones y huevo duro.', cat: 'Pizzas', img: 'pizza-especial', price: 14000, out: true },
  { id: 'flan', name: 'Flan casero', desc: 'Con dulce de leche.', cat: 'Postres', img: 'flan', price: 4000 },
];
const CATS = ['Hamburguesas', 'Papas y más', 'Pizzas', 'Postres'];
const TIMES = ['21:00', '21:30', '22:00'];
const byId = id => PRODUCTS.find(p => p.id === id);
const finalPrice = (base, off) => off ? Math.round(base * (1 - off / 100)) : base;
const unitOf = (p, o) => finalPrice(o != null ? p.options[o].p : p.price, p.off);

// Product card, as renderProductCard() in StoreFront.jsx
function card(p, { qty = 0, mode = 'store', open = true, desc = true } = {}) {
  const prices = p.options ? p.options.map(o => o.p) : [p.price];
  const base = Math.min(...prices), from = new Set(prices).size > 1;
  const soldOut = p.out || (p.options && p.options.every(o => o.out));
  let btn;
  if (soldOut) btn = '<span class="nostock">Sin stock</span>';
  else if (mode === 'menu') btn = p.options ? `<span class="add ghost">${ic('list')}</span>` : '';
  else btn = `<button class="add${open ? '' : ' dis'}" ${open ? `data-act="add" data-id="${p.id}"` : 'disabled'} aria-label="${p.options ? 'Elegir variedad de' : 'Agregar'} ${p.name}">${p.options ? ic('listPlus') : ic('plus', 20)}</button>`;
  return `<article class="pc${soldOut ? ' out' : ''}" data-pid="${p.id}">
    ${qty ? `<button class="qty" data-act="dec" data-id="${p.id}" title="Quitar uno">${qty}</button>` : ''}
    ${p.off ? `<span class="disc">-${p.off}%</span>` : ''}
    <div class="pc-img"><img src="${img(p.img)}" alt="${p.name}" loading="lazy" decoding="async"></div>
    <div class="pc-b">
      <h3 class="pc-n">${p.name}</h3>${desc ? `<p class="pc-d">${p.desc}</p>` : ''}
      <div class="pc-f"><div class="pc-p">${from ? '<small>desde</small>' : ''}${p.off ? `<b class="off">${fmt(finalPrice(base, p.off))}</b><s>${fmt(base)}</s>` : `<b>${fmt(base)}</b>`}</div>${btn}</div>
    </div></article>`;
}
// "Hecho con Qata" footer at the end of every store (MadeWithQata in StoreFront.jsx)
const MADE = `<p class="made">Hecho con <a href="https://qata.ar" target="_blank" rel="noopener">Qata</a></p>`;
const storeHead = ({ pill = true, closed = false, cats = 'Todo', search = '' } = {}) => `
  <div class="st-head">
    <div class="st-row"><div class="st-id"><span class="st-name">${STORE}</span>${pill ? `<span class="st-pill${closed ? ' closed' : ''}"><i></i><span>${closed ? 'Cerrado' : 'Tomando pedidos'}</span></span>` : ''}</div>
      <span class="st-search">${ic('search', 20)}</span>${search}</div>
    ${cats ? `<div class="st-cats">${['Todo', ...CATS].map(c => `<span class="cat${c === cats ? ' on' : ''}">${c}</span>`).join('')}</div>` : ''}
  </div>`;

// The WhatsApp message, from the app's default template (lib/orderMessage.js)
function buildMsg(o, { hl = true } = {}) {
  const code = hl ? `<span class="code-hl">#${o.code}</span>` : `#${o.code}`;
  const L = [
    '¡Hola! 👋 Quiero hacer un pedido:', '',
    `🧾 Pedido ${code}`,
    `📦 ${o.mode === 'delivery' ? 'DELIVERY' : 'RETIRO EN LOCAL'}`,
    `🕒 Horario: ${o.time}`,
    o.name.trim() ? `👤 Nombre: ${esc(o.name.trim())}` : null,
    o.phone.trim() ? `📱 Teléfono: ${esc(o.phone.trim())}` : null,
    o.mode === 'delivery' && o.addr.trim() ? `📍 Dirección: ${esc(o.addr.trim())}` : null,
    '', '📝 Pedido:',
    ...o.items.map(l => `▪️ ${l.qty}x ${esc(l.label)} (${fmt(l.qty * l.unit)})`),
    '', `TOTAL: ${fmt(o.total)}`,
    `💳 Pago: ${o.pay === 'Efectivo' ? 'EFECTIVO' : 'TRANSFERENCIA'}`,
  ].filter(x => x !== null);
  return L.map(x => x === '' ? '<div class="gap"></div>' : `<div>${x}</div>`).join('');
}

/* ================= the three-pane demo ================= */
function createDemo(root, { auto = false } = {}) {
  const s = { orders: [] };
  let soundOn = !auto;
  root.dataset.stage = 'store';
  root.innerHTML = `
    <div class="demo-tabs">
      <button type="button" data-act="stage" data-st="store">${T.customer}</button>
      <button type="button" data-act="stage" data-st="wa">WhatsApp</button>
      <button type="button" data-act="stage" data-st="panel">${T.owner}</button>
    </div>
    <div class="panes">
      <div class="pane p-store"><p class="pane-lab"><i>1</i>${T.pane1}</p>
        <div class="ph"><div class="ph-in app st">${SB}
          <div class="st-screen">
            <div class="st-head"><div class="st-row"><div class="st-id"><span class="st-name">${STORE}</span><span class="st-pill"><i></i><span>Tomando pedidos</span></span></div><span class="st-search">${ic('search', 20)}</span></div>
              <div class="st-cats" data-r="cats"></div></div>
            <div class="st-main" data-r="main"></div>
            <button class="cbar" type="button" data-act="cart" data-r="bar"></button>
            <div class="sh" data-r="vsheet"><button class="sh-bg" type="button" data-act="close" aria-label="Cerrar"></button><div class="sh-p" data-r="vpanel"></div></div>
            <div class="sh sh-cart" data-r="csheet"><button class="sh-bg" type="button" data-act="close" aria-label="Cerrar"></button><div class="sh-p" data-r="cpanel"></div></div>
          </div></div></div>
      </div>
      <div class="pane p-wa"><p class="pane-lab"><i>2</i>${T.pane2}</p>
        <div class="ph"><div class="ph-in app">${SB}
          <div class="wa-screen">
            <div class="wa-top">${ic('back', 22)}<span class="wa-av">LE</span><div><b>${STORE}</b><small>en línea</small></div></div>
            <div class="wa-chat" data-r="chat"></div>
            <div class="wa-comp"><div class="wa-draft" data-r="draft">Mensaje</div><button class="wa-send" type="button" data-act="wa-send" data-r="send" aria-label="Enviar">${ic('send', 18)}</button></div>
          </div></div></div>
      </div>
      <div class="pane p-panel"><p class="pane-lab"><i>3</i>${T.pane3}</p>
        <div class="ph"><div class="ph-in app">${SB}
          <div class="ow-screen">
            <div class="ow-bar"><span class="logo"><img src="${LOGO}" alt="">Qata</span><div class="ow-bar-r"><span data-r="pill"></span><span class="ibtn">${ic('menu', 20)}</span></div></div>
            <div class="ow-body" data-r="ow"></div>
            <div class="toast" data-r="toast"></div>
          </div></div></div>
      </div>
    </div>`;
  const R = k => root.querySelector(`[data-r="${k}"]`);

  function reset(keepOrders) {
    Object.assign(s, { cart: [], cat: 'Todo', sheet: null, vFor: null, mode: 'retiro', time: TIMES[0], pay: 'Efectivo', name: 'Lucía', phone: '11 4343 1322', addr: 'Av. San Martín 123', draft: null, sent: [], pending: [] });
    if (!keepOrders) s.orders = [];
    setStage('store'); render(); R('main').scrollTop = 0; R('ow').scrollTop = 0;
  }
  const setStage = st => { s.stage = st; root.dataset.stage = st; };
  const nItems = () => s.cart.reduce((a, l) => a + l.qty, 0);
  const total = () => s.cart.reduce((a, l) => a + l.qty * l.unit, 0);

  function renderStore() {
    R('cats').innerHTML = ['Todo', ...CATS].map(c => `<button type="button" class="cat${s.cat === c ? ' on' : ''}" data-act="cat" data-c="${c}">${c}</button>`).join('');
    const cats = s.cat === 'Todo' ? CATS : [s.cat];
    const list = cats.flatMap(c => PRODUCTS.filter(p => p.cat === c));
    R('main').innerHTML = `<div class="grid2">${list.map(p => card(p, { qty: s.cart.filter(l => l.id === p.id).reduce((a, l) => a + l.qty, 0) })).join('')}</div>${MADE}`;
    const n = nItems();
    R('bar').classList.toggle('show', n > 0);
    R('bar').innerHTML = `<span><span class="n">${n}</span>Ver pedido</span><b>${fmt(total())}</b>`;
  }

  function renderSheets() {
    R('vsheet').classList.toggle('open', s.sheet === 'var');
    R('csheet').classList.toggle('open', s.sheet === 'cart');
    if (s.sheet === 'var') {
      const p = byId(s.vFor);
      R('vpanel').innerHTML = `<div class="mh"><div><p>Elegí una opción</p><h2>${p.name}</h2></div><button class="x" type="button" data-act="close" aria-label="Cerrar">${ic('x')}</button></div>
        <div class="opts">${p.options.map((o, i) => o.out
          ? `<div class="opt out"><h4>${o.n}</h4><em>Agotado</em></div>`
          : `<button class="opt" type="button" data-act="opt" data-i="${i}"><div><h4>${o.n}</h4><span class="pr">${fmt(o.p)}</span></div><span class="add">${ic('plus')}</span></button>`).join('')}</div>`;
    }
    if (s.sheet === 'cart') {
      R('cpanel').innerHTML = `<div class="mh cart-h"><h2>${ic('bag', 20)} Tu pedido</h2><button class="x" type="button" data-act="close" aria-label="Cerrar">${ic('x')}</button></div>
        <div class="cart-b">
          <div class="items">${s.cart.map((l, i) => `<div class="it"><div class="it-img"><img src="${img(byId(l.id).img)}" alt=""></div><div class="it-t"><h4>${l.label}</h4><p>${fmt(l.qty * l.unit)}</p></div><div class="step"><button type="button" data-act="qty" data-i="${i}" data-d="-1" aria-label="Quitar uno">${ic('minus')}</button><span>${l.qty}</span><button type="button" data-act="qty" data-i="${i}" data-d="1" aria-label="Agregar uno">${ic('plus')}</button></div></div>`).join('')}</div>
          <div class="fields">
            <div><span class="lbl">¿Cómo lo recibís?</span><div class="seg"><button type="button" class="${s.mode === 'retiro' ? 'on' : ''}" data-act="mode" data-m="retiro">Retiro en local</button><button type="button" class="${s.mode === 'delivery' ? 'on' : ''}" data-act="mode" data-m="delivery">Delivery</button></div>
              ${s.mode === 'retiro' ? `<p class="where">${ic('pin')} Retirás en Belgrano 450, Roque Pérez</p>` : ''}</div>
            <div><span class="lbl">Horario</span><div class="times">${TIMES.map((t, i) => `<button type="button" class="${s.time === t ? 'on' : ''}" data-act="time" data-i="${i}">${t}</button>`).join('')}</div></div>
            <div><label class="lbl" for="${root.id}-name">Tu nombre</label><input class="field" id="${root.id}-name" data-f="name" value="${esc(s.name)}" placeholder="Ej: Juan Pérez" autocomplete="off"></div>
            <div><label class="lbl" for="${root.id}-phone">Tu WhatsApp <em>(para avisarte por tu pedido)</em></label><input class="field" id="${root.id}-phone" data-f="phone" value="${esc(s.phone)}" placeholder="Ej: 11 1234 5678" autocomplete="off"></div>
            ${s.mode === 'delivery' ? `<div><label class="lbl" for="${root.id}-addr">Dirección de envío</label><input class="field" id="${root.id}-addr" data-f="addr" value="${esc(s.addr)}" autocomplete="off"></div>` : ''}
            <div><span class="lbl">Forma de pago</span><div class="pays"><button type="button" class="${s.pay === 'Efectivo' ? 'on' : ''}" data-act="pay" data-p="Efectivo">${ic('cash')} Efectivo</button><button type="button" class="${s.pay !== 'Efectivo' ? 'on' : ''}" data-act="pay" data-p="Transferencia">${ic('bank')} Transferencia</button></div></div>
            ${s.pay !== 'Efectivo' ? `<div class="alias"><p>Datos para transferir</p><div><code class="mono">laesquina.mp</code><span class="cp">${ic('copy', 20)}</span></div></div>` : ''}
          </div>
        </div>
        <div class="cart-f"><div class="tot"><span>Total</span><b>${fmt(total())}</b></div>
          <button class="send" type="button" data-act="send">${ic('msg', 20)} Enviar por WhatsApp</button>
          <p class="priv">Tus datos los usa ${STORE} solo para tu pedido. <u>Privacidad</u></p></div>`;
    }
  }

  function renderWA() {
    const chat = R('chat');
    chat.innerHTML = `<span class="wa-day">Hoy</span>` + (s.sent.length
      ? s.sent.map(m => `<div class="bub">${m.html}<span class="t">${m.t}<i>✓✓</i></span></div>`).join('')
      : `<p class="wa-hint">${s.draft ? T.ready : T.wait}</p>`);
    chat.scrollTop = chat.scrollHeight;
    R('draft').innerHTML = s.draft || 'Mensaje';
    R('draft').classList.toggle('has', !!s.draft);
    R('send').classList.toggle('ready', !!s.draft);
  }

  function renderPanel() {
    const c = st => s.orders.filter(o => o.status === st).length;
    R('pill').innerHTML = s.pending.length ? `<span class="bellpill">${ic('bell')} ${s.pending.length}</span>` : '';
    const chip = { pending: ['pending', 'clock', 'Pendiente'], road: ['road', 'truck', 'En camino'], done: ['done', 'checkC', 'Entregado'] };
    R('ow').innerHTML = `
      <h1 class="ph1">Pedidos</h1>
      <p class="ph-sub">Confirmá los nuevos y seguí cada pedido hasta la entrega.</p>
      <p class="live"><i></i>En vivo: los pedidos nuevos aparecen solos.</p>
      ${s.pending.length ? `<div class="card pcard" data-r="pcard"><div class="pcard-h"><i></i><h2 class="h2">Por confirmar (${s.pending.length})</h2></div>
        <p>Confirmá cada pedido cuando te llegue su WhatsApp con el mismo código. Los que no confirmes se ocultan solos a las 24 h.</p>
        <div class="pitems">${s.pending.map(o => `<div class="pitem"><div class="pitem-r"><span class="ocode">#${o.code}</span><div style="min-width:0"><b>${esc(o.name.trim() || 'Cliente')}</b><small>${fmt(o.total)} · hace un momento</small></div></div>
          <div class="btns"><button type="button" class="b b-sm b-pri" data-act="confirm" data-code="${o.code}">${ic('checkC')} Confirmar</button><button type="button" class="b b-sm b-dis" data-act="discard" data-code="${o.code}">${ic('x')} Descartar</button></div></div>`).join('')}</div></div>` : ''}
      <div class="counts">
        <div class="cnt"><p>${ic('clock')} Pendientes</p><b>${c('pending')}</b></div>
        <div class="cnt road"><p>${ic('truck')} En camino</p><b>${c('road')}</b></div>
        <div class="cnt done"><p>${ic('checkC')} Entregados</p><b>${c('done')}</b></div>
        <div class="cnt today"><p>${ic('bag')} Hoy</p><b>${s.orders.length}</b></div>
      </div>
      <ul class="card olist" data-r="olist">${s.orders.length ? s.orders.map(o => `<li class="${o.fresh ? 'new' : ''}" data-code="${o.code}">
        <div><div class="on-name">${esc(o.name.trim() || 'Cliente')}<span>#${o.code}</span></div></div>
        <div class="on-det"><b>${o.items.length} ${o.items.length === 1 ? 'ítem' : 'ítems'}</b><span>${fmt(o.total)}</span></div>
        <div class="on-row"><span class="chip ${o.mode === 'delivery' ? 'delivery' : 'retiro'}">${o.mode === 'delivery' ? 'Delivery' : 'Retiro'}</span><span class="chip ${chip[o.status][0]}">${ic(chip[o.status][1], 14)} ${chip[o.status][2]}</span>
          <span class="on-act"><span class="ibtn">${ic('eye', 20)}</span>${o.status === 'pending' ? `<button type="button" class="ibtn" data-act="status" data-code="${o.code}" data-to="road" title="Marcar en camino">${ic('truck', 20)}</button>` : ''}${o.status !== 'done' ? `<button type="button" class="ibtn" data-act="status" data-code="${o.code}" data-to="done" title="Marcar entregado">${ic('checkC', 20)}</button>` : `<span class="ibtn">${ic('trash', 20)}</span>`}</span></div>
      </li>`).join('') : `<li class="empty">${s.pending.length ? 'Todavía no confirmaste ningún pedido.' : 'Todavía no recibiste pedidos. ¡Ya van a llegar!'}</li>`}</ul>`;
    s.orders.forEach(o => o.fresh = false);
  }

  function render() { renderStore(); renderSheets(); renderWA(); renderPanel(); }

  let toastT;
  function notify(o) {
    const t = R('toast');
    t.innerHTML = `<span class="ic">${ic('bell', 20)}</span><div class="toast-t"><b>¡Nuevo pedido #${o.code}!</b><small>${esc(o.name.trim() || 'Cliente')} · Confirmalo cuando te llegue el WhatsApp</small></div><span class="b">Ver</span>`;
    t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
    if (soundOn) playBell();
  }
  const scrollOwnerTo = sel => { const body = R('ow'), el = sel && body.querySelector(sel); body.scrollTo({ top: el ? Math.max(0, el.offsetTop - body.offsetTop - 16) : 0, behavior: reduced ? 'auto' : 'smooth' }); };

  function addLine(id, opt) {
    const p = byId(id), key = id + '|' + (opt ?? '');
    const line = s.cart.find(l => l.key === key);
    if (line) line.qty++;
    else s.cart.push({ key, id, opt, qty: 1, unit: unitOf(p, opt), label: opt != null ? `${p.name} · ${p.options[opt].n}` : p.name });
  }

  root.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a || !root.contains(a)) return;
    const d = a.dataset;
    switch (d.act) {
      case 'stage': setStage(d.st); return;
      case 'cat': s.cat = d.c; renderStore(); R('main').scrollTop = 0; return;
      case 'add': { const p = byId(d.id); if (p.options) { s.vFor = p.id; s.sheet = 'var'; renderSheets(); } else { addLine(p.id, null); renderStore(); } return; }
      case 'dec': for (let i = s.cart.length - 1; i >= 0; i--) if (s.cart[i].id === d.id) { if (--s.cart[i].qty === 0) s.cart.splice(i, 1); break; } renderStore(); return;
      case 'opt': addLine(s.vFor, +d.i); s.sheet = null; renderSheets(); renderStore(); return;
      case 'cart': if (!s.cart.length) return; s.sheet = 'cart'; renderSheets(); return;
      case 'close': s.sheet = null; renderSheets(); return;
      case 'qty': { const l = s.cart[+d.i]; l.qty += +d.d; if (l.qty <= 0) s.cart.splice(+d.i, 1); if (!s.cart.length) s.sheet = null; renderSheets(); renderStore(); return; }
      case 'mode': s.mode = d.m; renderSheets(); return;
      case 'time': s.time = TIMES[+d.i]; renderSheets(); return;
      case 'pay': s.pay = d.p; renderSheets(); return;
      case 'send': {
        if (!s.cart.length) return;
        const o = { code: randCode(), items: s.cart.map(l => ({ ...l })), total: total(), mode: s.mode, time: s.time, pay: s.pay, name: s.name, phone: s.phone, addr: s.addr };
        s.draft = buildMsg(o); s.pending.unshift(o);
        s.cart = []; s.sheet = null; s.cat = 'Todo';
        render(); scrollOwnerTo('[data-r="pcard"]'); setStage('wa'); notify(o);
        return;
      }
      case 'wa-send': {
        if (!s.draft) return;
        s.sent.push({ html: s.draft, t: hhmm() }); s.draft = null; renderWA();
        setTimeout(() => { if (s.stage === 'wa') setStage('panel'); }, 900);
        return;
      }
      case 'confirm': case 'discard': {
        const i = s.pending.findIndex(o => o.code === d.code); if (i < 0) return;
        const [o] = s.pending.splice(i, 1);
        if (d.act === 'confirm') { o.status = 'pending'; o.fresh = true; s.orders.unshift(o); s.orders = s.orders.slice(0, 3); }
        renderPanel(); scrollOwnerTo(d.act === 'confirm' ? '[data-r="olist"]' : null); return;
      }
      case 'status': { const o = s.orders.find(x => x.code === d.code); if (o) { o.status = d.to; renderPanel(); scrollOwnerTo('[data-r="olist"]'); } return; }
    }
  });
  root.addEventListener('input', e => { const f = e.target.dataset.f; if (f) s[f] = e.target.value; });

  reset();
  return { root, reset, setStage, setSound: v => { soundOn = v; } };
}

// The hero: the same demo, driven by a soft cursor
async function pilot(demo, holder) {
  const root = demo.root, cur = document.createElement('div');
  cur.className = 'cursor'; root.appendChild(cur);
  const tapOn = async (sel, pause) => {
    await visible(holder);
    const el = root.querySelector(sel); if (!el) return;
    const r = el.getBoundingClientRect(), R0 = root.getBoundingClientRect();
    cur.style.translate = `${r.left - R0.left + r.width / 2}px ${r.top - R0.top + r.height / 2}px`;
    cur.classList.add('show');
    await sleep(800);
    cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap');
    el.click();
    await sleep(pause);
  };
  for (;;) {
    await visible(holder);
    demo.reset(true); await sleep(1400);
    await tapOn('[data-act="add"][data-id="burger"]', 900);
    await tapOn('[data-act="opt"][data-i="1"]', 800);
    await tapOn('[data-act="cat"][data-c="Papas y más"]', 700);
    await tapOn('[data-act="add"][data-id="fries"]', 900);
    await tapOn('[data-act="cart"]', 1100);
    await tapOn('[data-act="time"][data-i="1"]', 900);
    await tapOn('[data-act="send"]', 1800);
    await tapOn('[data-act="wa-send"]', 2000);
    await tapOn('[data-act="confirm"]', 3200);
    cur.classList.remove('show'); await sleep(800);
  }
}

/* ================= feature mockups ================= */
// Each mockup is drawn at the app's real size, then scaled down only if the stage is smaller
function mount(fx, html) {
  fx.innerHTML = `<div class="art app">${html}</div>`;
  const art = fx.firstElementChild;
  const fit = () => { const s = Math.min(1.12, (fx.clientWidth - 28) / art.offsetWidth, (fx.clientHeight - 28) / art.offsetHeight); fx.style.setProperty('--s', s.toFixed(3)); };
  new ResizeObserver(fit).observe(fx); new ResizeObserver(fit).observe(art); fit();
  return art;
}
function tap(fx, el) {
  if (!el) return;
  let d = fx.querySelector(':scope > .tapdot');
  if (!d) { d = document.createElement('i'); d.className = 'tapdot'; fx.appendChild(d); }
  const r = el.getBoundingClientRect(), f = fx.getBoundingClientRect();
  d.style.left = (r.left - f.left + r.width / 2) + 'px'; d.style.top = (r.top - f.top + r.height / 2) + 'px';
  d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
}
const SAMPLE = [{ c: '7BE0', n: 'Lucía', t: 18000 }, { c: 'A3F1', n: 'Martín', t: 25500 }, { c: '2C9D', n: 'Sofía', t: 12500 }, { c: 'E41B', n: 'Nicolás', t: 33000 }];

const FX = {
  /* ---- customer ---- */
  variety(fx) {
    const art = mount(fx, `<div class="slice st" style="height:430px;position:relative">
      <div class="st-main"><div class="grid2" data-g></div></div>
      <div class="cbar" data-bar><span><span class="n">1</span>Ver pedido</span><b>${fmt(12500)}</b></div>
      <div class="sh open" data-sh><div class="sh-bg"></div><div class="sh-p" style="border-radius:28px 28px 0 0">
        <div class="mh"><div><p>Elegí una opción</p><h2>Hamburguesa</h2></div><span class="x">${ic('x')}</span></div>
        <div class="opts">${byId('burger').options.map((o, i) => o.out ? `<div class="opt out"><h4>${o.n}</h4><em>Agotado</em></div>` : `<div class="opt" data-o="${i}"><div><h4>${o.n}</h4><span class="pr">${fmt(o.p)}</span></div><span class="add">${ic('plus')}</span></div>`).join('')}</div>
      </div></div></div>`);
    const g = $('[data-g]', art), sh = $('[data-sh]', art), bar = $('[data-bar]', art);
    const grid = q => { g.innerHTML = card(byId('burger'), { qty: q, desc: false }) + card(byId('cheddar'), { desc: false }); };
    loop(fx, async () => {
      grid(0); bar.classList.remove('show'); sh.classList.add('open'); $$('.opt', art).forEach(o => o.classList.remove('hit'));
      await wait(fx, 1600);
      const o = $('[data-o="1"]', art); tap(fx, o); o.classList.add('hit');
      await sleep(350); sh.classList.remove('open'); grid(1); bar.classList.add('show');
      await wait(fx, 3200);
      bar.classList.remove('show'); await sleep(500);
    });
  },

  search(fx) {
    const pool = ['burger', 'cheddar', 'napo', 'especial', 'cuatro', 'flan'].map(byId);
    const art = mount(fx, `<div class="slice st" style="height:500px">
      <div class="st-head"><div class="st-row" style="position:relative"><div class="st-id"><span class="st-name">${STORE}</span></div><span class="st-search">${ic('search', 20)}</span>
        <div style="position:absolute;inset:0;background:var(--card);padding:0 16px;display:flex;align-items:center;gap:8px"><div style="position:relative;flex:1"><span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--sec)">${ic('search')}</span>
          <div class="field" style="border-radius:999px;background:var(--fondo);padding:10px 16px 10px 40px;min-height:46px"><span data-q></span><i class="caret"></i><span data-ph style="color:var(--sec)">Buscar en el menú</span></div></div><span class="st-search">${ic('x', 20)}</span></div></div>
        <div class="st-cats">${['Todo', ...CATS].map(c => `<span class="cat">${c}</span>`).join('')}</div></div>
      <div class="st-main"><p data-c style="font-size:14px;color:var(--sec);margin-bottom:16px;min-height:20px"></p><div class="grid2" data-g></div></div></div>`);
    const q = $('[data-q]', art), ph = $('[data-ph]', art), cnt = $('[data-c]', art), g = $('[data-g]', art);
    const show = query => {
      const n = norm(query.trim());
      const hits = n ? pool.filter(p => norm([p.name, p.desc, p.cat, ...(p.options || []).map(o => o.n)].join(' ')).includes(n)) : pool.slice(0, 2);
      g.innerHTML = hits.slice(0, 2).map(p => card(p, { desc: true })).join('');
      cnt.textContent = n ? `${hits.length === 1 ? '1 resultado' : hits.length + ' resultados'} para “${query.trim()}”` : '';
      ph.style.display = query ? 'none' : '';
    };
    const queries = ['jamon', 'DULCE', 'doble'];
    let i = 0;
    loop(fx, async () => {
      const word = queries[i++ % queries.length]; q.textContent = ''; show('');
      await wait(fx, 1200);
      for (const ch of word) { q.textContent += ch; show(q.textContent); await sleep(150); }
      await wait(fx, 3000);
    });
  },

  qr(fx) {
    const n = 25; let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const finderZone = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    let d = ''; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finderZone(x, y) && rnd() > .52) d += `M${x} ${y}h1v1h-1z`;
    const finder = (x, y) => `<rect x="${x + .5}" y="${y + .5}" width="6" height="6" fill="none" stroke="#000"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    const qr = `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges" aria-hidden="true"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><path d="${d}"/>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
    const art = mount(fx, `<div style="display:flex;align-items:center;gap:36px">
      <div class="qrcard" data-qr><b>${STORE}</b>${qr}<small>Escaneá para ver el menú</small><i class="scan"></i></div>
      <div class="ph" style="--k:.62;height:calc(560px * .62)"><div class="ph-in st" style="height:560px" data-ph>${SB}
        <div class="st-screen">${storeHead({ pill: false, cats: 'Todo' })}
          <div class="st-main" style="overflow:hidden;padding-bottom:0"><div class="grid2">${card(byId('burger'), { mode: 'menu', desc: false })}${card(byId('cheddar'), { mode: 'menu', desc: false })}</div>
          <div style="margin-top:24px;text-align:center"><span style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:500;background:var(--card);border:1px solid var(--borde)">${ic('bag')} ¿Querés pedir para llevar o delivery?</span></div></div>
        </div></div></div></div>`);
    const qc = $('[data-qr]', art), phn = $('.ph', art);
    phn.style.transition = 'opacity .6s, transform .6s';
    loop(fx, async () => {
      phn.style.opacity = '.0'; phn.style.transform = 'translateY(10px)'; qc.classList.remove('scanning');
      await wait(fx, 900); void qc.offsetWidth; qc.classList.add('scanning');
      await wait(fx, 1500); phn.style.opacity = '1'; phn.style.transform = 'none';
      await wait(fx, 3800);
    });
  },

  closed(fx) {
    const art = mount(fx, `<div style="display:flex;gap:16px;align-items:flex-start">
      <div style="display:flex;flex-direction:column;gap:12px;width:236px">
        <div class="mcard scard mshadow"><div><p class="eyebrow">Tienda</p><p class="big"><i data-dot></i><span data-state>Abierta</span></p></div><span class="toggle on" data-t></span></div>
        <div class="mcard scard mshadow"><div><p class="eyebrow">Delivery</p><p class="big"><i></i>Activo</p></div><span class="toggle on"></span></div>
      </div>
      <div class="slice st" style="width:340px;height:430px">${storeHead({ cats: '' })}
        <div data-note style="padding:16px 16px 0;display:none"><div class="st-note">Tienda cerrada, pedidos no disponibles.</div></div>
        <div class="st-main"><div class="grid2" data-g></div></div></div></div>`);
    const g = $('[data-g]', art), t = $('[data-t]', art);
    const set = open => {
      t.classList.toggle('on', open); $('[data-dot]', art).classList.toggle('off', !open); $('[data-state]', art).textContent = open ? 'Abierta' : 'Cerrada';
      const pill = $('.st-pill', art); pill.classList.toggle('closed', !open); pill.lastElementChild.textContent = open ? 'Tomando pedidos' : 'Cerrado';
      $('[data-note]', art).style.display = open ? 'none' : '';
      g.innerHTML = card(byId('muzza'), { open, desc: false }) + card(byId('napo'), { open, desc: false });
    };
    let open = true; set(open);
    loop(fx, async () => { await wait(fx, 3000); tap(fx, t); await sleep(220); open = !open; set(open); });
  },

  /* ---- owner ---- */
  code(fx) {
    const art = mount(fx, `<div style="position:relative;width:470px;height:330px">
      <div class="bub in" style="position:absolute;left:0;top:0;width:270px;max-width:none;font-size:14px;animation:none;-webkit-mask-image:linear-gradient(#000 72%,transparent);mask-image:linear-gradient(#000 72%,transparent)">
        <div>¡Hola! 👋 Quiero hacer un pedido:</div><div class="gap"></div><div>🧾 Pedido <span class="code-hl" data-k>#7BE0</span></div><div>📦 RETIRO EN LOCAL</div><div>🕒 Horario: 21:30</div><div>👤 Nombre: <span data-n>Lucía</span></div><div>📱 Teléfono: 11 4343 1322</div><div class="gap"></div><div>📝 Pedido:</div><div>▪️ 1x Hamburguesa · Doble</div></div>
      <div class="mcard mshadow" style="position:absolute;right:0;bottom:0;width:330px;padding:16px"><div class="pcard-h" style="margin-bottom:12px"><i style="width:10px;height:10px;border-radius:50%;background:var(--q-ember);display:block"></i><span class="h2" style="font-size:16px;line-height:24px">Por confirmar (1)</span></div>
        <div class="pitem"><div class="pitem-r"><span class="ocode" data-k2>#7BE0</span><div style="min-width:0"><b data-n2>Lucía</b><small data-t>${fmt(18000)} · hace un momento</small></div></div>
        <div class="btns"><span class="b b-sm b-pri">${ic('checkC')} Confirmar</span><span class="b b-sm b-dis">${ic('x')} Descartar</span></div></div></div></div>`);
    let i = 0;
    loop(fx, async () => {
      const o = SAMPLE[i++ % SAMPLE.length];
      $('[data-k]', art).textContent = '#' + o.c; $('[data-k2]', art).textContent = '#' + o.c;
      $('[data-n]', art).textContent = o.n; $('[data-n2]', art).textContent = o.n; $('[data-t]', art).textContent = `${fmt(o.t)} · hace un momento`;
      await wait(fx, 900);
      $('[data-k]', art).classList.add('on'); $('[data-k2]', art).classList.add('on');
      await wait(fx, 2200);
      $('[data-k]', art).classList.remove('on'); $('[data-k2]', art).classList.remove('on');
      await wait(fx, 900);
    });
  },

  confirm(fx) {
    const row = (o, st, fresh) => `<li class="${fresh ? 'new' : ''}" style="display:grid;grid-template-columns:1.6fr 1fr .8fr .9fr auto;gap:16px;align-items:center;padding:14px 20px;flex-direction:row">
      <div style="min-width:0"><div class="on-name">${o.n}<span>#${o.c}</span></div><div style="font-size:14px;color:var(--q-smoke);display:flex;align-items:center;gap:4px;margin-top:2px">${ic('phone', 12)} 11 4343 1322</div></div>
      <div class="on-det" style="white-space:nowrap"><b>2 ítems</b><span>${fmt(o.t)}</span></div>
      <div><span class="chip retiro">Retiro</span></div>
      <div>${st === 'road' ? `<span class="chip road">${ic('truck', 14)} En camino</span>` : `<span class="chip pending">${ic('clock', 14)} Pendiente</span>`}</div>
      <div class="on-act"><span class="ibtn">${ic('eye', 20)}</span></div></li>`;
    const art = mount(fx, `<div style="width:600px">
      <div data-pc></div>
      <ul class="card olist mshadow" data-l style="margin:0"></ul></div>`);
    const pc = $('[data-pc]', art), list = $('[data-l]', art);
    let i = 0, rows = [[SAMPLE[3], 'road']];
    const drawList = fresh => { list.innerHTML = `<li style="display:grid;grid-template-columns:1.6fr 1fr .8fr .9fr auto;gap:16px;padding:12px 20px;flex-direction:row" class="eyebrow"><span>Cliente</span><span>Detalle</span><span>Modalidad</span><span>Estado</span><span style="text-align:right">Acciones</span></li>` + rows.slice(0, 2).map((r, j) => row(r[0], r[1], fresh && j === 0)).join(''); };
    drawList();
    loop(fx, async () => {
      const o = SAMPLE[i++ % 3];
      pc.innerHTML = `<div class="card pcard" style="margin-bottom:16px"><div class="pcard-h"><i></i><h2 class="h2">Por confirmar (1)</h2></div><p>Confirmá cada pedido cuando te llegue su WhatsApp con el mismo código.</p>
        <div class="pitem" style="flex-direction:row;align-items:center" data-it><div class="pitem-r" style="flex:1"><span class="ocode">#${o.c}</span><div style="min-width:0"><b>${o.n}</b><small>${fmt(o.t)} · hace un momento</small></div></div>
        <div class="btns" style="margin:0"><span class="b b-sm b-pri" data-ok>${ic('checkC')} Confirmar</span><span class="b b-sm b-dis">${ic('x')} Descartar</span></div></div></div>`;
      await wait(fx, 2200);
      tap(fx, $('[data-ok]', art)); await sleep(250);
      $('[data-it]', art).classList.add('leave'); await sleep(320);
      pc.innerHTML = '';
      rows.unshift([o, 'pending']); rows = rows.slice(0, 2); drawList(true);
      await wait(fx, 3000);
    });
  },

  bell(fx) {
    const art = mount(fx, `<div style="width:440px">
      <div class="btab"><img src="${LOGO}" alt=""><span data-title>Pedidos · Qata</span></div>
      <div style="background:var(--q-bone);border-radius:0 16px 16px 16px;padding:24px 22px 104px;position:relative;overflow:hidden">
        <p class="ph1" style="font-size:28px">Pedidos</p>
        <p class="live" style="margin:6px 0 16px"><i></i>En vivo: los pedidos nuevos aparecen solos.</p>
        <div class="counts" style="margin:0"><div class="cnt" style="padding:16px"><p>${ic('clock')} Pendientes</p><b data-p style="font-size:30px;line-height:34px;margin-top:8px">2</b></div><div class="cnt today" style="padding:16px"><p>${ic('bag')} Hoy</p><b style="font-size:30px;line-height:34px;margin-top:8px">9</b></div></div>
        <div class="toast" data-toast style="left:22px;right:22px;bottom:18px"></div>
      </div></div>`);
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'play'; btn.textContent = T.bell; fx.appendChild(btn);
    btn.addEventListener('click', playBell);
    let i = 0, n = 0;
    loop(fx, async () => {
      const o = SAMPLE[i++ % SAMPLE.length], t = $('[data-toast]', art); n = n % 3 + 1;
      t.innerHTML = `<span class="ic">${ic('bell', 20)}</span><div class="toast-t"><b>¡Nuevo pedido #${o.c}!</b><small>${o.n} · Confirmalo cuando te llegue el WhatsApp</small></div><span class="b">Ver</span>`;
      $('[data-title]', art).textContent = `(${n}) Pedidos nuevos · Qata`;
      t.classList.add('show');
      await wait(fx, 3400); t.classList.remove('show');
      if (n === 3) { await wait(fx, 800); $('[data-title]', art).textContent = 'Pedidos · Qata'; }
      await wait(fx, 1600);
    });
  },

  edit(fx) {
    const art = mount(fx, `<div class="mcard mshadow" style="width:460px;overflow:hidden">
      <div style="padding:24px 24px 16px"><p class="eyebrow">Pedido <span class="mono">#7BE0</span></p><h2 style="font-size:24px;line-height:32px;font-weight:500;letter-spacing:-.025em;margin-top:4px">Lucía</h2></div>
      <div style="padding:0 24px 24px;height:300px;position:relative">
        <div class="fade-swap" data-edit>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 class="eyebrow">Productos</h3></div>
          <div data-rows style="display:flex;flex-direction:column;gap:8px"></div>
          <div style="background:var(--q-bone);border-radius:16px;padding:12px;margin-top:16px;display:flex;flex-direction:column;gap:8px"><p style="font-size:14px;font-weight:500">Agregar producto</p>
            <div class="input" style="padding:10px 16px;min-height:0;font-size:15px" data-sel>Elegí un producto…</div>
            <span class="b b-out" style="width:100%" data-addbtn>${ic('plus')} Agregar al pedido</span></div>
          <div style="display:flex;gap:8px;margin-top:16px"><span class="b b-pri" style="flex:1" data-save>${ic('checkC')} Guardar cambios</span><span class="b b-sec" style="flex:1">Cancelar</span></div>
        </div>
        <div class="fade-swap out" data-done style="position:absolute;inset:0 24px 24px">
          <div style="border:1px solid var(--q-hairline);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:12px">
            <p style="font-size:14px;font-weight:500">Pedido actualizado. Avisale al cliente:</p>
            <div style="font-size:12px;line-height:1.6;background:var(--q-bone);border-radius:12px;padding:12px;white-space:pre-wrap">¡Hola Lucía! 👋 Te confirmamos tu pedido #7BE0 con los cambios:\n\n▪️ 2x Hamburguesa · Doble (${fmt(25000)})\n▪️ 1x Papas fritas (${fmt(5500)})\n\nTOTAL: ${fmt(30500)}</div>
            <div style="display:flex;gap:8px"><span class="b b-sec" style="flex:1">${ic('copy')} Copiar mensaje</span><span class="b b-pri" style="flex:1">${ic('msg')} Abrir WhatsApp</span></div>
          </div></div>
      </div></div>`);
    const rowsEl = $('[data-rows]', art);
    const row = (name, qty, price, id) => `<div data-row="${id}" style="display:flex;justify-content:space-between;align-items:center;gap:12px;transition:opacity .3s"><span style="font-size:14px;font-weight:500;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</span>
      <div style="display:flex;align-items:center;gap:12px;flex:none"><span style="font-size:14px;color:var(--q-smoke)">${fmt(price)}</span><div style="display:flex;align-items:center;border:1px solid var(--q-hairline);border-radius:999px"><span data-minus style="width:32px;height:32px;display:grid;place-items:center;color:var(--q-smoke)">${qty === 1 ? ic('trash', 14) : ic('minus', 14)}</span><span style="width:24px;text-align:center;font-size:14px;font-weight:600">${qty}</span><span style="width:32px;height:32px;display:grid;place-items:center;color:var(--q-smoke)">${ic('plus', 14)}</span></div></div></div>`;
    loop(fx, async () => {
      $('[data-edit]', art).classList.remove('out'); $('[data-done]', art).classList.add('out');
      rowsEl.innerHTML = row('Hamburguesa · Doble', 2, 25000, 'a') + row('Doble cheddar', 1, 11700, 'b');
      $('[data-sel]', art).textContent = 'Elegí un producto…';
      await wait(fx, 1800);
      const b = $('[data-row="b"]', art); tap(fx, $('[data-minus]', b)); await sleep(250); b.style.opacity = '0'; await sleep(300); b.remove();
      await wait(fx, 900);
      tap(fx, $('[data-sel]', art)); await sleep(300); $('[data-sel]', art).textContent = 'Papas fritas';
      await wait(fx, 900);
      tap(fx, $('[data-addbtn]', art)); await sleep(250); rowsEl.insertAdjacentHTML('beforeend', row('Papas fritas', 1, 5500, 'c'));
      await wait(fx, 1100);
      tap(fx, $('[data-save]', art)); await sleep(300);
      $('[data-edit]', art).classList.add('out'); $('[data-done]', art).classList.remove('out');
      await wait(fx, 4200);
    });
  },

  /* ---- setting up ---- */
  photo(fx) {
    const art = mount(fx, `<div class="mcard mshadow" style="width:420px;padding:24px">
      <label class="flabel">Nombre del producto</label><div class="input" data-in><span data-q></span><i class="caret"></i></div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:20px">
        <div style="width:96px;height:96px;border-radius:16px;background:var(--q-bone);flex:none;overflow:hidden;display:grid;place-items:center;font-size:12px;color:var(--q-smoke)" data-box><span>Sin foto</span></div>
        <div><div style="display:flex;flex-wrap:wrap;gap:8px"><span class="b b-sec b-sm">${ic('imgPlus')} Subir foto</span><span class="b b-sec b-sm">${ic('images')} Elegir foto</span></div>
          <p style="font-size:12px;line-height:16px;color:var(--q-smoke);margin-top:8px">Mejor con fondo transparente o blanco.</p></div></div>
      <div class="notice hide" data-note><span>Elegimos esta foto según el nombre del producto.</span><u>Quitar</u></div></div>`);
    const items = [['Pizza napolitana', 'pizza-napolitana'], ['Flan casero', 'flan'], ['Empanada de carne', 'empanada'], ['Papas fritas', 'papas-fritas']];
    let i = 0;
    loop(fx, async () => {
      const [name, im] = items[i++ % items.length], q = $('[data-q]', art), box = $('[data-box]', art), note = $('[data-note]', art), inp = $('[data-in]', art);
      q.textContent = ''; box.innerHTML = '<span>Sin foto</span>'; note.classList.add('hide'); inp.classList.add('focus');
      await wait(fx, 900);
      for (const ch of name) { q.textContent += ch; await sleep(70 + Math.random() * 50); }
      await wait(fx, 500); inp.classList.remove('focus');
      box.innerHTML = `<img src="${img(im)}" alt="" style="width:100%;height:100%;object-fit:contain;padding:8px;animation:pop .35s ease-out">`;
      note.classList.remove('hide');
      await wait(fx, 3200);
    });
  },

  message(fx) {
    const chips = [['codigo', 'Código', 1], ['productos', 'Productos', 1], ['total', 'Total', 1], ['entrega', 'Entrega'], ['horario', 'Horario'], ['nombre', 'Nombre'], ['pago', 'Pago']];
    const art = mount(fx, `<div class="mcard mshadow" style="width:560px;padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div><p class="flabel">Campos automáticos</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${chips.map(([k, l, r]) => `<span class="fchip${r ? ' req' : ''}" data-k="${k}">+ ${l}</span>`).join('')}</div>
        <div class="ta" data-ta></div></div>
      <div><p class="flabel">Así te llega (ejemplo)</p><div class="prevbox"><div class="prevbub" data-pv></div></div></div></div>`);
    const steps = [
      ['nombre', '¡Hola! Soy {nombre} 👋', '¡Hola! Soy <mark>Lucía</mark> 👋'],
      ['codigo', 'Pedido #{codigo}', 'Pedido <mark>#7BE0</mark>'],
      ['productos', '{productos}', `<mark>▪️ 2x Hamburguesa doble (${fmt(25000)})\n▪️ 1x Papas cheddar (${fmt(6900)})</mark>`],
      ['total', 'TOTAL: {total}', `TOTAL: <mark>${fmt(31900)}</mark>`],
    ];
    loop(fx, async () => {
      const ta = $('[data-ta]', art), pv = $('[data-pv]', art);
      ta.innerHTML = '<i class="caret"></i>'; pv.innerHTML = '';
      await wait(fx, 1200);
      for (const [k, t, v] of steps) {
        const chip = $(`[data-k="${k}"]`, art); tap(fx, chip); chip.classList.add('hit'); await sleep(300); chip.classList.remove('hit');
        $$('mark', pv).forEach(m => m.classList.remove('on'));
        ta.innerHTML = ta.innerHTML.replace('<i class="caret"></i>', '') + esc(t) + '\n<i class="caret"></i>';
        pv.insertAdjacentHTML('beforeend', v + '\n');
        requestAnimationFrame(() => $$('mark', pv).slice(-1).forEach(m => m.classList.add('on')));
        await wait(fx, 1300);
      }
      $$('mark', pv).forEach(m => m.classList.remove('on'));
      await wait(fx, 3000);
    });
  },

  themes(fx) {
    const T = [
      ['Brasa', { brand: '#ff6808', fondo: '#f1f0ec', card: '#ffffff', texto: '#000000', sec: '#6e6d6c', borde: '#e5e7eb' }],
      ['Clásico', { brand: '#000000', fondo: '#ffffff', card: '#ffffff', texto: '#000000', sec: '#6e6d6c', borde: '#e5e7eb' }],
      ['Índigo', { brand: '#4570ff', fondo: '#f4f6ff', card: '#ffffff', texto: '#0b1533', sec: '#5b6480', borde: '#dfe5fb' }],
      ['Huerta', { brand: '#244f47', fondo: '#f3f1ea', card: '#ffffff', texto: '#14231f', sec: '#5e6b66', borde: '#e2e0d6' }],
      ['Pastel', { brand: '#c293f1', fondo: '#faf6ff', card: '#ffffff', texto: '#1d1230', sec: '#6f6580', borde: '#ece2fb' }],
      ['Noche', { brand: '#c6ff94', fondo: '#0e0e0e', card: '#1a1a1a', texto: '#ffffff', sec: '#a3a3a3', borde: '#2c2c2c' }],
    ];
    const art = mount(fx, `<div style="display:flex;gap:20px;align-items:flex-start">
      <div class="st" data-st style="width:300px;height:400px;border:1px solid #e5e7eb;border-radius:32px 32px 14px 14px;overflow:hidden;background:var(--card);display:flex;flex-direction:column;transition:background .6s;box-shadow:0 18px 40px -22px rgba(0,0,0,.25)">
        <div class="sb" style="background:var(--card);color:var(--texto);transition:background .6s,color .6s">${SB.replace('<div class="sb">', '').replace(/<\/div>$/, '')}</div>
        <div class="st-screen" style="transition:background .6s;--nm:17px">${storeHead({ cats: 'Todo' })}<div class="st-main" style="overflow:hidden;padding-bottom:0"><div class="grid2">${card(byId('muzza'), { desc: false })}${card(byId('napo'), { desc: false })}</div></div></div></div>
      <div style="display:flex;flex-direction:column;gap:8px;width:176px">${T.map(([n, t], i) => `<button type="button" class="preset" data-i="${i}"><span class="sw3"><i style="background:${t.fondo}"></i><i style="background:${t.brand}"></i><i style="background:${t.texto}"></i></span>${n}</button>`).join('')}</div></div>`);
    const st = $('[data-st]', art);
    $$('.st-head, .cat, .st-pill', art).forEach(el => el.style.transition = 'background .6s, color .6s, border-color .6s');
    let idx = 0, userUntil = 0;
    const apply = i => { idx = i; const t = T[i][1]; Object.entries(t).forEach(([k, v]) => st.style.setProperty('--' + k, v)); st.style.setProperty('--onb', onBrand(t.brand)); $$('.preset', art).forEach((b, j) => b.classList.toggle('on', j === i)); };
    $$('.preset', art).forEach(b => b.addEventListener('click', () => { userUntil = Date.now() + 8000; apply(+b.dataset.i); }));
    apply(0);
    loop(fx, async () => { await wait(fx, 2600); if (Date.now() > userUntil) apply((idx + 1) % T.length); });
  },

  contrast(fx) {
    const art = mount(fx, `<div style="display:flex;gap:16px;align-items:flex-start;width:520px">
      <div class="st" data-st style="width:170px;flex:none">${card(byId('flan'), { desc: true })}</div>
      <div class="mcard mshadow" style="flex:1;padding:20px">
        <div class="colorrow"><span class="sw" data-sw></span><span><b>Fondo de tarjetas</b><small data-hex>#ffffff</small></span></div>
        <p style="font-weight:500;margin-top:16px">Contraste del texto</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">
          <div class="ccheck" data-c0><p>Texto sobre el fondo</p><p class="r"><b>-</b><span>:1</span></p><em>Se lee bien</em></div>
          <div class="ccheck" data-c1><p>Texto sobre tarjetas</p><p class="r"><b>-</b><span>:1</span></p><em>Se lee bien</em></div>
          <div class="ccheck" data-c2><p>Secundario sobre tarjetas</p><p class="r"><b>-</b><span>:1</span></p><em>Se lee bien</em></div>
        </div></div></div>`);
    const st = $('[data-st]', art), TEXT = '#000000', SEC = '#6e6d6c', FONDO = '#f1f0ec';
    const setCheck = (el, r) => { el.classList.toggle('bad', r < 4.5); $('b', el).textContent = r.toFixed(2); $('em', el).textContent = r >= 4.5 ? 'Se lee bien' : 'Cuesta leer'; };
    const apply = v => {
      const g = Math.round(255 - v * 1.6), hex = '#' + [g, g, g].map(x => x.toString(16).padStart(2, '0')).join('');
      st.style.setProperty('--card', hex); $('[data-sw]', art).style.background = hex; $('[data-hex]', art).textContent = hex;
      setCheck($('[data-c0]', art), ratio(TEXT, FONDO)); setCheck($('[data-c1]', art), ratio(TEXT, hex)); setCheck($('[data-c2]', art), ratio(SEC, hex));
    };
    let t = 0;
    apply(0);
    loop(fx, async () => { t += .02; apply((1 - Math.cos(t)) / 2 * 100); await wait(fx, 60); });
  },

  /* ---- next ---- */
  library(fx) {
    const pics = ['hamburguesa-clasica', 'pizza-muzzarella', 'flan', 'papas-fritas', 'empanada', 'pizza-napolitana', 'carne-asada', 'hamburguesa-doble', 'pastas', 'pizza-cuatro-quesos', 'pizza-especial', 'flan', 'empanada', 'papas-fritas', 'hamburguesa-clasica'];
    const art = mount(fx, `<div class="lib">${pics.map(p => `<div><img src="${img(p)}" alt="" loading="lazy"></div>`).join('')}</div>`);
    const tiles = $$('.lib > div', art), order = tiles.map((_, i) => i).sort((a, b) => ((a * 7) % 15) - ((b * 7) % 15));
    loop(fx, async () => {
      tiles.forEach(t => t.classList.remove('on')); await wait(fx, 900);
      for (const i of order) { tiles[i].classList.add('on'); await sleep(260); }
      await wait(fx, 3000);
    });
  },

  made(fx) {
    const art = mount(fx, `<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
      <div class="slice st" style="height:330px"><div class="st-main" data-sc style="height:100%;overflow:hidden;padding-bottom:28px">
        <div class="grid2">${['muzza', 'napo', 'cuatro', 'flan'].map(id => card(byId(id), { desc: false })).join('')}</div>${MADE}</div></div>
      <div class="btab" data-tab style="border-radius:12px;opacity:0;transform:translateY(6px);transition:opacity .5s,transform .5s;width:auto;max-width:375px;box-shadow:0 18px 40px -22px rgba(0,0,0,.25)"><img src="${LOGO}" alt=""><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Menú digital y pedidos por WhatsApp sin comisiones | Qata</span></div></div>`);
    const sc = $('[data-sc]', art), tab = $('[data-tab]', art), link = $('.made a', art);
    link.addEventListener('click', e => e.preventDefault());
    const scrollTo = (top, ms) => new Promise(res => { const from = sc.scrollTop, t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; sc.scrollTop = from + (top - from) * e; k < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
    loop(fx, async () => {
      sc.scrollTop = 0; tab.style.opacity = '0'; tab.style.transform = 'translateY(6px)'; link.style.textDecoration = '';
      await wait(fx, 1200);
      await scrollTo(sc.scrollHeight - sc.clientHeight, reduced ? 0 : 2200);
      await wait(fx, 900);
      tap(fx, link); link.style.textDecoration = 'underline'; await sleep(300);
      tab.style.opacity = '1'; tab.style.transform = 'none';
      await wait(fx, 3400);
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
const hero = createDemo($('#hero-demo'), { auto: true });
if (!reduced) pilot(hero, $('#hero-demo'));
// cover.html (the home page cover) only has the hero
if ($('#try-demo')) {
  const tryDemo = createDemo($('#try-demo'));
  $('#try-reset').addEventListener('click', () => tryDemo.reset());
  $('#try-sound').addEventListener('click', e => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', on); e.currentTarget.textContent = on ? T.soundOn : T.soundOff; tryDemo.setSound(on);
  });
  $$('[data-fx]').forEach(fx => FX[fx.dataset.fx] && FX[fx.dataset.fx](fx));
  progress();
}
})();
