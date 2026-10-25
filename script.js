const temporizador = document.getElementById("temporizador");
const botonInicio = document.getElementById("botonInicio");
//configurar el tiempo
const tiempoEstudio = 50 * 60; // 25 minutos en segundos
let segundosRestantes = tiempoEstudio;
let intervalo=null;
let funcionando=false;

//mostrar el tiempo en pantalla
function actualizarTemporizador() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos=segundosRestantes % 60;
    //convertir los valores a texto
    const minutosTexto=String(minutos).padStart(2,"0");
    const segundosTexto=String(segundos).padStart(2,"0");
    //actualiza el reloj que aparece en el html.
    temporizador.textContent=`${minutosTexto}:${segundosTexto}`;
}

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
        botonInicio.textContent="Volver a empezar";
        alert("TERMINASTE TUS 50 MINUTOS DE ESTUDIO");
    }
}

function controlarTemporizador(){
    //si el tiempo termino prepara una nueva sesion
    if(segundosRestantes<=0){
        segundosRestantes=tiempoEstudio;
        actualizarTemporizador();
    }
    if(funcionando){
        clearInterval(intervalo);
        intervalo=null;
        funcionando=false;
        botonInicio.textContent="Continuar";
    }else{
        funcionando=true;
        intervalo=setInterval(contarTiempo,1000);
        botonInicio.textContent="Pausar";
    }
}
//conectar el boton
botonInicio.addEventListener("click",controlarTemporizador);
actualizarTemporizador();