import {
  getAuth} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";

import { generarPaginaUs } from "./paginaUsuario.js";
import { getUID, mostrarToast } from "./index.js";

export function generarDatosCuenta() {
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
      "<h2>Tus datos</h2>" +
      '<div class="mb-3">' +
      '<label for="nombre" class="form-label">Nombre:</label>' +
      '<input type="text" id="nombre" name="nombre" class="form-control" placeholder="Escribe tu nombre">' +
      "</div>" +
      '<div class="mb-3">' +
      '<label for="apellidos" class="form-label">Apellidos:</label>' +
      '<input type="text" id="apellidos" name="apellidos" class="form-control" placeholder="Escribe tus apellidos">' +
      "</div>" +
      '<div class="input-group mb-3">' +
      ' <select class="form-select" id="inputGroupSelect02" placeholder="Sexo">' +
      ' <option value="" disabled selected hidden>Seleccione su sexo</option>' +
      ' <option value="1">Hombre</option>' +
      ' <option value="2">Mujer</option>' +
      " </select>" +
      ' <label class="input-group-text" for="inputGroupSelect02">SEXO</label>' +
      "</div>" +
      '<div class="mb-3">' +
      '<label for="dni" class="form-label">DNI:</label>' +
      '<input type="text" id="dni" name="dni" class="form-control" placeholder="Inserte su DNI">' +
      "</div>" +
      '<div class="mb-3">' +
      '<label for="exampleInputEmail1" class="form-label">Email address</label>' +
      '<input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Email">' +
      '<div id="emailHelp" class="form-text"></div>' +
      "</div>" +
      '<div class="mb-3">' +
      '<label for="exampleInputPassword1" class="form-label">Contraseña</label>' +
      '<input type="password" class="form-control" id="contrasena" placeholder="Contraseña">' +
      "</div>" +
      '<button id="confirmar" class="btn btn-primary">Confirmar cambios</button>' +
      
      "</div>"
  );
  const buttonConfirmar = document.getElementById("confirmar");
  document.addEventListener(
    "backbutton",
    function () {
      generarPaginaUs();
    },
    false
  );
  //inserta los datos del user en los campos correspondientes

  const auth = getAuth();
  const db = getDatabase();
  const nombre = document.getElementById("nombre");
  const apellidos = document.getElementById("apellidos");
  const dni = document.getElementById("dni");
  const email = document.getElementById("email");
  const contrasena = document.getElementById("contrasena");
  const sexo = document.getElementById("inputGroupSelect02");

  get(ref(db, `users/${getUID()}`)).then((snapshot) => {
    // Obtiene el objeto de datos del usuario
    var usuario = snapshot.val();

    nombre.value = usuario.nombre;
    apellidos.value = usuario.apellidos;
    dni.value = usuario.dni;
    dni.value = usuario.dni;
    email.value = usuario.email;
    contrasena.value = usuario.contrasena;
    sexo.value = usuario.sexo;
      
 

  
    buttonConfirmar.addEventListener("click", function(){confirmar(usuario,db,nombre,apellidos,dni,email,contrasena,sexo)});
})
}

function confirmar(user, db, nombre, apellidos, dni, email, contrasena, sexo) {
    if (
    nombre != "" ||
    apellidos != "" ||
    email != "" ||
    contrasena != "" ||
    sexo != "")
    {
    set(ref(db, `users/${getUID()}`), {
      nombre: nombre.value,
      apellidos: apellidos.value,
      dni: dni.value,
      email: email.value,
      contrasena: contrasena.value,
      sexo: sexo.value,
    });
    mostrarToast("Cambios realizados correctamente")
  }else{
    mostrarToast("Por favor, rellena todos los campos");
  }
  
}