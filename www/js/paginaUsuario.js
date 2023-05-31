import { generarDatosCuenta } from "./datosCuenta.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import { getUID, mostrarToast, restablecerDOM } from "./index.js";
import {
  getDatabase,
  set,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";

export function generarPaginaUs() {
  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");
  const articles = document.querySelectorAll("article");

  // Me cargo todos los divs de la section
  divs.forEach((div) => {
    div.remove();
  });
  articles.forEach((article) => {
    article.remove();
  });
  if(document.getElementById("bloqueBusqueda")){
    const busqueda = document.getElementById("bloqueBusqueda");
    busqueda.remove();
  }
  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterbegin",
    '<div style="text-align: center"><img id="imagenUs" src="./assets/images/rottweiler-ejemplo.jpg"></div>' +
      "<div>" +
      '<h1 id="nombreUsuario"></h1>' +
      "</div>" +
      '<div class="list-group">' +
      '<button type="button" class="list-group-item list-group-item-action" aria-current="true">' +
      "Mis mascotas" +
      "</button>" +
      '<button type="button" class="list-group-item list-group-item-action" id="botonDatos">' +
      "Datos de mi cuenta" +
      "</button>" +
      '<button type="button" class="list-group-item list-group-item-action" id="cerrarSesion">' +
      'Cerrar sesión<img id="imagenSalir" src="assets/images/leave.png">' +
      "</button>" +
      "</div>"
  );
  const imagenUs = document.getElementById("imagenUs");
  const botonDatos = document.getElementById("botonDatos");
  const botonCerrarSesion = document.getElementById("cerrarSesion");
  const nombreUsuario = document.getElementById("nombreUsuario");
  const database = getDatabase();
  get(ref(database, `users/${getUID()}`)).then((snapshot) => {
    // Obtiene el objeto de datos del usuario
    const userData = snapshot.val();

    // Obtiene el valor del nombre del usuario
    const userName = userData.nombre;
    nombreUsuario.innerHTML = userName;
  });

  botonCerrarSesion.addEventListener("click", () => {
    cerrarSesion();
  });

  botonDatos.addEventListener("click", () => {
    generarDatosCuenta();
  });
}

function cerrarSesion() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      restablecerDOM();
    })
    .catch((error) => {
      // An error happened.
      mostrarToast(error);
    });
    const footers = document.querySelectorAll("footer")
    footers.forEach((footer) => {
     footer.remove(); 
    })
}
