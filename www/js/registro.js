import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";

import { restablecerDOM } from "./index.js";

export function paginaRegistro() {
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
      "<h2>Registro</h2>" +
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
      '<button id="registro" class="btn btn-primary">Registrarse</button>' +
      "</div>"
  );
  const registro = document.getElementById("registro");
  registro.addEventListener("click", prueba);
  document.addEventListener("backbutton", function(){restablecerDOM()}, false);

}

function prueba() {
  const seccion = document.getElementById("contenido");
  const divs = seccion.getElementsByTagName("input");

  var datos = [];

  console.log(divs);
  for(var i = 0; i<6;i++) {
    if(divs.item(i).className.match("camposTextoDatosMascota")){
      datos.push(divs.item(i).value);
    }
  }
  console.log(datos)
  const nombre = datos[0];
  const apellidos = datos[1];
  const dni = datos[2];
  const email = datos[3];
  const contrasena = datos[4];
  const confirmarContrasena = datos[5];

  var sexo = document.getElementById("inputGroupSelect02").value; //ACABO DE AÑADIR ESTO SI NO VA NO SE COMO ES
  const aceptoTerminos = document.getElementById("exampleCheck1");

  //Validaciones
  if (
    nombre === "" ||
    apellidos === "" ||
    email === "" ||
    contrasena === "" ||
    confirmarContrasena === "" ||
    sexo === "" ||
    !aceptoTerminos
  ) {
    alert("Por favor, rellene todos los campos");
  } else {
    if (!contrasena === confirmarContrasena) {
      alert("Las contraseñas no coinciden");
    }
  }

  if (aceptoTerminos.checked) {
    if (comprobarDNI(dni)) {
      //registro del usuario en firebase
      const auth = getAuth();
      if(sexo == 1){
        sexo = "Hombre"
      }else if(sexo == 2){
        sexo = "Mujer"
      }else {
        sexo = "Desconocido"
      }

      createUserWithEmailAndPassword(auth, email, contrasena)
        .then((userCredential) => {
          const user = userCredential.user;

          set(ref(getDatabase(), "users/" + user.uid), {
            email: email,
            contrasena: contrasena,
            nombre: nombre,
            apellidos: apellidos,
            dni: dni,
            sexo: sexo,
          });
          restablecerDOM();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
        alert("Registro completado con éxito.")
    }
  } else {
    alert("Debe aceptar los términos y condiciones");
  }
}

function registrar() {


  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const email = document.getElementById("email").value;
  const dni = document.getElementById("dni").value;
  const contrasena = document.getElementById("contrasena").value;
  const confirmarContrasena = document.getElementById(
    "confirmarContrasena"
  ).value;
  var sexo = document.getElementById("inputGroupSelect02").value; //ACABO DE AÑADIR ESTO SI NO VA NO SE COMO ES
  const aceptoTerminos = document.getElementById("exampleCheck1");

  //Validaciones
  if (
    nombre === "" ||
    apellidos === "" ||
    email === "" ||
    contrasena === "" ||
    confirmarContrasena === "" ||
    sexo === "" ||
    !aceptoTerminos
  ) {
    alert("Por favor, rellene todos los campos");
  } else {
    if (!contrasena === confirmarContrasena) {
      alert("Las contraseñas no coinciden");
    }
  }

  if (aceptoTerminos.checked) {
    if (comprobarDNI(dni)) {
      //registro del usuario en firebase
      const auth = getAuth();
      if(sexo == 1){
        sexo = "Hombre"
      }else if(sexo == 2){
        sexo = "Mujer"
      }

      createUserWithEmailAndPassword(auth, email, contrasena)
        .then((userCredential) => {
          const user = userCredential.user;

          set(ref(getDatabase(), "users/" + user.uid), {
            username: email,
            contrasena: contrasena,
            nombre: nombre,
            apellidos: apellidos,
            dni: dni,
            sexo: sexo,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
        alert("Registro completado con éxito.")
        window.scrollTo(0,0);
        restablecerDOM();
    }
  } else {
    alert("Debe aceptar los términos y condiciones");
  }
}
export function comprobarDNI(dni) {
  dni = dni.toUpperCase();
  const formatoDNI = /^[0-9]{8}[a-zA-Z]$/;

  if (!dni.match(formatoDNI)) {
    // Si el formato no es correcto, se muestra un mensaje de error
    alert(
      "El formato del DNI es incorrecto. Debe tener 8 dígitos seguidos de una letra."
    );
    return false;
  }

  // Obtenemos el número del DNI
  const numeroDNI = dni.substr(0, 8).trim();
  console.log("EL NUMERO DEL DNI ES: ", numeroDNI)
  // Obtenemos la letra correspondiente al número del DNI
  const letrasDNI = "TRWAGMYFPDXBNJZSQVHLCKE";
  const letraDNI = letrasDNI.charAt(numeroDNI % 23);
  console.log("LA LETRA DEL DNI ES: ",letraDNI)

  // Comprobamos si la letra introducida por el usuario coincide con la letra calculada
  console.log(dni.charAt(8))
  if (dni.charAt(8) != letraDNI) {
    // Si la letra no coincide, se muestra un mensaje de error
    alert("La letra del DNI no es correcta.");
    return false;
  }

  // Si el formato y la letra del DNI son correctos, la función devuelve true
  return true;
}
