const productoModel = require('../models/productoModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'codigo', tipo: 'texto', requerido: true, max: 20 },
    { campo: 'nombre', tipo: 'texto', requerido: true, max: 120 },
    { campo: 'descripcion', tipo: 'texto', max: 5000 },
    { campo: 'precio', tipo: 'decimal', requerido: true, max: 99999999.99 },
    { campo: 'imagen_url', tipo: 'texto', max: 255 },
    { campo: 'activo', tipo: 'bool', defecto: 1 },
    { campo: 'id_categoria', tipo: 'entero', requerido: true, min: 1 },
    { campo: 'id_proveedor', tipo: 'entero', requerido: true, min: 1 }
];

module.exports = {

    getProductos: (req, res) => {
        productoModel.getProductos((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Productos obtenidos correctamente', result);
        });
    },

    getProductoById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        productoModel.getProductoById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Producto no encontrado');
            }
            responder(res, 200, 'Producto obtenido correctamente', result[0]);
        });
    },

    postProducto: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        productoModel.postProducto(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Producto creado correctamente', { id_producto: result.insertId });
        });
    },

    putProducto: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        productoModel.putProducto(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Producto no encontrado');
            }
            responder(res, 200, 'Producto actualizado correctamente', { id_producto: id });
        });
    },

    deleteProducto: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        productoModel.deleteProducto(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Producto no encontrado');
            }
            responder(res, 200, 'Producto eliminado correctamente', { id_producto: id });
        });
    }
};
