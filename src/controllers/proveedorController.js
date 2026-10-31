const proveedorModel = require('../models/proveedorModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'nit', tipo: 'texto', requerido: true, max: 20 },
    { campo: 'nombre', tipo: 'texto', requerido: true, max: 120 },
    { campo: 'contacto', tipo: 'texto', max: 100 },
    { campo: 'email', tipo: 'email', max: 120 },
    { campo: 'telefono', tipo: 'texto', max: 20 },
    { campo: 'ciudad', tipo: 'texto', max: 80 }
];

module.exports = {

    getProveedores: (req, res) => {
        proveedorModel.getProveedores((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Proveedores obtenidos correctamente', result);
        });
    },

    getProveedorById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        proveedorModel.getProveedorById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Proveedor no encontrado');
            }
            responder(res, 200, 'Proveedor obtenido correctamente', result[0]);
        });
    },

    postProveedor: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        proveedorModel.postProveedor(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Proveedor creado correctamente', { id_proveedor: result.insertId });
        });
    },

    putProveedor: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        proveedorModel.putProveedor(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Proveedor no encontrado');
            }
            responder(res, 200, 'Proveedor actualizado correctamente', { id_proveedor: id });
        });
    },

    deleteProveedor: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        proveedorModel.deleteProveedor(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Proveedor no encontrado');
            }
            responder(res, 200, 'Proveedor eliminado correctamente', { id_proveedor: id });
        });
    }
};
