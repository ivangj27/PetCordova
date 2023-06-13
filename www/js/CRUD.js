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
  '<div class="input-group mb-3">' +
      ' <select class="form-select" id="inputGroupSelect02" placeholder="Sexo">' +
      ' <option value="" disabled selected hidden>Seleccione su sexo</option>'+
      ' <option value="1">Hombre</option>' +
      ' <option value="2">Mujer</option>' +
      " </select>" +
      ' <label class="input-group-text" for="inputGroupSelect02">SEXO</label>' +
  "</div>" +
 ' <div class="inputContainer">'+
   '<input id="inputImagen" type="file" class="camposTextoDatosMascota"> '+
   '<label class="labelTituloCampos" for="">Imagen</label>' +
  '</div>'+
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

  const bAnadir = document.getElementById("botonAceptar");
  const bCancelar = document.getElementById("botonCancelar");
  const inputEdad = document.getElementById("edad");
  const inputFecha = document.getElementById("nacimiento");
  const inputImagen = document.getElementById("inputImagen");


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
    anadirMascota(imagen);
  });

  inputImagen.addEventListener("change",function() {
    imagen = inputImagen.files[0];
    cambiarImagenArriba(inputImagen);
  });

  get(ref(database,`users/${getUID()}`)).then((snapshot) => {
    if(snapshot.exists()){
      var usuario_duenoBD = snapshot.val();
      if(snapshot.val().solicitud.length != 0) {
        var dni_dueno = snapshot.val().dni;
        var dni_solicitante = snapshot.val().solicitud.substring(0,9);
        var cod_pet = snapshot.val().solicitud.substring(10,snapshot.val().solicitud.length+1);
        var mensaje = "Solicitud de "+dni_solicitante+ " para el codMascota "+cod_pet;
        var titulo = "SOLICITUD";
        var etiquetaAceptar = "Aceptar";
        var etiquetaCancelar = "Cancelar";
        navigator.notification.confirm(
          mensaje,
          function (buttonIndex) {
              if (buttonIndex === 1) {
                  // Se hizo clic en el botón Aceptar
                  get(ref(database, `Mascotas/${cod_pet}`)).then((snapshot) => {
                    var petBD = snapshot.val();
                    if (snapshot.exists()) {
                      set(ref(database, `Mascotas/${cod_pet}`),{
                        adoptado:true,
                        cod:petBD.cod,
                        dni:dni_solicitante,
                        nacimiento:petBD.nacimiento,
                        nombre:petBD.nombre,
                        raza:petBD.raza,
                        sexo:petBD.sexo
                      })
                    }
                  });
                  get(ref(database, `Solicitudes`)).then((snapshot) => {
                    var solicitudes = []
                    snapshot.forEach(function(childSnapshot) {
                        var solicitud = childSnapshot.val();
                        solicitudes.push(solicitud);
                    });
                    var nSolicitud = solicitudes.length+1
                    var fechaActual = obtenerFechaActual();
                    var solicitudJSON= {
                      codPet: cod_pet,
                      dni_anterior: dni_dueno,
                      dni_nuevo:dni_solicitante,
                      fecha:fechaActual,
                      nSolicitud: nSolicitud
                    };
                    set(ref(database, "Solicitudes/" + nSolicitud), solicitudJSON);
                  });
                  //ENVIAR NOTIFICACION A USUARIO
                  get(ref(database,"users")).then((snapshot) => {
                    var uid_solicitante;
                    var indice = 0;
                    var keys = Object.keys(snapshot.val());
                    var usuarios = Object.values(snapshot.val());
                    for (var usuario in usuarios) {
                       var usuarioObj = usuarios[usuario]
                       if (usuarioObj.dni == dni_solicitante) {
                          uid_solicitante = keys[indice];
                          get(ref(database, `users/${uid_solicitante}`)).then((snapshot) => {
                            if (snapshot.exists()){
                              var usuario = snapshot.val();
      
                              set(ref(database, `users/${uid_solicitante}`), {
                                apellidos:usuario.apellidos,
                                confirmacion:2,
                                contrasena:usuario.contrasena,
                                dni:usuario.dni,
                                email:usuario.email,
                                nombre:usuario.nombre,
                                sexo:usuario.sexo,
                                solicitud:usuario.solicitud
                              })
                            }
                          });
                       }
                       indice++;
                     }
                  });
                  // QUITAR SOLICITUD DUEÑO_ANTERIOR PARA QUE NO LE SALGA LA NOTIFICACION
                  set(ref(database,`users/${getUID()}`), {
                    apellidos:usuario_duenoBD.apellidos,
                    confirmacion:usuario_duenoBD.confirmacion,
                    contrasena:usuario_duenoBD.contrasena,
                    dni:usuario_duenoBD.dni,
                    email:usuario_duenoBD.email,
                    nombre:usuario_duenoBD.nombre,
                    sexo:usuario_duenoBD.sexo,
                    solicitud:""
                  })

                  
              } else if (buttonIndex === 2) {
                  // Se hizo clic en el botón Cancelar
                  // MODIFICAR USUARIO_DUEÑO LA SOLICITUD EN ""
                  set(ref(database,`users/${getUID()}`), {
                    apellidos:usuario_duenoBD.apellidos,
                    confirmacion:usuario_duenoBD.confirmacion,
                    contrasena:usuario_duenoBD.contrasena,
                    dni:usuario_duenoBD.dni,
                    email:usuario_duenoBD.email,
                    nombre:usuario_duenoBD.nombre,
                    sexo:usuario_duenoBD.sexo,
                    solicitud:""
                  })
                  // HACER LLEGAR AL USUARIO QUE LA SOLICITUD HA SIDO RECHAZADA
                  get(ref(database,"users")).then((snapshot) => {
                    var uid_solicitante;
                    var indice = 0;
                    var keys = Object.keys(snapshot.val());
                    var usuarios = Object.values(snapshot.val());
                    for (var usuario in usuarios) {
                       var usuarioObj = usuarios[usuario]
                       if (usuarioObj.dni == dni_solicitante) {
                          uid_solicitante = keys[indice];
                          get(ref(database, `users/${uid_solicitante}`)).then((snapshot) => {
                            if (snapshot.exists()){
                              var usuario = snapshot.val();
      
                              set(ref(database, `users/${uid_solicitante}`), {
                                apellidos:usuario.apellidos,
                                confirmacion:1,
                                contrasena:usuario.contrasena,
                                dni:usuario.dni,
                                email:usuario.email,
                                nombre:usuario.nombre,
                                sexo:usuario.sexo,
                                solicitud:usuario.solicitud
                              })
                            }
                          });
                       }
                       indice++;
                     }
                  });
              }
          },
          titulo,
          [etiquetaAceptar, etiquetaCancelar]
      );
      }
      if (snapshot.val().confirmacion != 0) {
        if (snapshot.val().confirmacion === 1) {
          window.plugins.toast.showWithOptions(
            {
              message: "Solicitud Rechazada",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
            },
          );
          set(ref(database, `users/${getUID()}`), {
            apellidos:usuario_duenoBD.apellidos,
            confirmacion:0,
            contrasena:usuario_duenoBD.contrasena,
            dni:usuario_duenoBD.dni,
            email:usuario_duenoBD.email,
            nombre:usuario_duenoBD.nombre,
            sexo:usuario_duenoBD.sexo,
            solicitud:usuario_duenoBD.solicitud
          })
        }else if (snapshot.val().confirmacion === 2){
          window.plugins.toast.showWithOptions(
            {
              message: "Solicitud Aceptada",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
            },
          );
          set(ref(database, `users/${getUID()}`), {
            apellidos:usuario_duenoBD.apellidos,
            confirmacion:0,
            contrasena:usuario_duenoBD.contrasena,
            dni:usuario_duenoBD.dni,
            email:usuario_duenoBD.email,
            nombre:usuario_duenoBD.nombre,
            sexo:usuario_duenoBD.sexo,
            solicitud:usuario_duenoBD.solicitud
          })
        }
      }
    }
  });
  }

  function cambiarImagenArriba(imagenInput){
    if (document.getElementsByClassName("botonAceptar")[0]){
      var img = document.getElementsByClassName("fotoDetalleMascota")[0]
      var archivo = imagenInput.files[0];
      console.log(archivo)
      if (archivo) {
      // Crear un objeto FileReader
      var lector = new FileReader();

      // Configurar el evento "load" del lector
      lector.onload = function(e) {
        // Establecer la imagen seleccionada como fuente de la imagen preview
        img.src = e.target.result;
        console.log(img.src)
      };

      // Leer el contenido del archivo como una URL de datos
      lector.readAsDataURL(archivo);
      }
    }else{
      imagenInput.value = ""
    }
  }

  function obtenerFechaActual() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1; // El mes se indexa desde 0 (enero es 0)
    var anio = fecha.getFullYear();

    // Añadir un cero al día y mes si tienen un solo dígito
    if (dia < 10) {
      dia = "0" + dia;
    }
    if (mes < 10) {
      mes = "0" + mes;
    }

    var fechaFormateada = dia + "/" + mes + "/" + anio;
    return fechaFormateada;
  }

  /*
function anadir(archivo) {
  get(ref(getDatabase(), `users/${getUID()}`)).then((snapshot) => {
    // Obtiene el objeto de datos del usuario
    const userData = snapshot.val();

    // Obtiene el valor del rol del usuario
    const email = userData.email;
    // Selecciona el archivo a subir

    anadirMascota(archivo);
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
*/

function anadirMascota(archivo) {
  console.log("SE EJECUTA ANADIR");
  const database = getDatabase();

  // Obtener una referencia a la ubicación donde deseas agregar datos.
  
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = ""; 
  var selectElement = document.getElementById("inputGroupSelect02");
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var contenidoOpcion = selectedOption.textContent;
  if(contenidoOpcion == "Macho") {
    sexo = "Macho"
  }else if (contenidoOpcion == "Hembra"){
    sexo = "Hembra"
  }
  var dni = document.getElementById("dni").value;
  var nacimiento = nacimientoBD

  //coger usuario de la sesion para guardar la imagen como -> "usuario"/"nombre_foto"
  get(ref(database, `users/${getUID()}`)).then((snapshot) => {
    if (snapshot.exists()) {
      var usuario = snapshot.val();
      var Mascota = {
        cod: cod,
        nombre: nombre,
        raza: raza,
        sexo: sexo,
        dni: dni,
        nacimiento: nacimiento,
        adoptado:false,
        imagen: usuario.email+"/"+archivo.name
      };
      set(ref(database, "Mascotas/" + cod), Mascota);
      subirImagen(archivo);
      limpiaCampos();
    mostrarToast("Mascota agregada correctamente");
    }
  })
}

function modificar() {
  console.log("SE EJECUTA MODIFICAR");
  const database = getDatabase();

  // Obtener los valores de los campos
  var cod = document.getElementById("cod").value;
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = ""; 
  var selectElement = document.getElementById("inputGroupSelect02");
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var contenidoOpcion = selectedOption.textContent;
  if(contenidoOpcion == "Macho") {
    sexo = "Macho"
  }else if (contenidoOpcion == "Hembra"){
    sexo = "Hembra"
  }
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