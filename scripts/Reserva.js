// Clase Reserva
class Reserva {
    constructor(usuario, cantidadViajeros, fechaIda, fechaVuelta, destino) {
        this.nombre = usuario.nombre;
        this.apellido = usuario.apellido;
        this.email = usuario.email;
        this.cantidadViajeros = cantidadViajeros;
        this.fecha = luxon.DateTime.now();
        this.fechaIda = luxon.DateTime.fromISO (fechaIda);
        this.fechaVuelta = luxon.DateTime.fromISO (fechaVuelta);
        this.destino = destino;
        this.costo = this.calcularCosto(); // El costo tomara el valor retornado por el metodo que calcula el costo
    }

    // Metodo para calcular el valor de la reserva
    calcularCosto() {
        const duracion = this.fechaVuelta.diff(this.fechaIda, "days").days;
        return valores[this.destino] * duracion * this.cantidadViajeros;
    }
}