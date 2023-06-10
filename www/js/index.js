import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
  push,
  update,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";

import { actualizarDOM } from "./CRUD.js";
import { paginaRegistro } from "./registro.js";
import { recuperacion } from "./restablecerContrasena.js";
import { generarPaginaUs } from "./paginaUsuario.js";
import { cargarLista, listaDOM } from "./listaInteractiva.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBXo6m6nAiY8r3Oo35MT-Tp3rLrJpN0nA",
  authDomain: "tfg-app-mascotas.firebaseapp.com",
  databaseURL:
    "https://tfg-app-mascotas-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tfg-app-mascotas",
  storageBucket: "tfg-app-mascotas.appspot.com",
  messagingSenderId: "348794448656",
  appId: "1:348794448656:web:6f93585ca395453eff9395",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
var uid ="";
window.onload = function () {
  console.log("toy probando el remember me");
  var username = window.localStorage.getItem("username");
  var password = window.localStorage.getItem("password");
  var rememberMe = document.getElementById("recordar");
  console.log(username);
  console.log(password);
  if (username && password) {
    console.log("entro al if");
    document.getElementById("email").value = username;
    document.getElementById("contrasena").value = password;
    rememberMe.checked = true;
    //document.getElementById("inicio").click();
  }
};
const passwordInput = document.querySelector("#contrasena")
const eye = document.querySelector("#eye")

function restablecerVariables() {
  // Initialize Firebase
  const botonRegistro = document.getElementById("registro");
  const botonInicio = document.getElementById("inicio");
  const botonPass = document.getElementById("resetPass");
  document.getElementById("resetPass").addEventListener("click", dialogConfirm);

  console.log("iniciado");

  // Listeners de los botones de inicio y registro
  botonRegistro.addEventListener("click", paginaRegistro);
  botonInicio.addEventListener("click", iniciarSesion);
  eye.addEventListener("click", function(){
    this.classList.toggle("fa-eye-slash")
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)
  })
  
}
restablecerVariables();
function iniciarSesion() {
  
  // Obtener los valores de los campos de email y contraseña
  var email = document.getElementById("email").value;
  var contrasena = document.getElementById("contrasena").value;
  // Iniciar sesión con Firebase
  signInWithEmailAndPassword(auth, email, contrasena)
    .then((userCredential) => {
      console.log("Sesión iniciada correctamente");
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
          // User logged in already or has just logged in.
          var id = user.uid;
          setUID(id)
          recordarDatos();
          insertarNavBar();
          actualizarDOM();
          mostrarToast("Inicio de sesión correcto");
        }
      });
    })
    .catch((error) => {
      // Si hay un error en el inicio de sesión, puedes mostrar un mensaje de error o realizar otras acciones
      const errorMessage = error.message;
      console.log(errorMessage)
      mostrarToast("Error al iniciar sesión" + errorMessage);
    });
}

//Método para crear un "Toast" personalizado con el texto que le pases por parámetros
export function mostrarToast(mensaje) {
  window.plugins.toast.showWithOptions(
    {
      message: mensaje,
      duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: "bottom",
    },
  );
}

// Función para guardar los datos del usuario en el almacenamiento local si activa el switch
function recordarDatos() {
  const recordarUs = document.getElementById("recordar");
  var usuario = document.getElementById("email").value;
  var contrasena = document.getElementById("contrasena").value;

  console.log("metodo recordar ejecutado");
  if (recordarUs.checked) {
    window.localStorage.setItem("username", usuario);
    window.localStorage.setItem("password", contrasena);
    console.log(usuario);
    console.log("datos guardados");
  }
}

// Diálogo de restablecimiento de contraseña
function dialogConfirm() {
  recuperacion();
}

//Recarga la página de login
export function restablecerDOM() {
  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");
  const divsBody = document.querySelectorAll("div");
  // Me cargo todos los divs de la section
  divs.forEach((div) => {
    div.remove();
  });

  divsBody.forEach((div) => {
    div.remove();
  });

  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterbegin",
    '<div>' +
  '<div class="input-group mb-3">' +
  '<input type="text" id="email" class="form-control" placeholder="Usuario" aria-label="Username">' +
  '</div>' +
  '<div class="contrasena-container input-group mb-3">' +
  '<input type="password" id="contrasena" class="form-control" placeholder="Contraseña" aria-label="Server">' +
  '<i class="fa-solid fa-eye" id="eye"></i>' +
  '</div>' +
  '<br>' +
  '<div id="divRecordarUsuario">' +
  '<label id="remember">Recordar usuario</label>' +
  '<label class="switch">' +
  '<input id="recordar" type="checkbox">' +
  '<span class="slider round"></span>' +
  '</label>' +
  '</div>' +
  '<button id="resetPass" class="btn btn-light btn-ripple">¿Has olvidado tu contraseña?</button>' +
  '<br>' +
  '<button id="registro" type="button" class="btn btn-secondary btn-ripple">Registrarse</button>' +
  '<button id="inicio" type="button" class="btn btn-primary btn-ripple">Iniciar sesión</button>' +
  '</div>'
  );
  restablecerVariables();
}

//Inserta la barra de navegación inferior en la app
function insertarNavBar() {
  const seccion = document.getElementById("contenido");
  seccion.insertAdjacentHTML(
    "afterend",
    '<footer id="navegacion">' +
    '<nav class="navbar fixed-bottom navbar-light justify-content-center navbar-custom ">' +
        '<div class="container" id="barraNavContent">' +
            '<a class="navbar-brand" id="botonLista">' +
                '<i class="fas fa-search" id="iconoLista"></i>' +
            '</a>' +
            '<a class="navbar-brand" id="botonCRUD">' +
                '<i class="fa-solid fa-paw" id="iconoCRUD"></i>'+
            '</a>' +
            '<a class="navbar-brand" id="botonUsuario">' +
                '<img src="./assets/images/user_black.png" alt="Usuario" id="iconoUsuario" width="30" height="24">' +
            '</a>' +
        '</div>' +
    '</nav>' +
'</footer>'
  );
  const botonLista = document.getElementById("botonLista");
  const botonUsuario = document.getElementById("botonUsuario");
  const botonCRUD = document.getElementById("botonCRUD");
  const imagenUsuario = document.getElementById("iconoUsuario");
  const imagenCRUD = document.getElementById("iconoCRUD");
  imagenCRUD.setAttribute("style","color: white");
  const imagenLista = document.getElementById("iconoLista");

  botonUsuario.addEventListener("click", function(e){
    imagenUsuario.src = "./assets/images/user_white.png"
    imagenCRUD.setAttribute("style","color: black")
    imagenLista.setAttribute("style","color: black")
    generarPaginaUs();
    window.scrollTo(0,0);
  })
  botonLista.addEventListener("click", function(e){
    imagenUsuario.src = "./assets/images/user_black.png"
    imagenCRUD.setAttribute("style","color: black")
    imagenLista.setAttribute("style","color: white")
    listaDOM();
    window.scrollTo(0,0);
  })
  botonCRUD.addEventListener("click", function(e){
    imagenUsuario.src = "./assets/images/user_black.png"
    imagenCRUD.setAttribute("style","color: white")
    imagenLista.setAttribute("style","color: black")
    actualizarDOM();
    window.scrollTo(0,0);
  })
}
function setUID(id){
  uid = id;
}
export function getUID(){
  return uid;
}