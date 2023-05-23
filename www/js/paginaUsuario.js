export function generarPaginaUs() {
  const seccion = document.getElementById("contenido");
  const divs = seccion.querySelectorAll("div");

  // Me cargo todos los divs de la section
  divs.forEach((div) => {
    div.remove();
  });

  //Inserto el contenido nuevo de la section
  seccion.insertAdjacentHTML(
    "afterbegin",
    '<div style="text-align: center"><img id="imagenUs" src="./assets/images/rottweiler-ejemplo.jpg"></div>' +
      "<div>" +
      '<h1 id="nombreUsuario">Paquito</h1>' +
      "</div>" +
      '<div class="list-group">' +
      '<button type="button" class="list-group-item list-group-item-action" aria-current="true">' +
      "Mis mascotas" +
      "</button>" +
      '<button type="button" class="list-group-item list-group-item-action">' +
      "Datos de mi cuenta" +
      "</button>" +
      '<button type="button" class="list-group-item list-group-item-action" id="cerrarSesion">' +
      'Cerrar sesión<img id="imagenSalir" src="assets/images/leave.png">' +
      "</button>" +
      "</div>"
  );
  const imagenUs = document.getElementById("imagenUs");
}
