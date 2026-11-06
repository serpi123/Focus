const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let ventanaPrincipal = null;
let ventanaTemporizador = null;

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

app.whenReady().then(crearVentana);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("toggle-pop-temporizador", () => {
    if (ventanaTemporizador) {
        ventanaTemporizador.close();
        ventanaTemporizador = null;
    } else {
        crearVentanaTemporizador();
    }
});