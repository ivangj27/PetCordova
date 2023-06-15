import {
    getAuth,
    sendPasswordResetEmail,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import { restablecerDOM } from "./index.js"
import { mostrarToast } from "./index.js";

//función para cargar la pantalla de 'Recuperar Contraseña'
export function recuperacion(){
    const seccion = document.getElementById("contenido");
    const divs = seccion.querySelectorAll("div");
    // Me cargo todos los divs de la section
    divs.forEach((div) => {
      div.remove();
    });
  
    //Inserto el contenido nuevo de la section
    seccion.insertAdjacentHTML(
        "afterbegin",
        "<div>" +
        "<h2>Restablece tu contraseña</h2>" +
        '<div class="inputContainerCambioContra mb-3">' +
        '<label for="nombre" class="form-label" style="text-align:left;">Correo electrónico de su cuenta:</label>' +
        '<input type="text" id="correo" name="correo" class="textoRecuperacion" placeholder="Correo electrónico de su cuenta">' +
        "</div>" +
        '<button id="aceptar" class="btn btn-primary">Continuar</button>' +
        "</div>"
    );
  document.getElementById("aceptar").addEventListener("click",enviar)
  document.addEventListener("backbutton", function(){restablecerDOM()});

}

//función para enviar el email al email introducido para cambiar la contraseña
function enviar(){
    const auth=getAuth()
    console.log("Cambiando la contrasena");
    sendPasswordResetEmail(auth, document.getElementById("correo").value)
      .then(() => {
        mostrarToast("Email de cambio de contraseña enviado");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        mostrarToast("Fallo al enviar el email: " + errorMessage);
      });
    document.getElementById("correo").value = null
}