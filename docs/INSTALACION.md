# Guía de instalación de FOCUS

Esta guía tiene dos partes:

1. **[Instalar FOCUS para usarlo](#1-instalar-focus-para-usarlo):** para cualquier persona que quiera usar la app.
2. **[Instalar el proyecto para programar](#2-instalar-el-proyecto-para-programar):** para el equipo de desarrollo.

---

## 1. Instalar FOCUS para usarlo

### Requisitos

| | |
| --- | --- |
| Sistema operativo | Windows 10 u 11 de 64 bits |
| Espacio en disco | unos 400 MB |
| Conexión a internet | solo para descargar el instalador (la app funciona sin internet) |

No hace falta instalar Node.js ni nada más: el instalador trae todo lo necesario.

### Pasos

1. **Descarga el instalador** `FOCUS-Setup-1.0.0.exe` desde la sección **Releases** del repositorio
   en GitHub (o del lugar donde te lo hayan compartido).
2. **Ábrelo con doble clic.**
3. **Si aparece "Windows protegió su PC"** (SmartScreen), haz clic en **Más información** y luego en
   **Ejecutar de todas formas**. Este aviso aparece porque el instalador no tiene una firma digital
   paga; no significa que tenga un virus.
4. **Elige dónde instalarlo.** La carpeta que propone el instalador está bien para la mayoría de
   las personas. Pulsa **Instalar**.
5. Al terminar, deja marcada la opción **Ejecutar FOCUS** y pulsa **Terminar**.

Se crean dos accesos directos llamados **FOCUS**: uno en el escritorio y otro en el menú Inicio.

> No hace falta ser administrador: FOCUS se instala solo para tu usuario de Windows.

### Primer uso

Al abrir FOCUS por primera vez puedes **crear una cuenta** o **entrar como invitado**.
El [manual de usuario](MANUAL_DE_USUARIO.md) explica todas las funciones.

> **Importante sobre el bloqueador de apps:** durante el estudio, FOCUS cierra las aplicaciones
> que elijas **sin guardar** lo que tengan abierto. Antes de empezar, guarda tu trabajo en esas apps.

### Actualizar a una versión nueva

Descarga el instalador nuevo y ejecútalo. Se instala encima de la versión anterior y
**se conservan** tus cuentas, objetivos, historial y ajustes.

### Desinstalar

1. Abre **Configuración → Aplicaciones → Aplicaciones instaladas**.
2. Busca **FOCUS**, pulsa **⋯** y luego **Desinstalar**.

La desinstalación no borra tus datos, por si vuelves a instalar la app. Para borrarlos también,
elimina la carpeta `%APPDATA%\FOCUS`: escribe esa ruta en la barra de direcciones del Explorador
de archivos.

### Dónde se guardan los datos

Todo se guarda **solo en tu computadora**, en `%APPDATA%\FOCUS`: cuentas, objetivos, historial,
apps bloqueadas y ajustes. FOCUS no envía datos a internet.

### Problemas frecuentes

| Problema | Solución |
| --- | --- |
| No aparecen las notificaciones de Windows | Revisa en **Configuración → Sistema → Notificaciones** que FOCUS tenga permiso y que el modo **No molestar** esté apagado. |
| El bloqueador no cierra una app | Fíjate en que el nombre del `.exe` sea el correcto (puedes usar **Examinar .exe**), que la app esté activada en la lista y que el interruptor general del bloqueador esté encendido. Solo bloquea durante el **estudio**, no en el descanso. |
| El antivirus bloquea el instalador | Pasa a veces con instaladores sin firma digital. Si lo descargaste del repositorio oficial, puedes permitirlo en el antivirus. |
| Freedoom no tiene sonido | Haz clic dentro del juego y revisa que el volumen de Windows no esté silenciado. |

---

## 2. Instalar el proyecto para programar

### Requisitos

- [Node.js](https://nodejs.org/) 20 o superior (incluye npm).
- [Git](https://git-scm.com/).
- Windows 10 u 11 para generar el instalador y probar el bloqueador.

### Descargar y ejecutar

```bash
git clone https://github.com/serpi123/Focus.git
cd Focus
npm install
npm start
```

`npm install` descarga Electron y electron-builder en `node_modules/`. Esa carpeta no se sube a
GitHub, así que cada persona del equipo tiene que ejecutar `npm install` una vez.

### Comandos

| Comando | Qué hace |
| --- | --- |
| `npm start` | Abre la app en modo desarrollo. |
| `npm run dist` | Genera el instalador `dist/FOCUS-Setup-<versión>.exe`. |
| `npm run pack` | Genera la app sin instalador en `dist/win-unpacked/` (sirve para probar rápido). |
| `npm run temas` | Regenera `temas-pokemon.css`. Hay que ejecutarlo después de cambiar colores en `styles.css`. |

### Publicar una versión nueva

1. Actualiza `version` en `package.json` (por ejemplo, de `1.0.0` a `1.1.0`).
2. Anota los cambios en `CHANGELOG.md`.
3. Ejecuta `npm run dist`.
4. En GitHub, crea un **Release** nuevo con la versión como etiqueta (por ejemplo, `v1.1.0`) y
   adjunta `dist/FOCUS-Setup-1.1.0.exe`.

La carpeta `dist/` está en `.gitignore`: el instalador se publica en Releases, no dentro del repositorio.

### Estructura del proyecto

| Archivo o carpeta | Qué contiene |
| --- | --- |
| `main.js` | Proceso principal: ventanas, bloqueador de apps, notificaciones y protocolo de Freedoom. |
| `preload.js` | Puente seguro entre la interfaz y el proceso principal. |
| `index.html`, `script.js`, `styles.css` | Interfaz principal. |
| `temas-pokemon.css` | Paletas del set alternativo de Pokémon (archivo generado). |
| `temporizador.html`, `temporizador.js` | Ventana flotante. |
| `juegos.html`, `juegos.js` | Sala de minijuegos. |
| `doom/` | Freedoom: motor, datos y licencias (ver [doom/README.md](../doom/README.md)). |
| `assets/` | GIFs de los Pokémon. |
| `build/icon.png` | Ícono de la app y del instalador. |
| `scripts/generar-temas.js` | Generador de paletas. |
| `docs/` | Manual de usuario y esta guía. |
