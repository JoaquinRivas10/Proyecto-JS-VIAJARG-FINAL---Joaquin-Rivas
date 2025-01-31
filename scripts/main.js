// Arreglo general que contiene a los usuarios
const usuarios = [];

// Captar datos del formulario
const formularioCompleto = document.getElementById("formularioReserva");
const tablaReservas = document.getElementById("tablaReservas");
const filtroEmail = document.getElementById("filtroEmail");

// Filtros
function filtrar () {        
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("oculto"); // Saco la clase oculto asi aparece

    setTimeout(() => {

        const nombreFiltro = document.getElementById("filtroNombre").value.toLowerCase().trim();
        const apellidoFiltro = document.getElementById("filtroApellido").value.toLowerCase().trim();
        const emailFiltro = document.getElementById("filtroEmail").value.toLowerCase().trim();
        const destinoFiltro = document.getElementById("filtroDestino").value.toLowerCase().trim();
        const cantidadPasajerosFiltro = parseInt(document.getElementById("filtroCantidadPasajeros").value);
        const fechaReservaFiltro = document.getElementById("filtroFechaReserva").value;
        const fechaIdaFiltro = document.getElementById("filtroFechaIda").value;
        const fechaVueltaFiltro = document.getElementById("filtroFechaVuelta").value;
        const costoFiltro = parseFloat(document.getElementById("filtroCosto").value);

        const filas = Array.from(tablaReservas.getElementsByClassName("filaReserva"));

        filas.forEach((fila) => {
            const [nombre, apellido, email, destino, cantidadPasajeros, fechaReserva, fechaIda, fechaVuelta, costo] = Array.from(fila.cells).map((c) => c.textContent.trim());

            const pasarFiltro = 
            (!nombreFiltro || nombre.toLowerCase().includes(nombreFiltro)) &&
            (!apellidoFiltro || apellido.toLowerCase().includes(apellidoFiltro)) &&
            (!emailFiltro || email.toLowerCase().includes(emailFiltro)) &&
            (!destinoFiltro || destino.toLowerCase().includes(destinoFiltro)) &&
            (!cantidadPasajerosFiltro || parseInt(cantidadPasajeros) === cantidadPasajerosFiltro) &&
            (!fechaReservaFiltro || luxon.DateTime.fromFormat(fechaReserva, "dd-MM-yyyy") >= luxon.DateTime.fromISO(fechaReservaFiltro)) &&
            (!fechaIdaFiltro || luxon.DateTime.fromFormat(fechaIda, "dd-MM-yyyy") >= luxon.DateTime.fromISO(fechaIdaFiltro)) &&
            (!fechaVueltaFiltro || luxon.DateTime.fromFormat(fechaVuelta, "dd-MM-yyyy") <= luxon.DateTime.fromISO(fechaVueltaFiltro)) &&
            (!costoFiltro || parseFloat(costo.replace('$', '').trim()) <= costoFiltro);
        
        fila.style.display = pasarFiltro ? "table-row" : "none";
        });

        spinner.classList.add("oculto"); // Vuelvo a agregar la clase oculto asi desaparece
    }, 1200);            
}


// Funcion para renderizar las reservas
function renderizarReservas (usuarios) {
    tablaReservas.innerHTML = ""; // limpia la lista
    usuarios.forEach((usuario) => {
        usuario.reservas.forEach((reserva) => {
            const tr = document.createElement("tr");
            tr.classList.add("filaReserva"); // Agrego una class a las filas creadas, que usare para capturarlas en el filtro
            tr.innerHTML = `
                <td>${reserva.nombre}</td>
                <td>${reserva.apellido}</td>
                <td>${reserva.email}</td>
                <td>${reserva.destino}</td>
                <td>${reserva.cantidadViajeros}</td>
                <td>${formatoFecha(reserva.fecha)}</td>
                <td>${formatoFecha(reserva.fechaIda)}</td>
                <td>${formatoFecha(reserva.fechaVuelta)}</td>
                <td><strong>$ ${reserva.costo}</strong></td>
                `;
            tablaReservas.appendChild(tr);
        })
    })
}

// Agregar una reserva a un usuario. Se chequea si el usuario existe mediante el email, sino existe se crea.
function crearReserva (event) {
    event.preventDefault();
    const nombre = (document.getElementById("nombre").value).toLowerCase().trim();
    const apellido = (document.getElementById("apellido").value).toLowerCase().trim();
    const email = (document.getElementById("email").value).toLowerCase().trim();
    const cantidadViajeros = parseInt(document.getElementById("cantidadViajeros").value);
    const fechaIda = luxon.DateTime.fromISO (document.getElementById("fechaIda").value);
    const fechaVuelta = luxon.DateTime.fromISO (document.getElementById("fechaVuelta").value);
    const destino = (document.getElementById("destino").value).toLowerCase();

    if (!nombre || !apellido || !email || !cantidadViajeros || !fechaIda || !fechaVuelta || !destino) {
        console.error("Faltan ingresar datos");
        return;
    }


    if (fechaIda >= fechaVuelta) {
        Swal.fire({title: "La fecha de ida NO PUEDE SER POSTERIOR a la fecha de vuelta.",
            icon: "error",
            draggable: true
        });
        return;
    }

    const fechaActual = luxon.DateTime.now();
    if (fechaIda < fechaActual || fechaVuelta < fechaActual) {
        Swal.fire({
            title: "No se puede seleccionar una fecha anterior a la de hoy.",
            icon: "error",
            draggable: true
        });
        return;
    }

    if ((Math.ceil((fechaVuelta - fechaIda) / (1000 * 60 * 60 * 24))) < 7) {
        Swal.fire({
            title: "La duración mínima del viaje debe ser de 7 días. Por favor, ajusta las fechas.",
            icon: "error",
            draggable: true
        });
        return;
    }

    let usuario = Usuario.buscarUsuario(email, usuarios);
    if (!usuario) {
        usuario = Usuario.crearUsuario(nombre, apellido, email);
        usuarios.push(usuario);
    }

    const reserva = new Reserva (usuario, cantidadViajeros, fechaIda, fechaVuelta, destino);
    usuario.agregarReserva(reserva);

    localStorage.setItem("usuariosTotales", JSON.stringify(usuarios));
    renderizarReservas(usuarios);

    formularioCompleto.reset();

    Swal.fire({
        title: "Reserva exitosa!",
        icon: "success",
        draggable: true
    });
}

// Evento DOMContentLoaded para recuperar datos del localStorage y obtener datos del JSON
document.addEventListener("DOMContentLoaded", () => {
    recuperarDatos();
    recuperarDatosLocalStorage();
});

// Evento submit
formularioCompleto.addEventListener("submit", crearReserva);

// Evento input
document.querySelectorAll("#filtros input").forEach(input => {
    input.addEventListener("input", filtrar);
});