import {
    getDatabase,
    ref,
    push,
    set,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
  import { listaDOM } from "./listaInteractiva.js";
  import { getUID, mostrarToast } from "./index.js";
  export function cargarDatosMascota(pet){
    if (pet != null){
      document.getElementById("bloqueBusqueda").remove();
      document.getElementById("divMascotasList").remove();
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
    imagenMascota.classList.add("fotoDetalleMascota");
    imagenMascota.height = 200;
    imagenMascota.width = 170;
    imagenMascota.src = "img/logo.png";
    ventanaPrincipal.appendChild(imagenMascota);
    //boton Adoptar
    /*if (pet.adoptado != true) {
      const divBotonAdoptar = document.createElement("div");
      divBotonAdoptar.classList.add("divBotonAdoptar");
      const botonAdoptar = document.createElement("button");
      botonAdoptar.classList.add("botonAdoptarMascota");
      botonAdoptar.textContent = "Adoptar"
      divBotonAdoptar.appendChild(botonAdoptar);
      ventanaPrincipal.appendChild(divBotonAdoptar);
    }*/

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
    fechaNacimientoInput.value = cumple_array[2]+"-"+cumple_array[1]+"-"+cumple_array[0];
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
    sexoInput.classList.add("camposTextoDatosMascota");
    sexoInput.setAttribute("readonly","");
    sexoInput.value = pet.sexo;
    divContenedorSexo.appendChild(sexoInput);
    divContenedorSexo.appendChild(sexoLabel);
    divDatosMascota.appendChild(divContenedorSexo);

    ventanaPrincipal.appendChild(divDatosMascota);

    const db = getDatabase();
    get(ref(db, `users/${getUID()}`)).then((snapshot) => {
      // Obtiene el objeto de datos del usuario
      var usuario = snapshot.val();
      if (usuario.dni == pet.dni) {
        console.log(">> Mascota del Usuario");
        mostrarBotones(ventanaPrincipal);
      }
      document.addEventListener("backbutton", function(){listaDOM()}, false);
  
  })
  appWindow.appendChild(ventanaPrincipal);
  }

  function mostrarBotones(ventanaPrincipal){
    // BOTONES
    const divBotones = document.createElement("div");
    divBotones.classList.add("divBotones");
    // BOTON EDITAR
    const divBotonEditar = document.createElement("div");
    divBotonEditar.classList.add("divBotonEditar");
    const botonEditar = document.createElement("button");
    botonEditar.classList.add("botonEditarMascota");
    botonEditar.textContent = "EDITAR MASCOTA";
    divBotonEditar.appendChild(botonEditar);
    // BOTON ELIMINAR
    const divBotonEliminar = document.createElement("div");
    divBotonEliminar.classList.add("divBotonEliminar");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("botonEliminarMascota");
    botonEliminar.textContent = "ELIMINAR MASCOTA"
    divBotonEliminar.appendChild(botonEliminar);

    divBotones.appendChild(divBotonEditar);
    divBotones.appendChild(divBotonEliminar);
    ventanaPrincipal.appendChild(divBotones);
  }