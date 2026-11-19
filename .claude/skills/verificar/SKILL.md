---
name: verificar
description: Verificación de larvabirthday (build y prueba del recorrido completo de la invitación). Úsala antes de dar por terminada cualquier tarea y antes de commitear.
---

# Verificar

## 1. Build (~1 s)

```bash
npm run build
```

Debe terminar en `Complete!` con 1 página.

## 2. Recorrido completo

No hay tests: la invitación se prueba jugándola. Con `npm run dev` (o `npm run preview` para el build real):
- Pasar los 5 niveles de principio a fin, en emulación táctil de móvil (360 px de ancho) y en escritorio.
- El sonido arranca en el primer toque y el botón ♪ lo apaga y enciende.
- El botón atrás (el de la página y el del navegador) vuelve al nivel anterior.
- El Snake se puede ganar con gestos táctiles y con teclado.
- Con `prefers-reduced-motion` activo todo sigue siendo usable.

Si se tocó audio, avisa al usuario de que lo pruebe en un iPhone real: la emulación no reproduce las
restricciones de audio de iOS.

## Al terminar

Reporta qué se probó y qué no. Nunca reportes verde parcial.
