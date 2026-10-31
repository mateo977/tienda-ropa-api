const crypto = require('crypto');

// Respuesta JSON con estructura consistente:
//   exito: { ok: true,  message, data }
//   error: { ok: false, message, errors? }
function responder(res, status, message, data, errors) {
    const body = { ok: status < 400, message };
    if (body.ok) {
        body.data = data === undefined ? null : data;
    } else if (errors && errors.length > 0) {
        body.errors = errors;
    }
    return res.status(status).json(body);
}

// Devuelve el id como numero si es un entero positivo; si no, null
function idValido(valor) {
    const n = Number(valor);
    return Number.isInteger(n) && n > 0 ? n : null;
}

// Valida el cuerpo de la peticion segun el esquema de cada controlador.
// esCreacion = true (POST): exige los campos requeridos y aplica valores por defecto.
// esCreacion = false (PUT): exige los requeridos (salvo los marcados soloCrear).
function validar(esquema, body, esCreacion) {
    const errores = [];
    const datos = {};

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { errores: ['El cuerpo debe ser un objeto JSON'], datos };
    }

    esquema.forEach((c) => {
        const valor = body[c.campo];
        const requerido = c.requerido && (esCreacion || !c.soloCrear);

        if (valor === undefined) {
            if (requerido) {
                errores.push(c.campo + ' es obligatorio');
            } else if (esCreacion && c.defecto !== undefined) {
                datos[c.campo] = c.defecto;
            }
            return;
        }

        if (valor === null || (typeof valor === 'string' && valor.trim() === '')) {
            if (requerido || c.defecto !== undefined) {
                errores.push(c.campo + ' no puede estar vacio');
            } else {
                datos[c.campo] = null;
            }
            return;
        }

        switch (c.tipo) {
            case 'texto': {
                if (typeof valor !== 'string') {
                    errores.push(c.campo + ' debe ser texto');
                    break;
                }
                const t = valor.trim();
                if (t.length > c.max) {
                    errores.push(c.campo + ' no puede tener mas de ' + c.max + ' caracteres');
                    break;
                }
                datos[c.campo] = t;
                break;
            }
            case 'email': {
                const t = typeof valor === 'string' ? valor.trim() : '';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) || t.length > c.max) {
                    errores.push(c.campo + ' no es un correo valido');
                    break;
                }
                datos[c.campo] = t;
                break;
            }
            case 'entero': {
                const n = typeof valor === 'string' ? Number(valor) : valor;
                const min = c.min === undefined ? 0 : c.min;
                if (typeof n !== 'number' || !Number.isInteger(n) || n < min) {
                    errores.push(c.campo + ' debe ser un numero entero mayor o igual a ' + min);
                    break;
                }
                datos[c.campo] = n;
                break;
            }
            case 'decimal': {
                const n = typeof valor === 'string' ? Number(valor) : valor;
                if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > c.max) {
                    errores.push(c.campo + ' debe ser un numero mayor o igual a 0');
                    break;
                }
                datos[c.campo] = Math.round(n * 100) / 100;
                break;
            }
            case 'bool': {
                if (valor === true || valor === 1 || valor === '1') {
                    datos[c.campo] = 1;
                } else if (valor === false || valor === 0 || valor === '0') {
                    datos[c.campo] = 0;
                } else {
                    errores.push(c.campo + ' debe ser true o false');
                }
                break;
            }
            case 'enum': {
                if (!c.valores.includes(valor)) {
                    errores.push(c.campo + ' debe ser uno de: ' + c.valores.join(', '));
                    break;
                }
                datos[c.campo] = valor;
                break;
            }
            case 'password': {
                if (typeof valor !== 'string' || valor.length < 8 || valor.length > 100) {
                    errores.push(c.campo + ' debe tener entre 8 y 100 caracteres');
                    break;
                }
                datos[c.campo] = valor;
                break;
            }
            default:
                errores.push(c.campo + ' tiene un tipo de validacion desconocido');
        }
    });

    return { errores, datos };
}

// Encripta la contraseña (scrypt con sal aleatoria, viene incluido en Node.js)
function hashPassword(password) {
    const sal = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, sal, 64).toString('hex');
    return sal + ':' + hash;
}

// Traduce los errores de MySQL a respuestas HTTP claras
function manejarError(err, res) {
    switch (err.code) {
        case 'ER_DUP_ENTRY':
            return responder(res, 409, 'Ya existe un registro con ese valor unico (documento, correo, codigo, etc.)');
        case 'ER_ROW_IS_REFERENCED_2':
            return responder(res, 409, 'No se puede eliminar o cambiar el registro porque otros registros dependen de el');
        case 'ER_NO_REFERENCED_ROW_2':
            return responder(res, 400, 'Alguno de los ids relacionados (categoria, proveedor, cliente, etc.) no existe');
        case 'ER_CONSTRAINT_FAILED':
        case 'ER_CHECK_CONSTRAINT_VIOLATED':
            return responder(res, 400, 'Algun valor no cumple las restricciones de la base de datos');
        case 'ER_DATA_TOO_LONG':
        case 'ER_TRUNCATED_WRONG_VALUE':
        case 'ER_WARN_DATA_OUT_OF_RANGE':
            return responder(res, 400, 'Algun valor es demasiado largo o esta fuera de rango');
        case 'ECONNREFUSED':
        case 'ETIMEDOUT':
        case 'PROTOCOL_CONNECTION_LOST':
            console.error(err);
            return responder(res, 503, 'No hay conexion con la base de datos');
        default:
            console.error(err);
            return responder(res, 500, 'Error interno del servidor');
    }
}

module.exports = { responder, idValido, validar, hashPassword, manejarError };
