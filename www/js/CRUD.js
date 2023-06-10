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

var nacimientoBD; 
var mascotas = [];
var cod;

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
  '<input type="text" class="camposTextoDatosMascota" id="nombre" placeholder="a">' +
  '<label class="labelTituloCampos" for="">Nombre Mascota</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input class="camposTextoDatosMascota" type="text" id="dni" placeholder="a">' +
  '<label class="labelTituloCampos" for="">DNI Dueño</label>' +
  '</div>' +
  '<br>' +
  '<div class="inputContainer">' +
  '<input class="camposTextoDatosMascota" type="date" id="nacimiento" placeholder="a">' +
  '<label class="labelTituloCampos" for="">Fecha Nacimiento</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input type="text" placeholder="a" readonly="" class="camposTextoDatosMascota" id="edad">' +
  '<label class="labelTituloCampos" for="">Edad</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input type="text" placeholder="a" class="camposTextoDatosMascota" id="raza">' +
  '<label class="labelTituloCampos" for="">Raza Mascota</label>' +
  '</div>' +
  '<div class="inputContainer">' +
  '<input type="text" placeholder="a" class="camposTextoDatosMascota" id="sexo">' +
  '<label class="labelTituloCampos" for="">Sexo</label>' +
  '</div>' +
  '</div>' +
  '<div class="divBotones">' +
  '<div class="divBotonAceptar">' +
  '<button class="botonAceptar" id="botonAceptar">ACEPTAR MASCOTA</button>' +
  '</div>' +
  '<div class="divBotonCancelar">' +
  '<button class="botonCancelar" id="botonCancelar">CANCELAR MASCOTA</button>' +
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
  const bImagen = document.getElementById("imagen");
 
  bImagen.addEventListener("change", function (event) {
    imagen = event.target.files[0];
  })

  const bAnadir = document.getElementById("botonAceptar");
  const bCancelar = document.getElementById("botonCancelar");
  const inputEdad = document.getElementById("edad");
  const inputFecha = document.getElementById("nacimiento");


  const database = getDatabase();
  var mascotasRef = ref(database, "Mascotas");
  if (mascotas.length > 0) {
    mascotas.splice(0, mascotas.length);
  }
  get(mascotasRef).then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var mascota = childSnapshot.val();
      mascotas.push(mascota);
    });

    mascotas.forEach((mascota) => {
      cod = (parseInt(mascota.cod) + 1).toString();
    });
  });


  inputFecha.addEventListener("input", () => {
      console.log(inputFecha.value)
      var fechas = inputFecha.value.split("-");
      console.log(fechas)
      nacimientoBD = fechas[2]+"/"+fechas[1]+"/"+fechas[0];
      console.log(nacimientoBD)
      var cumple_date = new Date(inputFecha.value);
      var edadDiff = Date.now() - cumple_date.getTime();
      var edadDate = new Date(edadDiff);
      const edadMascota = Math.abs(edadDate.getUTCFullYear() - 1970);

      inputEdad.value = edadMascota;

  });
  bCancelar.addEventListener("click", function() {
    listaDOM();
  });
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

    anadir();
  });

  get(ref(database,`users/${getUID()}`)).then((snapshot) => {
    if(snapshot.exists()){
      if(snapshot.val().solicitud.length != 0) {
        navigator.notification.alert(
          'You are the winner!',  // message
          alertDismissed,         // callback
          'Game Over',            // title
          'Done'                  // buttonName
      );
      }
    }
  })
}

function alertDismissed() {
  // do something
}

function anadir() {
  console.log("SE EJECUTA ANADIR");
  const database = getDatabase();

  // Obtener una referencia a la ubicación donde deseas agregar datos.
  
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = document.getElementById("inputGroupSelect02").value
  var dni = document.getElementById("dni").value;
  var nacimiento = nacimientoBD

  var Mascota = {
    cod: cod,
    nombre: nombre,
    raza: raza,
    sexo: sexo,
    dni: dni,
    nacimiento: nacimiento,
    adoptado:false,
    imagen: archivo.name
  };
  set(ref(database, "Mascotas/" + cod), Mascota);
  subirImagen(archivo);
  limpiaCampos();
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
export function limpiaCampos() {
  document.getElementById("nombre").value = null;
  document.getElementById("raza").value = null;
  document.getElementById("inputGroupSelect02").value = null;
  document.getElementById("dni").value = null;
  document.getElementById("nacimiento").value = null;
  document.getElementById("edad").value = null;
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