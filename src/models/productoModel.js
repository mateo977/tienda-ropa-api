const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class producto {

    getProductos(callback) {
        const sql = "select id_producto, codigo, nombre, descripcion, precio, imagen_url, activo, id_categoria, id_proveedor from productos";
        db.query(sql, callback);
    }

    getProductoById(id, callback) {
        const sql = "select id_producto, codigo, nombre, descripcion, precio, imagen_url, activo, id_categoria, id_proveedor from productos where id_producto = ?";
        db.query(sql, [id], callback);
    }

    postProducto(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into productos (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putProducto(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update productos set " + campos.map((c) => c + " = ?").join(", ") + " where id_producto = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deleteProducto(id, callback) {
        const sql = "delete from productos where id_producto = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new producto();
