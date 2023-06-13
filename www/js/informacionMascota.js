import {
    getDatabase,
    ref,
    push,
    set,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
  import { listaDOM } from "./listaInteractiva.js";
  import { getUID, mostrarToast } from "./index.js";
  import { limpiaCampos } from "./CRUD.js";
  import {
    getStorage,
    ref as ref2,
    getDownloadURL,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";


  var nacimientoBD;
  export function cargarDatosMascota(pet){
    if (pet != null){
      if(document.getElementById("bloqueBusqueda")) {
        document.getElementById("bloqueBusqueda").remove();
      }
      if(document.getElementById("divMascotasList")) {
        document.getElementById("divMascotasList").remove()
      }
      console.log("acceso datos mascota");
      const seccion = document.getElementById("contenido");
      const divs = seccion.querySelectorAll("div");
      const articles = seccion.querySelectorAll("article");
      // Me cargo todos los divs de la section
      divs.forEach((div) => {
        div.remove();
      });
      articles.forEach((article) => {
      article.remove();
    });
    seccion.insertAdjacentHTML("afterbegin",
      "<div>" +
        '<section id="infoMascota">' +
        "</section>" +
      "</div>");
      mostrarDatos(pet);
      document.addEventListener("backbutton", function(){listaDOM(role)}, false);

      const inputFecha = document.getElementById("nacimiento");
      const inputEdad = document.getElementById("edad");

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
  }
  }

  function mostrarDatos(pet) {
    const database = getDatabase();

    // Parent Node
    const appWindow = document.getElementById("infoMascota");
    //Frame principal
    const ventanaPrincipal = document.createElement("article");
    ventanaPrincipal.classList.add("ventanaDatosMascota")
    //Imagen mascota
    const imagenMascota = document.createElement("img");
    const storageRef = ref2(getStorage(), "/" + pet.imagen);
    imagenMascota.classList.add("fotoDetalleMascota");
    imagenMascota.height = 200;
    imagenMascota.width = 170;
    
    try {
        getDownloadURL(storageRef)
          .then((url) => {
            // Asigna la URL de descarga como el valor del atributo src de la imagen
            imagenMascota.src = url;
          })
          .catch((error) => {
            imagenMascota.src = 'img/icono_perro.png'
          });
    }catch(error) {
      imagenMascota.src = 'img/icono_perro.png'
    }
    ventanaPrincipal.appendChild(imagenMascota);

    //boton Adoptar
    if (pet.adoptado != true) {
      const divBotonAdoptar = document.createElement("div");
      divBotonAdoptar.classList.add("divBotonAdoptar");
      const botonAdoptar = document.createElement("button");
      botonAdoptar.classList.add("botonAdoptarMascota");
      botonAdoptar.textContent = "Adoptar"
      divBotonAdoptar.appendChild(botonAdoptar);
      ventanaPrincipal.appendChild(divBotonAdoptar);
      botonAdoptar.addEventListener("click", function(){adoptarMascota(pet)})
    }

    const divDatosMascota = document.createElement("div");
    divDatosMascota.classList.add("divDatosMascota");
    const separacion = document.createElement("br");

    //Nombre (y montar la EDAD) 
    var cumple_array = pet.nacimiento.split("/"); // Divido la fecha
    var cumple_date = new Date(cumple_array[2], cumple_array[1] - 1, cumple_array[0]); // creo el Date con la fecha dividida
    var edadDiff = Date.now() - cumple_date.getTime(); 
    var edadDate = new Date(edadDiff); // transformo la diferencia en Date
    const edadMascota = Math.abs(edadDate.getUTCFullYear() - 1970); // para luego calcular la edad
    const divContenedorNombre = document.createElement("div");
    divContenedorNombre.classList.add("inputContainer");
    const nombreInput = document.createElement("input");
    const nombreLabel = document.createElement("label");
    nombreLabel.classList.add("labelTituloCampos");
    nombreLabel.setAttribute("for", "");
    nombreLabel.textContent = "Nombre Mascota";
    nombreInput.setAttribute("type", "text");
    nombreInput.setAttribute("id","nombre");
    nombreInput.classList.add("camposTextoDatosMascota");
    nombreInput.setAttribute("readonly","");
    nombreInput.setAttribute("placeholder", "a");
    nombreInput.value = pet.nombre;
    divContenedorNombre.appendChild(nombreInput);
    divContenedorNombre.appendChild(nombreLabel);


    const divContenedorDNI = document.createElement("div");
    divContenedorDNI.classList.add("inputContainer");
    const dniInput = document.createElement("input");
    dniInput.classList.add("camposTextoDatosMascota");
    dniInput.setAttribute("type","text");
    dniInput.setAttribute("readonly","");
    dniInput.setAttribute("placeholder","a");
    dniInput.setAttribute("id","dni");
    dniInput.value = pet.dni;
    const dniLabel = document.createElement("label");
    dniLabel.classList.add("labelTituloCampos");
    dniLabel.setAttribute("for","");
    dniLabel.textContent = "DNI Dueño";
    divContenedorDNI.appendChild(dniInput);
    divContenedorDNI.appendChild(dniLabel);
    divDatosMascota.appendChild(divContenedorNombre);
    divDatosMascota.appendChild(divContenedorDNI);

    divDatosMascota.appendChild(separacion);

    //FECHA NACIMIENTO MASCOTA + EDAD
    const divContenedorFechaNacimiento = document.createElement("div");
    divContenedorFechaNacimiento.classList.add("inputContainer");
    const fechaNacimientoInput = document.createElement("input");
    fechaNacimientoInput.classList.add("camposTextoDatosMascota");
    fechaNacimientoInput.setAttribute("type","date");
    fechaNacimientoInput.setAttribute("placeholder", "a");
    fechaNacimientoInput.setAttribute("readonly", "");
    fechaNacimientoInput.setAttribute("id","nacimiento");
    const fechaCadena = cumple_array[2]+"-"+cumple_array[1]+"-"+cumple_array[0];
    fechaNacimientoInput.value = fechaCadena;
    const fechaNacimientoLabel = document.createElement("label");
    fechaNacimientoLabel.classList.add("labelTituloCampos");
    fechaNacimientoLabel.setAttribute("for","");
    fechaNacimientoLabel.textContent = "Fecha Nacimiento";
    divContenedorFechaNacimiento.appendChild(fechaNacimientoInput);
    divContenedorFechaNacimiento.appendChild(fechaNacimientoLabel);
    divDatosMascota.appendChild(divContenedorFechaNacimiento);

    const divContenedorEdad = document.createElement("div");
    divContenedorEdad.classList.add("inputContainer");
    const edadInput = document.createElement("input");
    const edadLabel = document.createElement("label");
    edadLabel.classList.add("labelTituloCampos");
    edadLabel.setAttribute("for", "");
    edadLabel.textContent = "Edad";
    edadInput.setAttribute("type", "text");
    edadInput.setAttribute("placeholder", "a");
    edadInput.setAttribute("id","edad");
    edadInput.classList.add("camposTextoDatosMascota");
    edadInput.setAttribute("readonly","");
    edadInput.value = edadMascota;
    divContenedorEdad.appendChild(edadInput);
    divContenedorEdad.appendChild(edadLabel);
    divDatosMascota.appendChild(divContenedorEdad);

    // RAZA
    const divContenedorRaza = document.createElement("div");
    divContenedorRaza.classList.add("inputContainer");
    const razaInput = document.createElement("input");
    const razaLabel = document.createElement("label");
    razaLabel.classList.add("labelTituloCampos");
    razaLabel.setAttribute("for", "");
    razaLabel.textContent = "Raza Mascota";
    razaInput.setAttribute("type", "text");
    razaInput.setAttribute("placeholder", "a");
    razaInput.setAttribute("id","raza")
    razaInput.classList.add("camposTextoDatosMascota");
    razaInput.setAttribute("readonly","");
    razaInput.value = pet.raza;
    divContenedorRaza.appendChild(razaInput);
    divContenedorRaza.appendChild(razaLabel);
    divDatosMascota.appendChild(divContenedorRaza);

    // SEXO
    const divContenedorSexo = document.createElement("div");
    divContenedorSexo.classList.add("inputContainer");
    const sexoInput = document.createElement("input");
    const sexoLabel = document.createElement("label");
    sexoLabel.classList.add("labelTituloCampos");
    sexoLabel.setAttribute("for", "");
    sexoLabel.textContent = "Sexo";
    sexoInput.setAttribute("type", "text");
    sexoInput.setAttribute("placeholder", "a");
    sexoInput.setAttribute("id","sexo")
    sexoInput.classList.add("camposTextoDatosMascota");
    sexoInput.setAttribute("readonly","");
    sexoInput.value = pet.sexo;
    divContenedorSexo.appendChild(sexoInput);
    divContenedorSexo.appendChild(sexoLabel);
    divDatosMascota.appendChild(divContenedorSexo);


    //IMAGEN
    const divContenedorImagen = document.createElement("div");
    divContenedorImagen.classList.add("inputContainer");
    const imagenInput =  document.createElement("input");
    const imagenLabel = document.createElement("label");
    imagenLabel.classList.add("labelTituloCampos");
    imagenLabel.setAttribute("for","");
    imagenLabel.textContent = "Imagen";
    imagenInput.setAttribute("type", "file");
    imagenInput.setAttribute("id","imagenMascota");
    imagenInput.classList.add("camposTextoDatosMascota");
    imagenInput.setAttribute("readonly","readonly");

    imagenInput.addEventListener("change", function() {
      cambiarImagenArriba(imagenInput);
    })
    divContenedorImagen.appendChild(imagenInput);
    divContenedorImagen.appendChild(imagenLabel);
    divDatosMascota.appendChild(divContenedorImagen);


    ventanaPrincipal.appendChild(divDatosMascota);

    const db = getDatabase();
    get(ref(db, `users/${getUID()}`)).then((snapshot) => {
      // Obtiene el objeto de datos del usuario
      var usuario = snapshot.val();
      if (usuario.dni == pet.dni) {
        console.log(">> Mascota del Usuario");
        mostrarBotones(ventanaPrincipal, pet, imagenInput, imagenMascota);
      }
  
  })
  appWindow.appendChild(ventanaPrincipal);
  document.addEventListener("backbutton", function(){listaDOM()}, false);

  }

  function cambiarImagenArriba(imagenInput){
    if (document.getElementsByClassName("botonAceptar")[0]){
      var img = document.getElementsByClassName("fotoDetalleMascota")[0]
      var archivo = imagenInput.files[0];
      console.log(archivo)
      console.log(archivo.name)
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
      lector.readAsDataURL(img.src);
      }
    }else{
      imagenInput.value = ""
    }
  }

  function mostrarBotones(ventanaPrincipal,pet, imagenInput, imagenMascota){
    // BOTONES
    const divBotones = document.createElement("div");
    divBotones.classList.add("divBotones");
    // BOTON EDITAR
    const divBotonEditar = document.createElement("div");
    divBotonEditar.classList.add("divBotonEditar");
    const botonEditar = document.createElement("button");
    botonEditar.classList.add("botonEditarMascota");
    botonEditar.textContent = "EDITAR MASCOTA";
    // BOTON ELIMINAR
    const divBotonEliminar = document.createElement("div");
    divBotonEliminar.classList.add("divBotonEliminar");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("botonEliminarMascota");
    botonEliminar.textContent = "ELIMINAR MASCOTA";

    divBotonEditar.appendChild(botonEditar);
    divBotonEliminar.appendChild(botonEliminar);

    divBotones.appendChild(divBotonEditar);
    divBotones.appendChild(divBotonEliminar);
    ventanaPrincipal.appendChild(divBotones);

    botonEliminar.addEventListener("click", function() {
      console.log("SE EJECUTA ELIMINAR");
      const database = getDatabase();
    
      // Obtener el valor del campo "cod"
      var cod = pet.cod;
    
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
                listaDOM();
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
    });

    botonEditar.addEventListener("click", function() {
      /* si se acepta */
      mostrarAceptaryCancelar(pet, imagenInput, imagenMascota);
    })
  }

  function adoptarMascota(pet) {
      console.log(">> adopcion de "+pet.nombre)
      const db =getDatabase();
      var keys;
      var usuario_dueno;
      var dni_sol;
      var uid_dueno;

      get(ref(db, 'users')).then((snapshot) => {
        var indice = 0;
        keys = Object.keys(snapshot.val());
        var usuarios = Object.values(snapshot.val());
        console.log(keys)
        console.log(usuarios)
        for (var usuario in usuarios) {
           var usuarioObj = usuarios[usuario]
           if (usuarioObj.dni == pet.dni) {
              uid_dueno = keys[indice];
              usuario_dueno = usuarioObj;
              console.log(uid_dueno)
           }else if (getUID() == keys[indice]) {
              dni_sol = usuarioObj.dni;
              console.log(dni_sol)
           }
           indice++;
         }
        const usuarioRef = ref(db, `users/${uid_dueno}`);
        get(usuarioRef).then((snapshot) => {
          if(snapshot.exists()) {
            set(usuarioRef, {
              apellidos: usuario_dueno.apellidos,
              confirmacion: usuario_dueno.confirmacion,
              contrasena: usuario_dueno.contrasena,
              dni:usuario_dueno.dni,
              email: usuario_dueno.email,
              nombre:usuario_dueno.nombre,
              sexo:usuario_dueno.sexo,
              solicitud:dni_sol +"/"+pet.cod
            })
            console.log("SOLICITUD ENVIDADA")
          }
        });
      })
  }

  function mostrarAceptaryCancelar(pet, imagenInput, imagenMascota) {
    const divBotonEditar = document.querySelector(".divBotonEditar");
    const divBotonEliminar = document.querySelector(".divBotonEliminar");
    divBotonEditar.remove();
    divBotonEliminar.remove();
    const divBotones = document.querySelector(".divBotones");
    divBotones.insertAdjacentHTML("afterbegin",
      '<div class="divBotonAceptar">' +
        '<button class="botonAceptar">ACEPTAR CAMBIOS</button>' +
      "</div>" +
      '<div class="divBotonCancelar">' +
        '<button class="botonCancelar">DESCARTAR CAMBIOS</button>' +
      "</div>");
    const botonAceptar = document.querySelector(".botonAceptar");
    const botonCancelar = document.querySelector(".botonCancelar");

    const camposDatos = document.querySelectorAll(".camposTextoDatosMascota");
    camposDatos.forEach((input) => {
      input.removeAttribute("readonly");
    })
    console.log(camposDatos);

    botonAceptar.addEventListener("click", () => {
      
      console.log("SE EJECUTA MODIFICAR");

      var imagen = imagenInput.files[0];
      var imagenBD;
      try{
        imagenBD = email+"/"+imagen.name
      }catch(error){
        imagenBD = pet.imagen
      }

      var nacimientoRecogida = document.getElementById("nacimiento").value.split("-");
      var nacimientoString = nacimientoRecogida[2]+"/"+nacimientoRecogida[1]+"/"+nacimientoRecogida[0];

      const database = getDatabase();
      var mascotaRef = ref(database, `Mascotas/${pet.cod}`);

      get(ref(database, `users/${getUID()}`)).then((snapshot) => {
        if (snapshot.exists()) {
          var email = snapshot.val().email;

          get(mascotaRef).then((snapshot) => {
            if(snapshot.exists()) {
              set(mascotaRef, {
                adoptado:pet.adoptado,
                cod: pet.cod,
                imagen: imagenBD,
                nombre: document.getElementById("nombre").value,
                raza: document.getElementById("raza").value,
                sexo: document.getElementById("sexo").value,
                dni: document.getElementById("dni").value,
                nacimiento: nacimientoString,
              });
              pet.nombre = document.getElementById("nombre").value;
              pet.raza = document.getElementById("raza").value;
              pet.sexo = document.getElementById("sexo").value;
              pet.dni = document.getElementById("dni").value;
              pet.nacimiento = nacimientoString;
              pet.imagen = imagenBD;
              cargarDatosMascota(pet);
              try{
              subirImagen(imagen);
              }catch(error) {

              }
            }
          })

        }
      })
    })
    botonCancelar.addEventListener("click", () => {
        cargarDatosMascota(pet);
    })
  }

  function subirImagen(archivo) {
    const database = getDatabase();
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