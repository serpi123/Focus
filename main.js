const { app, BrowserWindow, ipcMain } = require("electron");
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
        width: 700,
        height: 650,
        title: "FOCUS - Sala de Juegos",
        backgroundColor: "#d4effc",
        resizable: false,
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

app.whenReady().then(crearVentana);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});