const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

let ventanaPrincipal = null;
let ventanaTemporizador = null;
let ventanaJuegos = null; // 1. NUEVO: Variable para la ventana de juegos

let modoPopActual = "inicio";
let temporizadorEnEjecucion = false;

function crearVentana() {
    ventanaPrincipal = new BrowserWindow({
        width: 1250,
        height: 900,
        minWidth: 800,
        minHeight: 650,
        title: "FOCUS - Modo Estudio",
        backgroundColor: "#C5B5FF",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    ventanaPrincipal.loadFile(path.join(__dirname, "index.html"));

    // Detectar cuando la ventana principal se minimiza
    ventanaPrincipal.on("minimize", () => {
        if (modoPopActual === "minimizar" && temporizadorEnEjecucion) {
            crearVentanaTemporizador();
        }
    });

    // Detectar cuando la ventana principal vuelve a restaurarse
    ventanaPrincipal.on("restore", () => {
        if (modoPopActual === "minimizar" && ventanaTemporizador) {
            ventanaTemporizador.close();
            ventanaTemporizador = null;
        }
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
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    ventanaTemporizador.setMenu(null);
    ventanaTemporizador.loadFile(path.join(__dirname, "temporizador.html"));

    ventanaTemporizador.on("closed", () => {
        ventanaTemporizador = null;
    });
}

// 2. NUEVO: Función para crear y mostrar la sala de juegos
function crearVentanaJuegos() {
    if (ventanaJuegos) {
        ventanaJuegos.focus(); // Si ya está abierta, la trae al frente
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
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    ventanaJuegos.setMenu(null);
    ventanaJuegos.loadFile(path.join(__dirname, "juegos.html"));

    ventanaJuegos.on("closed", () => {
        ventanaJuegos = null;
    });
}

// Comunicaciones IPC
ipcMain.on("abrir-pop-temporizador", () => {
    crearVentanaTemporizador();
});

ipcMain.on("cerrar-pop-temporizador", () => {
    if (ventanaTemporizador) {
        ventanaTemporizador.close();
        ventanaTemporizador = null;
    }
});

ipcMain.on("actualizar-modo-pop", (event, modo) => {
    modoPopActual = modo;
});

ipcMain.on("estado-temporizador", (event, corriendo) => {
    temporizadorEnEjecucion = corriendo;
});

ipcMain.on("actualizar-tiempo", (event, tiempoTexto) => {
    if (ventanaTemporizador) {
        ventanaTemporizador.webContents.send("sincronizar-tiempo", tiempoTexto);
    }
});

ipcMain.on("toggle-pop-temporizador", () => {
    if (ventanaTemporizador) {
        ventanaTemporizador.close();
        ventanaTemporizador = null;
    } else {
        crearVentanaTemporizador();
    }
});

// 3. NUEVO: Escuchador para el botón de "Minijuego"
ipcMain.on("abrir-ventana-juegos", () => {
    crearVentanaJuegos();
});

// 4. NUEVO: Selección de archivo .exe y extracción de su icono
ipcMain.handle("seleccionar-archivo-exe", async () => {
    if (!ventanaPrincipal) return null;
    try {
        const resultado = await dialog.showOpenDialog(ventanaPrincipal, {
            title: "Seleccionar aplicación a bloquear",
            properties: ["openFile"],
            filters: [
                { name: "Archivos Ejecutables (*.exe)", extensions: ["exe"] },
                { name: "Todos los archivos (*.*)", extensions: ["*"] }
            ]
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
                if (dataUrl && dataUrl.length > 60) {
                    iconoBase64 = dataUrl;
                }
            }
        } catch (errIcono) {
            console.warn("No se pudo extraer el icono:", errIcono.message);
        }

        return {
            ruta: rutaCompleta,
            archivo: nombreArchivo,
            nombre: nombreLimpio,
            icono: iconoBase64
        };
    } catch (e) {
        console.error("Error al abrir diálogo de archivos:", e);
        return null;
    }
});

ipcMain.handle("obtener-icono-exe", async (event, ruta) => {
    try {
        const nativeIcon = await app.getFileIcon(ruta, { size: "normal" });
        return nativeIcon ? nativeIcon.toDataURL() : null;
    } catch (e) {
        return null;
    }
});

app.whenReady().then(crearVentana);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});