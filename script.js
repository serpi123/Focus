// =========================================
// ELEMENTOS DEL DOM
// =========================================
document.addEventListener("DOMContentLoaded", () => {
// Barra superior (Perfil)
const barraSuperior = document.getElementById("barraSuperior");
const nombreUsuarioActivo = document.getElementById("nombreUsuarioActivo");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// Pantalla de Autenticación
const pantallaAuth = document.getElementById("pantalla-auth");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const formLogin = document.getElementById("formLogin");
const formRegister = document.getElementById("formRegister");
const loginUsuario = document.getElementById("loginUsuario");
const loginPassword = document.getElementById("loginPassword");
const errorLogin = document.getElementById("errorLogin");
const regNombre = document.getElementById("regNombre");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const errorRegister = document.getElementById("errorRegister");
const btnInvitado = document.getElementById("btnInvitado");

// Pantalla Principal (Bulbasaur - Personalizador)
const pantallaPrincipal = document.getElementById("pantalla-principal");
const btnMenosEstudio = document.getElementById("btnMenosEstudio");
const btnMasEstudio = document.getElementById("btnMasEstudio");
const displayMinutosEstudio = document.getElementById("displayMinutosEstudio");

const btnMenosDescanso = document.getElementById("btnMenosDescanso");
const btnMasDescanso = document.getElementById("btnMasDescanso");
const displayMinutosDescanso = document.getElementById("displayMinutosDescanso");

const btnPreset25 = document.getElementById("btnPreset25");
const btnPreset50 = document.getElementById("btnPreset50");
const btnPreset90 = document.getElementById("btnPreset90");

const btnIrEstudioDesdeBulbasaur = document.getElementById("btnIrEstudioDesdeBulbasaur");
const btnIrDescansoDesdeBulbasaur = document.getElementById("btnIrDescansoDesdeBulbasaur");

// Pantalla de Estudio (Gengar)
const pantallaEstudio = document.getElementById("pantalla-estudio");
const temporizador = document.getElementById("temporizador");
const botonInicio = document.getElementById("botonInicio");
const botonCambiarModo = document.getElementById("botonCambiarModo");
const botonReiniciar = document.getElementById("botonReiniciar");
const botonAjustesEstudio = document.getElementById("botonAjustesEstudio");

// Pantalla de Descanso (Snorlax)
const pantallaDescanso = document.getElementById("pantalla-descanso");
const temporizadorDescanso = document.getElementById("temporizador-descanso");
const botonDescanso = document.getElementById("botonDescanso");
const botonCambiarModoDescanso = document.getElementById("botonCambiarModoDescanso");
const botonReiniciarDescanso = document.getElementById("botonReiniciarDescanso");
const botonAjustesDescanso = document.getElementById("botonAjustesDescanso");

// Notificación Toast
const notificacionToast = document.getElementById("notificacionToast");
const toastIcono = document.getElementById("toastIcono");
const toastTitulo = document.getElementById("toastTitulo");
const toastMensaje = document.getElementById("toastMensaje");
const toastCerrar = document.getElementById("toastCerrar");

// =========================================
// SISTEMA DE AUDIO SUAVE (SINTETIZADO WEB AUDIO API)
// =========================================
function reproducirCampanada() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notas = [523.25, 659.25]; // C5 y E5 (acorde mayor limpio y armonioso)

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
    } catch (e) {
        // En caso de que el navegador restrinja audio antes del primer clic
    }
}

// =========================================
// NOTIFICACIÓN FLOTANTE (REEMPLAZA A ALERT)
// =========================================
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
    void notificacionToast.offsetWidth; // Forzar reflow para reiniciar animación
    notificacionToast.classList.add("visible");

    timeoutToast = setTimeout(() => {
        cerrarNotificacion();
    }, 4500);
}

function cerrarNotificacion() {
    clearTimeout(timeoutToast);
    notificacionToast.classList.remove("visible");
    timeoutOcultar = setTimeout(() => {
        notificacionToast.classList.add("oculta");
    }, 350);
}

toastCerrar.addEventListener("click", cerrarNotificacion);

// =========================================
// GESTIÓN DE AUTENTICACIÓN (LOGIN & REGISTRO)
// =========================================
function obtenerUsuariosRegistrados() {
    try {
        const datos = localStorage.getItem("focus_usuarios");
        return datos ? JSON.parse(datos) : [];
    } catch (e) {
        return [];
    }
}

function guardarUsuariosRegistrados(usuarios) {
    localStorage.setItem("focus_usuarios", JSON.stringify(usuarios));
}

function obtenerUsuarioActivo() {
    try {
        const datos = localStorage.getItem("focus_usuario_activo");
        return datos ? JSON.parse(datos) : null;
    } catch (e) {
        return null;
    }
}

function iniciarSesionConUsuario(usuario) {
    localStorage.setItem("focus_usuario_activo", JSON.stringify(usuario));
    nombreUsuarioActivo.textContent = usuario.nombre || "Entrenador";
    barraSuperior.classList.remove("oculta");
    cambiarModo("principal", false);
}

function cerrarSesion() {
    localStorage.removeItem("focus_usuario_activo");
    clearInterval(intervalo);
    intervalo = null;
    funcionando = false;
    barraSuperior.classList.add("oculta");
    cambiarModo("auth", false);
    mostrarNotificacion("👋", "Sesión cerrada", "Has vuelto a la pantalla de inicio.");
}

// Pestañas Login / Registro
tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("activo");
    tabRegister.classList.remove("activo");
    formLogin.classList.remove("oculta");
    formRegister.classList.add("oculta");
    errorLogin.classList.add("oculta");
});

tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("activo");
    tabLogin.classList.remove("activo");
    formRegister.classList.remove("oculta");
    formLogin.classList.add("oculta");
    errorRegister.classList.add("oculta");
});

// Evento Submit: Iniciar Sesión
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const ident = loginUsuario.value.trim().toLowerCase();
    const pass = loginPassword.value;

    const usuarios = obtenerUsuariosRegistrados();
    const usuarioValido = usuarios.find(
        (u) => (u.usuario.toLowerCase() === ident || u.email.toLowerCase() === ident) && u.password === pass
    );

    if (usuarioValido) {
        errorLogin.classList.add("oculta");
        formLogin.reset();
        iniciarSesionConUsuario(usuarioValido);
        mostrarNotificacion("✨", `¡Hola de nuevo, ${usuarioValido.nombre}!`, "Listo para concentrarte hoy.");
    } else {
        errorLogin.textContent = "Usuario/correo o contraseña incorrectos.";
        errorLogin.classList.remove("oculta");
    }
});

// Evento Submit: Registro
formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = regNombre.value.trim();
    const email = regEmail.value.trim().toLowerCase();
    const pass = regPassword.value;

    if (pass.length < 4) {
        errorRegister.textContent = "La contraseña debe tener al menos 4 caracteres.";
        errorRegister.classList.remove("oculta");
        return;
    }

    const usuarios = obtenerUsuariosRegistrados();
    const yaExiste = usuarios.some((u) => u.email.toLowerCase() === email || u.usuario.toLowerCase() === nombre.toLowerCase());

    if (yaExiste) {
        errorRegister.textContent = "Ya existe un entrenador con ese nombre o correo.";
        errorRegister.classList.remove("oculta");
        return;
    }

    const nuevoUsuario = {
        usuario: nombre,
        nombre: nombre,
        email: email,
        password: pass
    };

    usuarios.push(nuevoUsuario);
    guardarUsuariosRegistrados(usuarios);

    errorRegister.classList.add("oculta");
    formRegister.reset();
    iniciarSesionConUsuario(nuevoUsuario);
    mostrarNotificacion("🎉", `¡Bienvenido a FOCUS, ${nombre}!`, "Tu cuenta fue creada con éxito.");
});

// Continuar como Invitado
btnInvitado.addEventListener("click", () => {
    const invitado = { nombre: "Invitado", usuario: "invitado", email: "", esInvitado: true };
    iniciarSesionConUsuario(invitado);
    mostrarNotificacion("🍃", "Modo Invitado", "Has ingresado sin cuenta.");
});

// Botón de salir / logout en barra superior
btnCerrarSesion.addEventListener("click", cerrarSesion);

// =========================================
// ICONOS Y CONTROL DE BOTONES PRINCIPALES
// =========================================
const ICONO_PLAY = `<svg class="icono-btn" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const ICONO_PAUSA = `<svg class="icono-btn" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

function fijarBotonPrincipal(boton, estado, texto) {
    if (!boton) return;
    const icono = estado === "pausa" ? ICONO_PAUSA : ICONO_PLAY;
    boton.innerHTML = `${icono}<span>${texto}</span>`;
}

// =========================================
// PERSONALIZADOR DE TIEMPOS (BULBASAUR)
// =========================================
let minutosEstudioConfig = 50;  // Valor por defecto para estudio
let minutosDescansoConfig = 10; // Valor por defecto para descanso

let tiempoEstudio = minutosEstudioConfig * 60;
let tiempoDescanso = minutosDescansoConfig * 60;

let modoActual = "auth"; // "auth", "principal", "estudio", "descanso"
let segundosRestantes = tiempoEstudio;
let intervalo = null;
let funcionando = false;

function actualizarConfiguracionTiempos() {
    displayMinutosEstudio.textContent = minutosEstudioConfig;
    displayMinutosDescanso.textContent = minutosDescansoConfig;

    tiempoEstudio = minutosEstudioConfig * 60;
    tiempoDescanso = minutosDescansoConfig * 60;

    if (modoActual === "estudio" && !funcionando) {
        segundosRestantes = tiempoEstudio;
        actualizarTemporizador();
    } else if (modoActual === "descanso" && !funcionando) {
        segundosRestantes = tiempoDescanso;
        actualizarTemporizador();
    }
}

// Mostrar el tiempo en el reloj según el modo activo
function actualizarTemporizador() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    const texto = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

    if (modoActual === "estudio") {
        temporizador.textContent = texto;
    } else if (modoActual === "descanso") {
        temporizadorDescanso.textContent = texto;
    }
}

// =========================================
// NAVEGACIÓN Y CAMBIO DE MODO
// =========================================
function cambiarModo(nuevoModo, autoIniciar = false) {
    clearInterval(intervalo);
    intervalo = null;
    funcionando = false;
    modoActual = nuevoModo;

    // Ocultar todas las pantallas
    pantallaAuth.classList.add("oculta");
    pantallaPrincipal.classList.add("oculta");
    pantallaEstudio.classList.add("oculta");
    pantallaDescanso.classList.add("oculta");

    if (modoActual === "auth") {
        pantallaAuth.classList.remove("oculta");
        barraSuperior.classList.add("oculta");
        document.body.className = "tema-auth";
        document.title = "FOCUS - INICIAR SESIÓN";
    } else if (modoActual === "principal") {
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
        } else {
            fijarBotonPrincipal(botonDescanso, "play", "Empezar descanso");
        }
    } else { // "estudio"
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
        } else {
            fijarBotonPrincipal(botonInicio, "play", "Empezar estudio");
        }
    }
}

// Reiniciar el contador a la cantidad establecida del modo actual
function reiniciarTemporizador() {
    clearInterval(intervalo);
    intervalo = null;
    funcionando = false;

    if (modoActual === "estudio") {
        segundosRestantes = tiempoEstudio;
        fijarBotonPrincipal(botonInicio, "play", "Empezar estudio");
    } else if (modoActual === "descanso") {
        segundosRestantes = tiempoDescanso;
        fijarBotonPrincipal(botonDescanso, "play", "Empezar descanso");
    }

    actualizarTemporizador();
    mostrarNotificacion("↺", "Contador reiniciado", "El tiempo ha vuelto al inicio.");
}

// Contador por segundo (sin alert molesto)
function contarTiempo() {
    segundosRestantes--;
    actualizarTemporizador();

    if (segundosRestantes <= 0) {
        clearInterval(intervalo);
        intervalo = null;
        funcionando = false;

        if (modoActual === "estudio") {
            // Notificación moderna sin alert
            mostrarNotificacion("☕", "¡Sesión de estudio cumplida!", "Excelente trabajo. Toca relajarse con Snorlax.");
            cambiarModo("descanso", true);
        } else {
            // Notificación moderna sin alert
            mostrarNotificacion("📚", "¡Descanso finalizado!", "Energías renovadas. Comenzando nuevo bloque de estudio.");
            cambiarModo("estudio", false);
        }
    }
}

// Control de play / pausa / reanudar
function controlarTemporizador() {
    const botonActivo = modoActual === "estudio" ? botonInicio : botonDescanso;

    if (funcionando) {
        clearInterval(intervalo);
        intervalo = null;
        funcionando = false;
        fijarBotonPrincipal(botonActivo, "play", "Reanudar");
    } else {
        funcionando = true;
        intervalo = setInterval(contarTiempo, 1000);
        fijarBotonPrincipal(botonActivo, "pausa", "Pausar");
    }
}

// =========================================
// EVENTOS DEL PERSONALIZADOR (BULBASAUR)
// =========================================

// Sumar / restar tiempo de estudio
btnMenosEstudio.addEventListener("click", () => {
    if (minutosEstudioConfig > 1) {
        minutosEstudioConfig--;
        actualizarConfiguracionTiempos();
    }
});

btnMasEstudio.addEventListener("click", () => {
    if (minutosEstudioConfig < 180) {
        minutosEstudioConfig++;
        actualizarConfiguracionTiempos();
    }
});

// Sumar / restar tiempo de descanso
btnMenosDescanso.addEventListener("click", () => {
    if (minutosDescansoConfig > 1) {
        minutosDescansoConfig--;
        actualizarConfiguracionTiempos();
    }
});

btnMasDescanso.addEventListener("click", () => {
    if (minutosDescansoConfig < 90) {
        minutosDescansoConfig++;
        actualizarConfiguracionTiempos();
    }
});

// Presets rápidos
function aplicarPreset(estudio, descanso) {
    minutosEstudioConfig = estudio;
    minutosDescansoConfig = descanso;
    actualizarConfiguracionTiempos();
}

if (btnPreset25) btnPreset25.addEventListener("click", () => aplicarPreset(25, 5));
if (btnPreset50) btnPreset50.addEventListener("click", () => aplicarPreset(50, 10));
if (btnPreset90) btnPreset90.addEventListener("click", () => aplicarPreset(90, 15));

// Iniciar sesión desde la pantalla principal
btnIrEstudioDesdeBulbasaur.addEventListener("click", () => {
    actualizarConfiguracionTiempos();
    cambiarModo("estudio", false);
});

if (btnIrDescansoDesdeBulbasaur) {
    btnIrDescansoDesdeBulbasaur.addEventListener("click", () => {
        actualizarConfiguracionTiempos();
        cambiarModo("descanso", false);
    });
}

// =========================================
// EVENTOS DE CONTROL DEL TEMPORIZADOR
// =========================================
botonInicio.addEventListener("click", controlarTemporizador);
botonDescanso.addEventListener("click", controlarTemporizador);

// Navegación entre Estudio y Descanso
botonCambiarModo.addEventListener("click", () => cambiarModo("descanso", false));
botonCambiarModoDescanso.addEventListener("click", () => cambiarModo("estudio", false));

// Reinicio del contador
botonReiniciar.addEventListener("click", reiniciarTemporizador);
botonReiniciarDescanso.addEventListener("click", reiniciarTemporizador);

// Regresar al Panel Principal (Ajustes con Bulbasaur)
botonAjustesEstudio.addEventListener("click", () => cambiarModo("principal", false));
botonAjustesDescanso.addEventListener("click", () => cambiarModo("principal", false));

// =========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// =========================================
actualizarConfiguracionTiempos();

// Comprobar si ya existe una sesión guardada
const usuarioActivoGuardado = obtenerUsuarioActivo();
if (usuarioActivoGuardado) {
    iniciarSesionConUsuario(usuarioActivoGuardado);
} else {
    cambiarModo("auth", false);
}
});