require('dotenv').config({ quiet: true });
const express = require('express');
const bodyParser = require('body-parser');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const varianteRoutes = require('./src/routes/varianteRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const metodoPagoRoutes = require('./src/routes/metodoPagoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Ruta de prueba (sirve para verificar que la API esta en linea)
app.get('/', (req, res) => {
    res.status(200).json({ ok: true, message: 'API de la tienda de ropa funcionando', data: { version: '1.0.0' } });
});

//Rutas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/variantes', varianteRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle-pedido', detallePedidoRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
});

// JSON mal formado u otros errores no controlados
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ ok: false, message: 'El cuerpo de la peticion no es un JSON valido' });
    }
    console.error(err);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
});

//iniciar el servidor
app.listen(port, () => {
    console.log("Servidor iniciado en el puerto " + port);
});
