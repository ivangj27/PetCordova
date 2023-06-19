import {
  getDatabase,
  ref,
  push,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js"; //importamos las funciones de firebase para acceder a los datos
import {
  getStorage,
  ref as ref2,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";//importamos una funcion específica para guardar las imágenes
import { listaDOM } from "./listaInteractiva.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import { getUID } from "./index.js";
import { mostrarToast } from "./index.js";
import { comprobarDNI } from "./registro.js";

var nacimientoBD; 
var mascotas = [];
var cod;

export function actualizarDOM() { // función para mostrar la primera página tras iniciar sesión
  var imagen = ""; 

  console.log("INTENTANDO ACTUALIZAR EL DOM");

  //vamos recogiendo los elementos para eliminar los contenidos en el caso de que exista.
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
  '<img class="fotoDetalleMascota" src="" width="170" height="200">' +
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
  '<div class="input-group mb-3">' +
  '  <label class="input-group-text" for="inputGroupSelect02">RAZA</label>' +
  '  <select class="form-select" id="raza" placeholder="Raza">' +
  '    <option value="" disabled selected hidden>Seleccione una raza</option>' +
  '    <option value="Affenpinscher">Affenpinscher</option>' +
  '    <option value="Akita Inu">Akita Inu</option>' +
  '    <option value="Alaskan Malamute">Alaskan Malamute</option>' +
  '    <option value="American Bulldog">American Bulldog</option>' +
  '    <option value="American Cocker Spaniel">American Cocker Spaniel</option>' +
  '    <option value="American Eskimo Dog">American Eskimo Dog</option>' +
  '    <option value="American Foxhound">American Foxhound</option>' +
  '    <option value="American Pit Bull Terrier">American Pit Bull Terrier</option>' +
  '    <option value="American Staffordshire Terrier">American Staffordshire Terrier</option>' +
  '    <option value="Australian Cattle Dog">Australian Cattle Dog</option>' +
  '    <option value="Australian Shepherd">Australian Shepherd</option>' +
  '    <option value="Basenji">Basenji</option>' +
  '    <option value="Basset Hound">Basset Hound</option>' +
  '    <option value="Beagle">Beagle</option>' +
  '    <option value="Bearded Collie">Bearded Collie</option>' +
  '    <option value="Belgian Malinois">Belgian Malinois</option>' +
  '    <option value="Bernese Mountain Dog">Bernese Mountain Dog</option>' +
  '    <option value="Bichon Frisé">Bichon Frisé</option>' +
  '    <option value="Border Collie">Border Collie</option>' +
  '    <option value="Border Terrier">Border Terrier</option>' +
  '    <option value="Boston Terrier">Boston Terrier</option>' +
  '    <option value="Boxer">Boxer</option>' +
  '    <option value="Brittany Spaniel">Brittany Spaniel</option>' +
  '    <option value="Bull Terrier">Bull Terrier</option>' +
  '    <option value="Bulldog">Bulldog</option>' +
  '    <option value="Bullmastiff">Bullmastiff</option>' +
  '    <option value="Cairn Terrier">Cairn Terrier</option>' +
  '    <option value="Cavalier King Charles Spaniel">Cavalier King Charles Spaniel</option>' +
  '    <option value="Chesapeake Bay Retriever">Chesapeake Bay Retriever</option>' +
  '    <option value="Chihuahua">Chihuahua</option>' +
  '    <option value="Chinese Crested">Chinese Crested</option>' +
  '    <option value="Chow Chow">Chow Chow</option>' +
  '    <option value="Cocker Spaniel">Cocker Spaniel</option>' +
  '    <option value="Collie">Collie</option>' +
  '    <option value="Dachshund">Dachshund</option>' +
  '    <option value="Doberman Pinscher">Doberman Pinscher</option>' +
  '    <option value="English Bulldog">Bulldog Inglés</option>' +
  '    <option value="English Cocker Spaniel">Cocker Spaniel Inglés</option>' +
  '    <option value="English Setter">Setter Inglés</option>' +
  '    <option value="English Springer Spaniel">Springer Spaniel Inglés</option>' +
  '    <option value="French Bulldog">Bulldog Frances</option>' +
  '    <option value="German Shepherd">German Shepherd</option>' +
  '    <option value="German Shorthaired Pointer">German Shorthaired Pointer</option>' +
  '    <option value="Golden Retriever">Golden Retriever</option>' +
  '    <option value="Great Dane">Great Dane</option>' +
  '    <option value="Great Pyrenees">Great Pyrenees</option>' +
  '    <option value="Greyhound">Greyhound</option>' +
  '    <option value="Havanese">Havanese</option>' +
  '    <option value="Irish Setter">Irish Setter</option>' +
  '    <option value="Irish Wolfhound">Irish Wolfhound</option>' +
  '    <option value="Italian Greyhound">Italian Greyhound</option>' +
  '    <option value="Jack Russell Terrier">Jack Russell Terrier</option>' +
  '    <option value="Japanese Chin">Japanese Chin</option>' +
  '    <option value="Keeshond">Keeshond</option>' +
  '    <option value="Labrador Retriever">Labrador Retriever</option>' +
  '    <option value="Leonberger">Leonberger</option>' +
  '    <option value="Lhasa Apso">Lhasa Apso</option>' +
  '    <option value="Maltese">Maltese</option>' +
  '    <option value="Miniature Bull Terrier">Miniature Bull Terrier</option>' +
  '    <option value="Miniature Pinscher">Miniature Pinscher</option>' +
  '    <option value="Newfoundland">Newfoundland</option>' +
  '    <option value="Norfolk Terrier">Norfolk Terrier</option>' +
  '    <option value="Norwegian Elkhound">Norwegian Elkhound</option>' +
  '    <option value="Nova Scotia Duck Tolling Retriever">Nova Scotia Duck Tolling Retriever</option>' +
  '    <option value="Old English Sheepdog">Sheepdog Inglés</option>' +
  '    <option value="Papillon">Papillon</option>' +
  '    <option value="Pekingese">Pekingese</option>' +
  '    <option value="Pembroke Welsh Corgi">Pembroke Welsh Corgi</option>' +
  '    <option value="Pomeranian">Pomeranian</option>' +
  '    <option value="Poodle">Poodle</option>' +
  '    <option value="Portuguese Water Dog">Portuguese Water Dog</option>' +
  '    <option value="Pug">Pug</option>' +
  '    <option value="Rhodesian Ridgeback">Rhodesian Ridgeback</option>' +
  '    <option value="Rottweiler">Rottweiler</option>' +
  '    <option value="Saint Bernard">Saint Bernard</option>' +
  '    <option value="Samoyed">Samoyed</option>' +
  '    <option value="Schipperke">Schipperke</option>' +
  '    <option value="Scottish Terrier">Scottish Terrier</option>' +
  '    <option value="Shetland Sheepdog">Shetland Sheepdog</option>' +
  '    <option value="Shih Tzu">Shih Tzu</option>' +
  '    <option value="Siberian Husky">Siberian Husky</option>' +
  '    <option value="Staffordshire Bull Terrier">Staffordshire Bull Terrier</option>' +
  '    <option value="Tibetan Mastiff">Tibetan Mastiff</option>' +
  '    <option value="Vizsla">Vizsla</option>' +
  '    <option value="Weimaraner">Weimaraner</option>' +
  '    <option value="Welsh Springer Spaniel">Welsh Springer Spaniel</option>' +
  '    <option value="West Highland White Terrier">West Highland White Terrier</option>' +
  '    <option value="Whippet">Whippet</option>' +
  '    <option value="Yorkshire Terrier">Yorkshire Terrier</option>' +
  '    <option value="Akita">Akita</option>' +
  '    <option value="Caniche">Caniche</option>' +
  '    <option value="Bichón Maltés">Bichón Maltés</option>' +
  '    <option value="Bulldog Francés">Bulldog Francés</option>' +
  '    <option value="Pastor Alemán">Pastor Alemán</option>' +
  '    <option value="Shih Tzu">Shih Tzu</option>' +
  '    <option value="Dálmata">Dálmata</option>' +
  '    <option value="Dogo Argentino">Dogo Argentino</option>' +
  '  </select>' +
  '</div>'+
  '<div class="input-group mb-3">' +
  '  <label class="input-group-text" for="inputGroupSelect02">SEXO</label>' +
  '  <select class="form-select" id="inputGroupSelect02" placeholder="Sexo">' +
  '    <option value="" disabled selected hidden>Seleccione su sexo</option>' +
  '    <option value="1">Macho</option>' +
  '    <option value="2">Hembra</option>' +
  '  </select>' +
  '</div>'+
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

  const fotoMascota = document.getElementsByClassName("fotoDetalleMascota").item(0);
  getDownloadURL(ref2(getStorage(),"default/icono_perro.png")).then((url) => {
    fotoMascota.src = url;
  });
  const bAnadir = document.getElementById("botonAceptar");
  const bCancelar = document.getElementById("botonCancelar");
  const inputEdad = document.getElementById("edad");
  const inputFecha = document.getElementById("nacimiento");
  const inputImagen = document.getElementById("inputImagen");

  //con getDatabase() cogeremos la BD que hayamos configurado
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
    //preparamos el cod Mascota para la posible insercción.
    mascotas.forEach((mascota) => {
      cod = (parseInt(mascota.cod) + 1).toString();
    });
  });

  //parseamos la fecha a Date para ponerla en el DatePicker
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
  //si le da a 'Cancelar', le salta la lista de las mascotas
  bCancelar.addEventListener("click", function() {
    listaDOM();
  });
  //si le da a 'aceptar', iniciará la función para guardar la Mascota en la BD
  bAnadir.addEventListener("click", function () {
    console.log(imagen.name)
    anadirMascota(imagen);
  });
  //si el usuario pone una imagen en el InputFile, se pondrá en la parte superior (encima del nombre)
  inputImagen.addEventListener("change",function() {
    imagen = inputImagen.files[0];
    cambiarImagenArriba(inputImagen);
  });


  //Al ser la primera pantalla, se comprueba si el usuario tiene solicitudes o notificaciones
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
                        sexo:petBD.sexo,
                        imagen:petBD.imagen
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
                                admin:usuario.admin,
                                apellidos:usuario.apellidos,
                                confirmacion:2,
                                contrasena:usuario.contrasena,
                                dni:usuario.dni,
                                email:usuario.email,
                                nombre:usuario.nombre,
                                sexo:usuario.sexo,
                                solicitud:usuario.solicitud,
                                tlf:usuario.tlf
                              })
                            }
                          });
                       }
                       indice++;
                     }
                  });
                  // QUITAR SOLICITUD DUEÑO_ANTERIOR PARA QUE NO LE SALGA LA NOTIFICACION
                  set(ref(database,`users/${getUID()}`), {
                    admin:usuario_duenoBD.admin,
                    apellidos:usuario_duenoBD.apellidos,
                    confirmacion:usuario_duenoBD.confirmacion,
                    contrasena:usuario_duenoBD.contrasena,
                    dni:usuario_duenoBD.dni,
                    email:usuario_duenoBD.email,
                    nombre:usuario_duenoBD.nombre,
                    sexo:usuario_duenoBD.sexo,
                    solicitud:"",
                    tlf:usuario_duenoBD.tlf
                  })

                  
              } else if (buttonIndex === 2) {
                  // Se hizo clic en el botón Cancelar
                  // MODIFICAR USUARIO_DUEÑO LA SOLICITUD EN ""
                  set(ref(database,`users/${getUID()}`), {
                    admin:usuario_duenoBD.admin,
                    apellidos:usuario_duenoBD.apellidos,
                    confirmacion:usuario_duenoBD.confirmacion,
                    contrasena:usuario_duenoBD.contrasena,
                    dni:usuario_duenoBD.dni,
                    email:usuario_duenoBD.email,
                    nombre:usuario_duenoBD.nombre,
                    sexo:usuario_duenoBD.sexo,
                    solicitud:"",
                    tlf:usuario_duenoBD.tlf
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
                                admin:usuario.admin,
                                apellidos:usuario.apellidos,
                                confirmacion:1,
                                contrasena:usuario.contrasena,
                                dni:usuario.dni,
                                email:usuario.email,
                                nombre:usuario.nombre,
                                sexo:usuario.sexo,
                                solicitud:usuario.solicitud,
                                tlf:usuario.tlf
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
      if (snapshot.val().confirmacion != 0) { //con el 0 indicamos que el usuario no tiene notificaciones.
        if (snapshot.val().confirmacion === 1) { //si el usuario tiene un 1, significa que ha sido rechazada.
          window.plugins.toast.showWithOptions(
            {
              message: "Solicitud Rechazada",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
            },
          );
          set(ref(database, `users/${getUID()}`), {
            admin:usuario_duenoBD.admin,
            apellidos:usuario_duenoBD.apellidos,
            confirmacion:0,
            contrasena:usuario_duenoBD.contrasena,
            dni:usuario_duenoBD.dni,
            email:usuario_duenoBD.email,
            nombre:usuario_duenoBD.nombre,
            sexo:usuario_duenoBD.sexo,
            solicitud:usuario_duenoBD.solicitud,
            tlf:usuario_duenoBD.tlf
          })
        }else if (snapshot.val().confirmacion === 2){ // si el usuario tiene un 2, significa que ha sico aceptada.
          window.plugins.toast.showWithOptions(
            {
              message: "Solicitud Aceptada",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
            },
          );
          // le cambiamos la 'confirmación' a 0 para que no le salga todo el rato.
          set(ref(database, `users/${getUID()}`), {
            admin:usuario_duenoBD.admin,
            apellidos:usuario_duenoBD.apellidos,
            confirmacion:0,
            contrasena:usuario_duenoBD.contrasena,
            dni:usuario_duenoBD.dni,
            email:usuario_duenoBD.email,
            nombre:usuario_duenoBD.nombre,
            sexo:usuario_duenoBD.sexo,
            solicitud:usuario_duenoBD.solicitud,
            tlf:usuario_duenoBD.tlf
          })
        }
      }
    }
  });
  }

  //función para colocar la imagen que ponga el usuario en el InputFile encima del nombre
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

//función para añadir la mascota en la BD, pasando como parametro el archivo del InputFile
function anadirMascota(archivo) {
  console.log("SE EJECUTA ANADIR");
  const database = getDatabase();

  // Obtener una referencia a la ubicación donde deseas agregar datos.
  
  var nombre = document.getElementById("nombre").value;
  var raza = document.getElementById("raza").value;
  var sexo = ""; 
  var selectElement = document.getElementById("inputGroupSelect02");
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var contenidoOpcion = document.getElementById("inputGroupSelect02").value;
  if(contenidoOpcion == 1) {
    sexo = "Macho"
  }else if (contenidoOpcion == 2){
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