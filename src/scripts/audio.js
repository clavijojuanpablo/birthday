// Sonido sintetizado (sin archivos). El navegador solo permite audio tras un gesto del usuario,
// por eso la música arranca en el primer toque ("Descubrir invitación") y queda activada por defecto.
let ctx;
let master;
let enabled = true;
let timer = 0;
let step = 0;
let nextT = 0;

const LEAD = [440, 0, 523.25, 0, 659.25, 0, 523.25, 0, 392, 0, 493.88, 0, 587.33, 0, 493.88, 0];
const BASS = [110, 110, 87.31, 98];
const STEP = 60 / 116 / 2;

function tone(type, freq, t, dur, vol, to) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function schedule() {
  while (nextT < ctx.currentTime + 0.3) {
    const lead = LEAD[step % 16];
    if (lead) tone('square', lead, nextT, STEP * 1.6, 0.03);
    if (step % 4 === 0) tone('triangle', BASS[(step / 4) % 4], nextT, STEP * 3.4, 0.09);
    nextT += STEP;
    step++;
  }
}

function startMusic() {
  if (timer) return;
  nextT = ctx.currentTime + 0.05;
  timer = setInterval(schedule, 120);
}

export function isOn() {
  return enabled;
}

/** Llamar dentro de un gesto del usuario. */
export function unlock() {
  try {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = enabled ? 0.8 : 0;
      master.connect(ctx.destination);
    }
    if (enabled && ctx.state !== 'running') ctx.resume();
    if (enabled) startMusic();
  } catch {}
}

export function setEnabled(v) {
  enabled = v;
  if (!ctx) return;
  master.gain.setTargetAtTime(v ? 0.8 : 0, ctx.currentTime, 0.03);
  if (v) {
    ctx.resume();
    startMusic();
  } else {
    clearInterval(timer);
    timer = 0;
  }
}

document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend();
  else if (enabled) ctx.resume();
});

const FX = {
  click: (t) => tone('square', 660, t, 0.07, 0.07, 990),
  eat: (t) => tone('square', 700, t, 0.1, 0.09, 1400),
  bad: (t) => tone('sawtooth', 220, t, 0.25, 0.08, 80),
  crash: (t) => tone('sawtooth', 300, t, 0.3, 0.09, 60),
  win: (t) => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone('square', f, t + i * 0.09, 0.22, 0.08)),
};

export function sfx(name) {
  if (!ctx || !enabled || ctx.state !== 'running') return;
  FX[name]?.(ctx.currentTime + 0.01);
}
