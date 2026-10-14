const $ = id => document.getElementById(id);
const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
};
const wheel = $('wheel'), verse = $('verse');
let lang = store.get('lang') || ((navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es');
let theme = store.get('theme') || 'dark';
let cur = 0, timer, items = [];
const k = () => (lang === 'es' ? 0 : 1);
const rowH = () => items[0].offsetHeight;

function build() {
  wheel.innerHTML = '';
  items = OPTIONS.map((o, i) => {
    const d = document.createElement('div');
    d.className = 'opt';
    d.setAttribute('role', 'option');
    d.textContent = o[k()];
    d.onclick = () => wheel.scrollTo({ top: i * rowH(), behavior: 'smooth' });
    wheel.appendChild(d);
    return d;
  });
}

function showVerse() {
  const v = VERSES[OPTIONS[cur][2]];
  verse.classList.remove('on');
  clearTimeout(timer);
  timer = setTimeout(() => {
    $('vtext').textContent = '“' + v[2 + k()] + '”';
    $('vref').textContent = v[k()];
    verse.classList.add('on');
  }, 300);
}

let ticking = false;
function update(initial) {
  const pos = wheel.scrollTop / rowH();
  items.forEach((d, i) => {
    const dist = Math.abs(i - pos);
    d.style.opacity = Math.max(0.12, 1 - dist * 0.4);
    d.style.transform = 'scale(' + Math.max(0.6, 1 - dist * 0.12) + ')';
  });
  const idx = Math.min(items.length - 1, Math.max(0, Math.round(pos)));
  if (idx !== cur || initial) {
    const changed = idx !== cur;
    cur = idx;
    if (changed) {
      if (navigator.vibrate) navigator.vibrate(8);
      $('hint').classList.add('gone');
    }
    showVerse();
  }
}
wheel.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); }
}, { passive: true });

function applyLang() {
  const t = TEXTS[lang];
  document.documentElement.lang = lang;
  $('phrase').textContent = t.phrase;
  $('share').textContent = t.share;
  $('made').textContent = t.made;
  $('lang').textContent = t.other;
  build();
  wheel.scrollTop = cur * rowH();
  update(true);
}
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('theme').textContent = theme === 'dark' ? '☀' : '☾';
  const m = document.querySelector('meta[name=theme-color]');
  if (m) m.content = theme === 'dark' ? '#3a6b35' : '#cfe6c8';
}

$('lang').onclick = () => { lang = lang === 'es' ? 'en' : 'es'; store.set('lang', lang); applyLang(); };
$('theme').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; store.set('theme', theme); applyTheme(); };

/* ---- Compartir: imagen vertical (historias) + texto ---- */
function wrap(c, text, w) {
  const out = []; let line = '';
  text.split(' ').forEach(word => {
    const n = line ? line + ' ' + word : word;
    if (c.measureText(n).width > w && line) { out.push(line); line = word; } else line = n;
  });
  out.push(line);
  return out;
}
async function makeImage() {
  try { await document.fonts.load('700 40px Philosopher'); } catch (e) {}
  const o = OPTIONS[cur], v = VERSES[o[2]];
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
  const x = c.getContext('2d'), cs = getComputedStyle(document.body);
  x.fillStyle = cs.backgroundColor; x.fillRect(0, 0, 1080, 1920);
  x.fillStyle = cs.color; x.textAlign = 'center';
  let y = 620;
  x.font = '400 76px Philosopher'; x.fillText(TEXTS[lang].phrase, 540, y); y += 120;
  x.font = '700 104px Philosopher';
  wrap(x, o[k()], 900).forEach(l => { x.fillText(l, 540, y); y += 118; });
  y += 70; x.font = 'italic 44px Philosopher';
  wrap(x, '“' + v[2 + k()] + '”', 860).forEach(l => { x.fillText(l, 540, y); y += 64; });
  y += 20; x.font = '700 42px Philosopher'; x.fillText(v[k()], 540, y);
  x.globalAlpha = 0.7; x.font = '36px Philosopher'; x.fillText(location.host || '', 540, 1820);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
$('share').onclick = async () => {
  const o = OPTIONS[cur], v = VERSES[o[2]];
  const text = `${TEXTS[lang].phrase} ${o[k()]}\n\n“${v[2 + k()]}” — ${v[k()]}\n\n${location.href}`;
  try {
    const blob = await makeImage();
    const file = new File([blob], 'jesus.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text }); return;
    }
    if (navigator.share) { await navigator.share({ text }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
};

applyTheme();
document.fonts && document.fonts.ready.then(() => { wheel.scrollTop = cur * rowH(); update(); });
applyLang();
wheel.focus({ preventScroll: true });
