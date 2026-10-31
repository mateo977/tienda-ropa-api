const clienteModel = require('../models/clienteModel');
const { validar, idValido, responder, manejarError } = require('../utils/validaciones');
const { hashPassword } = require('../utils/validaciones');
// se realiza llamado al modelo

// Reglas de validacion de los datos de entrada
const esquema = [
    { campo: 'documento', tipo: 'texto', requerido: true, max: 15 },
    { campo: 'nombre', tipo: 'texto', requerido: true, max: 80 },
    { campo: 'apellido', tipo: 'texto', requerido: true, max: 80 },
    { campo: 'email', tipo: 'email', requerido: true, max: 120 },
    { campo: 'password', tipo: 'password', requerido: true, soloCrear: true },
    { campo: 'telefono', tipo: 'texto', max: 20 },
    { campo: 'direccion', tipo: 'texto', max: 255 },
    { campo: 'ciudad', tipo: 'texto', max: 80 }
];

module.exports = {

    getClientes: (req, res) => {
        clienteModel.getClientes((err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 200, 'Clientes obtenidos correctamente', result);
        });
    },

    getClienteById: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        clienteModel.getClienteById(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.length === 0) {
                return responder(res, 404, 'Cliente no encontrado');
            }
            responder(res, 200, 'Cliente obtenido correctamente', result[0]);
        });
    },

    postCliente: (req, res) => {
        const { errores, datos } = validar(esquema, req.body, true);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        // la contraseña nunca se guarda en texto plano
        datos.password_hash = hashPassword(datos.password);
        delete datos.password;

        clienteModel.postCliente(datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            responder(res, 201, 'Cliente creado correctamente', { id_cliente: result.insertId });
        });
    },

    putCliente: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        const { errores, datos } = validar(esquema, req.body, false);
        if (errores.length > 0) {
            return responder(res, 400, 'Datos invalidos', null, errores);
        }
        if (datos.password !== undefined) {
            datos.password_hash = hashPassword(datos.password);
            delete datos.password;
        }

        clienteModel.putCliente(id, datos, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Cliente no encontrado');
            }
            responder(res, 200, 'Cliente actualizado correctamente', { id_cliente: id });
        });
    },

    deleteCliente: (req, res) => {
        const id = idValido(req.params.id);
        if (!id) {
            return responder(res, 400, 'El id debe ser un numero entero positivo');
        }
        clienteModel.deleteCliente(id, (err, result) => {
            if (err) {
                return manejarError(err, res);
            }
            if (result.affectedRows === 0) {
                return responder(res, 404, 'Cliente no encontrado');
            }
            responder(res, 200, 'Cliente eliminado correctamente', { id_cliente: id });
        });
    }
};
