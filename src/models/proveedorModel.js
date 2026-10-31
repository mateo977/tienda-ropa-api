const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class proveedor {

    getProveedores(callback) {
        const sql = "select id_proveedor, nit, nombre, contacto, email, telefono, ciudad, fecha_registro from proveedores";
        db.query(sql, callback);
    }

    getProveedorById(id, callback) {
        const sql = "select id_proveedor, nit, nombre, contacto, email, telefono, ciudad, fecha_registro from proveedores where id_proveedor = ?";
        db.query(sql, [id], callback);
    }

    postProveedor(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into proveedores (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putProveedor(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update proveedores set " + campos.map((c) => c + " = ?").join(", ") + " where id_proveedor = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deleteProveedor(id, callback) {
        const sql = "delete from proveedores where id_proveedor = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new proveedor();
