import {
    getDatabase,
    ref,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
import { cargarDatosUsuario } from "./informacionUsuarioAdmin.js";
import { cargarPantallaAdmin } from "./pantallaAdmin.js";

  var usuarios = [];

  export function listaUsuarios(){
    const seccion = document.getElementById("contenido");
    const divs = seccion.querySelectorAll("div");
    const articles = document.querySelectorAll("article");

    // Me cargo todos los divs y los articles de la section
    divs.forEach((div) => {
      div.remove();
    });
    articles.forEach((article) => {
      article.remove();
    });
    if (document.getElementById("bloqueBusqueda")) {
      const busqueda = document.getElementById("bloqueBusqueda");
      busqueda.remove();
    }
    if(document.getElementById("divMascotasList")){
      const busqueda = document.getElementById("divMascotasList");
      busqueda.remove();
    }
    if(document.getElementById("divUsuariosList")){
        const busqueda = document.getElementById("divUsuariosList");
        busqueda.remove();
      }
    //Inserto el contenido nuevo de la section
    seccion.insertAdjacentHTML(
      "afterbegin",
      '<div class="input-group rounded" id="bloqueBusqueda">' +
        '<input id="inputBuscar" type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />' +
        '<span class="input-group-text border-0" id="search-addon">' +
        '<i class="fas fa-search"></i>' +
        "</span>" +
        "</div>" +
        '<div id="divUsuariosList">' +
        '<section id="usuariosList">'+
      '</section>'+
        "</div>"
    );
    cargarLista();

    //aplicamos filtro en la lista en el caso del que el usuario escriba algo en la búsqueda
    var inputBuscar = document.getElementById("inputBuscar");
    inputBuscar.addEventListener("input", function (event) {
      var busqueda = event.target.value.toLowerCase();
      buscarUsuarios(busqueda);
    });
    usuarios = [];
  }


  function cargarLista(){
    console.log("Prueba Fran - usuarios");
    const database = getDatabase();

    var usuariosRef = ref(database, "users");

    // lista de objetos de JavaScript
    usuarios = [];
    const usuariosList = document.getElementById("usuariosList");
    // obtener todos los objetos de la lista "mascotas"
    get(usuariosRef)
      .then(function (snapshot) {
        // para cada objeto en la lista, crear un objeto de JavaScript y agregarlo a la lista
        snapshot.forEach(function (childSnapshot) {
          // SI EL USUARIO QUIERE VER SUS MASCOTAS, MOSTRAR LAS SUYAS POR DNI
          var usuario = childSnapshot.val();
          usuarios.push(usuario);
        });
        // Add pet items to the list
        usuarios.forEach((user) => {
          // Create a new list item element
          console.log("estoy dentro del for");
          const listItem = document.createElement("article");
          listItem.classList.add("elementoListaUsuarios");

          const userPhotoFrame = document.createElement("button");
          userPhotoFrame.id = "fotoListaUsuarios";
          userPhotoFrame.classList.add("fotoListaUsuarios");
          //petPhotoFrame.addEventListener('click', informacionMascota);
          listItem.appendChild(userPhotoFrame);

          const userPhoto = document.createElement("img");
          userPhoto.width = "110";
          userPhoto.height = "110";
          userPhoto.src = "./assets/images/admin.png"
          
          userPhotoFrame.appendChild(userPhoto);

          // Create the pet info element
          const userInfo = document.createElement("div");
          listItem.appendChild(userInfo);

          // Create the pet name element
          const userName = document.createElement("h3");
          userName.textContent = user.nombre;
          userInfo.appendChild(userName);

          // Create the pet species and age element
          const userEmail = document.createElement("p");
          try{
            if (user.email.length > 20) {
                console.log(user.email)
                userEmail.style.fontSize = "8px"
            }
          }catch(error){}
          userEmail.textContent = user.email;
          userInfo.appendChild(userEmail);

          // Add the new list item to the pet list
          usuariosList.appendChild(listItem);
        });
        const botones = document.querySelectorAll(".fotoListaUsuarios");
        const secciones = document.querySelectorAll(".elementoListaUsuarios");
        botones.forEach((boton) => {
          boton.addEventListener("click", (event) => {
            const botonPulsado = event.target;
            const emailUsuarioBoton =
              boton.parentElement.querySelector("p").textContent;
            usuarios.forEach((usuario) => {
              if (usuario.email == emailUsuarioBoton) {
                console.log("Usuario encontrado");
                cargarDatosUsuario(usuario);
                window.scrollTo(0,0);
              }
            });
          });
        });
      })
      .catch(function (error) {
        console.error(error);
      });
    document.addEventListener(
      "backbutton",
      function () {
        cargarPantallaAdmin(database);
      },
      false
    );
  }

  function buscarUsuarios(){
    
  }