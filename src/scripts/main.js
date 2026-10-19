import { unlock, setEnabled, isOn, sfx } from './audio.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stages = $$('.stage');
const dots = $$('.progress li');
const cuts = $$('.cut');
const backBtn = $('#back');
const SLUGS = ['acceso', 'jugador', 'hambre', 'plan', 'final'];

let current = 0;
let busy = false;
let pending = null;

/* ---------- Sonido: activado por defecto, arranca con el primer toque ---------- */
const soundBtn = $('#sound');
const soundState = $('#sound-state');
const syncSound = () => {
  soundBtn.setAttribute('aria-pressed', String(isOn()));
  soundState.textContent = isOn() ? 'ON' : 'OFF';
};
soundBtn.addEventListener('click', () => {
  unlock();
  setEnabled(!isOn());
  syncSound();
  sfx('click');
});
// Cualquier primer gesto desbloquea el audio (los navegadores no permiten sonar antes).
// En móviles solo cuentan click / touchend (pointerdown no desbloquea el audio en iOS).
['click', 'touchend', 'keydown'].forEach((t) => addEventListener(t, unlock, { passive: true }));

/* ---------- Partículas ---------- */
const COLORS = ['#e8832b', '#f3e6c9', '#c23a2b', '#f6d27f', '#b9553a'];
function burst(el, n = 14) {
  if (reduce) return;
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('span');
    const a = Math.random() * Math.PI * 2;
    const d = 50 + Math.random() * 110;
    b.className = 'bit' + (i % 4 === 0 ? ' sq' : '');
    b.style.cssText = `left:${x}px;top:${y}px;background:${COLORS[i % COLORS.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px;--rot:${Math.random() * 540 - 270}deg`;
    b.addEventListener('animationend', () => b.remove(), { once: true });
    document.body.append(b);
  }
}

/* ---------- Transición de recortes de papel ---------- */
function jagged() {
  const pts = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${Math.round(Math.random() * 40)}px`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% calc(100% - ${Math.round(Math.random() * 40)}px)`);
  return `polygon(${pts.join(',')})`;
}
cuts.forEach((c) => (c.style.clipPath = jagged()));

function show(n) {
  stages.forEach((s, i) => {
    s.hidden = i !== n;
    s.classList.toggle('is-active', i === n);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('now', i === n);
    d.classList.toggle('done', i < n);
  });
  document.body.classList.toggle('on-light', n === 1);
  backBtn.hidden = n === 0;
  document.body.style.background = getComputedStyle(stages[n]).backgroundColor;
  window.scrollTo(0, 0);
  $('h1, h2', stages[n])?.focus({ preventScroll: true });
  current = n;
  if (n === 2) enterGame();
  else leaveGame();
  if (n === 3) loadPoster(); // precarga el póster mientras lee el plan
}

/**
 * Cambia de etapa con la transición de papel. `push` añade una entrada al historial
 * para que el botón "atrás" del navegador y del teléfono funcionen.
 */
async function goTo(n, push = true) {
  if (n === current) return;
  if (busy) {
    pending = { n, push };
    return;
  }
  busy = true;
  if (push) history.pushState({ n }, '', `#${SLUGS[n]}`);
  if (reduce) {
    show(n);
  } else {
    const opts = { duration: 380, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' };
    const [a, b] = cuts;
    a.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], opts);
    await b.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], { ...opts, delay: 90 }).finished;
    show(n);
    const out = { ...opts, duration: 420, easing: 'cubic-bezier(.7,0,.3,1)' };
    b.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-105%)' }], out);
    await a.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-105%)' }], { ...out, delay: 90 }).finished;
    cuts.forEach((c) => {
      c.getAnimations().forEach((x) => x.cancel());
      c.style.clipPath = jagged();
    });
  }
  busy = false;
  if (pending) {
    const p = pending;
    pending = null;
    goTo(p.n, p.push);
  }
}

// La página siempre empieza en el primer paso; el historial permite ir y volver.
history.replaceState({ n: 0 }, '', location.pathname);
addEventListener('popstate', (e) => {
  if ($('#viewer').open) $('#viewer').close();
  goTo(e.state?.n ?? 0, false);
});
backBtn.addEventListener('click', () => history.back());

/* ---------- Nivel 1 ---------- */
$('#start').addEventListener('click', (e) => {
  if (busy) return;
  unlock();
  sfx('click');
  $('#envelope').classList.add('open');
  burst(e.currentTarget, 10);
  setTimeout(() => goTo(1), reduce ? 0 : 750);
});

/* ---------- Nivel 2: elige jugador ---------- */
const list = $('#chars');
for (let i = list.children.length; i > 1; i--) list.append(list.children[Math.floor(Math.random() * i)]);

const msg = $('#msg');
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.char');
  if (!btn || btn.classList.contains('right')) return;
  if (btn.dataset.id === 'larva') {
    $$('.char', list).forEach((c) => c !== btn && c.classList.add('dim'));
    btn.classList.add('right');
    msg.textContent = 'Sabíamos que lo encontrarías.';
    msg.classList.add('ok');
    const next = $('#next2');
    next.hidden = false;
    burst(btn, 22);
    sfx('win');
    next.focus({ preventScroll: true });
  } else {
    btn.classList.remove('wrong');
    void btn.offsetWidth;
    btn.classList.add('wrong');
    msg.textContent = 'Ese personaje también está invitado, pero no es el cumpleañero.';
    sfx('bad');
  }
});
$('#next2').addEventListener('click', () => {
  sfx('click');
  goTo(2);
});

/* ---------- Nivel 3: Snake (módulo cargado solo cuando se necesita) ---------- */
let game = null;
let gameLoading = null;
const screen = $('.screen');
const scoreEl = $('#score');
const GOAL = 7;

async function enterGame() {
  gameLoading ||= import('./snake.js').then(({ createSnake, onSwipe }) => {
    game = createSnake($('#snake'), {
      goal: GOAL,
      onEat: (s) => {
        scoreEl.textContent = `${s}/${GOAL}`;
        sfx('eat');
        burst($('#snake'), 5);
      },
      onCrash: () => {
        sfx('crash');
        screen.classList.add('crash');
        setTimeout(() => screen.classList.remove('crash'), 320);
      },
      onWin: () => {
        sfx('win');
        $('#ov-win').hidden = false;
        $('#next3').focus({ preventScroll: true });
        burst($('#snake'), 22);
      },
    });
    onSwipe($('#snake'), (d) => game.turn(d));
  });
  await gameLoading;
}
function leaveGame() {
  game?.stop();
  if ($('#ov-win').hidden) $('#ov-start').hidden = false;
}

$('#play').addEventListener('click', () => {
  $('#ov-start').hidden = true;
  sfx('click');
  game?.start();
  $('#snake').focus?.();
});
$$('.dpad button').forEach((b) =>
  b.addEventListener('click', () => {
    if (!$('#ov-start').hidden) $('#ov-start').hidden = true;
    game?.turn(b.dataset.dir);
  })
);
const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
addEventListener('keydown', (e) => {
  if (current !== 2 || !game) return;
  const d = KEYS[e.key];
  if (!d || !$('#ov-win').hidden) return;
  e.preventDefault();
  $('#ov-start').hidden = true;
  game.turn(d);
});
$('#next3').addEventListener('click', () => {
  sfx('click');
  goTo(3);
});
$('#skip').addEventListener('click', () => {
  sfx('click');
  goTo(3);
});

/* ---------- Nivel 4: plan ---------- */
$('#next4').addEventListener('click', (e) => {
  burst(e.currentTarget, 12);
  sfx('click');
  goTo(4);
});

/* ---------- Nivel final: póster ---------- */
const poster = $('#poster');
function loadPoster() {
  if (poster && !poster.src) poster.src = poster.dataset.src;
}

const viewer = $('#viewer');
const vScroll = $('#viewer-scroll');
const vImg = $('#viewer-img');
$('#open-viewer')?.addEventListener('click', () => {
  vImg.src = poster.dataset.src;
  vScroll.classList.remove('zoomed');
  history.pushState({ n: 4, viewer: true }, '', '#poster');
  viewer.showModal();
});
// Cerrar el visor (botón, Esc o tocar fuera) también retrocede en el historial.
viewer.addEventListener('close', () => {
  if (history.state?.viewer) history.back();
});
$('#close-viewer').addEventListener('click', () => viewer.close());
vImg.addEventListener('click', (e) => {
  e.stopPropagation();
  vScroll.classList.toggle('zoomed');
});
vScroll.addEventListener('click', () => viewer.close());

$('#save')?.addEventListener('click', (e) => {
  const a = document.createElement('a');
  a.href = e.currentTarget.dataset.href;
  a.download = 'larva-birthday-poster.png';
  document.body.append(a);
  a.click();
  a.remove();
  burst(e.currentTarget, 12);
  sfx('win');
});

show(0);
