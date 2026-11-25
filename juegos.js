// =========================================
// SALA DE JUEGOS (solo para los descansos)
// =========================================

// ================= NAVEGACIÓN =================
let juegoActivo = "snake";

function cambiarJuego(id, boton) {
    document.querySelectorAll(".contenedor-juego").forEach(el => el.classList.remove("activo"));
    document.querySelectorAll(".btn-nav").forEach(el => el.classList.remove("activo"));
    document.getElementById(id).classList.add("activo");
    boton.classList.add("activo");
    juegoActivo = id;
    // Snake solo corre mientras está visible
    if (id === "snake") iniciarSnake();
    else detenerSnake();
    // Doom se carga al entrar en su pestaña y se descarga al salir (libera memoria y corta el sonido)
    if (id === "doom") abrirDoom();
    else cerrarDoom();
}

// ================= FREEDOOM =================
const marcoDoom = document.getElementById("marcoDoom");

function abrirDoom() {
    if (marcoDoom.querySelector("iframe")) return;
    const iframe = document.createElement("iframe");
    iframe.src = "focus-doom://juego/index.html";
    iframe.title = "Freedoom";
    iframe.allow = "autoplay; fullscreen";
    marcoDoom.appendChild(iframe);
    iframe.addEventListener("load", () => iframe.focus());
}

function cerrarDoom() {
    marcoDoom.innerHTML = "";
}

document.querySelectorAll(".btn-nav").forEach(boton => {
    boton.addEventListener("click", () => cambiarJuego(boton.dataset.juego, boton));
});

// ================= TRES EN RAYA =================
let tableroTTT = ["", "", "", "", "", "", "", "", ""];
let activoTTT = true;
let turnoMaquina = null; // evita que el jugador ponga dos X mientras la máquina "piensa"

function iniciarTTT() {
    clearTimeout(turnoMaquina);
    turnoMaquina = null;
    tableroTTT = ["", "", "", "", "", "", "", "", ""];
    activoTTT = true;
    document.getElementById("msgTTT").innerText = "Tu turno (X)";
    const grid = document.getElementById("gridTTT");
    grid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const div = document.createElement("div");
        div.className = "celda-ttt";
        div.addEventListener("click", () => jugarTTT(i, div));
        grid.appendChild(div);
    }
}

function jugarTTT(index, div) {
    if (tableroTTT[index] !== "" || !activoTTT || turnoMaquina) return;
    tableroTTT[index] = "X"; div.innerText = "X"; div.style.color = "#1B4965";
    if (verificarTTT()) return;
    document.getElementById("msgTTT").innerText = "Pensando...";
    turnoMaquina = setTimeout(maquinaTTT, 400);
}

const LINEAS_TTT = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

// La máquina gana si puede, bloquea si debe y si no elige al azar
function elegirJugadaMaquina(vacios) {
    for (const ficha of ["O", "X"]) {
        for (const linea of LINEAS_TTT) {
            const valores = linea.map(i => tableroTTT[i]);
            if (valores.filter(v => v === ficha).length === 2 && valores.includes("")) {
                return linea[valores.indexOf("")];
            }
        }
    }
    if (tableroTTT[4] === "") return 4;
    return vacios[Math.floor(Math.random() * vacios.length)];
}

function maquinaTTT() {
    turnoMaquina = null;
    const vacios = [];
    tableroTTT.forEach((c, i) => { if (c === "") vacios.push(i); });
    if (vacios.length === 0) return;
    const idx = elegirJugadaMaquina(vacios);
    tableroTTT[idx] = "O";
    const celdas = document.getElementsByClassName("celda-ttt");
    celdas[idx].innerText = "O"; celdas[idx].style.color = "#d62828";
    if (!verificarTTT()) document.getElementById("msgTTT").innerText = "Tu turno (X)";
}

function verificarTTT() {
    for (const w of LINEAS_TTT) {
        if (tableroTTT[w[0]] && tableroTTT[w[0]] === tableroTTT[w[1]] && tableroTTT[w[0]] === tableroTTT[w[2]]) {
            document.getElementById("msgTTT").innerText = tableroTTT[w[0]] === "X" ? "¡Ganaste!" : "¡Gana la máquina!";
            activoTTT = false;
            return true;
        }
    }
    if (!tableroTTT.includes("")) {
        document.getElementById("msgTTT").innerText = "¡Empate!";
        activoTTT = false;
        return true;
    }
    return false;
}

// ================= BUSCAMINAS =================
const filasBM = 9, colsBM = 9, minasTotal = 10;
let gridBuscaminas = []; let minasBM = []; let gameOverBM = false; let primerClickBM = true;

function iniciarBuscaminas() {
    gameOverBM = false; primerClickBM = true; minasBM = []; gridBuscaminas = [];
    document.getElementById("msgBM").innerText = "Minas: " + minasTotal;
    const ui = document.getElementById("gridBM"); ui.innerHTML = "";

    while (minasBM.length < minasTotal) {
        const r = Math.floor(Math.random() * (filasBM * colsBM));
        if (!minasBM.includes(r)) minasBM.push(r);
    }

    for (let i = 0; i < filasBM * colsBM; i++) {
        const div = document.createElement("div");
        div.className = "celda-bm";
        div.dataset.id = i;
        div.addEventListener("mousedown", (e) => clickBM(e, i, div));
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        gridBuscaminas.push(div);
        ui.appendChild(div);
    }
}

// Vecinos reales de una celda (sin "dar la vuelta" por los bordes)
function vecinosBM(id) {
    const fila = Math.floor(id / colsBM), col = id % colsBM;
    const vecinos = [];
    for (let df = -1; df <= 1; df++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (df === 0 && dc === 0) continue;
            const f = fila + df, c = col + dc;
            if (f >= 0 && f < filasBM && c >= 0 && c < colsBM) vecinos.push(f * colsBM + c);
        }
    }
    return vecinos;
}

function clickBM(e, id, div) {
    if (gameOverBM || div.classList.contains("revelada")) return;
    if (e.button === 2) {
        div.innerText = div.innerText === "🚩" ? "" : "🚩";
        return;
    }
    if (e.button !== 0 || div.innerText === "🚩") return;

    // El primer clic nunca es una mina
    if (primerClickBM) {
        primerClickBM = false;
        if (minasBM.includes(id)) {
            let nueva;
            do { nueva = Math.floor(Math.random() * (filasBM * colsBM)); } while (nueva === id || minasBM.includes(nueva));
            minasBM[minasBM.indexOf(id)] = nueva;
        }
    }

    if (minasBM.includes(id)) {
        div.classList.add("mina"); div.innerText = "💣";
        document.getElementById("msgBM").innerText = "¡Boom! Perdiste.";
        gameOverBM = true;
        minasBM.forEach(m => { gridBuscaminas[m].innerText = "💣"; gridBuscaminas[m].classList.add("revelada"); });
    } else {
        revelarBM(id);
        const sinRevelar = document.querySelectorAll(".celda-bm:not(.revelada)").length;
        if (sinRevelar === minasTotal) { document.getElementById("msgBM").innerText = "¡Ganaste!"; gameOverBM = true; }
    }
}

function revelarBM(id) {
    const div = gridBuscaminas[id];
    if (!div || div.classList.contains("revelada") || div.innerText === "🚩") return;
    div.classList.add("revelada");

    const vecinos = vecinosBM(id);
    const minasCerca = vecinos.filter(v => minasBM.includes(v)).length;

    if (minasCerca !== 0) {
        div.innerText = minasCerca;
        const colores = ["", "blue", "green", "red", "purple", "maroon", "turquoise", "black", "gray"];
        div.style.color = colores[minasCerca];
    } else {
        vecinos.forEach(revelarBM);
    }
}

// ================= SNAKE =================
const canvas = document.getElementById("canvasSnake");
const ctx = canvas.getContext("2d");
const box = 20;
const CELDAS = Math.floor(canvas.width / box); // 380 / 20 = 19 casillas por lado
let snake, food, direccion, siguienteDireccion, gameLoopSnake, scoreS;

const OPUESTA = { LEFT: "RIGHT", RIGHT: "LEFT", UP: "DOWN", DOWN: "UP" };
const TECLAS = { ArrowLeft: "LEFT", ArrowUp: "UP", ArrowRight: "RIGHT", ArrowDown: "DOWN" };

function iniciarSnake() {
    detenerSnake();
    snake = [{ x: 9 * box, y: 10 * box }];
    scoreS = 0; document.getElementById("scoreSnake").innerText = "Puntos: 0";
    direccion = "RIGHT"; siguienteDireccion = "RIGHT";
    generarComida();
    dibujarTablero();
    gameLoopSnake = setInterval(pasoSnake, 100);
}

function detenerSnake() {
    clearInterval(gameLoopSnake);
    gameLoopSnake = null;
}

document.addEventListener("keydown", (e) => {
    if (juegoActivo !== "snake" || !TECLAS[e.key]) return;
    e.preventDefault(); // que las flechas no muevan la página
    const nueva = TECLAS[e.key];
    // Se compara con la dirección real del último paso: no se puede dar media vuelta
    if (nueva !== OPUESTA[direccion]) siguienteDireccion = nueva;
});

// La comida aparece siempre dentro del tablero y nunca encima de la serpiente
function generarComida() {
    const libres = [];
    for (let x = 0; x < CELDAS; x++) {
        for (let y = 0; y < CELDAS; y++) {
            if (!snake.some(p => p.x === x * box && p.y === y * box)) libres.push({ x: x * box, y: y * box });
        }
    }
    food = libres.length ? libres[Math.floor(Math.random() * libres.length)] : null;
}

function colision(cabeza, cuerpo) {
    return cuerpo.some(p => p.x === cabeza.x && p.y === cabeza.y);
}

function dibujarTablero() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach((parte, i) => {
        ctx.fillStyle = i === 0 ? "#2d6a4f" : "#52b788";
        ctx.fillRect(parte.x, parte.y, box, box);
        ctx.strokeStyle = "#b7e4c7"; ctx.strokeRect(parte.x, parte.y, box, box);
    });
    if (food) {
        ctx.fillStyle = "red";
        ctx.beginPath(); ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2); ctx.fill();
    }
}

function pasoSnake() {
    direccion = siguienteDireccion;
    let { x, y } = snake[0];
    if (direccion === "LEFT") x -= box;
    if (direccion === "UP") y -= box;
    if (direccion === "RIGHT") x += box;
    if (direccion === "DOWN") y += box;
    const nuevaCabeza = { x, y };

    const come = food && x === food.x && y === food.y;
    const cuerpo = come ? snake : snake.slice(0, -1); // la cola se mueve, así que no cuenta como choque

    if (x < 0 || x >= CELDAS * box || y < 0 || y >= CELDAS * box || colision(nuevaCabeza, cuerpo)) {
        detenerSnake();
        document.getElementById("scoreSnake").innerText = "Game Over. Puntos: " + scoreS;
        return;
    }

    snake = [nuevaCabeza, ...cuerpo];
    if (come) {
        scoreS++;
        document.getElementById("scoreSnake").innerText = "Puntos: " + scoreS;
        generarComida();
        if (!food) {
            detenerSnake();
            document.getElementById("scoreSnake").innerText = "¡Tablero completo! Puntos: " + scoreS;
        }
    }
    dibujarTablero();
}

document.getElementById("btnReiniciarSnake").addEventListener("click", iniciarSnake);
document.getElementById("btnReiniciarTTT").addEventListener("click", iniciarTTT);
document.getElementById("btnReiniciarBM").addEventListener("click", iniciarBuscaminas);

// Iniciar todo
iniciarSnake();
iniciarTTT();
iniciarBuscaminas();
