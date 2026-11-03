dayjs.locale("es");

// URLs de la API de la NASA
const URL_NASA_HOY = "https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1";


// CAPTURA DE ELEMENTOS DEL DOM (Selectores)
const mensaje = document.getElementById("mensaje");
const seccionApod = document.getElementById("apod");
const titulo = document.getElementById("apod-titulo");
const fecha = document.getElementById("apod-fecha");
const imagen = document.getElementById("apod-imagen");
const explicacion = document.getElementById("apod-explicacion");
const enlaceVideo = document.getElementById("apod-enlace-video");
const botonBuscar = document.getElementById("btn-buscar");
const inputFecha = document.getElementById("fecha");


// PARTE 1: FUNCIONES DE RENDERIZADO Y FETCH (GENERAL)

// Función para mostrar mensajes de estado (Cargando, errores, etc.)
function mostrarMensaje(texto, tipo = "") {
    mensaje.textContent = texto;
    if (tipo) {
        mensaje.className = `mensaje ${tipo}`;
    } else {
        mensaje.className = "mensaje";
    }
}

// Función para pintar los datos de la APOD en el HTML
function mostrarApod(apod) {
    // Formateamos la fecha que trae la API usando Day.js en español
    const fechaFormato = dayjs(apod.date).format("D [de] MMMM [de] YYYY");

    titulo.textContent = apod.title;
    fecha.textContent = fechaFormato;
    imagen.src = apod.hdurl;
    imagen.alt = apod.title;
    explicacion.innerHTML = apod.explanation;

    // Carga enlace si es de tipo video
    if (apod.media_type === "video") {
        enlaceVideo.href = apod.permalink;
        enlaceVideo.hidden = false;
    } else {
        enlaceVideo.hidden = true;
    }

    seccionApod.hidden = false;
}

// Función genérica para consultar la API (Sirve tanto para hoy como para una fecha específica)
async function cargarApod(url) {
    mostrarMensaje("Cargando...", "info");
    seccionApod.hidden = true;

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No hay APOD para esa fecha");
        }

        const datos = await respuesta.json();
        let apod;
        
        // Diferencia si la API devuelve un array (como en la de hoy) o un objeto directo
        if (Array.isArray(datos)) {
            apod = datos[0];
        } else {
            apod = datos;
        }

        if (!apod) {
            throw new Error("La NASA no devolvió una foto del día");
        }

        mostrarApod(apod);
        mostrarMensaje(""); // Limpia el mensaje de carga si todo sale bien
    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


// PARTE 2: FUNCIONALIDAD DE BÚSQUEDA POR FECHA
function buscarPorFecha() {
    const fechaSeleccionada = inputFecha.value;

    // Limpiar mensajes anteriores
    mostrarMensaje("");
    
    // 1. Validar si está vacío
    if (!fechaSeleccionada) {
        mostrarMensaje("Elige una fecha (Formato: AAAA-MM-DD).", "error");
        return;
    }

    // 2. Validar si es una fecha futura con Day.js
    if (dayjs(fechaSeleccionada).isAfter(dayjs(), "day")) {
        mostrarMensaje("No puedes elegir una fecha futura.", "error");
        return; 
    }

    // 3. Validar si es anterior a la primera APOD (16 de junio de 1995)
    if (dayjs(fechaSeleccionada).isBefore(dayjs("1995-06-16"), "day")) {
        mostrarMensaje("La primera APOD fue el 16 de junio de 1995.", "error");
        return;
    }

    // Si pasa todas las validaciones, formateamos la fecha a YYMMDD para la URL de la API
    const fechaFormateada = dayjs(fechaSeleccionada).format("YYMMDD");
    
    // Construimos la URL específica y llamamos a la función de carga general
    const urlFecha = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${fechaFormateada}`;
    cargarApod(urlFecha);
}


// EVENTOS Y EJECUCIÓN AUTOMÁTICA

// Conectamos el botón de búsqueda con su respectiva función
botonBuscar.addEventListener("click", buscarPorFecha);

// La primera foto del día se carga automáticamente al abrir la página
cargarApod(URL_NASA_HOY);