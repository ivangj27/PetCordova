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
  uploadBytes
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";
import { listaDOM } from "./listaInteractiva.js";

export function actualizarDOM(role,email) {
  console.log("INTENTANDO ACTUALIZAR EL DOM");

  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");
  const storage = getStorage();
  // Me cargo todos los divs de la section
  divs.forEach((div) => {
    div.remove();
  });

  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterbegin",
    '<div class="container mt-4">' +
      "<form>" +
      '<div class="row col-campos">' +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="cod">COD. IDENTIFICACIÓN</label>' +
      '<input type="text" class="form-control" id="cod">' +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="nombre">NOMBRE</label>' +
      '<input type="text" class="form-control" id="nombre" placeholder="Nombre de su mascota">' +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="raza">RAZA</label>' +
      '<input type="text" class="form-control" id="raza" placeholder="Raza de su mascota">' +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="sexo">SEXO</label>' +
      '<input type="text" class="form-control" id="sexo" placeholder="Sexo de su mascota">' +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="nacimiento">F. NACIMIENTO</label>' +
      '<input type="text" class="form-control" id="nacimiento" placeholder="Fecha de Nacimiento de su mascota">' +
      "</div>" +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="dni">DNI</label>' +
      '<input type="text" class="form-control" id="dni" placeholder="Inserte el DNI del dueño">' +
      "</div>" +
      '<div class="col-md-2">' +
      '<div class="form-group">' +
      '<label for="imagen">Imagen</label>' +
      '<input type="file" class="form-control" id="imagen">' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</form>" +
      "</div>" +
      '<div class="container mt-4">' +
      '<div class="row col-botones">' +
      '<div class="col-md-3">' +
      '<button type="button" class="btn btn-success w-100 admButton" id="alta">ALTA</button>' +
      "</div>" +
      '<div class="col-md-3">' +
      '<button type="button" class="btn btn-warning w-100 admButton" id="modifica">MODIFICA</button>' +
      "</div>" +
      '<div class="col-md-3">' +
      '<button type="button" class="btn btn-danger w-100 admButton" id="borra" >BORRA</button>' +
      "</div>" +
      '<div class="col-md-3">' +
      '<button type="button" class="btn btn-primary w-100" id="consulta">CONSULTA TODOS</button>' +
      "</div>" +
      "</div>" +
      "</div>"
  );
  if (role != "admin") {
    // Obtener una lista de elementos con la clase "admButton"
    const buttons = document.querySelectorAll(".admButton");

    // Recorrer la lista y eliminar cada elemento
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].remove();
    }
  }
  const bAnadir = document.getElementById("alta");
  bAnadir.addEventListener("click", function () {
    anadir(email);
  });
  document.getElementById("modifica").addEventListener("click", () => {
    modificar();
  });
  document.getElementById("borra").addEventListener("click", () => {
    eliminar();
  });
  document.getElementById("consulta").addEventListener("click", () => {
    listaDOM(role);
  });
}
function anadir(email) {
  console.log("SE EJECUTA ANADIR");
  const database = getDatabase();

  // Obtener una referencia a la ubicación donde deseas agregar datos.

  var cod = document.getElementById("cod").value;
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = document.getElementById("sexo").value;
  var dni = document.getElementById("dni").value;
  var nacimiento = document.getElementById("nacimiento").value;

  var Mascota = {
    cod: cod,
    nombre: nombre,
    raza: raza,
    sexo: sexo,
    dni: dni,
    nacimiento: nacimiento,
  };
  set(ref(database, "Mascotas/" + cod), Mascota);

  // Limpiar los campos después de insertar los datos.
  subirImagen(email);
  limpiaCampos();
}

function modificar() {
  console.log("SE EJECUTA MODIFICAR");
  const database = getDatabase();

  // Obtener los valores de los campos
  var cod = document.getElementById("cod").value;
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = document.getElementById("sexo").value;
  var dni = document.getElementById("dni").value;
  var nacimiento = document.getElementById("nacimiento").value;

  // Obtener una referencia al documento que se desea modificar
  var mascotaRef = ref(database, `Mascotas/${cod}`);

  // Verificar si el documento existe en la base de datos
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
  document.getElementById("sexo").value = null;
  document.getElementById("dni").value = null;
  document.getElementById("nacimiento").value = null;
  document.getElementById("imagen").value = null;
}
function subirImagen(email) {
  // Selecciona el archivo a subir
  const file = document.getElementById("imagen").files[0];

  // Crea una referencia al archivo en Firebase Storage
  const storageRef = ref2(getStorage(), `${email}/perrito1.jpg`);

  // Sube el archivo a Firebase Storage
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log("Imagen subida correctamente");
  });
}
