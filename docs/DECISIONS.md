# Decisiones de Larva Birthday

Reconstruidas a partir del código el 2026-11-19. Entradas nuevas: fecha, qué y por qué.

## D-001 · Una sola página con niveles y #hash (2026-10)
Toda la invitación vive en `index.astro`; cada nivel es una sección y la navegación usa `history.pushState` con un
slug por nivel, así el botón atrás del teléfono funciona sin recargar.

## D-002 · Audio sintetizado, sin archivos (2026-10)
Web Audio genera música y efectos: cero descargas extra. Arranca con el primer gesto porque los navegadores
bloquean el audio automático; en móviles hay que escuchar `click` y `touchend` (arreglado el 2026-10-19).

## D-003 · Ilustraciones como SVG inline (2026-10)
Personajes y decoración en SVG dentro del HTML: nítidos en cualquier pantalla y sin peticiones de imágenes,
salvo el póster final.
