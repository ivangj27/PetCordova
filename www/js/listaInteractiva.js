import {
  getDatabase,
  ref,
  push,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
import { actualizarDOM } from "./CRUD.js";
import{cargarDatosMascota} from "./informacionMascota.js";

var rol = "";

export function listaDOM(role) {
  rol = role;
  console.log(rol)
  console.log("INTENTANDO ACTUALIZAR EL DOM");

  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");

  // Me cargo todos los divs de la section
  divs.forEach((div) => {
    div.remove();
  });
  
  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterbegin",
    `<div><section id="mascotasList"><header style="text-align: center"><h1 id="tituloListaAnimales">Mascotas</h1><button class="botonAnadirMascota" id="BtnAM">Añadir Mascota</button></header>`+
    '</section></div>'
  );
  cargarLista();
  document.addEventListener("backbutton", function(){actualizarDOM(role)}, false);
  const botonAnadir = document.querySelector(".botonAnadirMascota");
  botonAnadir.addEventListener('click', function(){cargarDatosMascota(null,role), false})
}
/*
function cargarLista() {
  const database = getDatabase();

  var mascotasRef = ref(database, "Mascotas");

  // lista de objetos de JavaScript
  var mascotas = [];

  const mascotasList = document.getElementById("mascotasList");
  // obtener todos los objetos de la lista "mascotas"
  get(mascotasRef)
    .then(function (snapshot) {
      // para cada objeto en la lista, crear un objeto de JavaScript y agregarlo a la lista
      snapshot.forEach(function (childSnapshot) {
        var mascota = childSnapshot.val();
        mascotas.push(mascota);
      });
      console.log(mascotas); // lista de objetos de JavaScript
      // Add pet items to the list
      mascotas.forEach((pet) => {
        // Create a new list item element
        console.log("estoy dentro del for");
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");

        // Create the pet image element
        /*const petImage = document.createElement("img");
        petImage.src = pet.image;
        listItem.appendChild(petImage);
        

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
    })
    .catch(function (error) {
      console.error(error);
    });
  }
  */
  var mascotas = [];
  export function cargarLista() {
    console.log("Prueba Fran")
    const database = getDatabase();
  
    var mascotasRef = ref(database, "Mascotas");
  
    // lista de objetos de JavaScript
  
    const mascotasList = document.getElementById("mascotasList");
    // obtener todos los objetos de la lista "mascotas"
    get(mascotasRef)
      .then(function (snapshot) {
        // para cada objeto en la lista, crear un objeto de JavaScript y agregarlo a la lista
        snapshot.forEach(function (childSnapshot) {
          var mascota = childSnapshot.val();
          mascotas.push(mascota);
        });
        console.log(mascotas); // lista de objetos de JavaScript
        // Add pet items to the list
        mascotas.forEach((pet) => {
          // Create a new list item element
          console.log("estoy dentro del for");
          const listItem = document.createElement("article");
          listItem.classList.add("elementoListaAnimales");
          
          const petPhotoFrame = document.createElement("button");
          petPhotoFrame.id = "fotoListaAnimales"
          petPhotoFrame.classList.add("fotoListaAnimales");
          //petPhotoFrame.addEventListener('click', informacionMascota);
          listItem.appendChild(petPhotoFrame);
          const petPhoto = document.createElement("img");
          petPhoto.src = "img/logo.png" // pet.imagen
          
          petPhotoFrame.appendChild(petPhoto);
  
          // Create the pet name element
          const petName = document.createElement("h3");
          petName.textContent = pet.nombre;
          listItem.appendChild(petName);
  
          // Create the pet species and age element
          const petSpeciesAge = document.createElement("p");
          petSpeciesAge.textContent = `${pet.raza} - ${pet.sexo}`;
          listItem.appendChild(petSpeciesAge);
  
          // Add the new list item to the pet list
          mascotasList.appendChild(listItem);

        });
        const botones = document.querySelectorAll(".fotoListaAnimales");
        const secciones = document.querySelectorAll(".elementoListaAnimales");
        botones.forEach((boton) => {
        boton.addEventListener('click', (event) => {
          const botonPulsado = event.target;
          const nombreMascotaBoton = boton.parentElement.querySelector("h3").textContent;
          mascotas.forEach((mascota) => {
            if (mascota.nombre == nombreMascotaBoton) {
              console.log("animal encontrado")
              cargarDatosMascota(mascota, rol);
            }
          })
        });
      });
      })
      .catch(function (error) {
        console.error(error);
      });
    }
