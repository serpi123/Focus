// =========================================
// PRELOAD: puente seguro entre la interfaz y el proceso principal
// =========================================
// La interfaz ya no tiene acceso directo a Node.js (nodeIntegration: false).
// Solo puede usar los canales de esta lista blanca a través de window.focusAPI.
const { contextBridge, ipcRenderer } = require("electron");

const CANALES_ENVIO = [
    "abrir-pop-temporizador",
    "cerrar-pop-temporizador",
    "toggle-pop-temporizador",
    "actualizar-modo-pop",
    "estado-temporizador",
    "actualizar-tiempo",
    "abrir-ventana-juegos",
    "cerrar-ventana-juegos",
    "bloqueo-iniciar",
    "bloqueo-detener",
    "notificar",
    "enfocar-principal"
];

const CANALES_INVOCAR = ["seleccionar-archivo-exe"];

const CANALES_ESCUCHA = ["sincronizar-tiempo", "app-bloqueada"];

contextBridge.exposeInMainWorld("focusAPI", {
    plataforma: process.platform,
    send(canal, datos) {
        if (CANALES_ENVIO.includes(canal)) ipcRenderer.send(canal, datos);
    },
    invoke(canal, datos) {
        if (CANALES_INVOCAR.includes(canal)) return ipcRenderer.invoke(canal, datos);
        return Promise.reject(new Error(`Canal no permitido: ${canal}`));
    },
    on(canal, callback) {
        if (!CANALES_ESCUCHA.includes(canal)) return;
        ipcRenderer.on(canal, (_evento, ...args) => callback(...args));
    }
});
