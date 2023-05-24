import {
    getDatabase,
    ref,
    push,
    set,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
  import { listaDOM } from "./listaInteractiva.js";
  export function cargarDatosMascota(pet, role){
    console.log("acceso datos mascota");
    const seccion = document.getElementById("contenido");
    const divs = seccion.querySelectorAll("div");
  
    // Me cargo todos los divs de la section
    divs.forEach((div) => {
      div.remove();
    });
    seccion.insertAdjacentHTML("afterbegin",
    "<div>" +
      '<section id="infoMascota">' +
      '<header style="text-align: center"><h1 id="tituloInfoMascota">Detalles - '+pet.nombre+'</h1></header>'+
      "</section>" +
    "</div>");
    mostrarDatos(pet);
    document.addEventListener("backbutton", function(){listaDOM(role)}, false);
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
    imagenMascota.classList.add("fotoDetalleMascota")
    imagenMascota.src = "img/logo.png";
    ventanaPrincipal.appendChild(imagenMascota);
    //boton Adoptar
    const divBotonAdoptar = document.createElement("div");
    divBotonAdoptar.classList.add("divBotonAdoptar");
    const botonAdoptar = document.createElement("button");
    botonAdoptar.classList.add("botonAdoptarMascota");
    botonAdoptar.textContent = "Adoptar"
    divBotonAdoptar.appendChild(botonAdoptar);
    ventanaPrincipal.appendChild(divBotonAdoptar);

    const divDatosMascota = document.createElement("div");
    divDatosMascota.classList.add("divDatosMascota");

    //Nombre + edad
    var cumple_array = pet.nacimiento.split("/"); // Divido la fecha
    var cumple_date = new Date(cumple_array[2], cumple_array[1] - 1, cumple_array[0]); // creo el Date con la fecha dividida
    var edadDiff = Date.now() - cumple_date.getTime(); 
    var edadDate = new Date(edadDiff); // transformo la diferencia en Date
    const edadMascota = Math.abs(edadDate.getUTCFullYear() - 1970); // para luego calcular la edad
    const divContenedorNombre = document.createElement("div");
    divContenedorNombre.classList.add("inputContainer");
    const divContenedorEdad = document.createElement("div");
    divContenedorEdad.classList.add("inputContainer");
    const nombreInput = document.createElement("input");
    const nombreLabel = document.createElement("label")
    nombreLabel.classList.add("labelTituloCampos");
    nombreLabel.setAttribute("for", "");
    nombreLabel.textContent = "Nombre Mascota";
    const edadInput = document.createElement("input");
    const edadLabel = document.createElement("label")
    edadLabel.classList.add("labelTituloCampos");
    edadLabel.setAttribute("for", "");
    edadLabel.textContent = "Edad";
    edadInput.setAttribute("type", "text");
    edadInput.setAttribute("placeholder", "a");
    edadInput.classList.add("camposTextoDatosMascota");
    edadInput.setAttribute("readonly","");
    nombreInput.setAttribute("type", "text");
    nombreInput.classList.add("camposTextoDatosMascota");
    nombreInput.setAttribute("readonly","");
    nombreInput.setAttribute("placeholder", "a");
    nombreInput.value = pet.nombre;
    edadInput.value = edadMascota;
    divContenedorNombre.appendChild(nombreInput);
    divContenedorNombre.appendChild(nombreLabel);
    divDatosMascota.appendChild(divContenedorNombre);
    divContenedorEdad.appendChild(edadInput);
    divContenedorEdad.appendChild(edadLabel);
    divDatosMascota.appendChild(divContenedorEdad);
    ventanaPrincipal.appendChild(divDatosMascota);

    //FECHA NACIMIENTO MASCOTA
    const divContenedorFechaNacimiento = document.createElement("div");
    divContenedorFechaNacimiento.classList.add("inputContainer");
    const fechaNacimientoInput = document.createElement("input");
    fechaNacimientoInput.classList.add("camposTextoDatosMascota");
    fechaNacimientoInput.setAttribute("type","datetime-local");
    fechaNacimientoInput.setAttribute("placeholder", "a");
    fechaNacimientoInput.setAttribute("readonly", "");
    


    appWindow.appendChild(ventanaPrincipal);

  }