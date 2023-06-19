import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
import { cargarDatosMascota } from "./informacionMascota.js";
import {
  getStorage,
  ref as ref2,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";
import { cargarPantallaAdmin } from "./pantallaAdmin.js";
import { actualizarDOM } from "./CRUD.js";
var mascotas = [];

//función para cargar la pantalla de la lista de las Mascotas de la BD
export function listaDOM() {
  console.log("INTENTANDO ACTUALIZAR EL DOM");

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
  //Inserto el contenido nuevo de la section
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
  cargarLista();
  document.addEventListener(
    "backbutton",
    function () {
      var db = getDatabase()
      get(ref(db, `users/${getUID()}`)).then((snapshot) => {
        // Obtiene el objeto de datos del usuario
        var usuario = snapshot.val();
          if(usuario.admin === true){
            cargarPantallaAdmin(db)
          }else{
            actualizarDOM()
          }
          })
    },
    false
  );

  //aplicamos filtro en la lista en el caso del que el usuario escriba algo en la búsqueda
  var inputBuscar = document.getElementById("inputBuscar");
  inputBuscar.addEventListener("input", function (event) {
    var busqueda = event.target.value.toLowerCase();
    buscarMascotas(busqueda);
  });
  mascotas = [];
}
/*
  IMPORTANTE PARA LAS IMAGENES: 
  Si no les vamos a decir un tamaño fijo en el CSS tenemos que añadir una función de recortarla 
  (igual que insta o cualquier otra cuando subes algo), si no no podemos redimensionarlas sin distorsionar la imagen.
*/

export function cargarLista() {
  console.log("Prueba Fran");
  const database = getDatabase();

  var mascotasRef = ref(database, "Mascotas");

  // lista de objetos de JavaScript
  mascotas = [];
  const mascotasList = document.getElementById("mascotasList");
  // obtener todos los objetos de la lista "mascotas"
  get(mascotasRef)
    .then(function (snapshot) {
      // para cada objeto en la lista, crear un objeto de JavaScript y agregarlo a la lista
      snapshot.forEach(function (childSnapshot) {
        // SI EL USUARIO QUIERE VER SUS MASCOTAS, MOSTRAR LAS SUYAS POR DNI
        var mascota = childSnapshot.val();
        mascotas.push(mascota);
      });
      // Add pet items to the list
      mascotas.forEach((pet) => {
        // Create a new list item element
        console.log("estoy dentro del for");
        const listItem = document.createElement("article");
        listItem.classList.add("elementoListaAnimales");

        const petPhotoFrame = document.createElement("button");
        petPhotoFrame.id = "fotoListaAnimales";
        petPhotoFrame.classList.add("fotoListaAnimales");
        //petPhotoFrame.addEventListener('click', informacionMascota);
        listItem.appendChild(petPhotoFrame);

        const petPhoto = document.createElement("img");
        const storageRef = ref2(getStorage(), "/" + pet.imagen);
        petPhoto.width = "120";
        petPhoto.height = "120";
        try {
        getDownloadURL(storageRef)
          .then((url) => {
            // Asigna la URL de descarga como el valor del atributo src de la imagen
            petPhoto.src = url;
          })
          .catch((error) => {
            console.error("Error al obtener la URL de descarga:", error);
            getDownloadURL(ref2(getStorage(),"default/icono_perro.png")).then((url) => {
              petPhoto.src = url;
            });
          });
        }catch(error) {
          getDownloadURL(ref2(getStorage(),"default/icono_perro.png")).then((url) => {
            petPhoto.src = url;
          });
        }
        petPhotoFrame.appendChild(petPhoto);

        // Create the pet info element
        const petInfo = document.createElement("div");
        listItem.appendChild(petInfo);

        // Create the pet name element
        const petName = document.createElement("h3");
        petName.textContent = pet.nombre;
        petInfo.appendChild(petName);

        // Create the pet species and age element
        const petSpeciesAge = document.createElement("p");
        petSpeciesAge.textContent = `${pet.raza} - ${pet.sexo}`;
        petInfo.appendChild(petSpeciesAge);

        // Add the new list item to the pet list
        mascotasList.appendChild(listItem);
      });
      const botones = document.querySelectorAll(".fotoListaAnimales");
      const secciones = document.querySelectorAll(".elementoListaAnimales");
      botones.forEach((boton) => {
        boton.addEventListener("click", (event) => {
          const botonPulsado = event.target;
          const nombreMascotaBoton =
            boton.parentElement.querySelector("h3").textContent;
          mascotas.forEach((mascota) => {
            if (mascota.nombre == nombreMascotaBoton) {
              console.log("animal encontrado");
              cargarDatosMascota(mascota);
              window.scrollTo(0,0);
            }
          });
        });
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}

//función para coger el filtro de búsqueda y recargar la página con las mascotas correspondientes. Lo hace a través del nombre y de la raza
function buscarMascotas(busqueda) {
  if (mascotas.length > 0) {
    mascotas.splice(0, mascotas.length);
  }
  const mascotasList = document.getElementById("mascotasList");

  // Limpiar los elementos existentes en la lista de mascotas
  mascotasList.innerHTML = "";

  var mascotasRef = ref(getDatabase(), "Mascotas");

  get(mascotasRef).then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var mascota = childSnapshot.val();
      mascotas.push(mascota);
    });

    // Filtrar las mascotas que coinciden con la búsqueda
    const mascotasFiltradas = mascotas.filter((pet) => {
      return (
        pet.nombre.toLowerCase().includes(busqueda) ||
        pet.raza.toLowerCase().includes(busqueda)
      );
    });

    mascotasFiltradas.forEach((pet) => {
      // Crear un elemento para mostrar la mascota y agregar el resultado al contenedor
      const listItem = document.createElement("article");
      listItem.classList.add("elementoListaAnimales");

      const petPhotoFrame = document.createElement("button");
      petPhotoFrame.id = "fotoListaAnimales";
      petPhotoFrame.classList.add("fotoListaAnimales");
      //petPhotoFrame.addEventListener('click', informacionMascota);
      listItem.appendChild(petPhotoFrame);

      const petPhoto = document.createElement("img");
      const storageRef = ref2(getStorage(), "/" + pet.imagen);
      petPhoto.width = "120";
      petPhoto.height = "120";

      getDownloadURL(storageRef)
        .then((url) => {
          // Asigna la URL de descarga como el valor del atributo src de la imagen
          petPhoto.src = url;
        })
        .catch((error) => {
          console.error("Error al obtener la URL de descarga:", error);
        });
      petPhotoFrame.appendChild(petPhoto);

      // Crear el elemento de información de la mascota
      const petInfo = document.createElement("div");
      listItem.appendChild(petInfo);

      // Crear el elemento para el nombre de la mascota
      const petName = document.createElement("h3");
      petName.textContent = pet.nombre;
      petInfo.appendChild(petName);

      // Crear el elemento para la especie y edad de la mascota
      const petSpeciesAge = document.createElement("p");
      petSpeciesAge.textContent = `${pet.raza} - ${pet.sexo}`;
      petInfo.appendChild(petSpeciesAge);

      // Agregar el nuevo elemento a la lista de mascotas
      mascotasList.appendChild(listItem);
    });
  });
}
