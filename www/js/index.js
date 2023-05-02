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
    document.getElementById("inicio").click();
  }
};

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const botonRegistro = document.getElementById("registro");
const botonInicio = document.getElementById("inicio");
const botonPass = document.getElementById("resetPass")
console.log("iniciado");

// Listeners de los botones de inicio y registro
botonRegistro.addEventListener("click", registro);
botonInicio.addEventListener("click", iniciarSesion);
botonPass.addEventListener("click",cambiarContrasena)

function registro() {
  console.log("REGISTRANDO...");
  var usuario = document.getElementById("email").value;
  var contrasena = document.getElementById("contrasena").value;

  createUserWithEmailAndPassword(auth, usuario, contrasena)
    .then((userCredential) => {
      const user = userCredential.user;

      set(ref(database, "users/" + user.uid), {
        username: usuario,
        contrasena: contrasena,
      });
      mostrarToast("Registro exitoso", false);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      mostrarToast("Registro fallido error: " + errorMessage, true);
    });
}

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
          // User logged in already or has just logged in.
          var id = user.uid;
          get(ref(database, `users/${id}`)).then((snapshot) => {
            // Obtiene el objeto de datos del usuario
            const userData = snapshot.val();

            // Obtiene el valor del rol del usuario
            const userRole = userData.role;

            // Hace algo con el valor del rol (por ejemplo, lo muestra en la consola)
            recordarDatos();
            actualizarDOM(userRole,email);

            // Si el inicio de sesión es exitoso, puedes redirigir a la página que desees o realizar otras acciones

            mostrarToast("Inicio de sesión correcto", false);
          });
        }
      });
    })
    .catch((error) => {
      // Si hay un error en el inicio de sesión, puedes mostrar un mensaje de error o realizar otras acciones
      const errorCode = error.code;
      const errorMessage = error.message;

      mostrarToast("Error al iniciar sesión" + errorMessage, true);
    });
}

//Método para crear un "Toast" personalizado con el texto que le pases por parámetros
function mostrarToast(cuerpo, error) {
  // Si error es verdadero muestra un toast de rojo
  if (error) {
    const toast = document.getElementById("fallido");
    const toastBody = toast.querySelector(".toast-body");
    toastBody.textContent = cuerpo;
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  } //Si error es falso muestra un toast del color principal
  else {
    const toast = document.getElementById("correcto");
    const toastBody = toast.querySelector(".toast-body");
    toastBody.textContent = cuerpo;
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  }
}
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
function cambiarContrasena(){
  console.log(document.getElementById("email").value)
  if (document.getElementById("email").value == "") {
    mostrarToast("El campo de 'email' está vacío", true)
  }else {
    console.log("cambiando la contrasena")
    sendPasswordResetEmail(auth,document.getElementById("email").value)
    .then(() => {
      mostrarToast("Email de cambio de contraseña enviado", false);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      mostrarToast("Fallo al enviar el email: " + errorMessage, true);
    });
  }
}
