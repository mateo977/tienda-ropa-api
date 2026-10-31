const varianteModel = require('../models/varianteModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'sku', tipo: 'texto', requerido: true, max: 30 },
    { campo: 'id_producto', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'talla', tipo: 'texto', requerido: true, max: 10 },
    { campo: 'color', tipo: 'texto', requerido: true, max: 30 },
    { campo: 'stock', tipo: 'entero', min: 0, defecto: 0 }
];

module.exports = {

    getVariantes: (req, res) => {
        varianteModel.getVariantes((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Variantes obtenidas correctamente', result);
        });
    },

    getVarianteById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        varianteModel.getVarianteById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Variante no encontrada');
            }
            responder(res, 200, 'Variante obtenida correctamente', result[0]);
        });
    },

    postVariante: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        varianteModel.postVariante(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Variante creada correctamente', { id_variante: result.insertId });
        });
    },

    putVariante: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        varianteModel.putVariante(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Variante no encontrada');
            }
            responder(res, 200, 'Variante actualizada correctamente', { id_variante: id });
        });
    },

    deleteVariante: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        varianteModel.deleteVariante(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Variante no encontrada');
            }
            responder(res, 200, 'Variante eliminada correctamente', { id_variante: id });
        });
    }
};
