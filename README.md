# API REST de la tienda de ropa

API construida con **Node.js**, **Express** y **MySQL** para la base de datos `tienda_ropa` (Fase 1). Ofrece un CRUD completo (crear, leer, actualizar y eliminar) para las 8 tablas del modelo: categorías, proveedores, productos, variantes, clientes, métodos de pago, pedidos y detalle de pedido. Todas las respuestas son JSON.

## Estructura del proyecto

Sigue la estructura del docente (config, models, controllers, routes e index.js):

```
├── index.js                  # servidor Express y registro de rutas
├── package.json
├── .env.example              # plantilla de variables de entorno
└── src/
    ├── config/dbConfig.js    # conexión a MySQL (lee variables de entorno)
    ├── models/               # consultas SQL (una clase por tabla)
    ├── controllers/          # lógica de cada petición y validaciones
    ├── routes/               # endpoints de cada tabla
    └── utils/validaciones.js # validaciones y respuestas JSON compartidas
```

## Requisitos

- Node.js 18 o superior
- Una base de datos MySQL con los scripts de la Fase 1 ya ejecutados (`tienda_ropa_estructura.sql` y `tienda_ropa_datos.sql`)

## Instalación y ejecución

```bash
git clone <url-del-repositorio>
cd <carpeta-del-proyecto>
npm install
cp .env.example .env     # en Windows: copy .env.example .env
# edita .env con los datos de tu base de datos
npm start
```

La API queda disponible en `http://localhost:3000` (o el puerto definido en `PORT`). Para desarrollo con recarga automática: `npm run dev`.

## Variables de entorno

Se definen en un archivo `.env` (no se sube a GitHub) o en el panel del servicio de despliegue.

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto de la API (el hosting suele asignarlo solo) | `3000` |
| `DB_HOST` | Servidor de MySQL | `mi-host.ejemplo.com` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `usuario` |
| `DB_PASSWORD` | Contraseña de MySQL | `********` |
| `DB_NAME` | Nombre de la base de datos | `tienda_ropa` |
| `DB_SSL` | `true` si la base en la nube exige conexión segura | `false` |

## Formato de las respuestas

Todas las respuestas tienen la misma estructura.

Éxito:

```json
{ "ok": true, "message": "Categoria creada correctamente", "data": { "id_categoria": 11 } }
```

Error:

```json
{ "ok": false, "message": "Datos invalidos", "errors": ["nombre es obligatorio"] }
```

| Código | Cuándo se usa |
| --- | --- |
| 200 | Consulta, actualización o eliminación correcta |
| 201 | Registro creado |
| 400 | Datos inválidos, id mal formado, JSON mal formado o id relacionado que no existe (llave foránea) |
| 404 | Registro o ruta no encontrados |
| 409 | Valor repetido en un campo único, o eliminación de un registro del que dependen otros |
| 500 / 503 | Error interno / sin conexión con la base de datos |

## Endpoints

Cada tabla tiene los mismos cinco endpoints:

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/categorias` | Lista todos (categorias) |
| GET | `/api/categorias/:id` | Obtiene uno por id |
| POST | `/api/categorias` | Crea uno nuevo |
| PUT | `/api/categorias/:id` | Actualiza uno existente |
| DELETE | `/api/categorias/:id` | Elimina uno |
| GET | `/api/proveedores` | Lista todos (proveedores) |
| GET | `/api/proveedores/:id` | Obtiene uno por id |
| POST | `/api/proveedores` | Crea uno nuevo |
| PUT | `/api/proveedores/:id` | Actualiza uno existente |
| DELETE | `/api/proveedores/:id` | Elimina uno |
| GET | `/api/productos` | Lista todos (productos) |
| GET | `/api/productos/:id` | Obtiene uno por id |
| POST | `/api/productos` | Crea uno nuevo |
| PUT | `/api/productos/:id` | Actualiza uno existente |
| DELETE | `/api/productos/:id` | Elimina uno |
| GET | `/api/variantes` | Lista todos (variantes) |
| GET | `/api/variantes/:id` | Obtiene uno por id |
| POST | `/api/variantes` | Crea uno nuevo |
| PUT | `/api/variantes/:id` | Actualiza uno existente |
| DELETE | `/api/variantes/:id` | Elimina uno |
| GET | `/api/clientes` | Lista todos (clientes) |
| GET | `/api/clientes/:id` | Obtiene uno por id |
| POST | `/api/clientes` | Crea uno nuevo |
| PUT | `/api/clientes/:id` | Actualiza uno existente |
| DELETE | `/api/clientes/:id` | Elimina uno |
| GET | `/api/metodos-pago` | Lista todos (metodos de pago) |
| GET | `/api/metodos-pago/:id` | Obtiene uno por id |
| POST | `/api/metodos-pago` | Crea uno nuevo |
| PUT | `/api/metodos-pago/:id` | Actualiza uno existente |
| DELETE | `/api/metodos-pago/:id` | Elimina uno |
| GET | `/api/pedidos` | Lista todos (pedidos) |
| GET | `/api/pedidos/:id` | Obtiene uno por id |
| POST | `/api/pedidos` | Crea uno nuevo |
| PUT | `/api/pedidos/:id` | Actualiza uno existente |
| DELETE | `/api/pedidos/:id` | Elimina uno |
| GET | `/api/detalle-pedido` | Lista todos (detalles de pedido) |
| GET | `/api/detalle-pedido/:id` | Obtiene uno por id |
| POST | `/api/detalle-pedido` | Crea uno nuevo |
| PUT | `/api/detalle-pedido/:id` | Actualiza uno existente |
| DELETE | `/api/detalle-pedido/:id` | Elimina uno |

### Campos del cuerpo (POST y PUT)

Los marcados con `*` son obligatorios.

| Recurso | Campos |
| --- | --- |
| `categorias` | nombre*, descripcion |
| `proveedores` | nit*, nombre*, contacto, email, telefono, ciudad |
| `productos` | codigo*, nombre*, descripcion, precio*, imagen_url, activo, id_categoria*, id_proveedor* |
| `variantes` | sku*, id_producto*, talla*, color*, stock |
| `clientes` | documento*, nombre*, apellido*, email*, password*, telefono, direccion, ciudad |
| `metodos-pago` | nombre* |
| `pedidos` | id_cliente*, id_metodo_pago*, estado, direccion_envio* |
| `detalle-pedido` | id_pedido*, id_variante*, cantidad*, precio_unitario* |

Notas:

- `estado` de pedidos acepta: `pendiente` (por defecto), `pagado`, `enviado`, `entregado`, `cancelado`.
- `clientes` recibe `password` (mínimo 8 caracteres) y la guarda encriptada; nunca se devuelve en las respuestas. En PUT es opcional.
- El `total` de un pedido no se envía: se recalcula solo cada vez que se crea, cambia o elimina una línea de `detalle-pedido`.
- En PUT, los campos opcionales que no se envían quedan sin cambios.
- `stock` (variantes) y `activo` (productos) tienen valor por defecto (`0` y `1`).

## Ejemplos

```bash
# Listar productos
curl http://localhost:3000/api/productos

# Crear una categoría
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Pijamas", "descripcion": "Ropa de dormir"}'

# Actualizar un cliente
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{"documento": "1001000001", "nombre": "Laura", "apellido": "Gomez", "email": "laura.gomez@correo.com"}'

# Eliminar una variante
curl -X DELETE http://localhost:3000/api/variantes/5
```

## Despliegue

1. Sube el código a un repositorio de GitHub (sin `.env` ni `node_modules`, ya excluidos por `.gitignore`).
2. En el servicio de hosting elegido, crea un servicio web de Node.js conectado al repositorio.
3. Comando de instalación: `npm install`. Comando de inicio: `npm start`.
4. Configura en el panel las variables de entorno de la tabla anterior con los datos de tu base en la nube.
5. Verifica que `GET /` y `GET /api/categorias` respondan desde la URL pública.

**URL pública de la API:** _(escribir aquí la URL del despliegue)_
