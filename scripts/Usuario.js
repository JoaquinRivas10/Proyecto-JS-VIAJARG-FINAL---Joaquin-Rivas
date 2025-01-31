// Clase Usuario
class Usuario {
    constructor(nombre, apellido, email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.reservas = []; // Aca registraremos todas las reservas que haga este usuario
    }

    // Metodo estatico para buscar usuario dentro del arreglo usuarios
    static buscarUsuario(email, usuarios) {
        return usuarios.find(unUsuario => unUsuario.email === email);
    }

    // Metodo estatico para crear un usuario
    static crearUsuario(nombre, apellido, email) {
        return new Usuario(nombre, apellido, email);
    }

    // Metodo para agregar una reserva
    agregarReserva(unaReserva) {
        this.reservas.push(unaReserva);
    }
}