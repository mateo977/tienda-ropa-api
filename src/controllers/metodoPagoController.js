const metodoPagoModel = require('../models/metodoPagoModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'nombre', tipo: 'texto', requerido: true, max: 50 }
];

module.exports = {

    getMetodosPago: (req, res) => {
        metodoPagoModel.getMetodosPago((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Metodos de pago obtenidos correctamente', result);
        });
    },

    getMetodoPagoById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        metodoPagoModel.getMetodoPagoById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Metodo de pago no encontrado');
            }
            responder(res, 200, 'Metodo de pago obtenido correctamente', result[0]);
        });
    },

    postMetodoPago: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        metodoPagoModel.postMetodoPago(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Metodo de pago creado correctamente', { id_metodo_pago: result.insertId });
        });
    },

    putMetodoPago: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        metodoPagoModel.putMetodoPago(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Metodo de pago no encontrado');
            }
            responder(res, 200, 'Metodo de pago actualizado correctamente', { id_metodo_pago: id });
        });
    },

    deleteMetodoPago: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        metodoPagoModel.deleteMetodoPago(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Metodo de pago no encontrado');
            }
            responder(res, 200, 'Metodo de pago eliminado correctamente', { id_metodo_pago: id });
        });
    }
};
