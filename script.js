// ELEMTNOS DE LA PANTALLA DE ESTUDIO
const temporizador = document.getElementById("temporizador");
const botonInicio = document.getElementById("botonInicio");
const pantallaEstudio = document.querySelector(".pantalla-estudio:not(.pantalla-descanso)");
//ELEMENTOS DE LA PANTALLA DE DESCANSO
const temporizadorDescanso = document.getElementById("temporizador-descanso");
const botonDescanso = document.getElementById("botonDescanso");
const pantallaDescanso = document.getElementById("pantalla-descanso");
//configurar el tiempo
const tiempoEstudio = 0.1 * 60; // un minuto para testear el cambio de pantalla
const tiempoDescanso = 0.1 * 60; // 

let modoActual = "estudio"; //modo actual, puede ser "estudio" o "descanso"
let segundosRestantes = tiempoEstudio;
let intervalo=null;
let funcionando=false;

//mostrar el tiempo en el reloj que corresponda
function actualizarTemporizador() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos=segundosRestantes % 60;
    //convertir los valores a texto
   const texto = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    if(modoActual==="estudio"){
        temporizador.textContent=texto;
    }else{
        temporizadorDescanso.textContent=texto;
    }

}
//cambiar de pantalla
function cambiarModo(nuevoModo){
    clearInterval(intervalo);
    intervalo=null;
    funcionando=false;
    modoActual=nuevoModo;
    if(modoActual === "descanso"){
        //ocultar gengar y mostrar snorlax
        pantallaEstudio.classList.add("oculta");
        pantallaDescanso.classList.remove("oculta");
        document.body.style.backgroundColor="#BBE1FA";;

        segundosRestantes=tiempoDescanso;
        actualizarTemporizador();

        //arancamos automaticamente el temporizador de descanso
        funcionando=true;
        intervalo=setInterval(contarTiempo,1000);
        botonDescanso.textContent="Pausar";
    }else{
        //volvert a gengar
        pantallaDescanso.classList.add("oculta");
        pantallaEstudio.classList.remove("oculta");
        document.body.style.backgroundColor="#C5B5FF";
        segundosRestantes=tiempoEstudio;
        actualizarTemporizador();
        botonInicio.textContent="Empezar";
    }
}
//contador por segundo
function contarTiempo(){
    //resta un segundo
    segundosRestantes--;
    //actualiza el reloj
    actualizarTemporizador();
    //comprueba si termino la sesion
    if(segundosRestantes<=0){
        clearInterval(intervalo);
        intervalo=null;
        funcionando=false;
        //actualiza el boton
        if (modoActual==="estudio"){
            alert("¡Tiempo de descanso!");
            cambiarModo("descanso");
        }else{
            alert("¡Tiempo de estudio!");
            cambiarModo("estudio");
        }
    }
}
//control de play / pausa
function controlarTemporizador(){
    //si el tiempo termino prepara una nueva sesion
    const botonActivo = modoActual === "estudio" ? botonInicio : botonDescanso;
    if(funcionando){
        clearInterval(intervalo);
        intervalo=null;
        funcionando=false;
        botonActivo.textContent="Continuar";
    }else{
        funcionando=true;
        intervalo=setInterval(contarTiempo,1000);
        botonActivo.textContent="Pausar";
    }
}
//conectar el boton
botonInicio.addEventListener("click",controlarTemporizador);
botonDescanso.addEventListener("click",controlarTemporizador);
actualizarTemporizador();
