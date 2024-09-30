//dom cargado
document.addEventListener("DOMContentLoaded", () => {
    let peliculas = []; //almacenar los datos de las pelis
  
    //solicitud http para los datos de las películas desde la API
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
      .then(respuesta => respuesta.json()) //convierto la respuesta a formato JSON
      .then(datos => {
        peliculas = datos; //guardo los datos en la variable
        console.log("Películas cargadas:", peliculas); //verificar la carga de las películas
      })
      .catch(error => console.error("Error al cargar los datos:", error)); //en caso de error
  
    //evento para el botón de búsqueda
    document.getElementById("btnBuscar").addEventListener("click", () => {
      const consulta = document.getElementById("inputBuscar").value.toLowerCase().trim(); //convierto la consulta a minúsculas y elimino espacios en blanco para comparar con los datos de la api
      
      if (consulta) { //si el campo no queda vacio
        //filtro de peliculas con las condiciones dadas
        const resultados = peliculas.filter(pelicula => 
          pelicula.title.toLowerCase().includes(consulta) || // Verificamos coincidencia en el título
          (pelicula.genres && pelicula.genres.some(genero => genero.name.toLowerCase().includes(consulta))) || // Verificamos coincidencia en los géneros
          (pelicula.tagline && pelicula.tagline.toLowerCase().includes(consulta)) || // Verificamos coincidencia en el tagline
          (pelicula.overview && pelicula.overview.toLowerCase().includes(consulta)) // Verificamos coincidencia en la descripción general (overview)
        );
  
        console.log("Resultados de la búsqueda:", resultados); //verifico los resultados en la consola
        mostrarResultados(resultados); //muestro resukltafdos
      } else {
        mostrarResultados([]); //por si no hay consulta (se muestra una lista vacía)
      }
    });
  
    //muestra los resultados en la lista de pelis
    function mostrarResultados(resultados) {
      const listaPeliculas = document.getElementById("lista"); //selecciono la lista de películas
      listaPeliculas.innerHTML = ""; //limpio la lista de pelis
      if (resultados.length === 0) { //por si no se encuentran resultados
        listaPeliculas.innerHTML = "<li class='list-group-item'>No se encontraron resultados.</li>"; //msj de no resultados
        return;
      }
  
      //for each en los resultados para mostrarlos en la lista
      resultados.forEach(pelicula => {
        const calificacionEstrellas = convertirCalificacionEstrellas(pelicula.vote_average); //se convierte el puntaje a estrellas
        const elementoLista = document.createElement("li"); //nuevlo elemento de lista
        elementoLista.className = "list-group-item"; //clase para estulos de bootstrap
  
        //asignamos el contenido del elemento de lista con el título, tagline y estrellas
        elementoLista.innerHTML = `
          <h5 class="titulo-pelicula">${pelicula.title}</h5>
          <p>${pelicula.tagline || 'No hay descripción disponible'}</p>
          <p>${calificacionEstrellas}</p>
        `;
        
        //mostrar detalles de la peli al hacer click en el título
        elementoLista.querySelector('.titulo-pelicula').addEventListener("click", () => mostrarDetallesPelicula(pelicula, elementoLista));
        
        listaPeliculas.appendChild(elementoLista); //agregamos el elemento de lista a la lista de pelis
      });
    }
  
    //función para mostrar los detalles de la peli seleccionada
    function mostrarDetallesPelicula(pelicula, elementoLista) {
      console.log("Detalles de la película seleccionada:", pelicula); //verificamos los detalles de la peli seleccionada
  
      // Creamos un contenedor de detalles adicionales
      const detallesDiv = document.createElement('div');
      detallesDiv.className = 'detalles-adicionales mt-3'; // Clase para estilos de Bootstrap
  
      //asigno el contenido del contenedor con los detalles de la película
      detallesDiv.innerHTML = `
        <h2>${pelicula.title}</h2>
        <p>${pelicula.overview || 'No hay sinopsis disponible.'}</p>
        <h5>Géneros:</h5>
        <ul>
          ${pelicula.genres.map(genero => `<li>${genero.name}</li>`).join('')} <!-- Iteramos sobre los géneros para mostrarlos en una lista -->
        </ul>
        <div class="text-end mb-2">
          <button class="btn btn-secondary btnMas">Más</button> <!-- Botón para mostrar más detalles -->
        </div>
        <div class="detallesAdicionales" style="display: none;"> <!-- Contenedor que estará oculto inicialmente -->
          <p><strong>Año de lanzamiento:</strong> ${pelicula.release_date ? pelicula.release_date.split("-")[0] : 'Desconocido'}</p>
          <p><strong>Duración:</strong> ${pelicula.runtime ? pelicula.runtime + ' minutos' : 'Desconocido'}</p>
          <p><strong>Presupuesto:</strong> $${pelicula.budget ? pelicula.budget.toLocaleString() : 'No disponible'}</p>
          <p><strong>Ganancias:</strong> $${pelicula.revenue ? pelicula.revenue.toLocaleString() : 'No disponible'}</p>
        </div>
      `;
    
      //busco si ya existe un contenedor de detalles
      const detallesPrevios = elementoLista.querySelector('.detalles-adicionales');
      if (detallesPrevios) {
        detallesPrevios.remove(); //si ya había uno, lo elimino
      }
  
      //añado el contenedor de detalles al elemento de lista
      elementoLista.appendChild(detallesDiv);
  
      //agrego el evento al botón de más para mostrar u ocultar los detalles adicionales
      const botonMas = detallesDiv.querySelector('.btnMas');
      botonMas.addEventListener('click', () => {
        const detallesAdicionales = detallesDiv.querySelector('.detallesAdicionales');
        if (detallesAdicionales.style.display === 'none') { // Si los detalles están ocultos
          detallesAdicionales.style.display = 'block'; //los mostramos
          botonMas.innerText = 'Menos'; //cambio ahora el texto del botón a Menos
        } else {
          detallesAdicionales.style.display = 'none'; //si ya estaban visibles, los ocultamos
          botonMas.innerText = 'Más'; //cambio el texto del botón a Más
        }
      });
    }
  
    //función para convertir la calificación de la peli a estrellas
    function convertirCalificacionEstrellas(calificacion) {
      const estrellas = Math.round(calificacion / 2); // Redondeamos la calificación a la mitad más cercana
      let estrellasHtml = ""; // Variable para almacenar el HTML de las estrellas
      for (let i = 0; i < 5; i++) {
        if (i < estrellas) {
          estrellasHtml += '<i class="fa fa-star text-warning"></i>'; // Agregamos estrellas completas (fa-star)
        } else {
          estrellasHtml += '<i class="fa fa-star-o text-secondary"></i>'; // Agregamos estrellas vacías (fa-star-o)
        }
      }
      return estrellasHtml; // Devolvemos el HTML de las estrellas
    }
  });
  