# Registro de cambios

Todos los cambios importantes de FOCUS se anotan en este archivo.

## [1.0.0] — 2026-11-24

Primera versión instalable. Incluye una revisión completa del código: corrección de errores,
mejoras de seguridad, nuevas funciones del método Pomodoro, temas, Freedoom y un instalador para Windows.

### Agregado

- **Instalador para Windows** (`FOCUS-Setup-1.0.0.exe`), hecho con electron-builder. Deja elegir
  la carpeta de instalación, crea accesos directos en el escritorio y en el menú Inicio, y se
  desinstala desde "Aplicaciones instaladas". Comandos nuevos: `npm run dist` (instalador) y
  `npm run pack` (versión sin instalar).
- **Ícono propio** de la aplicación: un tomate con reloj (`build/icon.png`).
- **Descanso largo:** después de una cantidad configurable de pomodoros (4 por defecto) el
  descanso es más largo (20 min por defecto). Debajo del reloj se ve el progreso del ciclo
  ("🍅 Pomodoro 2 de 4").
- **Estudio automático tras el descanso:** interruptor opcional para que el siguiente bloque de
  estudio empiece solo.
- **Botones rápidos** 25/5, 50/10 y 90/15 que también ajustan el descanso largo (15, 20 y 30 min).
- **Notificaciones de Windows:** cuando termina un bloque y la app no está a la vista, aparece una
  notificación del sistema y el ícono parpadea en la barra de tareas.
- **Aviso del bloqueador:** cada vez que se cierra una app bloqueada aparece un aviso en pantalla.
- **Cambiar de Pokémon:** botón arriba a la izquierda que alterna entre dos sets, cada uno con su
  paleta de colores:
  - Clásico: Bulbasaur (principal), Gengar (estudio) y Snorlax (descanso).
  - Alternativo: Clefairy (rosa), Mewtwo (lila) y Pikachu (amarillo).
  - La elección se recuerda por usuario.
- **Generador de paletas** (`npm run temas`): crea `temas-pokemon.css` a partir de `styles.css`.
- **Freedoom** en la sala de juegos: Doom clásico con contenido libre (Freedoom Phase 2), motor
  Chocolate Doom en WebAssembly, con sonido y música. Solo se carga mientras su pestaña está abierta.
- **Ventana flotante mejorada:** indica si es estudio, descanso o descanso largo, se atenúa en pausa,
  muestra el tiempo apenas se abre y tiene un botón ↗ para volver a la app.
- **Tres en Raya:** la máquina ahora gana si puede y bloquea tus jugadas.
- **Buscaminas:** el primer clic nunca es una mina.
- **Documentación:** manual de usuario y guía de instalación (en Markdown y en Word), este registro
  de cambios y un README en Markdown (antes era `IMPORTANTE.txt`). Los Word se regeneran con
  `npm run word`.

### Corregido

- **El temporizador se atrasaba** con la ventana minimizada. Ahora se calcula con la hora real de
  fin del bloque.
- **La app quedaba abierta** al cerrar la ventana principal si la ventana flotante o la de juegos
  seguían abiertas.
- **La app fallaba la primera vez que se abría** (sin datos guardados) por usar variables antes
  de declararlas.
- **Historial:**
  - Las pausas ya no suman tiempo de estudio.
  - Ahora se guarda también el descanso que empieza solo.
  - Si se cierra la app a mitad de una sesión, queda registrada como interrumpida.
  - Una sesión nunca registra más tiempo del planificado (antes, si la PC se suspendía, se contaba
    todo el tiempo dormido).
  - Las sesiones de pocos segundos ya no aparecen como "1 min".
  - La racha de días no se corta si hoy todavía no estudiaste.
- **Abrir el historial reiniciaba el temporizador.** Ahora el tiempo sigue corriendo.
- **Todos los usuarios compartían los mismos datos.** Ahora cada usuario tiene sus objetivos,
  historial, apps bloqueadas y ajustes. Los datos de la versión anterior pasan al primer usuario
  que inicia sesión.
- **Los tiempos configurados se perdían** al cerrar la app. Ahora se guardan.
- **Snake:**
  - La comida a veces aparecía fuera del tablero.
  - Podía aparecer encima de la serpiente.
  - Pulsar dos flechas rápido permitía dar media vuelta.
  - Las flechas movían la página.
- **Tres en Raya:** se podían poner dos X seguidas mientras la máquina "pensaba".
- **Buscaminas:** se reescribió el cálculo de casillas vecinas en los bordes.
- **Pantallas de estudio y descanso:** el cuadro del Pokémon quedaba pegado al panel de objetivos
  y corrido hacia un costado. Ahora la columna queda centrada bajo el título.
- **Historial:** la barra de usuario tapaba el botón "Cerrar".
- **Sonido de aviso:** cada aviso creaba un sonido nuevo sin liberarlo y podía dejar de sonar.

### Seguridad

- **Ventanas aisladas** (`contextIsolation`, sin `nodeIntegration`, con `sandbox`). La interfaz
  solo se comunica con el proceso principal por una lista cerrada de canales (`preload.js`).
- **El bloqueador de apps** pasó al proceso principal, usa `execFile` sin shell y solo acepta
  nombres de `.exe` válidos. Antes se podían ejecutar comandos escribiendo un nombre de app
  malicioso.
- **Contraseñas guardadas con hash** (PBKDF2 con sal) en lugar de texto plano. Las cuentas
  anteriores se convierten solas al iniciar sesión. Ahora la contraseña debe tener al menos
  6 caracteres.
- **Errores de login:** el mensaje ya no revela si una cuenta existe.
- **Política de contenido (CSP) más estricta** y sin JavaScript en línea en las páginas.
- **Freedoom se sirve con un protocolo propio** (`focus-doom://`) que solo puede leer la carpeta
  `doom/`.
- **Los enlaces externos** se abren en el navegador, no dentro de la app.

### Cambiado

- **Lista inicial del bloqueador:** solo Discord y Steam. Google Chrome se quitó porque suele hacer
  falta para estudiar.
- **Los minijuegos** se cierran solos al empezar un bloque de estudio.
- **Ventana flotante y juegos:** los archivos de JavaScript ahora están separados del HTML
  (`temporizador.js`, `juegos.js`).

### Eliminado

- `package (2).json`, que estaba vacío.
- `assets/ghastly pokemon STICKER.gif`, que no se usaba.
- `IMPORTANTE.txt`, reemplazado por `README.md` y `docs/INSTALACION.md`.
