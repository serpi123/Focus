// Importamos las herramientas necesarias de Electron.
const { app, BrowserWindow } = require("electron");

const path = require("path");


// Función que crea la ventana de FOCUS.
function crearVentana() {

    const ventana = new BrowserWindow({

        width: 1250,
        height: 900,

        minWidth: 800,
        minHeight: 650,

        title: "FOCUS - Modo Estudio",

        backgroundColor: "#C5B5FF",

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }

    });

    // Carga nuestra interfaz HTML.
    ventana.loadFile(path.join(__dirname, "index.html"));

}


// Espera a que Electron esté listo.
app.whenReady().then(() => {

    crearVentana();

});


// Cierra la aplicación cuando se cierran todas las ventanas,
// excepto en macOS.
app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});