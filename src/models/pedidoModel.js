const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class pedido {

    getPedidos(callback) {
        const sql = "select id_pedido, id_cliente, id_metodo_pago, fecha_pedido, estado, direccion_envio, total from pedidos";
        db.query(sql, callback);
    }

    getPedidoById(id, callback) {
        const sql = "select id_pedido, id_cliente, id_metodo_pago, fecha_pedido, estado, direccion_envio, total from pedidos where id_pedido = ?";
        db.query(sql, [id], callback);
    }

    postPedido(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into pedidos (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), callback);
    }

    putPedido(id, datos, callback) {
        const campos = Object.keys(datos);
        const sql = "update pedidos set " + campos.map((c) => c + " = ?").join(", ") + " where id_pedido = ?";
        db.query(sql, [...campos.map((c) => datos[c]), id], callback);
    }

    deletePedido(id, callback) {
        const sql = "delete from pedidos where id_pedido = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new pedido();
