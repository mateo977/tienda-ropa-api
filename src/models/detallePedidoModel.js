const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class detallePedido {

    getDetallesPedido(callback) {
        const sql = "select id_detalle, id_pedido, id_variante, cantidad, precio_unitario from detalle_pedido";
        db.query(sql, callback);
    }

    getDetallePedidoById(id, callback) {
        const sql = "select id_detalle, id_pedido, id_variante, cantidad, precio_unitario from detalle_pedido where id_detalle = ?";
        db.query(sql, [id], callback);
    }

    // El total del pedido se recalcula solo cada vez que cambia su detalle
    recalcularTotales(idsPedido, callback) {
        if (idsPedido.length === 0) {
            return callback(null);
        }
        const [idPedido, ...resto] = idsPedido;
        const sql = "update pedidos set total = (select coalesce(sum(cantidad * precio_unitario), 0) from detalle_pedido where id_pedido = ?) where id_pedido = ?";
        db.query(sql, [idPedido, idPedido], (err) => {
            if (err) {
                return callback(err);
            }
            this.recalcularTotales(resto, callback);
        });
    }

    postDetallePedido(datos, callback) {
        const campos = Object.keys(datos);
        const sql = "insert into detalle_pedido (" + campos.join(", ") + ") values (" + campos.map(() => "?").join(", ") + ")";
        db.query(sql, campos.map((c) => datos[c]), (err, result) => {
            if (err) {
                return callback(err);
            }
            this.recalcularTotales([datos.id_pedido], (err2) => callback(err2, result));
        });
    }

    putDetallePedido(id, datos, callback) {
        db.query("select id_pedido from detalle_pedido where id_detalle = ?", [id], (err, filas) => {
            if (err) {
                return callback(err);
            }
            if (filas.length === 0) {
                return callback(null, { affectedRows: 0 });
            }
            const anterior = filas[0].id_pedido;
            const campos = Object.keys(datos);
            const sql = "update detalle_pedido set " + campos.map((c) => c + " = ?").join(", ") + " where id_detalle = ?";
            db.query(sql, [...campos.map((c) => datos[c]), id], (err2, result) => {
                if (err2) {
                    return callback(err2);
                }
                const pedidos = [anterior];
                if (datos.id_pedido && datos.id_pedido !== anterior) {
                    pedidos.push(datos.id_pedido);
                }
                this.recalcularTotales(pedidos, (err3) => callback(err3, result));
            });
        });
    }

    deleteDetallePedido(id, callback) {
        db.query("select id_pedido from detalle_pedido where id_detalle = ?", [id], (err, filas) => {
            if (err) {
                return callback(err);
            }
            if (filas.length === 0) {
                return callback(null, { affectedRows: 0 });
            }
            db.query("delete from detalle_pedido where id_detalle = ?", [id], (err2, result) => {
                if (err2) {
                    return callback(err2);
                }
                this.recalcularTotales([filas[0].id_pedido], (err3) => callback(err3, result));
            });
        });
    }
}

module.exports = new detallePedido();
