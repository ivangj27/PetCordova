import {
    getDatabase,
    ref,
    push,
    set,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
  import {
    getAuth,
    signOut,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
  import { getUID, mostrarToast, restablecerDOM
  } from "./index.js";
import { generarDatosCuenta } from "./datosCuenta.js";
import { cargarLista } from "./listaInteractiva.js";
import { listaUsuarios } from "./listaUsuarios.js";

  export function cargarPantallaAdmin(database) {
    const db = database;
    console.log(">> CARGANDO LA PANTALA ADMIN");

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

    seccion.insertAdjacentHTML(
        "afterbegin",
        '<div style="text-align: center"><img id="imagenAdmin" src="./assets/images/admin.png"></div>' +
          "<div>" +
          '<h1 id="nombreUsuario"></h1>' +
          "</div>" +
          '<div class="list-group">' +
          '<button type="button" class="list-group-item list-group-item-action" id="botonDatos">' +
          "MIS DATOS" +
          "</button>" +
          '<button id="mascotas" type="button" class="list-group-item list-group-item-action" aria-current="true">' +
          "MASCOTAS" +
          "</button>" +
          '<button id="usuarios" type="button" class="list-group-item list-group-item-action" aria-current="true">' +
          "USUARIOS" +
          "</button>" +
          '<button type="button" class="list-group-item list-group-item-action" id="cerrarSesion">' +
          'Cerrar sesión<img id="imagenSalir" src="assets/images/leave.png">' +
          "</button>" +
          "</div>"
      );

      const nombreUsuario = document.getElementById("nombreUsuario");
      const botonDatos = document.getElementById("botonDatos");
      const botonMascotas = document.getElementById("mascotas");
      const botonUsuarios = document.getElementById("usuarios");
      const botonCerrarSesion = document.getElementById("cerrarSesion");
      
      get(ref(db,`users/${getUID()}`)).then((snapshot) => {
      if(snapshot.exists()){
        const usuario = snapshot.val();
        nombreUsuario.textContent = usuario.nombre;
      }
      });

      botonDatos.addEventListener("click", function(){
        generarDatosCuenta();
      });
      botonMascotas.addEventListener("click", function(){
        seccion.insertAdjacentHTML(
          "afterbegin",
          '<div class="input-group rounded" id="bloqueBusqueda">' +
            '<input id="inputBuscar" type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />' +
            '<span class="input-group-text border-0" id="search-addon">' +
            '<i class="fas fa-search"></i>' +
            "</span>" +
            "</div>" +
            '<div id="divMascotasList">' +
            '<section id="mascotasList">'+
          '</section>'+
            "</div>"
        );
        var divs = document.getElementsByTagName("div");
        console.log(divs);
        var botones = divs.length-2
        var nombreUsuario = divs.length-3
        var fotoUsuario = divs.length-4
        divs.item(botones).remove()
        divs.item(nombreUsuario).remove();
        divs.item(fotoUsuario).remove()
        cargarLista();
      });
      botonUsuarios.addEventListener("click", function(){
        listaUsuarios();
      });
      botonCerrarSesion.addEventListener("click", function() {
        cerrarSesion();
      });
   }

   //función para cerrar sesión y que cargue la pantalla de iniciar sesión
   function cerrarSesion() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          restablecerDOM();
        })
        .catch((error) => {
          // An error happened.
          mostrarToast(error);
        });
        const footers = document.querySelectorAll("footer")
        footers.forEach((footer) => {
         footer.remove(); 
        })
      }