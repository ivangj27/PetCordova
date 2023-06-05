import {
  getDatabase,
  ref,
  push,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
import {
  getStorage,
  ref as ref2,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";
import { listaDOM } from "./listaInteractiva.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import { getUID } from "./index.js";
import { mostrarToast } from "./index.js";
import { comprobarDNI } from "./registro.js";

export function actualizarDOM() {
  var imagen = ""; 

  console.log("INTENTANDO ACTUALIZAR EL DOM");

  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");
  const articles = seccion.querySelectorAll("article");

  if (document.getElementById("bloqueBusqueda")) {
    document.getElementById("bloqueBusqueda").remove();
  }

  if (document.getElementById("datosUsuario")) {
    document.getElementById("datosUsuario").remove();
  }

  // Me cargo todos los divs de la section
  divs.forEach((div) => {
    div.remove();
  });
  articles.forEach((article) => {
    article.remove();
  });

  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterbegin",
    '<div class="container mt-4">' +
      '<label for="tituloDatos" id="tituloDatos">DATOS DE LA MASCOTA</label>' +
      "<form>" +
      '<div class="row col-campos">' +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="cod">Código identificación:</label>' +
      '<div class="input-group mb-3">' +
      '<input type="text" class="form-control" id="cod">' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="nombre">Nombre: </label>' +
      '<div class="input-group mb-3">' +
      '<input type="text" class="form-control" id="nombre">' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="raza">Raza: </label>' +
      '<div class="input-group mb-3">' +
      '<input type="text" class="form-control" id="raza">' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="input-group mb-3">' +
      ' <select class="form-select" id="inputGroupSelect02" placeholder="Sexo">' +
      ' <option value="" disabled selected hidden>Seleccione su sexo</option>'+
      ' <option value="1">Macho</option>' +
      ' <option value="2">Hembra</option>' +
      " </select>" +
      ' <label class="input-group-text" for="inputGroupSelect02">SEXO</label>' +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="nacimiento">Fecha Nacimiento: </label>' +
      '<div class="input-group mb-3">' +
      '<input type="text" class="form-control" id="nacimiento">' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="dni">DNI: </label>' +
      '<div class="input-group mb-3">' +
      '<input type="text" class="form-control" id="dni">' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="imagen">Imagen: </label>' +
      '<div class="input-group mb-3">' +
      '<input type="file" class="form-control" id="imagen">' +
      "</div>" +
      "</div>" +
      " </div>" +
      " </div>" +
      '<div class="row col-botones">' +
      ' <div class="row-cols-2">' +
      '<button type="button" class="btn btn-danger w-100 admButton" id="cancelar">CANCELAR</button>' +
      '<button type="button" class="btn btn-success w-100 admButton" id="aceptar">ACEPTAR</button>' +
      "</div>" +
      "</div>" +
      "</form>" +
      "</div> "
  );
  /* Comprobación de si es admin eliminada, ya veremos si metemos esto al final
  if (role != "admin") {
    // Obtener una lista de elementos con la clase "admButton"
    const buttons = document.querySelectorAll(".admButton");

    // Recorrer la lista y eliminar cada elemento
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].remove();
    }
  }*/
  const bAnadir = document.getElementById("aceptar");
  const bImagen = document.getElementById("imagen");
 
  bImagen.addEventListener("change", function (event) {
    imagen = event.target.files[0];
  })

  bAnadir.addEventListener("click", function () {
    console.log(imagen.name)
    anadir(imagen);
  });
  }
function anadir(archivo) {
  get(ref(getDatabase(), `users/${getUID()}`)).then((snapshot) => {
    // Obtiene el objeto de datos del usuario
    const userData = snapshot.val();

    // Obtiene el valor del rol del usuario
    const email = userData.email;
    // Selecciona el archivo a subir

  console.log("SE EJECUTA ANADIR");
  const database = getDatabase();

  // Obtener una referencia a la ubicación donde deseas agregar datos.

  var cod = document.getElementById("cod").value;
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = document.getElementById("inputGroupSelect02").value
  var dni = document.getElementById("dni").value;
  var nacimiento = document.getElementById("nacimiento").value;

  if(sexo == 1){
    sexo = "Hombre"
  }else if(sexo == 2){
    sexo = "Mujer"
  }

  var Mascota = {
    cod: cod,
    nombre: nombre,
    raza: raza,
    sexo: sexo,
    dni: dni,
    nacimiento: nacimiento,
    imagen: archivo.name,
  };
  set(ref(database, "Mascotas/" + cod), Mascota);
  subirImagen(archivo);
  limpiaCampos();
})
mostrarToast("Mascota agregada correctamente");
}

function modificar() {
  console.log("SE EJECUTA MODIFICAR");
  const database = getDatabase();

  // Obtener los valores de los campos
  var cod = document.getElementById("cod").value;
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = document.getElementById("inputGroupSelect02").value
  var dni = document.getElementById("dni").value;
  var nacimiento = document.getElementById("nacimiento").value;

  // Obtener una referencia al documento que se desea modificar
  var mascotaRef = ref(database, `Mascotas/${cod}`);

  // Verificar si el documento existe en la base de datos
  var error = false;
  if (nacimiento === "") {
    mostrarToast("Por favor, ingresa la fecha de nacimiento");
    error = true;
  } else {
    var fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Expresión regular para el formato dd/mm/yyyy
    if (!fechaRegex.test(nacimiento)) {
      mostrarToast("El formato de fecha de nacimiento debe ser dd/mm/yyyy");
      error = true;
    }
  }

  if(comprobarDNI(dni) === false){
    mostrarToast("El DNI no es válido");
    error = true;
  }

  if (!error) {
    get(mascotaRef).then((snapshot) => {
      if (snapshot.exists()) {
        // Actualizar los campos específicos de la mascota usando el método set()
        set(mascotaRef, {
          cod: cod,
          nombre: nombre,
          raza: raza,
          sexo: sexo,
          dni: dni,
          nacimiento: nacimiento,
        });
        console.log("MASCOTA MODIFICADA");
      } else {
        console.log("EL DOCUMENTO NO EXISTE");
      }
    });
    limpiaCampos();
  }
}
function eliminar() {
  console.log("SE EJECUTA ELIMINAR");
  const database = getDatabase();

  // Obtener el valor del campo "cod"
  var cod = document.getElementById("cod").value;

  // Obtener una referencia al documento que se desea eliminar
  var mascotaRef = ref(database, `Mascotas/${cod}`);

  // Verificar si el documento existe en la base de datos
  get(mascotaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Si el documento existe, eliminarlo
        set(mascotaRef, null)
          .then(() => {
            console.log("Documento eliminado exitosamente.");
          })
          .catch((error) => {
            console.error("Error eliminando el documento: ", error);
          });
      } else {
        console.error("El documento no existe.");
      }
    })
    .catch((error) => {
      console.error("Error obteniendo el documento: ", error);
    });
  limpiaCampos();
}
function limpiaCampos() {
  document.getElementById("cod").value = null;
  document.getElementById("nombre").value = null;
  document.getElementById("raza").value = null;
  document.getElementById("inputGroupSelect02").value = null;
  document.getElementById("dni").value = null;
  document.getElementById("nacimiento").value = null;
  document.getElementById("imagen").value = null;
}

var fileData = new File();

function subirImagen(archivo) {
  const database = getDatabase();
  const imagen = archivo
  get(ref(database, `users/${getUID()}`)).then((snapshot) => {
    // Obtiene el objeto de datos del usuario
    const userData = snapshot.val();

    // Obtiene el valor del rol del usuario
    const email = userData.email;
    // Selecciona el archivo a subir

    console.log(archivo.name);
    console.log(archivo.size);
    // Crea una referencia al archivo en Firebase Storage
    const storageRef = ref2(getStorage(), `${email}/` + archivo.name);
    // Sube el archivo a Firebase Storage

    uploadBytes(storageRef, archivo).then((snapshot) => {
      console.log("Imagen subida correctamente");
    });

    // Hace algo con el valor del rol (por ejemplo, lo muestra en la consola)

    // Si el inicio de sesión es exitoso, puedes redirigir a la página que desees o realizar otras acciones
  });
}