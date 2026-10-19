// Mini Snake: Larva se come controles de videojuegos. Se carga solo al llegar al nivel 2.
const N = 16;
const C = 20;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function createSnake(canvas, { goal, onEat, onWin, onCrash }) {
  const g = canvas.getContext('2d');
  let snake, dir, queue, food, score, timer;
  let running = false;
  let won = false;

  function reset(keepScore) {
    snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
    dir = 'right';
    queue = [];
    if (!keepScore) score = 0;
    spawn();
    draw();
  }

  function spawn() {
    do food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    while (snake.some((s) => s.x === food.x && s.y === food.y));
  }

  function turn(d) {
    if (won || !DIRS[d]) return;
    const last = queue.length ? queue[queue.length - 1] : dir;
    const [lx, ly] = DIRS[last];
    const [nx, ny] = DIRS[d];
    if (lx + nx === 0 && ly + ny === 0) return; // sin giro de 180°
    if (queue.length < 2) queue.push(d);
    if (!running) start();
  }

  function tick() {
    if (!running) return;
    if (queue.length) dir = queue.shift();
    const [dx, dy] = DIRS[dir];
    const head = { x: (snake[0].x + dx + N) % N, y: (snake[0].y + dy + N) % N };
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      onCrash?.();
      reset(true); // choque: la serpiente vuelve a empezar pero conserva el puntaje
    } else {
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        onEat?.(score);
        if (score >= goal) {
          won = true;
          stop();
          draw();
          onWin?.();
          return;
        }
        spawn();
      } else snake.pop();
      draw();
    }
    timer = setTimeout(tick, Math.max(70, 150 - score * 9));
  }

  function start() {
    if (running || won) return;
    running = true;
    timer = setTimeout(tick, 150);
  }

  function stop() {
    running = false;
    clearTimeout(timer);
  }

  function draw() {
    g.fillStyle = '#15162b';
    g.fillRect(0, 0, N * C, N * C);
    g.fillStyle = '#2c3a6e';
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) g.fillRect(x * C + 9, y * C + 9, 2, 2);

    // control de videojuegos
    const fx = food.x * C;
    const fy = food.y * C;
    g.fillStyle = '#f3e6c9';
    g.fillRect(fx + 2, fy + 5, 16, 9);
    g.fillRect(fx, fy + 8, 4, 8);
    g.fillRect(fx + 16, fy + 8, 4, 8);
    g.fillStyle = '#15162b';
    g.fillRect(fx + 4, fy + 8, 5, 2);
    g.fillRect(fx + 5, fy + 7, 3, 4);
    g.fillStyle = '#c23a2b';
    g.fillRect(fx + 13, fy + 8, 2, 2);
    g.fillStyle = '#e8832b';
    g.fillRect(fx + 15, fy + 10, 2, 2);

    // cuerpo
    for (let i = snake.length - 1; i > 0; i--) {
      g.fillStyle = i % 2 ? '#e8832b' : '#b9553a';
      g.fillRect(snake[i].x * C + 1, snake[i].y * C + 1, C - 2, C - 2);
    }
    // cabeza con gafas de sol
    const h = snake[0];
    g.fillStyle = '#f6a24a';
    g.fillRect(h.x * C, h.y * C, C, C);
    g.fillStyle = '#15162b';
    g.fillRect(h.x * C + 2, h.y * C + 6, 16, 5);
    g.fillStyle = '#f3e6c9';
    g.fillRect(h.x * C + 4, h.y * C + 7, 3, 1);
    g.fillRect(h.x * C + 11, h.y * C + 7, 3, 1);
    g.fillStyle = '#c23a2b';
    g.fillRect(h.x * C + 6, h.y * C + 14, 8, 2);
  }

  reset();
  return { turn, start, stop, reset: () => { won = false; stop(); reset(); }, get score() { return score; } };
}

/** Deslizar con el dedo sobre `el` para girar. */
export function onSwipe(el, cb) {
  let sx = 0;
  let sy = 0;
  el.addEventListener('touchstart', (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - sx;
    const dy = e.touches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
}
