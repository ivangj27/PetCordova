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

export function actualizarDOM() {
  console.log("INTENTANDO ACTUALIZAR EL DOM");

  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");
  const articles = seccion.querySelectorAll("article");

  if(document.getElementById("bloqueBusqueda")){
    document.getElementById("bloqueBusqueda").remove();
  }

  if(document.getElementById("datosUsuario")){
    document.getElementById("datosUsuario").remove();
  }

  if(document.getElementById("divMascotasList")){
    document.getElementById("divMascotasList").remove();
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
    '<div><section id="infoMascota"><article class="ventanaDatosMascota">' +
  '<img class="fotoDetalleMascota" src="img/icono_perro.png" width="170" height="200">' +
  '<div class="divDatosMascota">' +
  '<div class="inputContainer">' +
  '<input type="text" class="camposTextoDatosMascota" placeholder="a">' +
  '<label class="labelTituloCampos" for="">Nombre Mascota</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input class="camposTextoDatosMascota" type="text" placeholder="a">' +
  '<label class="labelTituloCampos" for="">DNI Dueño</label>' +
  '</div>' +
  '<br>' +
  '<div class="inputContainer">' +
  '<input class="camposTextoDatosMascota" type="date" placeholder="a">' +
  '<label class="labelTituloCampos" for="">Fecha Nacimiento</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input type="text" placeholder="a" readonly="" class="camposTextoDatosMascota">' +
  '<label class="labelTituloCampos" for="">Edad</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input type="text" placeholder="a" class="camposTextoDatosMascota">' +
  '<label class="labelTituloCampos" for="">Raza Mascota</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input type="text" placeholder="a" class="camposTextoDatosMascota">' +
  '<label class="labelTituloCampos" for="">Sexo</label>' +
  '</div>' +
  '</div>' +
  '<div class="divBotones">' +
  '<div class="divBotonAceptar">' +
  '<button class="botonAceptar">ACEPTAR MASCOTA</button>' +
  '</div>' +
  '<div class="divBotonCancelar">' +
  '<button class="botonCancelar">CANCELAR MASCOTA</button>' +
  '</div>' +
  '</div>' +
  '</article></section></div>'
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
  const bAnadir = document.getElementById("alta");
  bAnadir.addEventListener("click", function () {
    anadir();
  });
  document.getElementById("modifica").addEventListener("click", () => {
    modificar();
  });
  document.getElementById("borra").addEventListener("click", () => {
    eliminar();
  });
  document.getElementById("consulta").addEventListener("click", () => {
    //listaDOM(role);
    listaDOM();
  });
}
function anadir() {
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
    adoptado:false
  };
  set(ref(database, "Mascotas/" + cod), Mascota);
  subirImagen();
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

function subirImagen() {
  const database = getDatabase();

  get(ref(database, `users/${getUID()}`)).then((snapshot) => { 
    // Obtiene el objeto de datos del usuario
    const userData = snapshot.val();

    // Obtiene el valor del rol del usuario
    const email = userData.email;
    // Selecciona el archivo a subir
    const file = document.getElementById("imagen").files[0];

    // Crea una referencia al archivo en Firebase Storage
    const storageRef = ref2(getStorage(), `${email}/perrito1.jpg`);
    // Sube el archivo a Firebase Storage
    console.log(convertImageToBlob("img/logo.png"));

    uploadBytes(storageRef,file ).then((snapshot) => {
      console.log("Imagen subida correctamente");
    });

    // Hace algo con el valor del rol (por ejemplo, lo muestra en la consola)

    // Si el inicio de sesión es exitoso, puedes redirigir a la página que desees o realizar otras acciones
  });
}




