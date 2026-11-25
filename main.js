const { app, BrowserWindow, ipcMain, dialog, Notification, protocol, shell } = require("electron");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

let ventanaPrincipal = null;
let ventanaTemporizador = null;
let ventanaJuegos = null;

let modoPopActual = "inicio";
let temporizadorEnEjecucion = false;
// Último tiempo conocido, para que la mini-ventana lo muestre apenas se abre
let ultimoEstadoTiempo = { texto: "--:--", modo: "estudio", largo: false };

// Opciones seguras compartidas por todas las ventanas
const preferenciasSeguras = {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true
};

function crearVentana() {
    ventanaPrincipal = new BrowserWindow({
        width: 1250,
        height: 900,
        minWidth: 800,
        minHeight: 650,
        title: "FOCUS - Modo Estudio",
        icon: path.join(__dirname, "build", "icon.png"),
        backgroundColor: "#C5B5FF",
        webPreferences: {
            ...preferenciasSeguras,
            // Evita que Chromium frene el temporizador al minimizar la ventana
            backgroundThrottling: false
        }
    });

    ventanaPrincipal.loadFile(path.join(__dirname, "index.html"));

    ventanaPrincipal.on("minimize", () => {
        if (modoPopActual === "minimizar" && temporizadorEnEjecucion) {
            crearVentanaTemporizador();
        }
    });

    ventanaPrincipal.on("restore", () => {
        if (modoPopActual === "minimizar") cerrarVentanaTemporizador();
    });

    ventanaPrincipal.on("focus", () => {
        if (ventanaPrincipal) ventanaPrincipal.flashFrame(false);
    });

    // Al cerrar la ventana principal se cierra toda la app (mini-ventana y juegos incluidos)
    ventanaPrincipal.on("closed", () => {
        ventanaPrincipal = null;
        detenerBloqueo();
        app.quit();
    });
}

function crearVentanaTemporizador() {
    if (ventanaTemporizador) {
        ventanaTemporizador.focus();
        return;
    }

    ventanaTemporizador = new BrowserWindow({
        width: 210,
        height: 95,
        resizable: false,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        webPreferences: preferenciasSeguras
    });

    ventanaTemporizador.setMenu(null);
    ventanaTemporizador.loadFile(path.join(__dirname, "temporizador.html"));

    ventanaTemporizador.webContents.on("did-finish-load", () => {
        if (ventanaTemporizador) {
            ventanaTemporizador.webContents.send("sincronizar-tiempo", ultimoEstadoTiempo);
        }
    });

    ventanaTemporizador.on("closed", () => {
        ventanaTemporizador = null;
    });
}

function cerrarVentanaTemporizador() {
    if (ventanaTemporizador) {
        ventanaTemporizador.close();
        ventanaTemporizador = null;
    }
}

function crearVentanaJuegos() {
    if (ventanaJuegos) {
        ventanaJuegos.focus();
        return;
    }

    ventanaJuegos = new BrowserWindow({
        width: 820,
        height: 800,
        minWidth: 700,
        minHeight: 650,
        title: "FOCUS - Sala de Juegos",
        backgroundColor: "#d4effc",
        resizable: true,
        webPreferences: preferenciasSeguras
    });

    ventanaJuegos.setMenu(null);
    ventanaJuegos.loadFile(path.join(__dirname, "juegos.html"));

    // Los enlaces (créditos de Freedoom) se abren en el navegador, no en una ventana de la app
    ventanaJuegos.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https://")) shell.openExternal(url);
        return { action: "deny" };
    });

    ventanaJuegos.on("closed", () => {
        ventanaJuegos = null;
    });
}

// =========================================
// BLOQUEADOR DE APLICACIONES (solo Windows)
// =========================================
// Solo se aceptan nombres de ejecutable simples: evita inyectar comandos
const EXE_VALIDO = /^[\w .()+\-]{1,100}\.exe$/i;
const EXE_PROPIO = path.basename(process.execPath).toLowerCase();
const INTERVALO_BLOQUEO_MS = 3000;

let appsABloquear = [];
let intervaloBloqueo = null;
let revisandoProcesos = false;

function revisarYCerrarApps() {
    if (revisandoProcesos || appsABloquear.length === 0) return;
    revisandoProcesos = true;

    // Una sola llamada a tasklist para ver qué procesos están abiertos
    execFile("tasklist", ["/FO", "CSV", "/NH"], { windowsHide: true, maxBuffer: 16 * 1024 * 1024 }, (error, salida) => {
        revisandoProcesos = false;
        if (error || !salida) return;

        const abiertos = new Set();
        salida.split(/\r?\n/).forEach((linea) => {
            const coincidencia = linea.match(/^"([^"]+)"/);
            if (coincidencia) abiertos.add(coincidencia[1].toLowerCase());
        });

        appsABloquear.forEach((exe) => {
            if (!abiertos.has(exe.toLowerCase())) return;
            execFile("taskkill", ["/F", "/T", "/IM", exe], { windowsHide: true }, (errorKill) => {
                if (!errorKill && ventanaPrincipal) {
                    ventanaPrincipal.webContents.send("app-bloqueada", exe);
                }
            });
        });
    });
}

function iniciarBloqueo(lista) {
    detenerBloqueo();
    if (process.platform !== "win32" || !Array.isArray(lista)) return;

    appsABloquear = [...new Set(
        lista
            .filter((exe) => typeof exe === "string" && EXE_VALIDO.test(exe.trim()))
            .map((exe) => exe.trim())
            .filter((exe) => exe.toLowerCase() !== EXE_PROPIO)
    )];
    if (appsABloquear.length === 0) return;

    revisarYCerrarApps(); // primera revisión inmediata, sin esperar
    intervaloBloqueo = setInterval(revisarYCerrarApps, INTERVALO_BLOQUEO_MS);
}

function detenerBloqueo() {
    if (intervaloBloqueo) clearInterval(intervaloBloqueo);
    intervaloBloqueo = null;
    appsABloquear = [];
}

// =========================================
// COMUNICACIONES IPC
// =========================================
ipcMain.on("abrir-pop-temporizador", () => crearVentanaTemporizador());
ipcMain.on("cerrar-pop-temporizador", () => cerrarVentanaTemporizador());

ipcMain.on("toggle-pop-temporizador", () => {
    if (ventanaTemporizador) cerrarVentanaTemporizador();
    else crearVentanaTemporizador();
});

ipcMain.on("actualizar-modo-pop", (_event, modo) => {
    if (["inicio", "boton", "minimizar"].includes(modo)) modoPopActual = modo;
});

ipcMain.on("estado-temporizador", (_event, corriendo) => {
    temporizadorEnEjecucion = Boolean(corriendo);
});

ipcMain.on("actualizar-tiempo", (_event, estado) => {
    if (!estado || typeof estado.texto !== "string") return;
    ultimoEstadoTiempo = estado;
    if (ventanaTemporizador) {
        ventanaTemporizador.webContents.send("sincronizar-tiempo", estado);
    }
});

ipcMain.on("abrir-ventana-juegos", () => crearVentanaJuegos());

ipcMain.on("cerrar-ventana-juegos", () => {
    if (ventanaJuegos) ventanaJuegos.close();
});

ipcMain.on("bloqueo-iniciar", (_event, lista) => iniciarBloqueo(lista));
ipcMain.on("bloqueo-detener", () => detenerBloqueo());

// Notificación del sistema cuando la app no está en primer plano
ipcMain.on("notificar", (_event, datos) => {
    if (!ventanaPrincipal || !datos) return;
    if (ventanaPrincipal.isFocused()) return;

    if (Notification.isSupported()) {
        const aviso = new Notification({
            title: String(datos.titulo || "FOCUS"),
            body: String(datos.cuerpo || "")
        });
        aviso.on("click", enfocarPrincipal);
        aviso.show();
    }
    ventanaPrincipal.flashFrame(true);
});

function enfocarPrincipal() {
    if (!ventanaPrincipal) return;
    if (ventanaPrincipal.isMinimized()) ventanaPrincipal.restore();
    ventanaPrincipal.show();
    ventanaPrincipal.focus();
}

ipcMain.on("enfocar-principal", enfocarPrincipal);

// Selección de archivo .exe y extracción de su icono
ipcMain.handle("seleccionar-archivo-exe", async () => {
    if (!ventanaPrincipal) return null;
    try {
        const resultado = await dialog.showOpenDialog(ventanaPrincipal, {
            title: "Seleccionar aplicación a bloquear",
            properties: ["openFile"],
            filters: [{ name: "Archivos Ejecutables (*.exe)", extensions: ["exe"] }]
        });

        if (resultado.canceled || !resultado.filePaths || resultado.filePaths.length === 0) {
            return null;
        }

        const rutaCompleta = resultado.filePaths[0];
        const nombreArchivo = path.basename(rutaCompleta);
        const nombreLimpio = nombreArchivo.replace(/\.exe$/i, "");
        let iconoBase64 = null;

        try {
            let nativeIcon = await app.getFileIcon(rutaCompleta, { size: "large" });
            if (!nativeIcon || nativeIcon.isEmpty()) {
                nativeIcon = await app.getFileIcon(rutaCompleta, { size: "normal" });
            }
            if (nativeIcon && !nativeIcon.isEmpty()) {
                const dataUrl = nativeIcon.toDataURL();
                if (dataUrl && dataUrl.length > 60) iconoBase64 = dataUrl;
            }
        } catch (errIcono) {
            console.warn("No se pudo extraer el icono:", errIcono.message);
        }

        return {
            archivo: nombreArchivo,
            nombre: nombreLimpio,
            icono: iconoBase64
        };
    } catch (e) {
        console.error("Error al abrir diálogo de archivos:", e);
        return null;
    }
});

// =========================================
// DOOM (Freedoom) — protocolo propio para servir la carpeta doom/
// =========================================
// El motor WebAssembly necesita fetch() y módulos ES, que no funcionan con file://.
// focus-doom:// solo puede leer archivos dentro de doom/.
const CARPETA_DOOM = path.join(__dirname, "doom");
const TIPOS_MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".wasm": "application/wasm",
    ".data": "application/octet-stream",
    ".css": "text/css; charset=utf-8",
    ".md": "text/plain; charset=utf-8",
    ".txt": "text/plain; charset=utf-8"
};

protocol.registerSchemesAsPrivileged([
    { scheme: "focus-doom", privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
]);

function registrarProtocoloDoom() {
    protocol.handle("focus-doom", async (request) => {
        try {
            const { pathname } = new URL(request.url);
            const ruta = path.normalize(path.join(CARPETA_DOOM, decodeURIComponent(pathname)));
            // Bloquea rutas que intenten salir de doom/ (ej: ../../main.js)
            if (ruta !== CARPETA_DOOM && !ruta.startsWith(CARPETA_DOOM + path.sep)) {
                return new Response("Prohibido", { status: 403 });
            }
            const datos = await fs.promises.readFile(ruta);
            const tipo = TIPOS_MIME[path.extname(ruta).toLowerCase()] || "application/octet-stream";
            return new Response(datos, { headers: { "content-type": tipo } });
        } catch (e) {
            return new Response("No encontrado", { status: 404 });
        }
    });
}

// Necesario para que Windows muestre las notificaciones de la app
if (process.platform === "win32") app.setAppUserModelId("com.focus.pomodoro");

app.whenReady().then(() => {
    registrarProtocoloDoom();
    crearVentana();
});

app.on("window-all-closed", () => {
    detenerBloqueo();
    if (process.platform !== "darwin") app.quit();
});
