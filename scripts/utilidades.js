// Funcion para cambiar el formato de las fechas a dd-mm-aaaa
function formatoFecha (fecha) {
    return fecha.toFormat("dd-MM-yyyy");
}

// Funcion para obtener los datos del local Storage, convertirlos en objetos literales y mapearlos a nuevamente a instancias de las clases.
function recuperarDatosLocalStorage () {
    const datosRecuperados = localStorage.getItem("usuariosTotales"); // Recupero en formato string

    if (datosRecuperados) {
        const usuariosRecuperados = JSON.parse(datosRecuperados); // Transformo a objetos literales

        usuariosRecuperados.forEach((unUsuario) => {
            const usuarioMapeado = new Usuario (unUsuario.nombre, unUsuario.apellido, unUsuario.email);

            unUsuario.reservas.forEach((unaReserva) => {
                const reservaMapeada = new Reserva (usuarioMapeado, unaReserva.cantidadViajeros, unaReserva.fechaIda, unaReserva.fechaVuelta, unaReserva.destino);
                usuarioMapeado.agregarReserva(reservaMapeada);
            });
        usuarios.push(usuarioMapeado);
        });

    renderizarReservas(usuarios);
    }
}

// Funcion para obtener datos del archivo local JSON
function recuperarDatos () {
    fetch("/data/destinos.json")
        .then((response) => response.json())
        .then((destinos) => {
            const destinoSeleccionado = document.getElementById("destino");
            destinos.forEach((destino) => {
                const option = document.createElement("option");
                option.value = destino.nombre.toLowerCase();
                option.textContent = destino.nombre;
                destinoSeleccionado.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error al cargar los destinos:", error);
            Swal.fire({
                title: "Error al cargar destinos",
                icon: "error",
            });
        });
}