---
name: cerrar-sesion
description: Cierra una sesión de trabajo en larvabirthday: verifica, actualiza docs/STATUS.md y DECISIONS y commitea. Úsala al terminar un bloque de trabajo.
---

# Cerrar sesión

1. **Verificar:** corre `/verificar`. Con rojo no se commitea.
2. **`docs/STATUS.md`:** "Ahora mismo", "Próximos pasos" (el primero accionable), deudas y fecha de la cabecera.
   Si se decidió algo, entrada nueva en `docs/DECISIONS.md`.
3. **Commitear:** revisa `git status` (sin `dist/` ni `.env`). Mensaje en español, una frase con el efecto
   (como el historial: "Arreglar desbloqueo de audio en móviles"). Pregunta antes de hacer `git push`.
