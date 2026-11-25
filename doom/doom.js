// Arranca Chocolate Doom (WebAssembly) con Freedoom Phase 2.
// motor/chocolate-doom.data contiene freedoom2.wad, que el motor monta en /iwads/.
import ChocolateDoomModule from "./motor/chocolate-doom.js";

const canvas = document.getElementById("canvas");
const estado = document.getElementById("estado");
const textoEstado = document.getElementById("textoEstado");

const ANCHO = 640, ALTO = 480; // 4:3, la proporción con la que Doom dibuja

// Escala el canvas para llenar el recuadro sin deformarlo
function ajustarEscala() {
    const escala = Math.min(window.innerWidth / ANCHO, window.innerHeight / ALTO);
    canvas.style.transform = `scale(${escala})`;
}
window.addEventListener("resize", ajustarEscala);
ajustarEscala();

// Evita que el clic derecho abra el menú del navegador sobre el juego
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

async function iniciar() {
    try {
        const modulo = await ChocolateDoomModule({
            canvas,
            locateFile: (archivo) => new URL(`motor/${archivo}`, import.meta.url).href,
            print: (texto) => console.log(texto),
            printErr: (texto) => console.debug(texto),
            setStatus: (texto) => { if (texto) textoEstado.textContent = texto; }
        });

        estado.classList.add("oculto");
        canvas.focus();
        // Modo ventana con resolución fija; el CSS la escala al recuadro.
        // Sin esto el motor arranca en "pantalla completa" y la imagen sale ampliada y corrida.
        modulo.callMain(["-iwad", "/iwads/freedoom2.wad", "-window", "-geometry", `${ANCHO}x${ALTO}`, "-nograbmouse"]);
    } catch (error) {
        console.error("No se pudo iniciar Freedoom:", error);
        textoEstado.textContent = "No se pudo iniciar el juego.";
    }
}

iniciar();
