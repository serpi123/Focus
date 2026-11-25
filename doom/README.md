# Freedoom en FOCUS

Esta carpeta contiene el juego que aparece en la pestaña **Freedoom** de la sala de juegos.

| Archivo | Qué es |
| --- | --- |
| `index.html`, `doom.js` | Página y arranque del juego (código de FOCUS) |
| `motor/chocolate-doom.js`, `motor/chocolate-doom.wasm` | Motor Chocolate Doom 3.1.1 compilado a WebAssembly con Emscripten |
| `motor/chocolate-doom.data` | `freedoom2.wad` (Freedoom Phase 2, versión 0.13.0) empaquetado para el motor |
| `licencias/` | Licencias y créditos de todos los componentes |

## Origen

Los archivos de `motor/` y `licencias/` vienen sin modificar del proyecto
[pedrohf-dev/doom-in-a-tab](https://github.com/pedrohf-dev/doom-in-a-tab)
(`vendor/doom-wasm/web/public/engine` y `vendor/doom-wasm/licenses`).

## Licencias

- **Chocolate Doom**: GPL-2.0-or-later (`licencias/CHOCOLATE-DOOM-GPL-2.0.md`).
  El código fuente está en [chocolate-doom/chocolate-doom](https://github.com/chocolate-doom/chocolate-doom),
  y el código exacto de esta compilación, junto con las instrucciones para compilarla, en
  [pedrohf-dev/doom-in-a-tab](https://github.com/pedrohf-dev/doom-in-a-tab).
- **Freedoom**: licencia tipo BSD (`licencias/FREEDOOM-COPYING.txt`, créditos en `licencias/CREDITS*.txt`).
- **Emscripten, SDL2 y SDL2_mixer**: ver los archivos correspondientes en `licencias/`.

Si se distribuye la aplicación con esta carpeta, hay que respetar la GPL del motor:
incluir estas licencias y ofrecer el código fuente correspondiente.

## Cómo se carga

Electron no permite `fetch()` ni módulos ES sobre `file://`, así que `main.js` registra el
protocolo `focus-doom://`. Ese protocolo solo puede leer archivos dentro de esta carpeta.
La sala de juegos abre `focus-doom://juego/index.html` en un iframe al entrar en la pestaña
y lo elimina al salir de ella, lo que libera la memoria y corta el sonido.
