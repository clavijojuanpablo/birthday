# Larva Birthday — invitación interactiva

Invitación de cumpleaños como mini-juego de una sola página, para "Larva". Proyecto personal y puntual, en español.
`noindex`: no debe aparecer en buscadores. Familia **sitio estático Astro** (ver `C:\Proyectos\CLAUDE.md`).

El recorrido tiene 5 niveles, uno por `<section class="stage">` en `src/pages/index.astro`:

| # | Slug (`#hash`) | Qué pasa |
|---|---|---|
| 1 | `acceso` | "Hay algo preparado para ti…": arranca la música con el primer toque |
| 2 | `jugador` | Elegir al cumpleañero entre cuatro personajes (`Characters.ts`) |
| 3 | `hambre` | Mini Snake: Larva come controles de videojuego (`snake.js`, se carga al llegar) |
| 4 | `plan` | Revela la fecha y el plan |
| 5 | `final` | Póster final descargable/visible a pantalla completa (`#poster`) |

## Stack

- **Astro 5** estático, una sola página. JS nativo en `src/scripts/` (sin framework).
- **Audio sintetizado con Web Audio** (`audio.js`): sin archivos de sonido. El navegador solo permite audio tras un
  gesto del usuario; el desbloqueo escucha `click` y `touchend` (arreglo para móviles en el último commit).
- Personajes y decoración como **SVG inline** (estilo papel recortado). Fuentes propias en `public/fonts/`.
- Repo: `clavijojuanpablo/birthday`. Hosting: no documentado (ver `docs/STATUS.md`).

## Comandos

```bash
npm run dev       # http://localhost:4321
npm run build     # dist/ — debe pasar antes de cerrar una tarea
npm run preview   # sirve dist/
```

## Estructura

```
src/
  pages/index.astro     toda la invitación: los 5 niveles en orden
  components/           Characters.ts (SVG de personajes) · Landscape · Ransom (letras de recorte) · Marquee · Deco
  scripts/main.js       navegación entre niveles (history + #hash, botón atrás), sonido, póster
  scripts/audio.js      música y efectos sintetizados
  scripts/snake.js      el juego del nivel 3
  styles/global.css     tokens (:root) y todos los estilos
public/                 fuentes y el póster (larva-birthday-poster.png)
```

## Convenciones

- **Colores y fuentes por variable** de `:root` en `global.css` (`--ink`, `--orange`, `--f-display`…). Nada de hex sueltos.
- **Un nivel nuevo** = `<section class="stage" data-stage="N">` en `index.astro` + su slug en `SLUGS` de `main.js` +
  su paso en `steps` (barra de progreso). Los tres deben coincidir en orden.
- Respetar `prefers-reduced-motion` (ya lo lee `main.js` en `reduce`). Todo nivel debe poder pasarse en móvil con el dedo.
- Lo que solo usa un nivel se carga al llegar a él (como `snake.js`).
- El póster: si se reemplaza, mismo nombre de archivo; el build lee sus dimensiones del PNG para evitar saltos.

## Definición de terminado

- `npm run build` en verde.
- Probado el recorrido completo en un móvil real o en emulación táctil, con sonido (el audio en iOS es lo que más falla).
- `docs/STATUS.md` actualizado.

## Docs

- **`docs/STATUS.md` — empieza aquí.** · `docs/DECISIONS.md` — decisiones con fecha y por qué.

## Kit `.claude/`

- Skills: `verificar` (build + prueba del recorrido), `cerrar-sesion`.
- Hooks: inyectar `docs/STATUS.md` + git al iniciar; bloquear escritura en `.env`; avisar si cambió código y no STATUS.md.
