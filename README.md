# FOCUS – Temporizador Pomodoro

Aplicación de escritorio (Electron) para estudiar con el método Pomodoro: alterna bloques de
estudio y descanso, bloquea las aplicaciones que distraen y guarda el historial de sesiones.

## Instalación

**Para usar la app:** descarga `FOCUS-Setup-1.0.0.exe` desde **Releases**, ábrelo y sigue los pasos.
No hace falta instalar nada más.

**Para programar:**

```bash
git clone https://github.com/serpi123/Focus.git
cd Focus
npm install
npm start
```

Para generar el instalador: `npm run dist` (queda en `dist/`).

## Documentación

- [Guía de instalación](docs/INSTALACION.md) (también en Word: [INSTALACION.docx](docs/INSTALACION.docx)):
  para quien la usa y para el equipo de desarrollo.
- [Manual de usuario](docs/MANUAL_DE_USUARIO.md) (también en Word: [MANUAL_DE_USUARIO.docx](docs/MANUAL_DE_USUARIO.docx)):
  todas las funciones, con capturas.
- [Registro de cambios](CHANGELOG.md).

Los Word se generan a partir de los `.md` con `npm run word`.

## Funciones

- **Pomodoro configurable:** tiempo de estudio, descanso corto, descanso largo y cantidad de
  pomodoros por ciclo (por defecto, descanso largo cada 4). Opción para empezar el estudio
  automáticamente al terminar el descanso.
- **Bloqueador de apps:** durante el estudio cierra las aplicaciones elegidas (Discord, Steam,
  juegos, etc.). Se puede escribir el nombre del `.exe` o buscarlo en el equipo.
- **Ventana flotante:** mini temporizador siempre visible (al empezar, manual o al minimizar).
- **Objetivos:** lista de tareas para la sesión.
- **Historial:** sesiones completadas o interrumpidas, racha de días y minutos estudiados.
- **Minijuegos:** Snake, Tres en Raya, Buscaminas y **Freedoom** (Doom clásico con contenido
  libre), disponibles durante el descanso. La sala de juegos se cierra sola al empezar a estudiar.
  Freedoom usa el motor Chocolate Doom (GPL-2.0); detalles y licencias en [doom/README.md](doom/README.md).
- **Cambiar Pokémon:** el botón de arriba a la izquierda alterna entre dos sets, cada uno con
  su paleta de colores. Clásico: Bulbasaur / Gengar / Snorlax. Alternativo: Clefairy / Mewtwo /
  Pikachu. Las imágenes del set alternativo van en `assets/clefairy.gif`, `assets/mewtwo.gif` y
  `assets/pikachu-durmiendo.gif`. Los colores alternativos están en `temas-pokemon.css`, que se genera
  con `npm run temas` (hay que volver a ejecutarlo si se cambian colores en `styles.css`).
- **Cuentas locales:** cada usuario tiene sus propios datos. Las contraseñas se guardan con hash
  (PBKDF2), nunca en texto plano.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `main.js` | Proceso principal: ventanas, bloqueador de apps, notificaciones |
| `preload.js` | Puente seguro entre la interfaz y el proceso principal |
| `index.html`, `script.js`, `styles.css` | Interfaz principal |
| `temporizador.html`, `temporizador.js` | Mini-ventana flotante |
| `juegos.html`, `juegos.js` | Sala de minijuegos |
