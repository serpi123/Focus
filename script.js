// =========================================
// INTEGRACIÓN CON ELECTRON (IPC)
// =========================================
let ipcRenderer = null;
try {
    const electron = require("electron");
    ipcRenderer = electron.ipcRenderer;
} catch (e) {
    console.warn("Ejecutando fuera del entorno de Electron.");
}

document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // ELEMENTOS DEL DOM
    // =========================================
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
    const exitoLogin = document.getElementById("exitoLogin");
    const regNombre = document.getElementById("regNombre");
    const regEmail = document.getElementById("regEmail");
    const regPassword = document.getElementById("regPassword");
    const errorRegister = document.getElementById("errorRegister");
    const exitoRegister = document.getElementById("exitoRegister");
    const btnInvitado = document.getElementById("btnInvitado");

    // Pantalla Principal (Bulbasaur - Personalizador)
    const pantallaPrincipal = document.getElementById("pantalla-principal");
    const btnMenosEstudio = document.getElementById("btnMenosEstudio");
    const btnMasEstudio = document.getElementById("btnMasEstudio");
    const displayMinutosEstudio = document.getElementById("displayMinutosEstudio");

    const btnMenosDescanso = document.getElementById("btnMenosDescanso");
    const btnMasDescanso = document.getElementById("btnMasDescanso");
    const displayMinutosDescanso = document.getElementById("displayMinutosDescanso");

    const selectModoPop = document.getElementById("selectModoPop");

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
    const btnPopTemporizador = document.getElementById("btnPopTemporizador");

    // Pantalla de Descanso (Snorlax)
    const pantallaDescanso = document.getElementById("pantalla-descanso");
    const temporizadorDescanso = document.getElementById("temporizador-descanso");
    const botonDescanso = document.getElementById("botonDescanso");
    const botonCambiarModoDescanso = document.getElementById("botonCambiarModoDescanso");
    const botonReiniciarDescanso = document.getElementById("botonReiniciarDescanso");
    const botonAjustesDescanso = document.getElementById("botonAjustesDescanso");
    const btnPopTemporizadorDescanso = document.getElementById("btnPopTemporizadorDescanso");

    // Notificación Toast
    const notificacionToast = document.getElementById("notificacionToast");
    const toastIcono = document.getElementById("toastIcono");
    const toastTitulo = document.getElementById("toastTitulo");
    const toastMensaje = document.getElementById("toastMensaje");
    const toastCerrar = document.getElementById("toastCerrar");

    // =========================================
    // SISTEMA DE AUDIO (WEB AUDIO API)
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

    // =========================================
    // NOTIFICACIÓN TOAST
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
        void notificacionToast.offsetWidth;
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

    if (toastCerrar) toastCerrar.addEventListener("click", cerrarNotificacion);

    // =========================================
    // GESTIÓN DE AUTENTICACIÓN
    // =========================================
    function obtenerUsuariosRegistrados() {
        try {
            const datos = localStorage.getItem("focus_usuarios");
            const parsed = datos ? JSON.parse(datos) : [];
            return Array.isArray(parsed) ? parsed : [];
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

    function limpiarMensajesAuth() {
        if (errorLogin) { errorLogin.textContent = ""; errorLogin.classList.add("oculta"); }
        if (exitoLogin) { exitoLogin.textContent = ""; exitoLogin.classList.add("oculta"); }
        if (errorRegister) { errorRegister.textContent = ""; errorRegister.classList.add("oculta"); }
        if (exitoRegister) { exitoRegister.textContent = ""; exitoRegister.classList.add("oculta"); }
    }

    // Pestañas Login / Registro
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("activo");
            tabRegister.classList.remove("activo");
            formLogin.classList.remove("oculta");
            formRegister.classList.add("oculta");
            limpiarMensajesAuth();
        });

        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("activo");
            tabLogin.classList.remove("activo");
            formRegister.classList.remove("oculta");
            formLogin.classList.add("oculta");
            limpiarMensajesAuth();
        });
    }

    // Submit Iniciar Sesión
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarMensajesAuth();

            const ident = loginUsuario.value.trim().toLowerCase();
            const pass = loginPassword.value;

            if (!ident || !pass) {
                errorLogin.textContent = "Por favor, completa todos los campos.";
                errorLogin.classList.remove("oculta");
                return;
            }

            const usuarios = obtenerUsuariosRegistrados();
            const usuarioEncontrado = usuarios.find(
                (u) => (u.usuario && u.usuario.toLowerCase() === ident) ||
                       (u.email && u.email.toLowerCase() === ident)
            );

            if (!usuarioEncontrado) {
                errorLogin.textContent = "El usuario o correo no está registrado.";
                errorLogin.classList.remove("oculta");
                return;
            }

            if (usuarioEncontrado.password !== pass) {
                errorLogin.textContent = "Contraseña incorrecta.";
                errorLogin.classList.remove("oculta");
                return;
            }

            formLogin.reset();
            limpiarMensajesAuth();
            iniciarSesionConUsuario(usuarioEncontrado);
            mostrarNotificacion("✨", `¡Hola de nuevo, ${usuarioEncontrado.nombre}!`, "Listo para concentrarte hoy.");
        });
    }

    // Submit Registro
    if (formRegister) {
        formRegister.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarMensajesAuth();

            const nombre = regNombre.value.trim();
            const email = regEmail.value.trim().toLowerCase();
            const pass = regPassword.value;

            if (!nombre || !email.includes("@") || pass.length < 4) {
                errorRegister.textContent = "Ingresa datos válidos (contraseña mínimo 4 caracteres).";
                errorRegister.classList.remove("oculta");
                return;
            }

            const usuarios = obtenerUsuariosRegistrados();
            if (usuarios.some((u) => u.usuario?.toLowerCase() === nombre.toLowerCase() || u.email?.toLowerCase() === email)) {
                errorRegister.textContent = "El usuario o correo ya está registrado.";
                errorRegister.classList.remove("oculta");
                return;
            }

            const nuevoUsuario = { usuario: nombre, nombre: nombre, email: email, password: pass, fechaRegistro: new Date().toISOString() };
            usuarios.push(nuevoUsuario);
            guardarUsuariosRegistrados(usuarios);

            formRegister.reset();
            limpiarMensajesAuth();
            iniciarSesionConUsuario(nuevoUsuario);
            mostrarNotificacion("🎉", "¡Cuenta creada!", `Bienvenido, Entrenador ${nombre}.`);
        });
    }

    if (btnInvitado) {
        btnInvitado.addEventListener("click", () => {
            iniciarSesionConUsuario({ nombre: "Invitado", usuario: "invitado", esInvitado: true });
            mostrarNotificacion("🍃", "Modo Invitado", "Has ingresado sin cuenta.");
        });
    }

    if (btnCerrarSesion) btnCerrarSesion.addEventListener("click", cerrarSesion);

    // =========================================
    // PERSONALIZADOR DE TIEMPOS Y MODO POP
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

    // Selector del comportamiento de la ventana emergente
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
        if (!ipcRenderer) return;
        if (modoPopTemporizador === "inicio") {
            ipcRenderer.send("abrir-pop-temporizador");
        }
    }

    // Función para abrir/cerrar manualmente al hacer clic en el botón
    const toggleManualPop = () => {
        if (ipcRenderer) ipcRenderer.send("toggle-pop-temporizador");
    };

    if (btnPopTemporizador) btnPopTemporizador.addEventListener("click", toggleManualPop);
    if (btnPopTemporizadorDescanso) btnPopTemporizadorDescanso.addEventListener("click", toggleManualPop);

    function actualizarConfiguracionTiempos() {
        if (displayMinutosEstudio) displayMinutosEstudio.textContent = minutosEstudioConfig;
        if (displayMinutosDescanso) displayMinutosDescanso.textContent = minutosDescansoConfig;

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

    function actualizarTemporizador() {
        const minutos = Math.floor(segundosRestantes / 60);
        const segundos = segundosRestantes % 60;
        const texto = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

        if (modoActual === "estudio" && temporizador) {
            temporizador.textContent = texto;
        } else if (modoActual === "descanso" && temporizadorDescanso) {
            temporizadorDescanso.textContent = texto;
        }

        if (ipcRenderer) {
            ipcRenderer.send("actualizar-tiempo", texto);
        }
    }

    function contarTiempo() {
        segundosRestantes--;
        actualizarTemporizador();

        if (segundosRestantes <= 0) {
            clearInterval(intervalo);
            intervalo = null;
            funcionando = false;

            if (modoActual === "estudio") {
                mostrarNotificacion("☕", "¡Sesión de estudio cumplida!", "Excelente trabajo. Toca relajarse con Snorlax.");
                cambiarModo("descanso", true);
            } else {
                mostrarNotificacion("📚", "¡Descanso finalizado!", "Energías renovadas. Comenzando nuevo bloque de estudio.");
                cambiarModo("estudio", false);
            }
        }
    }

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

    function controlarTemporizador() {
        const botonActivo = modoActual === "estudio" ? botonInicio : botonDescanso;

        if (funcionando) {
            clearInterval(intervalo);
            intervalo = null;
            funcionando = false;
            fijarBotonPrincipal(botonActivo, "play", "Reanudar");

            if (ipcRenderer) {
                ipcRenderer.send("estado-temporizador", false);
                if (modoPopTemporizador === "inicio") {
                    ipcRenderer.send("cerrar-pop-temporizador");
                }
            }
        } else {
            funcionando = true;
            intervalo = setInterval(contarTiempo, 1000);
            fijarBotonPrincipal(botonActivo, "pausa", "Pausar");

            if (ipcRenderer) {
                ipcRenderer.send("estado-temporizador", true);
                evaluarAbrirPop();
            }
        }
    }

    function cambiarModo(nuevoModo, autoIniciar = false) {
        clearInterval(intervalo);
        intervalo = null;
        funcionando = false;
        modoActual = nuevoModo;

        pantallaAuth.classList.add("oculta");
        pantallaPrincipal.classList.add("oculta");
        pantallaEstudio.classList.add("oculta");
        pantallaDescanso.classList.add("oculta");

        if ((modoActual === "auth" || modoActual === "principal") && ipcRenderer) {
            ipcRenderer.send("cerrar-pop-temporizador");
            ipcRenderer.send("estado-temporizador", false);
        }

        if (modoActual === "auth") {
            pantallaAuth.classList.remove("oculta");
            barraSuperior.classList.add("oculta");
            document.body.className = "tema-auth";
            document.title = "FOCUS - INICIAR SESIÓN";
            limpiarMensajesAuth();
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
                if (ipcRenderer) {
                    ipcRenderer.send("estado-temporizador", true);
                    evaluarAbrirPop();
                }
            } else {
                fijarBotonPrincipal(botonDescanso, "play", "Empezar descanso");
            }
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
                if (ipcRenderer) {
                    ipcRenderer.send("estado-temporizador", true);
                    evaluarAbrirPop();
                }
            } else {
                fijarBotonPrincipal(botonInicio, "play", "Empezar estudio");
            }
        }
    }

    // =========================================
    // REGISTRO DE EVENTOS Y CONTROLES
    // =========================================
    if (btnMenosEstudio) btnMenosEstudio.addEventListener("click", () => { if (minutosEstudioConfig > 1) { minutosEstudioConfig--; actualizarConfiguracionTiempos(); } });
    if (btnMasEstudio) btnMasEstudio.addEventListener("click", () => { if (minutosEstudioConfig < 180) { minutosEstudioConfig++; actualizarConfiguracionTiempos(); } });
    if (btnMenosDescanso) btnMenosDescanso.addEventListener("click", () => { if (minutosDescansoConfig > 1) { minutosDescansoConfig--; actualizarConfiguracionTiempos(); } });
    if (btnMasDescanso) btnMasDescanso.addEventListener("click", () => { if (minutosDescansoConfig < 90) { minutosDescansoConfig++; actualizarConfiguracionTiempos(); } });

    function aplicarPreset(estudio, descanso) {
        minutosEstudioConfig = estudio;
        minutosDescansoConfig = descanso;
        actualizarConfiguracionTiempos();
    }

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

    // Inicialización de la app
    actualizarConfiguracionTiempos();
    const usuarioActivoGuardado = obtenerUsuarioActivo();
    if (usuarioActivoGuardado) {
        iniciarSesionConUsuario(usuarioActivoGuardado);
    } else {
        cambiarModo("auth", false);
    }
});