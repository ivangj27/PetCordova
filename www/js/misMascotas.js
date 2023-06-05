import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
import {
  getStorage,
  ref as ref2,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";
import { getUID
} from "./index.js";

export function paginaMisMascotas() {
    
  document.addEventListener(
    "backbutton",
    function () {
      generarPaginaUs();
    },
    false
  );
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
  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterend",
      '<div id="divMascotasList">' +
      '<section id="mascotasList"><header style="text-align: center"><button class="botonAnadirMascota" id="BtnAM">Añadir Mascota</button></header>' +
      "</section>" +
      "</div>"
  );

  var mascotas = [];
  const db = getDatabase();
  get(ref(db, `users/${getUID()}`)).then((snapshot) => {
    // Obtiene el objeto de datos del usuario
    var usuario = snapshot.val();
    var dniUsuario = usuario.dni;

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
        return pet.dni.toLowerCase().includes(dniUsuario);
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
        petPhoto.width = "170";
        petPhoto.height = "170";

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
  });
}
