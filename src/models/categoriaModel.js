const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class categoria {

    getCategorias(callback) {
        const sql = "select id_categoria, nombre, descripcion from categorias";
        db.query(sql, callback);
    }

    getCategoriaById(id, callback) {
        const sql = "select id_categoria, nombre, descripcion from categorias where id_categoria = ?";
        db.query(sql, [id], callback);
    }

    postCategoria(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into categorias (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putCategoria(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update categorias set " + campos.map((c) => c + " = ?").join(", ") + " where id_categoria = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deleteCategoria(id, callback) {
        const sql = "delete from categorias where id_categoria = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new categoria();
