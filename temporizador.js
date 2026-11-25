// Mini-ventana flotante: muestra el tiempo que le envía la ventana principal
const api = window.focusAPI;
const tarjeta = document.getElementById("tarjeta");
const displayMini = document.getElementById("displayMini");
const modoMini = document.getElementById("modoMini");

function pintarEstado(estado) {
    if (!estado) return;
    displayMini.textContent = estado.texto;
    const esDescanso = estado.modo === "descanso";
    modoMini.textContent = esDescanso ? (estado.largo ? "Descanso largo" : "Descanso") : "Estudio";
    tarjeta.classList.toggle("descanso", esDescanso);
    tarjeta.classList.toggle("pausado", estado.corriendo === false);
}

if (api) {
    api.on("sincronizar-tiempo", pintarEstado);
    document.getElementById("btnAbrir").addEventListener("click", () => api.send("enfocar-principal"));
}
