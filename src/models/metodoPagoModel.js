const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class metodoPago {

    getMetodosPago(callback) {
        const sql = "select id_metodo_pago, nombre from metodos_pago";
        db.query(sql, callback);
    }

    getMetodoPagoById(id, callback) {
        const sql = "select id_metodo_pago, nombre from metodos_pago where id_metodo_pago = ?";
        db.query(sql, [id], callback);
    }

    postMetodoPago(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into metodos_pago (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putMetodoPago(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update metodos_pago set " + campos.map((c) => c + " = ?").join(", ") + " where id_metodo_pago = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deleteMetodoPago(id, callback) {
        const sql = "delete from metodos_pago where id_metodo_pago = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new metodoPago();
