// =========================================
// INTEGRACIÓN CON ELECTRON (vía preload.js)
// =========================================
// La interfaz no tiene acceso a Node: todo pasa por window.focusAPI (ver preload.js)
const api = window.focusAPI || null;
if (!api) console.warn("Ejecutando fuera del entorno de Electron.");

function enviarIPC(canal, datos) {
    if (api) api.send(canal, datos);
}

// Nombre de ejecutable válido: letras, números, espacios, . _ - ( ) + y terminado en .exe
const EXE_VALIDO = /^[\w .()+\-]{1,100}\.exe$/i;
const ICONO_DATAURL_VALIDO = /^data:image\/(png|jpeg|gif|webp|bmp|x-icon);base64,[A-Za-z0-9+/=]+$/;

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

    const btnMenosDescansoLargo = document.getElementById("btnMenosDescansoLargo");
    const btnMasDescansoLargo = document.getElementById("btnMasDescansoLargo");
    const displayMinutosDescansoLargo = document.getElementById("displayMinutosDescansoLargo");

    const btnMenosCiclos = document.getElementById("btnMenosCiclos");
    const btnMasCiclos = document.getElementById("btnMasCiclos");
    const displayCiclos = document.getElementById("displayCiclos");

    const switchAutoEstudio = document.getElementById("switchAutoEstudio");

    const indicadorCicloEstudio = document.getElementById("indicadorCicloEstudio");
    const indicadorCicloDescanso = document.getElementById("indicadorCicloDescanso");

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
    // ALMACENAMIENTO POR USUARIO
    // =========================================
    // Cada usuario tiene sus propios objetivos, historial, apps y ajustes.
    let idUsuarioActual = null;

    function claveUsuario(base) {
        return `focus_${base}__${idUsuarioActual || "invitado"}`;
    }

    function leerJSON(clave, porDefecto) {
        try {
            const raw = localStorage.getItem(clave);
            return raw ? JSON.parse(raw) : porDefecto;
        } catch (e) {
            return porDefecto;
        }
    }

    function leerDatoUsuario(base, porDefecto) {
        return leerJSON(claveUsuario(base), porDefecto);
    }

    function guardarDatoUsuario(base, valor) {
        localStorage.setItem(claveUsuario(base), JSON.stringify(valor));
    }

    // Las versiones anteriores guardaban todo en claves globales compartidas.
    // Esos datos se entregan una sola vez al primer usuario que inicia sesión.
    const CLAVES_ANTIGUAS = {
        focus_objetivos: "objetivos",
        focus_historial: "historial",
        focus_apps_bloqueadas_lista: "apps",
        focus_master_bloqueo: "bloqueoMaestro"
    };

    function migrarDatosAntiguos() {
        Object.entries(CLAVES_ANTIGUAS).forEach(([claveVieja, base]) => {
            const valor = localStorage.getItem(claveVieja);
            if (valor === null) return;
            if (localStorage.getItem(claveUsuario(base)) === null) {
                if (base === "bloqueoMaestro") guardarDatoUsuario(base, valor !== "false");
                else localStorage.setItem(claveUsuario(base), valor);
            }
            localStorage.removeItem(claveVieja);
        });
        localStorage.removeItem("focus_apps_bloqueadas");
    }

    // =========================================
    // SISTEMA DE AUDIO Y TOAST
    // =========================================
    let contextoAudio = null; // se reutiliza: crear uno por aviso agota los recursos de audio

    function reproducirCampanada() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!contextoAudio) contextoAudio = new AudioCtx();
            const ctx = contextoAudio;
            if (ctx.state === "suspended") ctx.resume();
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

    // avisoSistema = true también muestra una notificación de Windows si la app no está enfocada
    function mostrarNotificacion(icono, titulo, mensaje, avisoSistema = false) {
        reproducirCampanada();
        if (avisoSistema) enviarIPC("notificar", { titulo: `${icono} ${titulo}`, cuerpo: mensaje });
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
    let masterBloqueoActivo = true;
    let bloqueoEnCurso = false;

    // Inicializar interruptor maestro
    if (switchMasterBloqueo) {
        switchMasterBloqueo.addEventListener("change", (e) => {
            masterBloqueoActivo = e.target.checked;
            guardarDatoUsuario("bloqueoMaestro", masterBloqueoActivo);
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

    // Normaliza una app guardada: descarta nombres de .exe inválidos e iconos sospechosos
    function sanearApp(app, idx) {
        if (!app || typeof app.exe !== "string") return null;
        const exe = app.exe.trim().toLowerCase().endsWith(".exe") ? app.exe.trim() : app.exe.trim() + ".exe";
        if (!EXE_VALIDO.test(exe)) return null;
        const sugerida = APPS_SUGERIDAS.find(s => s.exe.toLowerCase() === exe.toLowerCase());
        const iconoUrl = (typeof app.iconoUrl === "string" && ICONO_DATAURL_VALIDO.test(app.iconoUrl)) ? app.iconoUrl : null;
        return {
            id: typeof app.id === "string" && app.id ? app.id : `app_${Date.now()}_${idx}`,
            nombre: typeof app.nombre === "string" && app.nombre ? app.nombre : exe.replace(/\.exe$/i, ""),
            exe,
            activo: app.activo !== false,
            iconoKey: sugerida ? sugerida.iconoKey : (ICONOS_APPS_SVG[app.iconoKey] ? app.iconoKey : "generico"),
            iconoUrl
        };
    }

    function cargarAppsBloqueadas() {
        const guardadas = leerDatoUsuario("apps", null);
        if (Array.isArray(guardadas)) {
            const vistos = new Set();
            appsBloqueadas = guardadas
                .map(sanearApp)
                .filter(Boolean)
                .filter(app => {
                    // Evitar duplicados por id o por ejecutable
                    const clave = app.exe.toLowerCase();
                    if (vistos.has(clave) || vistos.has("id:" + app.id)) return false;
                    vistos.add(clave); vistos.add("id:" + app.id);
                    return true;
                });
        } else {
            // Lista inicial: solo distracciones claras (el navegador suele hacer falta para estudiar)
            appsBloqueadas = [
                { id: "discord", nombre: "Discord", exe: "Discord.exe", activo: true, iconoKey: "discord", iconoUrl: null },
                { id: "steam", nombre: "Steam", exe: "steam.exe", activo: true, iconoKey: "steam", iconoUrl: null }
            ];
            guardarDatoUsuario("apps", appsBloqueadas);
        }
        masterBloqueoActivo = leerDatoUsuario("bloqueoMaestro", true) !== false;
        if (switchMasterBloqueo) switchMasterBloqueo.checked = masterBloqueoActivo;
    }

    function guardarAppsBloqueadas() {
        guardarDatoUsuario("apps", appsBloqueadas);
        actualizarEstadoBloqueador();
        if (funcionando && modoActual === "estudio") {
            iniciarBloqueoApps();
        }
    }

    function actualizarEstadoBloqueador() {
        const totalActivas = appsBloqueadas.filter(a => a.activo).length;
        if (badgeContadorApps) {
            // El color lo pone el CSS (así respeta el tema activo)
            badgeContadorApps.classList.toggle("pausado", !masterBloqueoActivo);
            badgeContadorApps.textContent = masterBloqueoActivo
                ? `${totalActivas} activa${totalActivas === 1 ? "" : "s"}`
                : "Pausado";
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

        if (typeof app.iconoUrl === "string" && ICONO_DATAURL_VALIDO.test(app.iconoUrl)) {
            // El error de carga se maneja con addEventListener en renderizarListaApps (sin JS en línea)
            return `
                <img src="${escapeHtml(app.iconoUrl)}" class="icono-app-img" alt="${escapeHtml(app.nombre)}">
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
                        <input type="checkbox" class="check-app-toggle" data-id="${escapeHtml(app.id)}" ${app.activo ? "checked" : ""}>
                        <span class="slider-app"></span>
                    </label>
                    <button type="button" class="btn-eliminar-app" data-id="${escapeHtml(app.id)}" title="Eliminar de la lista">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            // Si el icono real no carga, mostrar el SVG de respaldo
            const img = tarjeta.querySelector(".icono-app-img");
            if (img) {
                img.addEventListener("error", () => {
                    img.style.display = "none";
                    if (img.nextElementSibling) img.nextElementSibling.style.display = "flex";
                });
            }

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

    // Añade (o reactiva) una app a la lista. Devuelve false si el nombre no es válido.
    function agregarApp({ exe, nombre, iconoKey = "generico", iconoUrl = null }) {
        exe = String(exe || "").trim();
        if (!exe.toLowerCase().endsWith(".exe")) exe += ".exe";
        if (!EXE_VALIDO.test(exe)) {
            mostrarNotificacion("⚠️", "Nombre no válido", "Usa solo letras, números, espacios, puntos, guiones o paréntesis (ej: valorant.exe).");
            return false;
        }
        const sugerida = APPS_SUGERIDAS.find(s => s.exe.toLowerCase() === exe.toLowerCase());
        if (sugerida) iconoKey = sugerida.iconoKey;
        const iconoValido = (typeof iconoUrl === "string" && ICONO_DATAURL_VALIDO.test(iconoUrl)) ? iconoUrl : null;
        const nombreFinal = sugerida ? sugerida.nombre : (nombre || exe.replace(/\.exe$/i, ""));

        const existente = appsBloqueadas.find(a => a.exe.toLowerCase() === exe.toLowerCase());
        if (existente) {
            existente.activo = true;
            if (iconoValido && !existente.iconoUrl) existente.iconoUrl = iconoValido;
            mostrarNotificacion("ℹ️", "Ya configurada", `${existente.nombre} ya estaba en tu lista y fue activada.`);
        } else {
            appsBloqueadas.unshift({
                id: "app_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
                nombre: nombreFinal.charAt(0).toUpperCase() + nombreFinal.slice(1),
                exe,
                activo: true,
                iconoKey,
                iconoUrl: iconoValido
            });
            mostrarNotificacion("✨", "Aplicación añadida", `${nombreFinal} añadida a la lista de bloqueo.`);
        }
        guardarAppsBloqueadas();
        renderizarSugerencias();
        renderizarListaApps();
        return true;
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
            inputNombreAppPersonalizada.value = "";
        } else if (agregarApp({ exe: texto, nombre: texto.replace(/\.exe$/i, "") })) {
            inputNombreAppPersonalizada.value = "";
        }
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
            if (!api) {
                if (inputArchivoExeFallback) inputArchivoExeFallback.click();
                return;
            }
            try {
                const res = await api.invoke("seleccionar-archivo-exe");
                if (res && res.archivo) {
                    agregarApp({ exe: res.archivo, nombre: res.nombre, iconoUrl: res.icono });
                }
            } catch (err) {
                console.warn("Fallo diálogo nativo, recurriendo al selector:", err);
                if (inputArchivoExeFallback) inputArchivoExeFallback.click();
            }
        });
    }

    // Selector de archivo fallback (HTML)
    if (inputArchivoExeFallback) {
        inputArchivoExeFallback.addEventListener("change", (e) => {
            if (e.target.files && e.target.files.length > 0) {
                const archivo = e.target.files[0].name;
                agregarApp({ exe: archivo, nombre: archivo.replace(/\.exe$/i, "") });
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

    // =========================================
    // CENTINELA DE BLOQUEO (se ejecuta en el proceso principal, ver main.js)
    // =========================================
    function iniciarBloqueoApps() {
        if (!api || api.plataforma !== "win32") {
            console.log("El bloqueo de apps solo funciona en Windows dentro de Electron.");
            return;
        }
        if (!masterBloqueoActivo) {
            detenerBloqueoApps();
            return;
        }

        const listaApps = appsBloqueadas
            .filter(app => app.activo)
            .map(app => app.exe)
            .filter(exe => EXE_VALIDO.test(exe));

        if (listaApps.length === 0) {
            detenerBloqueoApps();
            return;
        }

        enviarIPC("bloqueo-iniciar", listaApps);
        bloqueoEnCurso = true;
    }

    function detenerBloqueoApps() {
        if (!bloqueoEnCurso) return;
        enviarIPC("bloqueo-detener");
        bloqueoEnCurso = false;
    }

    // Aviso cada vez que el centinela cierra una app
    if (api) {
        api.on("app-bloqueada", (exe) => {
            const app = appsBloqueadas.find(a => a.exe.toLowerCase() === String(exe).toLowerCase());
            const nombre = app ? app.nombre : exe;
            mostrarNotificacion("🛡️", "Distracción bloqueada", `${nombre} se cerró. ¡Sigue concentrado!`);
        });
    }

    // =========================================
    // AUTENTICACIÓN Y SESIONES
    // =========================================
    function obtenerUsuariosRegistrados() {
        const lista = leerJSON("focus_usuarios", []);
        return Array.isArray(lista) ? lista : [];
    }
    function guardarUsuariosRegistrados(u) { localStorage.setItem("focus_usuarios", JSON.stringify(u)); }
    function obtenerUsuarioActivo() { return leerJSON("focus_usuario_activo", null); }

    // ---- Contraseñas con hash (PBKDF2 + sal aleatoria). Nunca se guardan en texto plano ----
    const ITERACIONES_PBKDF2 = 150000;

    function bytesAHex(bytes) {
        return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    }
    function hexABytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        return bytes;
    }

    async function calcularHash(password, salHex) {
        const sal = salHex ? hexABytes(salHex) : crypto.getRandomValues(new Uint8Array(16));
        const clave = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits(
            { name: "PBKDF2", salt: sal, iterations: ITERACIONES_PBKDF2, hash: "SHA-256" },
            clave,
            256
        );
        return { hash: bytesAHex(new Uint8Array(bits)), sal: bytesAHex(sal) };
    }

    // Comparación en tiempo constante
    function hashesIguales(a, b) {
        if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
        let diferencia = 0;
        for (let i = 0; i < a.length; i++) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
        return diferencia === 0;
    }

    async function verificarPassword(usuario, password) {
        if (usuario.passwordHash && usuario.sal) {
            const { hash } = await calcularHash(password, usuario.sal);
            return hashesIguales(hash, usuario.passwordHash);
        }
        // Cuentas creadas con la versión anterior (contraseña en texto plano)
        return typeof usuario.password === "string" && usuario.password === password;
    }

    // Solo los datos públicos del usuario se guardan como "sesión activa"
    function datosPublicos(u) {
        return { usuario: u.usuario, nombre: u.nombre, email: u.email || null, esInvitado: Boolean(u.esInvitado) };
    }

    function iniciarSesionConUsuario(u) {
        const publico = datosPublicos(u);
        localStorage.setItem("focus_usuario_activo", JSON.stringify(publico));
        idUsuarioActual = publico.esInvitado ? "invitado" : String(publico.email || publico.usuario || "invitado").toLowerCase();
        migrarDatosAntiguos();
        cargarDatosUsuario();
        nombreUsuarioActivo.textContent = publico.nombre || "Entrenador";
        barraSuperior.classList.remove("oculta");
        cambiarModo("principal");
    }

    function cerrarSesion() {
        cambiarModo("auth"); // detiene el timer, el bloqueo y guarda la sesión en curso
        localStorage.removeItem("focus_usuario_activo");
        idUsuarioActual = null;
        mostrarNotificacion("👋", "Sesión cerrada", "Has vuelto a la pantalla de inicio.");
    }

    function limpiarMensajesAuth() {
        if (errorLogin) { errorLogin.textContent = ""; errorLogin.classList.add("oculta"); }
        if (exitoLogin) { exitoLogin.textContent = ""; exitoLogin.classList.add("oculta"); }
        if (errorRegister) { errorRegister.textContent = ""; errorRegister.classList.add("oculta"); }
        if (exitoRegister) { exitoRegister.textContent = ""; exitoRegister.classList.add("oculta"); }
    }

    function mostrarErrorAuth(elemento, texto) {
        elemento.textContent = texto;
        elemento.classList.remove("oculta");
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
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault(); limpiarMensajesAuth();
            const ident = loginUsuario.value.trim().toLowerCase();
            const pass = loginPassword.value;
            if (!ident || !pass) { mostrarErrorAuth(errorLogin, "Por favor, completa todos los campos."); return; }

            const usuarios = obtenerUsuariosRegistrados();
            const usuarioEncontrado = usuarios.find(u => (u.usuario?.toLowerCase() === ident) || (u.email?.toLowerCase() === ident));
            if (!usuarioEncontrado || !(await verificarPassword(usuarioEncontrado, pass))) {
                // Mismo mensaje en ambos casos para no revelar qué cuentas existen
                mostrarErrorAuth(errorLogin, "Usuario o contraseña incorrectos.");
                return;
            }

            // Migrar cuentas antiguas: reemplazar la contraseña en texto plano por su hash
            if (!usuarioEncontrado.passwordHash) {
                const { hash, sal } = await calcularHash(pass);
                usuarioEncontrado.passwordHash = hash;
                usuarioEncontrado.sal = sal;
                delete usuarioEncontrado.password;
                guardarUsuariosRegistrados(usuarios);
            }

            formLogin.reset(); limpiarMensajesAuth(); iniciarSesionConUsuario(usuarioEncontrado);
            mostrarNotificacion("✨", `¡Hola de nuevo, ${usuarioEncontrado.nombre}!`, "Listo para concentrarte hoy.");
        });
    }

    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault(); limpiarMensajesAuth();
            const nombre = regNombre.value.trim(); const email = regEmail.value.trim().toLowerCase(); const pass = regPassword.value;
            if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || pass.length < 6) {
                mostrarErrorAuth(errorRegister, "Ingresa un nombre, un correo válido y una contraseña de al menos 6 caracteres.");
                return;
            }

            const usuarios = obtenerUsuariosRegistrados();
            if (usuarios.some((u) => u.usuario?.toLowerCase() === nombre.toLowerCase() || u.email?.toLowerCase() === email)) {
                mostrarErrorAuth(errorRegister, "El usuario o correo ya está registrado.");
                return;
            }

            const { hash, sal } = await calcularHash(pass);
            const nuevoUsuario = { usuario: nombre, nombre, email, passwordHash: hash, sal, fechaRegistro: new Date().toISOString() };
            usuarios.push(nuevoUsuario); guardarUsuariosRegistrados(usuarios);
            formRegister.reset(); limpiarMensajesAuth(); iniciarSesionConUsuario(nuevoUsuario);
            mostrarNotificacion("🎉", "¡Cuenta creada!", `Bienvenido, Entrenador ${nombre}.`);
        });
    }

    if (btnInvitado) btnInvitado.addEventListener("click", () => { iniciarSesionConUsuario({ nombre: "Invitado", usuario: "invitado", esInvitado: true }); mostrarNotificacion("🍃", "Modo Invitado", "Has ingresado sin cuenta."); });
    if (btnCerrarSesion) btnCerrarSesion.addEventListener("click", cerrarSesion);

    // =========================================
    // CONFIGURACIÓN (se guarda por usuario)
    // =========================================
    const LIMITES = {
        estudio: [1, 180],
        descanso: [1, 90],
        descansoLargo: [1, 90],
        ciclos: [1, 8]
    };
    const CONFIG_POR_DEFECTO = {
        estudio: 50,
        descanso: 10,
        descansoLargo: 20,
        ciclos: 4,            // pomodoros antes del descanso largo
        autoEstudio: false,   // empezar el estudio solo al terminar el descanso
        modoPop: "inicio"
    };
    let config = { ...CONFIG_POR_DEFECTO };

    function limitar(valor, [min, max], porDefecto) {
        const n = Math.round(Number(valor));
        return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : porDefecto;
    }

    function cargarConfig() {
        const guardada = leerDatoUsuario("config", {}) || {};
        config = { ...CONFIG_POR_DEFECTO, ...guardada };
        Object.keys(LIMITES).forEach(k => { config[k] = limitar(config[k], LIMITES[k], CONFIG_POR_DEFECTO[k]); });
        if (!guardada.modoPop) config.modoPop = localStorage.getItem("focus_modo_pop") || CONFIG_POR_DEFECTO.modoPop;
        if (!["inicio", "boton", "minimizar"].includes(config.modoPop)) config.modoPop = "inicio";
        config.autoEstudio = Boolean(config.autoEstudio);

        if (selectModoPop) selectModoPop.value = config.modoPop;
        if (switchAutoEstudio) switchAutoEstudio.checked = config.autoEstudio;
        enviarIPC("actualizar-modo-pop", config.modoPop);
        actualizarConfiguracionTiempos();
    }

    function guardarConfig() {
        guardarDatoUsuario("config", config);
    }

    // =========================================
    // CICLOS POMODORO (descanso largo cada N pomodoros)
    // =========================================
    let pomodorosCompletados = 0; // pomodoros terminados en el ciclo actual
    let descansoEsLargo = false;

    function fechaLocal(fecha = new Date()) {
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    }

    function cargarCiclo() {
        const guardado = leerDatoUsuario("ciclo", null);
        // El ciclo vuelve a empezar cada día
        pomodorosCompletados = (guardado && guardado.fecha === fechaLocal()) ? Number(guardado.completados) || 0 : 0;
    }

    function guardarCiclo() {
        guardarDatoUsuario("ciclo", { fecha: fechaLocal(), completados: pomodorosCompletados });
    }

    function actualizarIndicadorCiclo() {
        const total = config.ciclos;
        if (indicadorCicloEstudio) {
            const actual = Math.min(pomodorosCompletados + 1, total);
            indicadorCicloEstudio.textContent = `🍅 Pomodoro ${actual} de ${total}`;
        }
        if (indicadorCicloDescanso) {
            indicadorCicloDescanso.textContent = descansoEsLargo
                ? `🌙 Descanso largo · ¡ciclo de ${total} completado!`
                : `☕ Descanso corto · ${pomodorosCompletados} de ${total} pomodoros`;
        }
    }

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

    let modoActual = "auth";
    let segundosRestantes = config.estudio * 60;
    let intervalo = null;
    let funcionando = false;
    // Hora exacta en que termina el bloque: así el tiempo no se atrasa aunque
    // la ventana esté minimizada o el equipo vaya lento.
    let finTimestamp = null;

    function duracionModoActual() {
        if (modoActual === "descanso") return (descansoEsLargo ? config.descansoLargo : config.descanso) * 60;
        return config.estudio * 60;
    }

    if (selectModoPop) {
        selectModoPop.addEventListener("change", (e) => {
            config.modoPop = e.target.value;
            guardarConfig();
            enviarIPC("actualizar-modo-pop", config.modoPop);
        });
    }

    if (switchAutoEstudio) {
        switchAutoEstudio.addEventListener("change", (e) => {
            config.autoEstudio = e.target.checked;
            guardarConfig();
        });
    }

    function evaluarAbrirPop() {
        if (config.modoPop === "inicio") enviarIPC("abrir-pop-temporizador");
    }

    const toggleManualPop = () => enviarIPC("toggle-pop-temporizador");
    if (btnPopTemporizador) btnPopTemporizador.addEventListener("click", toggleManualPop);
    if (btnPopTemporizadorDescanso) btnPopTemporizadorDescanso.addEventListener("click", toggleManualPop);

    function actualizarConfiguracionTiempos() {
        if (displayMinutosEstudio) displayMinutosEstudio.textContent = config.estudio;
        if (displayMinutosDescanso) displayMinutosDescanso.textContent = config.descanso;
        if (displayMinutosDescansoLargo) displayMinutosDescansoLargo.textContent = config.descansoLargo;
        if (displayCiclos) displayCiclos.textContent = config.ciclos;
        if ((modoActual === "estudio" || modoActual === "descanso") && !funcionando) {
            segundosRestantes = duracionModoActual();
            actualizarTemporizador();
        }
        actualizarIndicadorCiclo();
    }

    function actualizarTemporizador() {
        const min = Math.floor(segundosRestantes / 60); const seg = segundosRestantes % 60;
        const texto = `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
        if (modoActual === "estudio" && temporizador) temporizador.textContent = texto;
        else if (modoActual === "descanso" && temporizadorDescanso) temporizadorDescanso.textContent = texto;
        enviarIPC("actualizar-tiempo", { texto, modo: modoActual, largo: descansoEsLargo, corriendo: funcionando });
    }

    function calcularRestantes() {
        return Math.max(0, Math.ceil((finTimestamp - Date.now()) / 1000));
    }

    function tick() {
        const restantes = calcularRestantes();
        if (restantes !== segundosRestantes) {
            segundosRestantes = restantes;
            actualizarTemporizador();
        }
        if (restantes <= 0) terminarBloque();
    }

    function botonDelModo() {
        return modoActual === "estudio" ? botonInicio : botonDescanso;
    }

    function textoBotonInicio() {
        const empezado = segundosRestantes < duracionModoActual();
        if (empezado) return "Reanudar";
        return modoActual === "estudio" ? "Empezar estudio" : "Empezar descanso";
    }

    function iniciarConteo() {
        if (funcionando || (modoActual !== "estudio" && modoActual !== "descanso")) return;
        if (segundosRestantes <= 0) segundosRestantes = duracionModoActual();
        funcionando = true;
        finTimestamp = Date.now() + segundosRestantes * 1000;
        intervalo = setInterval(tick, 250);
        abrirOReanudarSesion();
        fijarBotonPrincipal(botonDelModo(), "pausa", "Pausar");
        enviarIPC("estado-temporizador", true);
        evaluarAbrirPop();
        if (modoActual === "estudio") {
            iniciarBloqueoApps();
            enviarIPC("cerrar-ventana-juegos"); // los minijuegos son solo para el descanso
        }
        actualizarTemporizador();
    }

    // Detiene el conteo sin perder el tiempo restante
    function detenerConteo() {
        if (intervalo) clearInterval(intervalo);
        intervalo = null;
        if (funcionando && finTimestamp) segundosRestantes = calcularRestantes();
        funcionando = false;
        finTimestamp = null;
        pausarSesion();
        detenerBloqueoApps();
        enviarIPC("estado-temporizador", false);
    }

    function pausarConteo() {
        if (!funcionando) return;
        detenerConteo();
        fijarBotonPrincipal(botonDelModo(), "play", "Reanudar");
        if (config.modoPop === "inicio") enviarIPC("cerrar-pop-temporizador");
        actualizarTemporizador();
    }

    function terminarBloque() {
        detenerConteo();
        registrarSesion(true);
        if (modoActual === "estudio") {
            pomodorosCompletados++;
            const tocaLargo = pomodorosCompletados >= config.ciclos;
            guardarCiclo();
            mostrarNotificacion(
                "☕",
                "¡Sesión de estudio cumplida!",
                tocaLargo
                    ? `¡Completaste ${config.ciclos} pomodoros! Te ganaste un descanso largo de ${config.descansoLargo} min.`
                    : "Excelente trabajo. Toca relajarse con Snorlax.",
                true
            );
            cambiarModo("descanso", { autoIniciar: true, largo: tocaLargo });
        } else {
            mostrarNotificacion(
                "📚",
                "¡Descanso finalizado!",
                config.autoEstudio ? "Energías renovadas. Comenzando nuevo bloque de estudio." : "Cuando quieras, pulsa «Empezar estudio».",
                true
            );
            cambiarModo("estudio", { autoIniciar: config.autoEstudio });
        }
    }

    function reiniciarTemporizador() {
        detenerConteo();
        registrarSesion(false);
        segundosRestantes = duracionModoActual();
        fijarBotonPrincipal(botonDelModo(), "play", textoBotonInicio());
        if (config.modoPop === "inicio") enviarIPC("cerrar-pop-temporizador");
        actualizarTemporizador();
        mostrarNotificacion("↺", "Contador reiniciado", "El tiempo ha vuelto al inicio.");
    }

    function controlarTemporizador() {
        if (funcionando) pausarConteo();
        else iniciarConteo();
    }

    // Muestra la pantalla de un modo sin tocar el temporizador
    function mostrarPantalla(modo) {
        [pantallaAuth, pantallaPrincipal, pantallaEstudio, pantallaDescanso, pantallaHistorial]
            .forEach(p => { if (p) p.classList.add("oculta"); });

        if (modo === "auth") {
            pantallaAuth.classList.remove("oculta");
            barraSuperior.classList.add("oculta");
            if (btnCambiarTema) btnCambiarTema.classList.add("oculta");
            document.documentElement.dataset.set = "clasico";
            document.body.className = "tema-auth";
            document.title = "FOCUS - INICIAR SESIÓN";
            limpiarMensajesAuth();
            if (panelObjetivos) panelObjetivos.classList.add("oculta");
            return;
        }

        barraSuperior.classList.remove("oculta");
        if (btnCambiarTema) btnCambiarTema.classList.remove("oculta");
        document.documentElement.dataset.set = setPokemon;

        // El panel de objetivos se mueve a la pantalla visible
        const destinos = {
            principal: ["contenedorPrincipalBulbasaur", ".columna-bulbasaur"],
            estudio: ["zonaEstudioLayout", ".columna-centro-modo"],
            descanso: ["zonaDescansoLayout", ".columna-centro-modo"]
        };
        if (panelObjetivos && destinos[modo]) {
            panelObjetivos.classList.remove("oculta");
            const contenedor = document.getElementById(destinos[modo][0]);
            const columna = contenedor ? contenedor.querySelector(destinos[modo][1]) : null;
            if (contenedor && columna && panelObjetivos.parentElement !== contenedor) {
                contenedor.insertBefore(panelObjetivos, columna);
            }
        }

        if (modo === "principal") {
            pantallaPrincipal.classList.remove("oculta");
            document.body.className = "tema-bulbasaur";
            document.title = "FOCUS - PANEL PRINCIPAL";
        } else if (modo === "descanso") {
            pantallaDescanso.classList.remove("oculta");
            document.body.className = "tema-descanso";
            document.title = descansoEsLargo ? "FOCUS - DESCANSO LARGO" : "FOCUS - MODO DESCANSO";
        } else if (modo === "estudio") {
            pantallaEstudio.classList.remove("oculta");
            document.body.className = "tema-estudio";
            document.title = "FOCUS - MODO ESTUDIO";
        }
        actualizarIndicadorCiclo();
        actualizarBotonTema();
    }

    // opciones: { autoIniciar, largo }. También acepta un booleano (autoIniciar) por compatibilidad.
    function cambiarModo(nuevoModo, opciones = {}) {
        if (typeof opciones === "boolean") opciones = { autoIniciar: opciones };
        const { autoIniciar = false, largo = false } = opciones;

        detenerConteo();
        registrarSesion(false); // si había una sesión a medias, se guarda como interrumpida

        modoActual = nuevoModo;

        if (modoActual === "descanso") {
            descansoEsLargo = largo;
            if (largo) {
                pomodorosCompletados = 0; // empieza un ciclo nuevo
                guardarCiclo();
            }
        }

        if (modoActual === "auth" || modoActual === "principal") {
            enviarIPC("cerrar-pop-temporizador");
        } else {
            segundosRestantes = duracionModoActual();
            actualizarTemporizador();
            fijarBotonPrincipal(botonDelModo(), "play", textoBotonInicio());
        }

        mostrarPantalla(modoActual);

        if (autoIniciar) iniciarConteo();
    }

    function ajustarConfig(clave, delta) {
        const nuevo = limitar(config[clave] + delta, LIMITES[clave], config[clave]);
        if (nuevo === config[clave]) return;
        config[clave] = nuevo;
        guardarConfig();
        actualizarConfiguracionTiempos();
    }

    if (btnMenosEstudio) btnMenosEstudio.addEventListener("click", () => ajustarConfig("estudio", -1));
    if (btnMasEstudio) btnMasEstudio.addEventListener("click", () => ajustarConfig("estudio", 1));
    if (btnMenosDescanso) btnMenosDescanso.addEventListener("click", () => ajustarConfig("descanso", -1));
    if (btnMasDescanso) btnMasDescanso.addEventListener("click", () => ajustarConfig("descanso", 1));
    if (btnMenosDescansoLargo) btnMenosDescansoLargo.addEventListener("click", () => ajustarConfig("descansoLargo", -1));
    if (btnMasDescansoLargo) btnMasDescansoLargo.addEventListener("click", () => ajustarConfig("descansoLargo", 1));
    if (btnMenosCiclos) btnMenosCiclos.addEventListener("click", () => ajustarConfig("ciclos", -1));
    if (btnMasCiclos) btnMasCiclos.addEventListener("click", () => ajustarConfig("ciclos", 1));

    function aplicarPreset(estudio, descanso, descansoLargo) {
        config.estudio = estudio;
        config.descanso = descanso;
        config.descansoLargo = descansoLargo;
        guardarConfig();
        actualizarConfiguracionTiempos();
    }
    if (btnPreset25) btnPreset25.addEventListener("click", () => aplicarPreset(25, 5, 15));
    if (btnPreset50) btnPreset50.addEventListener("click", () => aplicarPreset(50, 10, 20));
    if (btnPreset90) btnPreset90.addEventListener("click", () => aplicarPreset(90, 15, 30));

    if (btnIrEstudioDesdeBulbasaur) btnIrEstudioDesdeBulbasaur.addEventListener("click", () => cambiarModo("estudio"));
    if (btnIrDescansoDesdeBulbasaur) btnIrDescansoDesdeBulbasaur.addEventListener("click", () => cambiarModo("descanso"));

    if (botonInicio) botonInicio.addEventListener("click", controlarTemporizador);
    if (botonDescanso) botonDescanso.addEventListener("click", controlarTemporizador);
    if (botonCambiarModo) botonCambiarModo.addEventListener("click", () => cambiarModo("descanso"));
    if (botonCambiarModoDescanso) botonCambiarModoDescanso.addEventListener("click", () => cambiarModo("estudio"));
    if (botonReiniciar) botonReiniciar.addEventListener("click", reiniciarTemporizador);
    if (botonReiniciarDescanso) botonReiniciarDescanso.addEventListener("click", reiniciarTemporizador);
    if (botonAjustesEstudio) botonAjustesEstudio.addEventListener("click", () => cambiarModo("principal"));
    if (botonAjustesDescanso) botonAjustesDescanso.addEventListener("click", () => cambiarModo("principal"));

    // =========================================
    // ABRIR SALA DE JUEGOS EN NUEVA VENTANA
    // =========================================
    if (botonJugar) {
        botonJugar.addEventListener("click", () => enviarIPC("abrir-ventana-juegos"));
    }

    // =========================================
    // LÓGICA DE OBJETIVOS (TO-DO LIST)
    // =========================================
    let objetivos = [];

    const badgeContadorObjetivos = document.getElementById("badgeContadorObjetivos");
    const btnLimpiarObjetivos = document.getElementById("btnLimpiarObjetivos");

    function cargarObjetivos() {
        const guardados = leerDatoUsuario("objetivos", []);
        objetivos = Array.isArray(guardados)
            ? guardados.filter(o => o && typeof o.texto === "string")
            : [];
    }

    function guardarObjetivos() {
        guardarDatoUsuario("objetivos", objetivos);
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
        const texto = inputNuevoObjetivo.value.trim().slice(0, 200);
        if (texto.length > 0) {
            objetivos.push({ texto, completado: false });
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
        inputNuevoObjetivo.addEventListener("keydown", (e) => {
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
    const MAX_SESIONES = 300;

    // Sesión en curso. Solo cuenta el tiempo con el reloj andando (las pausas no suman).
    let sesionActiva = null; // { tipo, largo, minutosPlanificados, fecha, horaInicio, msActivos, reanudadoEn }

    function cargarHistorial() {
        const lista = leerDatoUsuario("historial", []);
        return Array.isArray(lista) ? lista : [];
    }

    function guardarHistorial(lista) {
        guardarDatoUsuario("historial", lista.slice(-MAX_SESIONES));
    }

    function abrirOReanudarSesion() {
        const ahora = Date.now();
        if (!sesionActiva) {
            const inicio = new Date(ahora);
            sesionActiva = {
                tipo: modoActual === "descanso" ? "descanso" : "estudio",
                largo: modoActual === "descanso" && descansoEsLargo,
                minutosPlanificados: Math.round(duracionModoActual() / 60),
                fecha: fechaLocal(inicio),
                horaInicio: `${String(inicio.getHours()).padStart(2, "0")}:${String(inicio.getMinutes()).padStart(2, "0")}`,
                msActivos: 0,
                reanudadoEn: ahora
            };
        } else if (!sesionActiva.reanudadoEn) {
            sesionActiva.reanudadoEn = ahora;
        }
    }

    function pausarSesion() {
        if (sesionActiva && sesionActiva.reanudadoEn) {
            sesionActiva.msActivos += Date.now() - sesionActiva.reanudadoEn;
            sesionActiva.reanudadoEn = null;
        }
    }

    function registrarSesion(completada) {
        if (!sesionActiva) return;
        pausarSesion();
        const s = sesionActiva;
        sesionActiva = null;

        // Nunca se cuenta más que lo planificado (por ejemplo, si la PC se suspendió durante la sesión)
        const msActivos = Math.min(s.msActivos, s.minutosPlanificados * 60000);

        // Las sesiones interrumpidas de menos de 1 minuto no se guardan
        if (!completada && msActivos < 60000) return;
        const duracionMin = Math.max(1, Math.round(msActivos / 60000));

        const lista = cargarHistorial();
        lista.push({
            id: "ses_" + Date.now(),
            fecha: s.fecha,
            horaInicio: s.horaInicio,
            tipo: s.tipo,
            largo: s.largo,
            duracionMin,
            minutosPlanificados: s.minutosPlanificados,
            completada
        });
        guardarHistorial(lista);
    }

    // Si se cierra la app con una sesión a medias, se guarda como interrumpida
    window.addEventListener("beforeunload", () => {
        if (idUsuarioActual) registrarSesion(false);
    });

    // ---- Métricas ----
    function calcularMetricas(lista) {
        const fechaHoy = fechaLocal();
        const estudio = lista.filter(s => s.tipo === "estudio");

        const minHoy = estudio.filter(s => s.fecha === fechaHoy).reduce((acc, s) => acc + s.duracionMin, 0);
        const totalMin = estudio.reduce((acc, s) => acc + s.duracionMin, 0);
        const completas = estudio.filter(s => s.completada).length;

        // Racha: días consecutivos con estudio. Si hoy aún no estudiaste, la racha de ayer sigue viva.
        const dias = new Set(estudio.map(s => s.fecha));
        const diaCheck = new Date();
        if (!dias.has(fechaLocal(diaCheck))) diaCheck.setDate(diaCheck.getDate() - 1);
        let racha = 0;
        while (dias.has(fechaLocal(diaCheck))) {
            racha++;
            diaCheck.setDate(diaCheck.getDate() - 1);
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
        const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
        const ayer = new Date(hoy); ayer.setDate(hoy.getDate() - 1);
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        if (fecha.getTime() === hoy.getTime()) return "🗓️ Hoy";
        if (fecha.getTime() === ayer.getTime()) return "📆 Ayer";
        return `${diasSemana[fecha.getDay()]} ${d} de ${meses[m - 1]}`;
    }

    // ---- Renderizado del historial ----
    let filtroActual = "todo";

    function renderizarHistorial() {
        if (!listaHistorialEl) return;
        const lista = cargarHistorial();
        const filtrada = filtroActual === "todo" ? lista : lista.filter(s => s.tipo === filtroActual);
        const invertida = [...filtrada].reverse(); // más recientes primero

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
                const titulo = esEstudio ? "Sesión de Estudio" : (s.largo ? "Descanso largo" : "Descanso");
                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-sesion";
                tarjeta.innerHTML = `
                    <div class="sesion-icono-tipo ${esEstudio ? "estudio" : "descanso"}">${esEstudio ? "📚" : (s.largo ? "🌙" : "😴")}</div>
                    <div class="sesion-info">
                        <p class="sesion-titulo">${titulo}</p>
                        <p class="sesion-subtitulo">Inicio: ${escapeHtml(s.horaInicio)} · Planificado: ${Number(s.minutosPlanificados) || 0} min</p>
                    </div>
                    <div class="sesion-duracion">
                        ${formatMin(Number(s.duracionMin) || 0)}
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
    // Abrir el historial NO detiene el temporizador: sigue corriendo de fondo.
    function abrirHistorial() {
        [pantallaAuth, pantallaPrincipal, pantallaEstudio, pantallaDescanso, panelObjetivos]
            .forEach(p => { if (p) p.classList.add("oculta"); });
        if (pantallaHistorial) pantallaHistorial.classList.remove("oculta");
        document.body.className = "tema-bulbasaur";
        document.title = "FOCUS - Historial";
        renderizarHistorial();
    }

    function cerrarHistorial() {
        mostrarPantalla(modoActual); // vuelve a la misma pantalla sin reiniciar el tiempo
    }

    if (btnAbrirHistorial) btnAbrirHistorial.addEventListener("click", abrirHistorial);
    if (btnCerrarHistorial) btnCerrarHistorial.addEventListener("click", cerrarHistorial);

    if (btnLimpiarHistorial) {
        btnLimpiarHistorial.addEventListener("click", () => {
            if (confirm("¿Borrar todo el historial de sesiones? Esta acción no se puede deshacer.")) {
                localStorage.removeItem(claveUsuario("historial"));
                renderizarHistorial();
                mostrarNotificacion("🗑️", "Historial borrado", "Se eliminaron todas las sesiones guardadas.");
            }
        });
    }

    document.querySelectorAll(".btn-filtro-hist").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-filtro-hist").forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            filtroActual = btn.dataset.filtro;
            renderizarHistorial();
        });
    });

    // =========================================
    // SETS DE POKÉMON (cambian la imagen y la paleta de colores)
    // =========================================
    // "clasico": Bulbasaur / Gengar / Snorlax  ·  "alt": Clefairy / Mewtwo / Pikachu
    // Los colores del set alternativo están en temas-pokemon.css (generado con `npm run temas`).
    const SETS_POKEMON = {
        clasico: {
            principal: { nombre: "Bulbasaur", src: "assets/WnES.gif" },
            estudio: { nombre: "Gengar", src: "assets/shiny-gengar-ig.gif" },
            descanso: { nombre: "Snorlax", src: "assets/Pixel Eat Sticker.gif" }
        },
        alt: {
            principal: { nombre: "Clefairy", src: "assets/clefairy.gif" },
            estudio: { nombre: "Mewtwo", src: "assets/mewtwo.gif" },
            descanso: { nombre: "Pikachu", src: "assets/pikachu-durmiendo.gif" }
        }
    };
    const IMAGENES_POKEMON = {
        principal: document.getElementById("imgPokemonPrincipal"),
        estudio: document.getElementById("imgPokemonEstudio"),
        descanso: document.getElementById("imgPokemonDescanso")
    };
    const DESCRIPCION_PANTALLA = {
        principal: "de la pantalla principal",
        estudio: "de modo estudio",
        descanso: "de modo descanso"
    };
    const btnCambiarTema = document.getElementById("btnCambiarTema");
    const textoCambiarTema = document.getElementById("textoCambiarTema");

    let setPokemon = "clasico";
    const avisosImagenFaltante = new Set();
    let pendientesAviso = [];
    let timeoutAvisoImagen = null;

    // Junta los archivos que faltan en un solo aviso (cada imagen falla por separado)
    function avisarImagenFaltante(src) {
        if (avisosImagenFaltante.has(src)) return;
        avisosImagenFaltante.add(src);
        pendientesAviso.push(src);
        clearTimeout(timeoutAvisoImagen);
        timeoutAvisoImagen = setTimeout(() => {
            const lista = pendientesAviso.join(", ");
            mostrarNotificacion(
                "🖼️",
                pendientesAviso.length === 1 ? "Falta una imagen" : `Faltan ${pendientesAviso.length} imágenes`,
                `Agrega ${lista} para ver los nuevos Pokémon.`
            );
            pendientesAviso = [];
        }, 150);
    }

    function pantallaParaTema() {
        return ["principal", "estudio", "descanso"].includes(modoActual) ? modoActual : "principal";
    }

    function actualizarBotonTema() {
        if (!textoCambiarTema) return;
        const otroSet = setPokemon === "alt" ? "clasico" : "alt";
        textoCambiarTema.textContent = `Cambiar a ${SETS_POKEMON[otroSet][pantallaParaTema()].nombre}`;
    }

    function aplicarSetPokemon(set, animar = false) {
        setPokemon = SETS_POKEMON[set] ? set : "clasico";
        document.documentElement.dataset.set = setPokemon;

        Object.entries(IMAGENES_POKEMON).forEach(([pantalla, img]) => {
            if (!img) return;
            const pokemon = SETS_POKEMON[setPokemon][pantalla];
            const clasico = SETS_POKEMON.clasico[pantalla];
            img.onerror = null;
            // Si falta el GIF del set alternativo, se mantiene el clásico y se avisa una sola vez
            img.onerror = () => {
                img.onerror = null;
                img.src = clasico.src;
                img.alt = `${clasico.nombre}, el pokemon ${DESCRIPCION_PANTALLA[pantalla]}`;
                avisarImagenFaltante(pokemon.src);
            };
            if (img.getAttribute("src") !== pokemon.src) img.src = pokemon.src;
            img.alt = `${pokemon.nombre}, el pokemon ${DESCRIPCION_PANTALLA[pantalla]}`;
            if (animar) {
                img.classList.remove("cambiando");
                void img.offsetWidth; // reinicia la animación
                img.classList.add("cambiando");
            }
        });
        actualizarBotonTema();
    }

    if (btnCambiarTema) {
        btnCambiarTema.addEventListener("click", () => {
            aplicarSetPokemon(setPokemon === "alt" ? "clasico" : "alt", true);
            guardarDatoUsuario("setPokemon", setPokemon);
        });
    }

    // =========================================
    // CARGA DE DATOS DEL USUARIO
    // =========================================
    function cargarDatosUsuario() {
        cargarAppsBloqueadas();
        renderizarSugerencias();
        renderizarListaApps();
        actualizarEstadoBloqueador();
        cargarConfig();
        cargarCiclo();
        cargarObjetivos();
        renderizarObjetivos();
        actualizarIndicadorCiclo();
        aplicarSetPokemon(leerDatoUsuario("setPokemon", "clasico"));
    }

    // =========================================
    // INICIALIZACIÓN DE LA APP (SIEMPRE AL FINAL)
    // =========================================
    const usuarioActivoGuardado = obtenerUsuarioActivo();
    if (usuarioActivoGuardado) {
        iniciarSesionConUsuario(usuarioActivoGuardado);
    } else {
        cambiarModo("auth");
    }
});
