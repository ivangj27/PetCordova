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
    '<div id="datosUsuario">' +
      "<h2>MIS DATOS</h2>" +
      '<div class="inputContainerUsuario">'+
        '<input class="camposTextoDatosMascota" id="camposTextoUsuario" name="nombre" type="text" placeholder="a"></input>'+
        '<label class="labelTituloCampos" for="">NOMBRE</label>'+
     '</div>'+
     '<div class="inputContainerUsuario">'+
        '<input class="camposTextoDatosMascota" name="apellidos" id="camposTextoUsuario" type="text" placeholder="a"></input>'+
        '<label class="labelTituloCampos" for="">APELLIDOS</label>'+
     '</div>'+
      '<div class="inputContainerUsuario">'+
        '<input class="camposTextoDatosMascota" name="dni" id="camposTextoUsuario" type="text" placeholder="a"></input>'+
        '<label class="labelTituloCampos" for="">DNI</label>'+
     '</div>'+
     '<div class="inputContainerUsuario">'+
        '<input class="camposTextoDatosMascota" name="email" id="camposTextoUsuario" type="email" aria-describedby="emailHelp" placeholder="a"></input>'+
        '<label class="labelTituloCampos" for="">EMAIL</label>'+
        '<div id="emailHelp" class="form-text"></div>'+
     '</div>'+
     '<div class="inputContainerUsuario">'+
        '<input class="camposTextoDatosMascota" name="contrasena" id="camposTextoUsuario" type="password" aria-describedby="emailHelp" placeholder="a"></input>'+
        '<label class="labelTituloCampos" for="">CONTRASEÑA</label>'+
     '</div>'+
     '<div class="inputContainerUsuario">'+
        '<input class="camposTextoDatosMascota" name="contrasena" id="camposTextoUsuario" type="password" aria-describedby="emailHelp" placeholder="a"></input>'+
        '<label class="labelTituloCampos" for="">CONFIRMAR CONTRA.</label>'+
     '</div>'+
     '<div class="input-group mb-3">' +
      ' <select class="form-select" id="inputGroupSelect02" placeholder="Sexo">' +
      ' <option value="" disabled selected hidden>Seleccione su sexo</option>'+
      ' <option value="1">Hombre</option>' +
      ' <option value="2">Mujer</option>' +
      " </select>" +
      ' <label class="input-group-text" for="inputGroupSelect02">SEXO</label>' +
      "</div>" +
      '<div class="mb-3 form-check">' +
      '<input class="form-check-input" type="checkbox" id="exampleCheck1">' +
      '<label class="form-check-label" for="exampleCheck1">Acepto los términos y condiciones</label>' +
      "</div>" +
      '<button id="registro" class="btn btn-primary">Confirmar cambios</button>' +
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
  
  /*const nombre = document.getElementById("nombre");
  const apellidos = document.getElementById("apellidos");
  const dni = document.getElementById("dni");
  const email = document.getElementById("email");
  const contrasena = document.getElementById("contrasena");
  const sexo = document.getElementById("inputGroupSelect02");*/

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
    document.addEventListener("backbutton", function(){generarPaginaUs()}, false);

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
    generarPaginaUs();

  }else{
    mostrarToast("Por favor, rellena todos los campos");
  }
}