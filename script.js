// =========================================
// INTEGRACIÓN CON ELECTRON (IPC Y PROCESOS)
// =========================================
let ipcRenderer = null;
let exec = null;
try {
    const electron = require("electron");
    ipcRenderer = electron.ipcRenderer;
    exec = require("child_process").exec;
} catch (e) {
    console.warn("Ejecutando fuera del entorno de Electron.");
}

document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // ELEMENTOS DEL DOM
    // =========================================
    const barraSuperior = document.getElementById("barraSuperior");
    const nombreUsuarioActivo = document.getElementById("nombreUsuarioActivo");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    // Autenticación
    const pantallaAuth = document.getElementById("pantalla-auth");
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const formLogin = document.getElementById("formLogin");
    const formRegister = document.getElementById("formRegister");
    const loginUsuario = document.getElementById("loginUsuario");
    const loginPassword = document.getElementById("loginPassword");
    const errorLogin = document.getElementById("errorLogin");
    const exitoLogin = document.getElementById("exitoLogin");
    const regNombre = document.getElementById("regNombre");
    const regEmail = document.getElementById("regEmail");
    const regPassword = document.getElementById("regPassword");
    const errorRegister = document.getElementById("errorRegister");
    const exitoRegister = document.getElementById("exitoRegister");
    const btnInvitado = document.getElementById("btnInvitado");

    // Principal (Bulbasaur)
    const pantallaPrincipal = document.getElementById("pantalla-principal");
    const btnMenosEstudio = document.getElementById("btnMenosEstudio");
    const btnMasEstudio = document.getElementById("btnMasEstudio");
    const displayMinutosEstudio = document.getElementById("displayMinutosEstudio");

    const btnMenosDescanso = document.getElementById("btnMenosDescanso");
    const btnMasDescanso = document.getElementById("btnMasDescanso");
    const displayMinutosDescanso = document.getElementById("displayMinutosDescanso");

    const selectModoPop = document.getElementById("selectModoPop");
    
    // Bloqueador Interactivo de Aplicaciones (Al costado del Bulbasaur)
    const panelBloqueadorApps = document.getElementById("panelBloqueadorApps");
    const switchMasterBloqueo = document.getElementById("switchMasterBloqueo");
    const badgeContadorApps = document.getElementById("badgeContadorApps");
    const carruselSugerenciasApps = document.getElementById("carruselSugerenciasApps");
    const inputNombreAppPersonalizada = document.getElementById("inputNombreAppPersonalizada");
    const btnAgregarAppManual = document.getElementById("btnAgregarAppManual");
    const btnExaminarExe = document.getElementById("btnExaminarExe");
    const inputArchivoExeFallback = document.getElementById("inputArchivoExeFallback");
    const btnActivarTodasApps = document.getElementById("btnActivarTodasApps");
    const btnLimpiarTodasApps = document.getElementById("btnLimpiarTodasApps");
    const contenedorListaApps = document.getElementById("contenedorListaApps");

    const btnPreset25 = document.getElementById("btnPreset25");
    const btnPreset50 = document.getElementById("btnPreset50");
    const btnPreset90 = document.getElementById("btnPreset90");

    const btnIrEstudioDesdeBulbasaur = document.getElementById("btnIrEstudioDesdeBulbasaur");
    const btnIrDescansoDesdeBulbasaur = document.getElementById("btnIrDescansoDesdeBulbasaur");

    // Estudio (Gengar)
    const pantallaEstudio = document.getElementById("pantalla-estudio");
    const temporizador = document.getElementById("temporizador");
    const botonInicio = document.getElementById("botonInicio");
    const botonCambiarModo = document.getElementById("botonCambiarModo");
    const botonReiniciar = document.getElementById("botonReiniciar");
    const botonAjustesEstudio = document.getElementById("botonAjustesEstudio");
    const btnPopTemporizador = document.getElementById("btnPopTemporizador");

    // Descanso (Snorlax)
    const pantallaDescanso = document.getElementById("pantalla-descanso");
    const temporizadorDescanso = document.getElementById("temporizador-descanso");
    const botonDescanso = document.getElementById("botonDescanso");
    const botonCambiarModoDescanso = document.getElementById("botonCambiarModoDescanso");
    const botonReiniciarDescanso = document.getElementById("botonReiniciarDescanso");
    const botonAjustesDescanso = document.getElementById("botonAjustesDescanso");
    const btnPopTemporizadorDescanso = document.getElementById("btnPopTemporizadorDescanso");
    
    // Botón del minijuego
    const botonJugar = document.getElementById("botonJugar");

    // Notificaciones
    const notificacionToast = document.getElementById("notificacionToast");
    const toastIcono = document.getElementById("toastIcono");
    const toastTitulo = document.getElementById("toastTitulo");
    const toastMensaje = document.getElementById("toastMensaje");
    const toastCerrar = document.getElementById("toastCerrar");

    // Panel de Objetivos (To-Do List - A la izquierda)
    const panelObjetivos = document.getElementById("panelObjetivos");
    const inputNuevoObjetivo = document.getElementById("inputNuevoObjetivo");
    const btnAgregarObjetivo = document.getElementById("btnAgregarObjetivo");
    const listaObjetivos = document.getElementById("listaObjetivos");

    // Historial de sesiones
    const pantallaHistorial = document.getElementById("pantalla-historial");
    const btnAbrirHistorial = document.getElementById("btnAbrirHistorial");
    const btnCerrarHistorial = document.getElementById("btnCerrarHistorial");
    const listaHistorialEl = document.getElementById("listaHistorial");
    const btnLimpiarHistorial = document.getElementById("btnLimpiarHistorial");
    const metricaRacha = document.getElementById("metricaRacha");
    const metricaHoy = document.getElementById("metricaHoy");
    const metricaCompletadas = document.getElementById("metricaCompletadas");
    const metricaTotal = document.getElementById("metricaTotal");

    // =========================================
    // SISTEMA DE AUDIO Y TOAST
    // =========================================
    function reproducirCampanada() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const notas = [523.25, 659.25];

            notas.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = ctx.currentTime + idx * 0.12;
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.001, start);
                gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.75);
            });
        } catch (e) {}
    }

    let timeoutToast = null;
    let timeoutOcultar = null;

    function mostrarNotificacion(icono, titulo, mensaje) {
        reproducirCampanada();
        toastIcono.textContent = icono;
        toastTitulo.textContent = titulo;
        toastMensaje.textContent = mensaje;

        clearTimeout(timeoutToast);
        clearTimeout(timeoutOcultar);
        notificacionToast.classList.remove("oculta");
        void notificacionToast.offsetWidth;
        notificacionToast.classList.add("visible");

        timeoutToast = setTimeout(cerrarNotificacion, 4500);
    }

    function cerrarNotificacion() {
        clearTimeout(timeoutToast);
        notificacionToast.classList.remove("visible");
        timeoutOcultar = setTimeout(() => { notificacionToast.classList.add("oculta"); }, 350);
    }

    if (toastCerrar) toastCerrar.addEventListener("click", cerrarNotificacion);

    // =========================================
    // BLOQUEADOR INTERACTIVO DE APLICACIONES (AL COSTADO DE BULBASAUR)
    // =========================================
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Iconos SVG Vectoriales de marcas y aplicaciones comunes
    const ICONOS_APPS_SVG = {
        discord: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
        chrome: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#EA4335"/><circle cx="12" cy="12" r="5" fill="#FFFFFF"/><circle cx="12" cy="12" r="4" fill="#1A73E8"/><path d="M12 2a10 10 0 0 1 8.66 5H12z" fill="#EA4335"/><path d="M20.66 7A10 10 0 0 1 12 22l4.33-7.5z" fill="#FBBC05"/><path d="M12 22A10 10 0 0 1 3.34 7L12 12z" fill="#34A853"/></svg>`,
        steam: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#171A21"/><path fill="#FFFFFF" d="M12 2a10 10 0 0 0-9.95 9l5.44 2.25a3.46 3.46 0 0 1 2.5-1.09c.3 0 .58.04.85.11l2.45-3.55a4.2 4.2 0 0 1 4.71-1.39 4.2 4.2 0 0 1 2.87 5.27 4.2 4.2 0 0 1-5.27 2.87 4.2 4.2 0 0 1-2.09-1.33L9.06 15.3A3.5 3.5 0 0 1 5.6 17a3.5 3.5 0 0 1-3.48-3.08A10 10 0 1 0 12 2zm6 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-10.4 6.7a1.8 1.8 0 0 0 2.4-.8 1.8 1.8 0 0 0-.8-2.4l-1.3-.5a2.5 2.5 0 0 0-.3 3.7z"/></svg>`,
        spotify: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#1DB954"/><path fill="#FFFFFF" d="M16.5 14.8c-.2 0-.3-.1-.5-.2-2-1.2-4.5-1.5-7.5-.8-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 3.3-.8 6.1-.4 8.4.9.3.2.4.6.2.9-.1.3-.3.5-.3.5zm1-2.4c-.2 0-.4-.1-.6-.2-2.3-1.4-5.8-1.8-8.5-1-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.1-.9 7-.5 9.7 1.1.4.2.5.7.3 1.1-.1.4-.3.6-.5.6zm.1-2.6c-.3 0-.5-.1-.7-.2-2.8-1.7-7.4-1.8-10.1-1-.5.2-1.1-.1-1.2-.6-.2-.5.1-1.1.6-1.2 3.2-1 8.3-.8 11.5 1.1.5.3.6.9.3 1.4-.2.3-.4.5-.4.5z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#25D366"/><path fill="#FFFFFF" d="M17.5 14.3c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4 0-.1 0-.3-.1-.4s-.5-1.3-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z"/></svg>`,
        telegram: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#229ED9"/><path fill="#FFFFFF" d="M6 11.7l10-4.2c.5-.2.9.1.8.6l-1.7 8c-.1.6-.5.7-.9.4l-2.6-1.9-1.2 1.2c-.1.1-.3.3-.6.3l.2-2.6 4.7-4.2c.2-.2-.1-.3-.3-.1l-5.8 3.6-2.5-.8c-.6-.2-.6-.6.1-.9z"/></svg>`,
        epic: `<svg viewBox="0 0 24 24" width="22" height="22"><rect width="20" height="20" x="2" y="2" rx="4" fill="#313131"/><path fill="#FFFFFF" d="M12 4L6 6.5v9L12 20l6-4.5v-9L12 4zm0 2.5l3.8 1.6v6.2L12 17.1l-3.8-2.8V8.1L12 6.5zm-2 3.5h4v1.5h-4v1h3v1.5h-3v1h4V16h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/></svg>`,
        minecraft: `<svg viewBox="0 0 24 24" width="22" height="22"><rect width="20" height="20" x="2" y="2" rx="4" fill="#795548"/><path fill="#4CAF50" d="M2 2h20v6H2z"/><path fill="#388E3C" d="M4 8h2v2H4zm4 0h2v3H8zm4 0h2v1h-2zm4 0h2v3h-2zm4 0h2v1h-2z"/></svg>`,
        riot: `<svg viewBox="0 0 24 24" width="22" height="22"><rect width="20" height="20" x="2" y="2" rx="5" fill="#D13639"/><path fill="#FFFFFF" d="M6 7h4v7H6zm6 0h4v11h-4zm-6 9h4v2H6z"/></svg>`,
        roblox: `<svg viewBox="0 0 24 24" width="22" height="22"><rect width="20" height="20" x="2" y="2" rx="4" fill="#111111"/><path fill="#FFFFFF" transform="rotate(-15 12 12)" d="M7 7h10v10H7zm3 3h4v4h-4z"/></svg>`,
        netflix: `<svg viewBox="0 0 24 24" width="22" height="22"><rect width="20" height="20" x="2" y="2" rx="4" fill="#141414"/><path fill="#E50914" d="M7 5h2.5v14H7zm7.5 0H17v14h-2.5z"/><path fill="#B81D24" d="M7 5l7.5 14H17L9.5 5z"/></svg>`,
        twitch: `<svg viewBox="0 0 24 24" width="22" height="22"><rect width="20" height="20" x="2" y="2" rx="4" fill="#9146FF"/><path fill="#FFFFFF" d="M5 4h14v10l-4 4h-3l-2 2H8v-2H5V4zm2 2v10h3v-2h3l2-2V6H7zm4 2h2v4h-2V8zm4 0h2v4h-2V8z"/></svg>`,
        edge: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#0078D7"/><path fill="#FFFFFF" d="M12 4a8 8 0 0 0-7.8 6.3c.4-.2.9-.3 1.4-.3 2.6 0 4.8 1.8 5.3 4.3.1.5.1 1 .1 1.5 0 2.3-1.8 4.2-4.1 4.2H6a8 8 0 1 0 6-16zm-.3 4.2a3.8 3.8 0 0 1 3.8 3.8c0 1.9-1.4 3.5-3.3 3.8a6.3 6.3 0 0 1-.5-2.6 5 5 0 0 1 5-5H11.7z"/></svg>`,
        generico: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2D6A4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 8h10M7 12h6M7 16h8"/></svg>`
    };

    // Catálogo de aplicaciones sugeridas para acceso rápido
    const APPS_SUGERIDAS = [
        { id: "discord", nombre: "Discord", exe: "Discord.exe", iconoKey: "discord" },
        { id: "chrome", nombre: "Google Chrome", exe: "chrome.exe", iconoKey: "chrome" },
        { id: "steam", nombre: "Steam", exe: "steam.exe", iconoKey: "steam" },
        { id: "spotify", nombre: "Spotify", exe: "Spotify.exe", iconoKey: "spotify" },
        { id: "whatsapp", nombre: "WhatsApp", exe: "WhatsApp.exe", iconoKey: "whatsapp" },
        { id: "telegram", nombre: "Telegram", exe: "Telegram.exe", iconoKey: "telegram" },
        { id: "epic", nombre: "Epic Games", exe: "EpicGamesLauncher.exe", iconoKey: "epic" },
        { id: "minecraft", nombre: "Minecraft", exe: "Minecraft.exe", iconoKey: "minecraft" },
        { id: "riot", nombre: "Riot / LoL", exe: "RiotClientServices.exe", iconoKey: "riot" },
        { id: "roblox", nombre: "Roblox", exe: "RobloxPlayerBeta.exe", iconoKey: "roblox" },
        { id: "netflix", nombre: "Netflix", exe: "Netflix.exe", iconoKey: "netflix" },
        { id: "twitch", nombre: "Twitch", exe: "Twitch.exe", iconoKey: "twitch" },
        { id: "edge", nombre: "MS Edge", exe: "msedge.exe", iconoKey: "edge" }
    ];

    let appsBloqueadas = [];
    let masterBloqueoActivo = localStorage.getItem("focus_master_bloqueo") !== "false";
    let intervaloBloqueo = null;

    // Inicializar interruptor maestro
    if (switchMasterBloqueo) {
        switchMasterBloqueo.checked = masterBloqueoActivo;
        switchMasterBloqueo.addEventListener("change", (e) => {
            masterBloqueoActivo = e.target.checked;
            localStorage.setItem("focus_master_bloqueo", masterBloqueoActivo ? "true" : "false");
            actualizarEstadoBloqueador();
            if (masterBloqueoActivo) {
                mostrarNotificacion("🛡️", "Bloqueador Activado", "Se cerrarán las apps seleccionadas durante el estudio.");
                if (funcionando && modoActual === "estudio") iniciarBloqueoApps();
            } else {
                detenerBloqueoApps();
                mostrarNotificacion("⏸️", "Bloqueador Pausado", "No se cerrará ninguna app durante el estudio.");
            }
        });
    }

    // Cargar apps guardadas o migrar del formato antiguo
    function cargarAppsBloqueadas() {
        const jsonGuardado = localStorage.getItem("focus_apps_bloqueadas_lista");
        if (jsonGuardado) {
            try {
                appsBloqueadas = JSON.parse(jsonGuardado);
                // Asegurar respaldo de iconoKey válido y sanear URLs de imagen
                appsBloqueadas.forEach(app => {
                    const sugerida = APPS_SUGERIDAS.find(s => 
                        (app.exe && s.exe.toLowerCase() === app.exe.toLowerCase()) || 
                        (app.nombre && s.nombre.toLowerCase() === app.nombre.toLowerCase()) ||
                        (app.id && s.id.toLowerCase() === app.id.toLowerCase())
                    );
                    if (sugerida && (!app.iconoKey || app.iconoKey === "generico")) {
                        app.iconoKey = sugerida.iconoKey;
                    }
                    if (app.iconoUrl && (!app.iconoUrl.startsWith("data:image/") || app.iconoUrl.length < 80)) {
                        app.iconoUrl = null;
                    }
                });
            } catch (err) {
                appsBloqueadas = [];
            }
        } else {
            const anterior = localStorage.getItem("focus_apps_bloqueadas");
            if (anterior && anterior.trim().length > 0) {
                const nombres = anterior.split(",").map(s => s.trim()).filter(Boolean);
                appsBloqueadas = nombres.map((nom, idx) => {
                    const exe = nom.toLowerCase().endsWith(".exe") ? nom : nom + ".exe";
                    const sugerida = APPS_SUGERIDAS.find(s => s.exe.toLowerCase() === exe.toLowerCase() || s.id === nom.toLowerCase());
                    return {
                        id: sugerida ? sugerida.id : "app_" + idx + "_" + Date.now(),
                        nombre: sugerida ? sugerida.nombre : nom.replace(/\.exe$/i, ""),
                        exe: sugerida ? sugerida.exe : exe,
                        activo: true,
                        iconoKey: sugerida ? sugerida.iconoKey : "generico",
                        iconoUrl: null
                    };
                });
            } else {
                // Apps predeterminadas para que se aprecie el diseño desde el inicio
                appsBloqueadas = [
                    { id: "discord", nombre: "Discord", exe: "Discord.exe", activo: true, iconoKey: "discord", iconoUrl: null },
                    { id: "chrome", nombre: "Google Chrome", exe: "chrome.exe", activo: true, iconoKey: "chrome", iconoUrl: null },
                    { id: "steam", nombre: "Steam", exe: "steam.exe", activo: true, iconoKey: "steam", iconoUrl: null }
                ];
            }
            guardarAppsBloqueadas();
        }
    }

    function guardarAppsBloqueadas() {
        localStorage.setItem("focus_apps_bloqueadas_lista", JSON.stringify(appsBloqueadas));
        
        // Mantener compatibilidad con string de localStorage
        const listaActivas = appsBloqueadas
            .filter(app => app.activo)
            .map(app => app.exe)
            .join(", ");
        localStorage.setItem("focus_apps_bloqueadas", listaActivas);

        actualizarEstadoBloqueador();
        if (funcionando && modoActual === "estudio") {
            iniciarBloqueoApps();
        }
    }

    function actualizarEstadoBloqueador() {
        const totalActivas = appsBloqueadas.filter(a => a.activo).length;
        if (badgeContadorApps) {
            if (!masterBloqueoActivo) {
                badgeContadorApps.textContent = "Pausado";
                badgeContadorApps.style.color = "#718096";
            } else {
                badgeContadorApps.textContent = `${totalActivas} activa${totalActivas === 1 ? "" : "s"}`;
                badgeContadorApps.style.color = "#2d6a4f";
            }
        }
    }

    function renderizarIcono(app) {
        // Encontrar clave de icono sugerido por nombre o exe
        const sugerida = APPS_SUGERIDAS.find(s => 
            (app.exe && s.exe.toLowerCase() === app.exe.toLowerCase()) || 
            (app.nombre && s.nombre.toLowerCase() === app.nombre.toLowerCase()) ||
            (app.id && s.id.toLowerCase() === app.id.toLowerCase())
        );
        const iconoKey = (sugerida && sugerida.iconoKey) || app.iconoKey || "generico";
        const svgFallback = ICONOS_APPS_SVG[iconoKey] || ICONOS_APPS_SVG.generico;

        if (app.iconoUrl && typeof app.iconoUrl === "string" && app.iconoUrl.length > 80 && app.iconoUrl.startsWith("data:image/")) {
            return `
                <img src="${app.iconoUrl}" class="icono-app-img" alt="${escapeHtml(app.nombre)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
                <span class="icono-app-fallback" style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">
                    ${svgFallback}
                </span>
            `;
        }

        return svgFallback;
    }

    // Renderizar carrusel de sugerencias rápidas
    function renderizarSugerencias() {
        if (!carruselSugerenciasApps) return;
        carruselSugerenciasApps.innerHTML = "";

        APPS_SUGERIDAS.forEach(sug => {
            const yaAgregada = appsBloqueadas.find(a => a.exe.toLowerCase() === sug.exe.toLowerCase());
            const estaActiva = yaAgregada && yaAgregada.activo;

            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = `chip-sugerencia-app ${estaActiva ? "seleccionada" : ""}`;
            chip.title = estaActiva ? `Pausar bloqueo de ${sug.nombre}` : `Bloquear ${sug.nombre}`;

            chip.innerHTML = `
                <span class="chip-icono">${ICONOS_APPS_SVG[sug.iconoKey] || ICONOS_APPS_SVG.generico}</span>
                <span class="chip-nombre">${escapeHtml(sug.nombre)}</span>
                <span class="chip-check">✓</span>
            `;

            chip.addEventListener("click", () => {
                alternarSugerencia(sug);
            });

            carruselSugerenciasApps.appendChild(chip);
        });
    }

    function alternarSugerencia(sug) {
        const existente = appsBloqueadas.find(a => a.exe.toLowerCase() === sug.exe.toLowerCase());
        if (existente) {
            existente.activo = !existente.activo;
            if (existente.activo) {
                mostrarNotificacion("🛡️", "App activada", `${sug.nombre} será bloqueada durante el estudio.`);
            } else {
                mostrarNotificacion("⏸️", "App pausada", `${sug.nombre} no se cerrará.`);
            }
        } else {
            appsBloqueadas.unshift({
                id: sug.id,
                nombre: sug.nombre,
                exe: sug.exe,
                activo: true,
                iconoKey: sug.iconoKey,
                iconoUrl: null
            });
            mostrarNotificacion("✨", "Distracción añadida", `${sug.nombre} añadida a la lista de bloqueo.`);
        }
        guardarAppsBloqueadas();
        renderizarSugerencias();
        renderizarListaApps();
    }

    // Renderizar lista vertical de aplicaciones
    function renderizarListaApps() {
        if (!contenedorListaApps) return;
        contenedorListaApps.innerHTML = "";

        if (appsBloqueadas.length === 0) {
            contenedorListaApps.innerHTML = `
                <div class="vacio-lista-apps">
                    <span class="icono-vacio-apps">🍃</span>
                    <h4 class="titulo-vacio-apps">Sin distracciones en la lista</h4>
                    <p class="desc-vacio-apps">Toca una de las apps populares arriba o pulsa "Examinar .exe" para elegirla desde tu PC.</p>
                </div>
            `;
            return;
        }

        appsBloqueadas.forEach(app => {
            const tarjeta = document.createElement("div");
            tarjeta.className = `tarjeta-app-bloqueada ${app.activo ? "" : "pausada"}`;

            tarjeta.innerHTML = `
                <div class="tarjeta-app-info">
                    <div class="icono-app-wrapper">
                        ${renderizarIcono(app)}
                    </div>
                    <div class="detalles-app">
                        <span class="nombre-app" title="${escapeHtml(app.nombre)}">${escapeHtml(app.nombre)}</span>
                        <span class="proceso-app" title="${escapeHtml(app.exe)}">${escapeHtml(app.exe)}</span>
                    </div>
                </div>
                <div class="tarjeta-app-acciones">
                    <span class="estado-texto-app ${app.activo ? "activo" : "pausado"}">
                        ${app.activo ? "Bloqueado" : "Pausado"}
                    </span>
                    <label class="switch-app" title="${app.activo ? "Pausar" : "Activar"}">
                        <input type="checkbox" class="check-app-toggle" data-id="${app.id}" ${app.activo ? "checked" : ""}>
                        <span class="slider-app"></span>
                    </label>
                    <button type="button" class="btn-eliminar-app" data-id="${app.id}" title="Eliminar de la lista">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            // Control de encendido/apagado por app
            const check = tarjeta.querySelector(".check-app-toggle");
            check.addEventListener("change", (e) => {
                app.activo = e.target.checked;
                guardarAppsBloqueadas();
                renderizarSugerencias();
                renderizarListaApps();
            });

            // Control de eliminación
            const btnEliminar = tarjeta.querySelector(".btn-eliminar-app");
            btnEliminar.addEventListener("click", () => {
                appsBloqueadas = appsBloqueadas.filter(a => a.id !== app.id);
                guardarAppsBloqueadas();
                renderizarSugerencias();
                renderizarListaApps();
                mostrarNotificacion("🗑️", "App eliminada", `${app.nombre} retirada de la lista.`);
            });

            contenedorListaApps.appendChild(tarjeta);
        });
    }

    // Añadir aplicación desde el campo de texto
    function agregarAppManual() {
        if (!inputNombreAppPersonalizada) return;
        const texto = inputNombreAppPersonalizada.value.trim();
        if (!texto) {
            inputNombreAppPersonalizada.focus();
            return;
        }

        const sugerida = APPS_SUGERIDAS.find(s => 
            s.nombre.toLowerCase() === texto.toLowerCase() ||
            s.exe.toLowerCase() === texto.toLowerCase() ||
            s.id.toLowerCase() === texto.toLowerCase()
        );

        if (sugerida) {
            alternarSugerencia(sugerida);
        } else {
            const exeNormalizado = texto.toLowerCase().endsWith(".exe") ? texto : texto + ".exe";
            const nombreLimpio = texto.replace(/\.exe$/i, "");
            
            const existente = appsBloqueadas.find(a => a.exe.toLowerCase() === exeNormalizado.toLowerCase());
            if (existente) {
                existente.activo = true;
                mostrarNotificacion("ℹ️", "Ya configurada", `${existente.nombre} ya estaba en tu lista y fue activada.`);
            } else {
                appsBloqueadas.unshift({
                    id: "app_" + Date.now(),
                    nombre: nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1),
                    exe: exeNormalizado,
                    activo: true,
                    iconoKey: "generico",
                    iconoUrl: null
                });
                mostrarNotificacion("✨", "Aplicación añadida", `${nombreLimpio} añadida a la lista de bloqueo.`);
            }
            guardarAppsBloqueadas();
            renderizarSugerencias();
            renderizarListaApps();
        }

        inputNombreAppPersonalizada.value = "";
    }

    if (btnAgregarAppManual) btnAgregarAppManual.addEventListener("click", agregarAppManual);
    if (inputNombreAppPersonalizada) {
        inputNombreAppPersonalizada.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                agregarAppManual();
            }
        });
    }

    // Botón Examinar .exe en el ordenador (con extracción del icono auténtico del sistema)
    if (btnExaminarExe) {
        btnExaminarExe.addEventListener("click", async () => {
            if (ipcRenderer) {
                try {
                    const res = await ipcRenderer.invoke("seleccionar-archivo-exe");
                    if (res && res.archivo) {
                        const exe = res.archivo.toLowerCase().endsWith(".exe") ? res.archivo : res.archivo + ".exe";
                        const sugerida = APPS_SUGERIDAS.find(s => 
                            s.exe.toLowerCase() === exe.toLowerCase() || 
                            s.nombre.toLowerCase() === res.nombre.toLowerCase() ||
                            s.id.toLowerCase() === res.nombre.toLowerCase()
                        );
                        const iconoKey = sugerida ? sugerida.iconoKey : "generico";
                        const nombreFinal = sugerida ? sugerida.nombre : res.nombre;
                        const iconoUrlValido = (res.icono && typeof res.icono === "string" && res.icono.length > 80) ? res.icono : null;

                        const existente = appsBloqueadas.find(a => a.exe.toLowerCase() === exe.toLowerCase());
                        if (existente) {
                            existente.activo = true;
                            if (iconoUrlValido && !existente.iconoUrl) existente.iconoUrl = iconoUrlValido;
                            if (iconoKey) existente.iconoKey = iconoKey;
                            mostrarNotificacion("ℹ️", "App activada", `${existente.nombre} ya existía y fue activada.`);
                        } else {
                            appsBloqueadas.unshift({
                                id: "app_" + Date.now(),
                                nombre: nombreFinal,
                                exe: exe,
                                activo: true,
                                iconoKey: iconoKey,
                                iconoUrl: iconoUrlValido
                            });
                            mostrarNotificacion("🎉", "¡App e icono listos!", `${nombreFinal} añadida a la lista de bloqueo.`);
                        }
                        guardarAppsBloqueadas();
                        renderizarSugerencias();
                        renderizarListaApps();
                    }
                } catch (err) {
                    console.warn("Fallo diálogo nativo, recurriendo al selector:", err);
                    if (inputArchivoExeFallback) inputArchivoExeFallback.click();
                }
            } else if (inputArchivoExeFallback) {
                inputArchivoExeFallback.click();
            }
        });
    }

    // Selector de archivo fallback (HTML)
    if (inputArchivoExeFallback) {
        inputArchivoExeFallback.addEventListener("change", (e) => {
            if (e.target.files && e.target.files.length > 0) {
                const archivo = e.target.files[0].name;
                const exe = archivo.toLowerCase().endsWith(".exe") ? archivo : archivo + ".exe";
                const nombre = archivo.replace(/\.exe$/i, "");
                appsBloqueadas.unshift({
                    id: "app_" + Date.now(),
                    nombre: nombre,
                    exe: exe,
                    activo: true,
                    iconoKey: "generico",
                    iconoUrl: null
                });
                guardarAppsBloqueadas();
                renderizarSugerencias();
                renderizarListaApps();
                mostrarNotificacion("✨", "Aplicación añadida", `${nombre} añadida a la lista.`);
                inputArchivoExeFallback.value = "";
            }
        });
    }

    // Acciones de cabecera: Activar todas y Vaciar
    if (btnActivarTodasApps) {
        btnActivarTodasApps.addEventListener("click", () => {
            if (appsBloqueadas.length === 0) return;
            appsBloqueadas.forEach(a => a.activo = true);
            guardarAppsBloqueadas();
            renderizarSugerencias();
            renderizarListaApps();
            mostrarNotificacion("🛡️", "Todas activadas", "Todas las aplicaciones de la lista están listas para bloquearse.");
        });
    }

    if (btnLimpiarTodasApps) {
        btnLimpiarTodasApps.addEventListener("click", () => {
            if (appsBloqueadas.length === 0) return;
            appsBloqueadas = [];
            guardarAppsBloqueadas();
            renderizarSugerencias();
            renderizarListaApps();
            mostrarNotificacion("🗑️", "Lista vaciada", "Se han quitado todas las aplicaciones.");
        });
    }

    // Cargar e iniciar componentes de bloqueo
    cargarAppsBloqueadas();
    renderizarSugerencias();
    renderizarListaApps();
    actualizarEstadoBloqueador();

    // Centinela de bloqueo de procesos en Windows
    function iniciarBloqueoApps() {
        if (!exec || process.platform !== "win32") {
            console.log("El bloqueo de apps solo funciona en Windows o 'exec' no cargó.");
            return;
        }

        const masterActivo = localStorage.getItem("focus_master_bloqueo") !== "false";
        if (!masterActivo) {
            console.log("Bloqueo pausado por interruptor maestro.");
            detenerBloqueoApps();
            return;
        }

        const listaApps = appsBloqueadas
            .filter(app => app.activo)
            .map(app => app.exe.toLowerCase().endsWith(".exe") ? app.exe : app.exe + ".exe")
            .filter(Boolean);

        if (listaApps.length === 0) {
            console.log("No hay aplicaciones activas para bloquear.");
            detenerBloqueoApps();
            return;
        }

        if (intervaloBloqueo) clearInterval(intervaloBloqueo);

        console.log("Iniciando centinela de bloqueo para:", listaApps);

        intervaloBloqueo = setInterval(() => {
            listaApps.forEach(app => {
                const comando = `taskkill /IM "${app}" /F /T`;
                exec(comando, (error) => {
                    if (error && error.code !== 128) {
                        console.warn(`Aviso centinela (${app}):`, error.message);
                    }
                });
            });
        }, 5000);
    }

    function detenerBloqueoApps() {
        if (intervaloBloqueo) {
            clearInterval(intervaloBloqueo);
            intervaloBloqueo = null;
        }
    }

    // =========================================
    // AUTENTICACIÓN Y SESIONES
    // =========================================
    function obtenerUsuariosRegistrados() {
        try { const d = localStorage.getItem("focus_usuarios"); return d ? JSON.parse(d) : []; } catch(e) { return []; }
    }
    function guardarUsuariosRegistrados(u) { localStorage.setItem("focus_usuarios", JSON.stringify(u)); }
    function obtenerUsuarioActivo() {
        try { const d = localStorage.getItem("focus_usuario_activo"); return d ? JSON.parse(d) : null; } catch(e) { return null; }
    }

    function iniciarSesionConUsuario(u) {
        localStorage.setItem("focus_usuario_activo", JSON.stringify(u));
        nombreUsuarioActivo.textContent = u.nombre || "Entrenador";
        barraSuperior.classList.remove("oculta");
        cambiarModo("principal", false);
    }

    function cerrarSesion() {
        localStorage.removeItem("focus_usuario_activo");
        clearInterval(intervalo);
        intervalo = null;
        funcionando = false;
        detenerBloqueoApps();
        barraSuperior.classList.add("oculta");
        cambiarModo("auth", false);
        mostrarNotificacion("👋", "Sesión cerrada", "Has vuelto a la pantalla de inicio.");
    }

    function limpiarMensajesAuth() {
        if (errorLogin) { errorLogin.textContent = ""; errorLogin.classList.add("oculta"); }
        if (exitoLogin) { exitoLogin.textContent = ""; exitoLogin.classList.add("oculta"); }
        if (errorRegister) { errorRegister.textContent = ""; errorRegister.classList.add("oculta"); }
        if (exitoRegister) { exitoRegister.textContent = ""; exitoRegister.classList.add("oculta"); }
    }

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("activo"); tabRegister.classList.remove("activo");
            formLogin.classList.remove("oculta"); formRegister.classList.add("oculta"); limpiarMensajesAuth();
        });
        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("activo"); tabLogin.classList.remove("activo");
            formRegister.classList.remove("oculta"); formLogin.classList.add("oculta"); limpiarMensajesAuth();
        });
    }

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault(); limpiarMensajesAuth();
            const ident = loginUsuario.value.trim().toLowerCase();
            const pass = loginPassword.value;
            if (!ident || !pass) { errorLogin.textContent = "Por favor, completa todos los campos."; errorLogin.classList.remove("oculta"); return; }
            
            const usuarioEncontrado = obtenerUsuariosRegistrados().find(u => (u.usuario?.toLowerCase() === ident) || (u.email?.toLowerCase() === ident));
            if (!usuarioEncontrado) { errorLogin.textContent = "El usuario o correo no está registrado."; errorLogin.classList.remove("oculta"); return; }
            if (usuarioEncontrado.password !== pass) { errorLogin.textContent = "Contraseña incorrecta."; errorLogin.classList.remove("oculta"); return; }

            formLogin.reset(); limpiarMensajesAuth(); iniciarSesionConUsuario(usuarioEncontrado);
            mostrarNotificacion("✨", `¡Hola de nuevo, ${usuarioEncontrado.nombre}!`, "Listo para concentrarte hoy.");
        });
    }

    if (formRegister) {
        formRegister.addEventListener("submit", (e) => {
            e.preventDefault(); limpiarMensajesAuth();
            const nombre = regNombre.value.trim(); const email = regEmail.value.trim().toLowerCase(); const pass = regPassword.value;
            if (!nombre || !email.includes("@") || pass.length < 4) { errorRegister.textContent = "Ingresa datos válidos (contraseña mínimo 4 caracteres)."; errorRegister.classList.remove("oculta"); return; }
            
            const usuarios = obtenerUsuariosRegistrados();
            if (usuarios.some((u) => u.usuario?.toLowerCase() === nombre.toLowerCase() || u.email?.toLowerCase() === email)) {
                errorRegister.textContent = "El usuario o correo ya está registrado."; errorRegister.classList.remove("oculta"); return;
            }

            const nuevoUsuario = { usuario: nombre, nombre: nombre, email: email, password: pass, fechaRegistro: new Date().toISOString() };
            usuarios.push(nuevoUsuario); guardarUsuariosRegistrados(usuarios);
            formRegister.reset(); limpiarMensajesAuth(); iniciarSesionConUsuario(nuevoUsuario);
            mostrarNotificacion("🎉", "¡Cuenta creada!", `Bienvenido, Entrenador ${nombre}.`);
        });
    }

    if (btnInvitado) btnInvitado.addEventListener("click", () => { iniciarSesionConUsuario({ nombre: "Invitado", usuario: "invitado", esInvitado: true }); mostrarNotificacion("🍃", "Modo Invitado", "Has ingresado sin cuenta."); });
    if (btnCerrarSesion) btnCerrarSesion.addEventListener("click", cerrarSesion);

    // =========================================
    // TEMPORIZADOR Y MODOS
    // =========================================
    const ICONO_PLAY = `<svg class="icono-btn" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const ICONO_PAUSA = `<svg class="icono-btn" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    function fijarBotonPrincipal(boton, estado, texto) {
        if (!boton) return;
        const icono = estado === "pausa" ? ICONO_PAUSA : ICONO_PLAY;
        boton.innerHTML = `${icono}<span>${texto}</span>`;
    }

    let minutosEstudioConfig = 50;
    let minutosDescansoConfig = 10;
    let tiempoEstudio = minutosEstudioConfig * 60;
    let tiempoDescanso = minutosDescansoConfig * 60;
    let modoActual = "auth";
    let segundosRestantes = tiempoEstudio;
    let intervalo = null;
    let funcionando = false;

    let modoPopTemporizador = localStorage.getItem("focus_modo_pop") || "inicio";

    if (selectModoPop) {
        selectModoPop.value = modoPopTemporizador;
        if (ipcRenderer) ipcRenderer.send("actualizar-modo-pop", modoPopTemporizador);
        selectModoPop.addEventListener("change", (e) => {
            modoPopTemporizador = e.target.value;
            localStorage.setItem("focus_modo_pop", modoPopTemporizador);
            if (ipcRenderer) ipcRenderer.send("actualizar-modo-pop", modoPopTemporizador);
        });
    }

    function evaluarAbrirPop() {
        if (ipcRenderer && modoPopTemporizador === "inicio") ipcRenderer.send("abrir-pop-temporizador");
    }

    const toggleManualPop = () => { if (ipcRenderer) ipcRenderer.send("toggle-pop-temporizador"); };
    if (btnPopTemporizador) btnPopTemporizador.addEventListener("click", toggleManualPop);
    if (btnPopTemporizadorDescanso) btnPopTemporizadorDescanso.addEventListener("click", toggleManualPop);

    function actualizarConfiguracionTiempos() {
        if (displayMinutosEstudio) displayMinutosEstudio.textContent = minutosEstudioConfig;
        if (displayMinutosDescanso) displayMinutosDescanso.textContent = minutosDescansoConfig;
        tiempoEstudio = minutosEstudioConfig * 60;
        tiempoDescanso = minutosDescansoConfig * 60;
        if (modoActual === "estudio" && !funcionando) { segundosRestantes = tiempoEstudio; actualizarTemporizador(); }
        else if (modoActual === "descanso" && !funcionando) { segundosRestantes = tiempoDescanso; actualizarTemporizador(); }
    }

    function actualizarTemporizador() {
        const min = Math.floor(segundosRestantes / 60); const seg = segundosRestantes % 60;
        const texto = `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
        if (modoActual === "estudio" && temporizador) temporizador.textContent = texto;
        else if (modoActual === "descanso" && temporizadorDescanso) temporizadorDescanso.textContent = texto;
        if (ipcRenderer) ipcRenderer.send("actualizar-tiempo", texto);
    }

    function contarTiempo() {
        segundosRestantes--; actualizarTemporizador();
        if (segundosRestantes <= 0) {
            clearInterval(intervalo); intervalo = null; funcionando = false; detenerBloqueoApps();
            if (modoActual === "estudio") { mostrarNotificacion("☕", "¡Sesión de estudio cumplida!", "Excelente trabajo. Toca relajarse con Snorlax."); cambiarModo("descanso", true); }
            else { mostrarNotificacion("📚", "¡Descanso finalizado!", "Energías renovadas. Comenzando nuevo bloque de estudio."); cambiarModo("estudio", false); }
        }
    }

    function reiniciarTemporizador() {
        clearInterval(intervalo); intervalo = null; funcionando = false; detenerBloqueoApps();
        if (modoActual === "estudio") { segundosRestantes = tiempoEstudio; fijarBotonPrincipal(botonInicio, "play", "Empezar estudio"); }
        else if (modoActual === "descanso") { segundosRestantes = tiempoDescanso; fijarBotonPrincipal(botonDescanso, "play", "Empezar descanso"); }
        actualizarTemporizador(); mostrarNotificacion("↺", "Contador reiniciado", "El tiempo ha vuelto al inicio.");
    }

    function controlarTemporizador() {
        const botonActivo = modoActual === "estudio" ? botonInicio : botonDescanso;
        if (funcionando) {
            clearInterval(intervalo); intervalo = null; funcionando = false;
            fijarBotonPrincipal(botonActivo, "play", "Reanudar"); detenerBloqueoApps();
            if (ipcRenderer) { ipcRenderer.send("estado-temporizador", false); if (modoPopTemporizador === "inicio") ipcRenderer.send("cerrar-pop-temporizador"); }
        } else {
            funcionando = true; intervalo = setInterval(contarTiempo, 1000);
            fijarBotonPrincipal(botonActivo, "pausa", "Pausar");
            if (modoActual === "estudio") iniciarBloqueoApps();
            if (ipcRenderer) { ipcRenderer.send("estado-temporizador", true); evaluarAbrirPop(); }
        }
    }

    function cambiarModo(nuevoModo, autoIniciar = false) {
        clearInterval(intervalo); intervalo = null; funcionando = false; detenerBloqueoApps();
        modoActual = nuevoModo;
        pantallaAuth.classList.add("oculta"); pantallaPrincipal.classList.add("oculta"); pantallaEstudio.classList.add("oculta"); pantallaDescanso.classList.add("oculta");
        if (pantallaHistorial) pantallaHistorial.classList.add("oculta");

        if ((modoActual === "auth" || modoActual === "principal") && ipcRenderer) {
            ipcRenderer.send("cerrar-pop-temporizador"); ipcRenderer.send("estado-temporizador", false);
        }

        if (modoActual === "auth") {
            pantallaAuth.classList.remove("oculta");
            barraSuperior.classList.add("oculta");
            document.body.className = "tema-auth";
            document.title = "FOCUS - INICIAR SESIÓN";
            limpiarMensajesAuth();
            if (panelObjetivos) panelObjetivos.classList.add("oculta");
        } else {
            if (panelObjetivos) {
                panelObjetivos.classList.remove("oculta");
                if (modoActual === "principal") {
                    const contPrincipal = document.getElementById("contenedorPrincipalBulbasaur");
                    const colBulba = contPrincipal ? contPrincipal.querySelector(".columna-bulbasaur") : null;
                    if (contPrincipal && colBulba && panelObjetivos.parentElement !== contPrincipal) {
                        contPrincipal.insertBefore(panelObjetivos, colBulba);
                    }
                } else if (modoActual === "estudio") {
                    const zonaEstudio = document.getElementById("zonaEstudioLayout");
                    const colCentro = zonaEstudio ? zonaEstudio.querySelector(".columna-centro-modo") : null;
                    if (zonaEstudio && colCentro && panelObjetivos.parentElement !== zonaEstudio) {
                        zonaEstudio.insertBefore(panelObjetivos, colCentro);
                    }
                } else if (modoActual === "descanso") {
                    const zonaDescanso = document.getElementById("zonaDescansoLayout");
                    const colCentro = zonaDescanso ? zonaDescanso.querySelector(".columna-centro-modo") : null;
                    if (zonaDescanso && colCentro && panelObjetivos.parentElement !== zonaDescanso) {
                        zonaDescanso.insertBefore(panelObjetivos, colCentro);
                    }
                }
            }

            if (modoActual === "principal") {
                pantallaPrincipal.classList.remove("oculta");
                barraSuperior.classList.remove("oculta");
                document.body.className = "tema-bulbasaur";
                document.title = "FOCUS - PANEL PRINCIPAL";
            } else if (modoActual === "descanso") {
                pantallaDescanso.classList.remove("oculta");
                barraSuperior.classList.remove("oculta");
                document.body.className = "tema-descanso";
                document.title = "FOCUS - MODO DESCANSO";
                segundosRestantes = tiempoDescanso;
                actualizarTemporizador();
                if (autoIniciar) {
                    funcionando = true;
                    intervalo = setInterval(contarTiempo, 1000);
                    fijarBotonPrincipal(botonDescanso, "pausa", "Pausar");
                    if (ipcRenderer) { ipcRenderer.send("estado-temporizador", true); evaluarAbrirPop(); }
                } else fijarBotonPrincipal(botonDescanso, "play", "Empezar descanso");
            } else {
                pantallaEstudio.classList.remove("oculta");
                barraSuperior.classList.remove("oculta");
                document.body.className = "tema-estudio";
                document.title = "FOCUS - MODO ESTUDIO";
                segundosRestantes = tiempoEstudio;
                actualizarTemporizador();
                if (autoIniciar) {
                    funcionando = true;
                    intervalo = setInterval(contarTiempo, 1000);
                    fijarBotonPrincipal(botonInicio, "pausa", "Pausar");
                    if (ipcRenderer) { ipcRenderer.send("estado-temporizador", true); evaluarAbrirPop(); }
                    iniciarBloqueoApps();
                } else fijarBotonPrincipal(botonInicio, "play", "Empezar estudio");
            }
        }
    }

    if (btnMenosEstudio) btnMenosEstudio.addEventListener("click", () => { if (minutosEstudioConfig > 1) { minutosEstudioConfig--; actualizarConfiguracionTiempos(); }});
    if (btnMasEstudio) btnMasEstudio.addEventListener("click", () => { if (minutosEstudioConfig < 180) { minutosEstudioConfig++; actualizarConfiguracionTiempos(); }});
    if (btnMenosDescanso) btnMenosDescanso.addEventListener("click", () => { if (minutosDescansoConfig > 1) { minutosDescansoConfig--; actualizarConfiguracionTiempos(); }});
    if (btnMasDescanso) btnMasDescanso.addEventListener("click", () => { if (minutosDescansoConfig < 90) { minutosDescansoConfig++; actualizarConfiguracionTiempos(); }});
    function aplicarPreset(estudio, descanso) { minutosEstudioConfig = estudio; minutosDescansoConfig = descanso; actualizarConfiguracionTiempos(); }
    if (btnPreset25) btnPreset25.addEventListener("click", () => aplicarPreset(25, 5));
    if (btnPreset50) btnPreset50.addEventListener("click", () => aplicarPreset(50, 10));
    if (btnPreset90) btnPreset90.addEventListener("click", () => aplicarPreset(90, 15));

    if (btnIrEstudioDesdeBulbasaur) btnIrEstudioDesdeBulbasaur.addEventListener("click", () => { actualizarConfiguracionTiempos(); cambiarModo("estudio", false); });
    if (btnIrDescansoDesdeBulbasaur) btnIrDescansoDesdeBulbasaur.addEventListener("click", () => { actualizarConfiguracionTiempos(); cambiarModo("descanso", false); });

    if (botonInicio) botonInicio.addEventListener("click", controlarTemporizador);
    if (botonDescanso) botonDescanso.addEventListener("click", controlarTemporizador);
    if (botonCambiarModo) botonCambiarModo.addEventListener("click", () => cambiarModo("descanso", false));
    if (botonCambiarModoDescanso) botonCambiarModoDescanso.addEventListener("click", () => cambiarModo("estudio", false));
    if (botonReiniciar) botonReiniciar.addEventListener("click", reiniciarTemporizador);
    if (botonReiniciarDescanso) botonReiniciarDescanso.addEventListener("click", reiniciarTemporizador);
    if (botonAjustesEstudio) botonAjustesEstudio.addEventListener("click", () => cambiarModo("principal", false));
    if (botonAjustesDescanso) botonAjustesDescanso.addEventListener("click", () => cambiarModo("principal", false));

    // =========================================
    // ABRIR SALA DE JUEGOS EN NUEVA VENTANA
    // =========================================
    if (botonJugar) {
        botonJugar.addEventListener("click", () => {
            if (ipcRenderer) {
                ipcRenderer.send("abrir-ventana-juegos");
            }
        });
    }

    // =========================================
    // LÓGICA DE OBJETIVOS (TO-DO LIST)
    // =========================================
    let objetivos = [];
    try {
        const objsGuardados = localStorage.getItem("focus_objetivos");
        objetivos = objsGuardados ? JSON.parse(objsGuardados) : [];
    } catch (e) {
        objetivos = [];
    }

    const badgeContadorObjetivos = document.getElementById("badgeContadorObjetivos");
    const btnLimpiarObjetivos = document.getElementById("btnLimpiarObjetivos");

    function guardarObjetivos() {
        localStorage.setItem("focus_objetivos", JSON.stringify(objetivos));
    }

    function renderizarObjetivos() {
        if (!listaObjetivos) return;
        listaObjetivos.innerHTML = "";

        const pendientes = objetivos.filter(o => !o.completado).length;
        if (badgeContadorObjetivos) {
            badgeContadorObjetivos.textContent = `${pendientes} ${pendientes === 1 ? "pendiente" : "pendientes"}`;
        }
        
        if (objetivos.length === 0) {
            listaObjetivos.innerHTML = `
                <div class="vacio-lista-objetivos">
                    <span class="icono-vacio-obj">✨</span>
                    <p>No tienes objetivos pendientes.<br>¡Añade uno para empezar!</p>
                </div>
            `;
            return;
        }

        objetivos.forEach((obj, index) => {
            const li = document.createElement("li");
            li.className = `item-objetivo ${obj.completado ? "completado" : ""}`;
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox-objetivo";
            checkbox.checked = Boolean(obj.completado);
            checkbox.addEventListener("change", () => toggleObjetivo(index));

            const span = document.createElement("span");
            span.className = "texto-objetivo";
            span.textContent = obj.texto;
            span.addEventListener("click", () => toggleObjetivo(index));

            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn-eliminar-objetivo";
            btnEliminar.type = "button";
            btnEliminar.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
            btnEliminar.title = "Eliminar objetivo";
            btnEliminar.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarObjetivo(index);
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(btnEliminar);
            listaObjetivos.appendChild(li);
        });
    }

    function agregarObjetivo() {
        if (!inputNuevoObjetivo) return;
        const texto = inputNuevoObjetivo.value.trim();
        if (texto.length > 0) {
            objetivos.push({ texto: texto, completado: false });
            guardarObjetivos();
            renderizarObjetivos();
            inputNuevoObjetivo.value = "";
            inputNuevoObjetivo.focus();
        }
    }

    function toggleObjetivo(index) {
        if (objetivos[index]) {
            objetivos[index].completado = !objetivos[index].completado;
            guardarObjetivos();
            renderizarObjetivos();
        }
    }

    function eliminarObjetivo(index) {
        if (objetivos[index] !== undefined) {
            objetivos.splice(index, 1);
            guardarObjetivos();
            renderizarObjetivos();
        }
    }

    if (btnAgregarObjetivo) btnAgregarObjetivo.addEventListener("click", agregarObjetivo);
    
    if (inputNuevoObjetivo) {
        inputNuevoObjetivo.addEventListener("keypress", (e) => {
            if (e.key === "Enter") agregarObjetivo();
        });
    }

    if (btnLimpiarObjetivos) {
        btnLimpiarObjetivos.addEventListener("click", () => {
            const antes = objetivos.length;
            objetivos = objetivos.filter(o => !o.completado);
            if (objetivos.length < antes) {
                guardarObjetivos();
                renderizarObjetivos();
                mostrarNotificacion("🧹", "Objetivos limpiados", "Se eliminaron las tareas completadas.");
            }
        });
    }

    // =========================================
    // HISTORIAL DE SESIONES
    // =========================================
    const HISTORIAL_KEY = "focus_historial";
    const MAX_SESIONES = 90;

    // Variables de estado de sesión activa
    let sesionActiva = null; // { tipo, horaInicio, minutosTotales, inicioTimestamp }

    function cargarHistorial() {
        try {
            const raw = localStorage.getItem(HISTORIAL_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }

    function guardarHistorial(lista) {
        // Limitar a las últimas MAX_SESIONES
        const recortada = lista.slice(-MAX_SESIONES);
        localStorage.setItem(HISTORIAL_KEY, JSON.stringify(recortada));
    }

    function iniciarSesionHistorial(tipo, minutosTotales) {
        const ahora = new Date();
        sesionActiva = {
            tipo,
            minutosTotales,
            horaInicio: `${String(ahora.getHours()).padStart(2,"0")}:${String(ahora.getMinutes()).padStart(2,"0")}`,
            inicioTimestamp: Date.now()
        };
    }

    function registrarSesion(completada) {
        if (!sesionActiva) return;
        const ahora = Date.now();
        const duracionMs = ahora - sesionActiva.inicioTimestamp;
        const duracionMin = Math.max(1, Math.round(duracionMs / 60000));

        // No registrar sesiones menores a 1 minuto efectivo
        if (duracionMin < 1) { sesionActiva = null; return; }

        const hoy = new Date();
        const sesion = {
            id: "ses_" + ahora,
            fecha: `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`,
            horaInicio: sesionActiva.horaInicio,
            tipo: sesionActiva.tipo, // "estudio" | "descanso"
            duracionMin,
            minutosPlanificados: sesionActiva.minutosTotales,
            completada
        };

        const lista = cargarHistorial();
        lista.push(sesion);
        guardarHistorial(lista);
        sesionActiva = null;
    }

    // ---- Métricas ----
    function calcularMetricas(lista) {
        const hoy = new Date();
        const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;

        const minHoy = lista
            .filter(s => s.fecha === fechaHoy && s.tipo === "estudio")
            .reduce((acc, s) => acc + s.duracionMin, 0);

        const totalMin = lista
            .filter(s => s.tipo === "estudio")
            .reduce((acc, s) => acc + s.duracionMin, 0);

        const completas = lista.filter(s => s.completada && s.tipo === "estudio").length;

        // Racha: días consecutivos con al menos 1 sesión de estudio
        const diasConEstudio = [...new Set(
            lista.filter(s => s.tipo === "estudio").map(s => s.fecha)
        )].sort().reverse();

        let racha = 0;
        let diaCheck = new Date();
        for (const dia of diasConEstudio) {
            const diaStr = `${diaCheck.getFullYear()}-${String(diaCheck.getMonth()+1).padStart(2,"0")}-${String(diaCheck.getDate()).padStart(2,"0")}`;
            if (dia === diaStr) {
                racha++;
                diaCheck.setDate(diaCheck.getDate() - 1);
            } else { break; }
        }

        return { minHoy, totalMin, completas, racha };
    }

    function formatMin(min) {
        if (min < 60) return `${min} min`;
        const h = Math.floor(min / 60);
        const m = min % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }

    function etiquetaDia(fechaStr) {
        const [y, m, d] = fechaStr.split("-").map(Number);
        const fecha = new Date(y, m - 1, d);
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const ayer = new Date(hoy); ayer.setDate(hoy.getDate()-1);
        const diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
        const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        if (fecha.getTime() === hoy.getTime()) return "🗓️ Hoy";
        if (fecha.getTime() === ayer.getTime()) return "📆 Ayer";
        return `${diasSemana[fecha.getDay()]} ${d} de ${meses[m-1]}`;
    }

    // ---- Renderizado del historial ----
    let filtroActual = "todo";

    function renderizarHistorial() {
        if (!listaHistorialEl) return;
        const lista = cargarHistorial();
        const filtrada = filtroActual === "todo" ? lista : lista.filter(s => s.tipo === filtroActual);
        const invertida = [...filtrada].reverse(); // más recientes primero

        // Actualizar métricas
        const metricas = calcularMetricas(lista);
        if (metricaRacha) metricaRacha.textContent = metricas.racha;
        if (metricaHoy) metricaHoy.textContent = formatMin(metricas.minHoy);
        if (metricaCompletadas) metricaCompletadas.textContent = metricas.completas;
        if (metricaTotal) metricaTotal.textContent = formatMin(metricas.totalMin);

        listaHistorialEl.innerHTML = "";

        if (invertida.length === 0) {
            listaHistorialEl.innerHTML = `
                <div class="historial-vacio">
                    <span class="icono-vacio-hist">📭</span>
                    <p>No hay sesiones registradas todavía</p>
                    <small>Empieza una sesión de estudio para ver tu progreso aquí</small>
                </div>`;
            return;
        }

        // Agrupar por día
        const porDia = {};
        for (const s of invertida) {
            if (!porDia[s.fecha]) porDia[s.fecha] = [];
            porDia[s.fecha].push(s);
        }

        for (const [fecha, sesiones] of Object.entries(porDia)) {
            const grupo = document.createElement("div");
            grupo.className = "grupo-dia-historial";

            const totalDia = sesiones
                .filter(s => s.tipo === "estudio")
                .reduce((acc, s) => acc + s.duracionMin, 0);

            const label = document.createElement("div");
            label.className = "etiqueta-dia-historial";
            label.textContent = etiquetaDia(fecha) + (totalDia > 0 ? ` · ${formatMin(totalDia)} estudiados` : "");
            grupo.appendChild(label);

            for (const s of sesiones) {
                const esEstudio = s.tipo === "estudio";
                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-sesion";
                tarjeta.innerHTML = `
                    <div class="sesion-icono-tipo ${s.tipo}">${esEstudio ? "📚" : "😴"}</div>
                    <div class="sesion-info">
                        <p class="sesion-titulo">${esEstudio ? "Sesión de Estudio" : "Descanso"}</p>
                        <p class="sesion-subtitulo">Inicio: ${s.horaInicio} · Planificado: ${s.minutosPlanificados} min</p>
                    </div>
                    <div class="sesion-duracion">
                        ${formatMin(s.duracionMin)}
                        <span>${s.completada ? "completada" : "interrumpida"}</span>
                    </div>
                    <span class="sesion-badge ${s.completada ? "completa" : "interrumpida"}">${s.completada ? "✅ Completa" : "⚡ Parcial"}</span>
                `;
                grupo.appendChild(tarjeta);
            }
            listaHistorialEl.appendChild(grupo);
        }
    }

    // ---- Pantalla historial ----
    let modoPrevioAlHistorial = "principal";

    function abrirHistorial() {
        modoPrevioAlHistorial = modoActual || "principal";
        // Ocultar todo menos barra y historial
        const pantallas = [pantallaAuth, pantallaPrincipal, pantallaEstudio, pantallaDescanso, panelObjetivos];
        pantallas.forEach(p => { if (p) p.classList.add("oculta"); });
        if (pantallaHistorial) pantallaHistorial.classList.remove("oculta");
        document.body.className = "tema-bulbasaur";
        document.title = "FOCUS - Historial";
        renderizarHistorial();
    }

    function cerrarHistorial() {
        if (pantallaHistorial) pantallaHistorial.classList.add("oculta");
        cambiarModo(modoPrevioAlHistorial, false);
    }

    if (btnAbrirHistorial) btnAbrirHistorial.addEventListener("click", abrirHistorial);
    if (btnCerrarHistorial) btnCerrarHistorial.addEventListener("click", cerrarHistorial);

    if (btnLimpiarHistorial) {
        btnLimpiarHistorial.addEventListener("click", () => {
            if (confirm("¿Borrar todo el historial de sesiones? Esta acción no se puede deshacer.")) {
                localStorage.removeItem(HISTORIAL_KEY);
                renderizarHistorial();
                mostrarNotificacion("🗑️", "Historial borrado", "Se eliminaron todas las sesiones guardadas.");
            }
        });
    }

    // Filtros
    document.querySelectorAll(".btn-filtro-hist").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-filtro-hist").forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            filtroActual = btn.dataset.filtro;
            renderizarHistorial();
        });
    });

    // ---- Enganchar el guardado de sesiones al timer ----
    // Parchamos contarTiempo y controlarTemporizador para registrar sesiones

    // Cuando se inicia el timer → abrir sesión
    const _controlarTemporizadorOrig = controlarTemporizador;
    // No podemos redefinir directamente la función interna, así que usamos
    // los botones para interceptar el inicio
    function registrarInicioSiCorresponde() {
        if (!funcionando) return; // ya corriendo
        if (sesionActiva) return; // ya hay sesión
        const tipo = modoActual === "descanso" ? "descanso" : "estudio";
        const minPlan = tipo === "estudio" ? minutosEstudioConfig : minutosDescansoConfig;
        iniciarSesionHistorial(tipo, minPlan);
    }

    // Sobrescribimos controlarTemporizador para interceptar inicio
    const btnsTemporizador = [botonInicio, botonDescanso];
    btnsTemporizador.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            // Después de que se ejecutó el handler original
            setTimeout(() => {
                if (funcionando && !sesionActiva) {
                    const tipo = modoActual === "descanso" ? "descanso" : "estudio";
                    const minPlan = tipo === "estudio" ? minutosEstudioConfig : minutosDescansoConfig;
                    iniciarSesionHistorial(tipo, minPlan);
                }
            }, 50);
        });
    });

    // Cuando se llama a reiniciar → sesión interrumpida
    const btnsReiniciar = [botonReiniciar, botonReiniciarDescanso];
    btnsReiniciar.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            setTimeout(() => registrarSesion(false), 10);
        });
    });

    // Cuando el timer llega a 0 → sesión completada (en contarTiempo)
    // Usamos MutationObserver sobre el texto del timer para detectar "00:00"
    function observarTimerCompleto(timerEl) {
        if (!timerEl) return;
        const obs = new MutationObserver(() => {
            if (timerEl.textContent === "00:00" && sesionActiva) {
                registrarSesion(true);
            }
        });
        obs.observe(timerEl, { childList: true, subtree: true, characterData: true });
    }
    observarTimerCompleto(temporizador);
    observarTimerCompleto(temporizadorDescanso);

    // Cuando se cambia de modo manualmente → sesión interrumpida
    const btnsCambioModo = [botonCambiarModo, botonCambiarModoDescanso, botonAjustesEstudio, botonAjustesDescanso];
    btnsCambioModo.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            setTimeout(() => { if (sesionActiva) registrarSesion(false); }, 10);
        });
    });

    function inicializarHistorial() {
        // Ya inicializado al definir las variables
    }

    // =========================================
    // INICIALIZACIÓN DE LA APP (SIEMPRE AL FINAL)
    // =========================================
    renderizarObjetivos(); // Cargar la lista de objetivos al abrir
    inicializarHistorial(); // Configurar historial
    actualizarConfiguracionTiempos();
    const usuarioActivoGuardado = obtenerUsuarioActivo();
    if (usuarioActivoGuardado) {
        iniciarSesionConUsuario(usuarioActivoGuardado);
    } else {
        cambiarModo("auth", false);
    }
});