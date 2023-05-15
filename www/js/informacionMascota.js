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
    //Nombre + edad
    //const edadMascota = Date.UTC() -> Queremos coger bien la fecha de nacimiento para calcular la edad de la mascota

    const divDatosMascota = document.createElement("div");
    divDatosMascota.classList.add("divDatosMascota");
    const nombreEdadLabel = document.createElement("Label");
    nombreEdadLabel.id = "nombreEdad";
    const nombreInput = document.createElement("input");
    const edadInput = document.createElement("input");
    edadInput.setAttribute("type", "text");
    edadInput.setAttribute("style", "width:40px; margin-left:0px;")
    edadInput.classList.add("camposTextoDatosMascota");
    edadInput.setAttribute("readonly","");
    nombreInput.setAttribute("type", "text");
    nombreInput.classList.add("camposTextoDatosMascota");
    nombreInput.setAttribute("readonly","");
    nombreInput.value = pet.nombre;
    nombreEdadLabel.appendChild(nombreInput);
    nombreEdadLabel.appendChild(edadInput);
    divDatosMascota.appendChild(nombreEdadLabel);
    ventanaPrincipal.appendChild(divDatosMascota);



    appWindow.appendChild(ventanaPrincipal);

  }