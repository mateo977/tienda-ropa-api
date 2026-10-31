const categoriaModel = require('../models/categoriaModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'nombre', tipo: 'texto', requerido: true, max: 80 },
    { campo: 'descripcion', tipo: 'texto', max: 255 }
];

module.exports = {

    getCategorias: (req, res) => {
        categoriaModel.getCategorias((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Categorias obtenidas correctamente', result);
        });
    },

    getCategoriaById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        categoriaModel.getCategoriaById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Categoria no encontrada');
            }
            responder(res, 200, 'Categoria obtenida correctamente', result[0]);
        });
    },

    postCategoria: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        categoriaModel.postCategoria(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Categoria creada correctamente', { id_categoria: result.insertId });
        });
    },

    putCategoria: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        categoriaModel.putCategoria(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Categoria no encontrada');
            }
            responder(res, 200, 'Categoria actualizada correctamente', { id_categoria: id });
        });
    },

    deleteCategoria: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        categoriaModel.deleteCategoria(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Categoria no encontrada');
            }
            responder(res, 200, 'Categoria eliminada correctamente', { id_categoria: id });
        });
    }
};
