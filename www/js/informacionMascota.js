import {
    getDatabase,
    ref,
    push,
    set,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
 
  export function cargarDatosMascota(pet){
    console.log("acceso datos mascota");
    const seccion = document.getElementById("contenido");
    const divs = seccion.querySelectorAll("div");
  
    // Me cargo todos los divs de la section
    divs.forEach((div) => {
      div.remove();
    });
    seccion.insertAdjacentHTML("afterbegin","<h1>"+pet.nombre+"</h1>");
  }