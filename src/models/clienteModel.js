const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class cliente {

    getClientes(callback) {
        const sql = "select id_cliente, documento, nombre, apellido, email, telefono, direccion, ciudad, fecha_registro from clientes";
        db.query(sql, callback);
    }

    getClienteById(id, callback) {
        const sql = "select id_cliente, documento, nombre, apellido, email, telefono, direccion, ciudad, fecha_registro from clientes where id_cliente = ?";
        db.query(sql, [id], callback);
    }

    postCliente(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into clientes (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putCliente(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update clientes set " + campos.map((c) => c + " = ?").join(", ") + " where id_cliente = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deleteCliente(id, callback) {
        const sql = "delete from clientes where id_cliente = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new cliente();
