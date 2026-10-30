//Fecha en español
dayjs.locale("es");
const fechaFormato = dayjs(apod.date).format("D [de] MMMM [de] YYYY");

//const URL_NASA_HOY = "https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1";
const URL_NASA_HOY = "https://science.nasa.gov/wp-json/wp/v2/apod-basic/261028"
// Elementos Que de van a cargar deacuerdo al ID
const mensaje = document.getElementById("mensaje");
const seccionApod = document.getElementById("apod");
const titulo = document.getElementById("apod-titulo");
const fecha = document.getElementById("apod-fecha");
const imagen = document.getElementById("apod-imagen");
const explicacion = document.getElementById("apod-explicacion");
const enlaceVideo = document.getElementById("apod-enlace-video");

//Funfion mientras carga la imagen
function mostrarMensaje(texto, tipo = "") {
    mensaje.textContent = texto;
    if (tipo) {
        mensaje.className = `mensaje ${tipo}`;
    } else {
        mensaje.className = "mensaje";
    }
};
//Muestra la foto del día
function mostrarApod(apod) {
    titulo.textContent = apod.title;
    fecha.textContent = fechaFormato;
    imagen.src = apod.hdurl;
    imagen.alt = apod.title;
    explicacion.innerHTML = apod.explanation;

    // Carga enlace si es tipo es video
    if (apod.media_type === "video") {
        enlaceVideo.href = apod.permalink;
        enlaceVideo.hidden = false;
    } else {
        enlaceVideo.hidden = true;
    };

    seccionApod.hidden = false;
};
//Colsulta a la API
async function cargarFotoDelDia() {
    mostrarMensaje("Cargando...", "info");
    seccionApod.hidden = true;

    try {
        const respuesta = await fetch(URL_NASA_HOY);

        if (!respuesta.ok) {
            throw new Error("No hay APOD para esa fecha");
        };

        const datos = await respuesta.json();
        let apod;
        //Direrencia la url de hoy y una en especifico
        // if (Array.isArray(datos)) {
        //     apod = datos[0];
        // } else {
        //     apod = datos;
        // };

        if (!apod) {
            throw new Error("La NASA no devolvió una foto del día");
        };

        mostrarApod(apod);
        mostrarMensaje("");
    } catch (error) {
        mostrarMensaje(error.message, "Error");
    };
}

// La primera foto se carga automáticamente al abrir la página.
cargarFotoDelDia();