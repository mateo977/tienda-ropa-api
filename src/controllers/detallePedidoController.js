const detallePedidoModel = require('../models/detallePedidoModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'id_pedido', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'id_variante', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'cantidad', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'precio_unitario', tipo: 'decimal', requerido: true, max: 99999999.99 }
];

module.exports = {

    getDetallesPedido: (req, res) => {
        detallePedidoModel.getDetallesPedido((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Detalles de pedido obtenidos correctamente', result);
        });
    },

    getDetallePedidoById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        detallePedidoModel.getDetallePedidoById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Detalle de pedido no encontrado');
            }
            responder(res, 200, 'Detalle de pedido obtenido correctamente', result[0]);
        });
    },

    postDetallePedido: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        detallePedidoModel.postDetallePedido(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Detalle de pedido creado correctamente', { id_detalle: result.insertId });
        });
    },

    putDetallePedido: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        detallePedidoModel.putDetallePedido(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Detalle de pedido no encontrado');
            }
            responder(res, 200, 'Detalle de pedido actualizado correctamente', { id_detalle: id });
        });
    },

    deleteDetallePedido: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        detallePedidoModel.deleteDetallePedido(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Detalle de pedido no encontrado');
            }
            responder(res, 200, 'Detalle de pedido eliminado correctamente', { id_detalle: id });
        });
    }
};
