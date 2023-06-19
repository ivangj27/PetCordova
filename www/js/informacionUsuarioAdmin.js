import {
    getDatabase,
    ref,
    push,
    set,
    get,
  } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
  import { mostrarToast } from "./index.js";
import { listaUsuarios } from "./listaUsuarios.js";

  export function cargarDatosUsuario(usuario) {
    if (usuario != null){
        if(document.getElementById("bloqueBusqueda")) {
          document.getElementById("bloqueBusqueda").remove();
        }
        if(document.getElementById("divUsuariosList")) {
          document.getElementById("divUsuariosList").remove()
        }
        console.log("acceso datos usuario");
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
      seccion.insertAdjacentHTML(
        "afterbegin",
        '<div id="datosUsuario">' +
          "<h2>MIS DATOS</h2>" +
          '<div class="inputContainerUsuario">'+
            '<input class="camposTextoDatosMascota" id="camposTextoUsuario" name="nombre" type="text" placeholder="a"></input>'+
            '<label class="labelTituloCampos" for="">NOMBRE</label>'+
         '</div>'+
         '<div class="inputContainerUsuario">'+
            '<input class="camposTextoDatosMascota" name="apellidos" id="camposTextoUsuario" type="text" placeholder="a"></input>'+
            '<label class="labelTituloCampos" for="">APELLIDOS</label>'+
         '</div>'+
          '<div class="inputContainerUsuario">'+
            '<input class="camposTextoDatosMascota" name="dni" id="camposTextoUsuario" type="text" placeholder="a"></input>'+
            '<label class="labelTituloCampos" for="">DNI</label>'+
         '</div>'+
         '<div class="inputContainerUsuario">'+
            '<input class="camposTextoDatosMascota" name="email" id="camposTextoUsuario" type="email" aria-describedby="emailHelp" placeholder="a"></input>'+
            '<label class="labelTituloCampos" for="">EMAIL</label>'+
            '<div id="emailHelp" class="form-text"></div>'+
         '</div>'+
         '<div class="inputContainerUsuario">'+
            '<input class="camposTextoDatosMascota" name="contrasena" id="camposTextoUsuario" type="password" aria-describedby="emailHelp" placeholder="a"></input>'+
            '<label class="labelTituloCampos" for="">CONTRASEÑA</label>'+
         '</div>'+
         '<div class="input-group mb-3">' +
          ' <select class="form-select" id="inputGroupSelect02" placeholder="Sexo">' +
          ' <option value="" disabled selected hidden>Seleccione su sexo</option>'+
          ' <option value="1">Hombre</option>' +
          ' <option value="2">Mujer</option>' +
          " </select>" +
          ' <label class="input-group-text" for="inputGroupSelect02">SEXO</label>' +
          "</div>" +
          '<div class="mb-3 form-check">' +
          '<input class="form-check-input" type="checkbox" id="exampleCheck1">' +
          '<label class="form-check-label" for="exampleCheck1">Acepto los términos y condiciones</label>' +
          "</div>" +
          '<button id="registro" class="btn btn-primary">Confirmar cambios</button>' +
          '<button id="eliminar" class="botonEliminarUsuario">Eliminar Usuario</button>' +
          "</div>"
      );

        const buttonConfirmar = document.getElementById("registro");
        const buttonEliminar = document.getElementById("eliminar");
        document.addEventListener("backbutton",function(){
            generarPaginaUs()
        })
        //inserta los datos del user en los campos correspondientes
        const db = getDatabase();

        const nombre = document.getElementsByName("nombre").item(0);
        const apellidos = document.getElementsByName("apellidos").item(0);
        const dni = document.getElementsByName("dni").item(0);
        const email = document.getElementsByName("email").item(0);
        const contrasena = document.getElementsByName("contrasena").item(0);
        var sexo = document.getElementById("inputGroupSelect02");
        buttonConfirmar.addEventListener("click", function(){
            confirmar(db, nombre, apellidos, dni, email, contrasena, sexo, usuario)
        })
        buttonEliminar.addEventListener("click", function(){
            eliminarUsuario(db,usuario)
        })

        nombre.value = usuario.nombre;
        apellidos.value = usuario.apellidos;
        dni.value = usuario.dni;
        dni.value = usuario.dni;
        email.value = usuario.email;
        contrasena.value = usuario.contrasena;
        if (usuario.sexo.includes("Mujer")) {
        sexo.selectedIndex = 2
        }else {
        sexo.selectedIndex = 1
        }
    }
    document.addEventListener("backbutton", function(){listaUsuarios()});
}

// funcion para aplicar los cambios que quiera hacer el usuario con sus datos
function confirmar(db, nombre, apellidos, dni, email, contrasena, sexo, usuarioParam) {
    var selectElement = sexo
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var contenidoOpcion = selectedOption.textContent;
    if(contenidoOpcion == "Hombre") {
      sexo = "Hombre"
    }else if (contenidoOpcion == "Mujer"){
      sexo = "Mujer"
    }
      //comprobamos si los campos estan vacios y si las contraseñas coinciden
      if (
      (nombre.value != "" ||
      apellidos.value != "" ||
      email.value != "" ||
      contrasena.value != "" ||
      confirmarContra.value != "" ||
      sexo != ""))
      {
        get(ref(db, `users`)).then((snapshot) => {

            var indice = 0;
            var keys = Object.keys(snapshot.val());
            var usuarios = Object.values(snapshot.val());
            console.log(keys)
            console.log(usuarios)
            for (var usuario in usuarios) {
            var usuarioObj = usuarios[usuario]
            if (usuarioObj.dni == usuarioParam.dni) {
                var uid_usuario = keys[indice];
                console.log(uid_usuario)
            }
            indice++;
            }
            const usuarioRef = ref(db, `users/${uid_usuario}`);
            get(usuarioRef).then((snapshot) => {
                if(snapshot.exists()) {
                  set(usuarioRef, {
                    nombre: nombre.value,
                    apellidos: apellidos.value,
                    dni: dni.value,
                    email: email.value,
                    contrasena: contrasena.value,
                    sexo: sexo,
                    solicitud:usuarioParam.solicitud,
                    confirmacion:usuarioParam.confirmacion,
                    admin:usuarioParam.admin,
                    tlf:usuarioParam.tlf
                  });
                  mostrarToast("Cambios realizados correctamente.")
                  listaUsuarios();
                }
              }).catch((error) => {
                mostrarToast("Error al actualizar cambios.")
              });
        })
  
    }else{
      mostrarToast("Por favor, rellena todos los campos");
    }
  }

  function eliminarUsuario(db,usuarioParam) {
    get(ref(db,'users')).then((snapshot) => {
        var indice = 0;
        var keys = Object.keys(snapshot.val());
        var usuarios = Object.values(snapshot.val());
        console.log(keys)
        console.log(usuarios)
        for (var usuario in usuarios) {
            var usuarioObj = usuarios[usuario]
            if (usuarioObj.dni == usuarioParam.dni) {
                var uid_usuario = keys[indice];
                console.log(uid_usuario)
            }
            indice++;
        }
        get(ref(db, `users/${uid_usuario}`)).then((snapshot) =>{
            if (snapshot.exists()){
                set(ref(db, `users/${uid_usuario}`),null)
                listaUsuarios()
            }
        })
    });
  }
