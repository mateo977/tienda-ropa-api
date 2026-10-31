const pedidoModel = require('../models/pedidoModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'id_cliente', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'id_metodo_pago', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'estado', tipo: 'enum', valores: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'], defecto: 'pendiente' },
    { campo: 'direccion_envio', tipo: 'texto', requerido: true, max: 255 }
];

module.exports = {

    getPedidos: (req, res) => {
        pedidoModel.getPedidos((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Pedidos obtenidos correctamente', result);
        });
    },

    getPedidoById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        pedidoModel.getPedidoById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Pedido no encontrado');
            }
            responder(res, 200, 'Pedido obtenido correctamente', result[0]);
        });
    },

    postPedido: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        pedidoModel.postPedido(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Pedido creado correctamente', { id_pedido: result.insertId });
        });
    },

    putPedido: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        pedidoModel.putPedido(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Pedido no encontrado');
            }
            responder(res, 200, 'Pedido actualizado correctamente', { id_pedido: id });
        });
    },

    deletePedido: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        pedidoModel.deletePedido(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Pedido no encontrado');
            }
            responder(res, 200, 'Pedido eliminado correctamente', { id_pedido: id });
        });
    }
};
