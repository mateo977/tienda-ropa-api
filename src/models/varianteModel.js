const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class variante {

    getVariantes(callback) {
        const sql = "select id_variante, sku, id_producto, talla, color, stock from variantes";
        db.query(sql, callback);
    }

    getVarianteById(id, callback) {
        const sql = "select id_variante, sku, id_producto, talla, color, stock from variantes where id_variante = ?";
        db.query(sql, [id], callback);
    }

    postVariante(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into variantes (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putVariante(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update variantes set " + campos.map((c) => c + " = ?").join(", ") + " where id_variante = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deleteVariante(id, callback) {
        const sql = "delete from variantes where id_variante = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new variante();
